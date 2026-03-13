"""
账号级 Settings 服务：
- 从 DB 读取/更新用户设置
- 从 YAML 加载默认 Prompt
- 合并得到运行时有效设置
"""

from functools import lru_cache
from typing import Any

import yaml
from loguru import logger
from supabase import create_client

from app.core.config import (
    SUPABASE_URL,
    SUPABASE_SECRET_KEY,
    DEFAULT_DEANGLE_DETACH_PROMPT_PATH,
    DEFAULT_DEANGLE_FACT_CHECK_PROMPT_PATH,
    DEFAULT_REANGLE_PROMPT_PATH,
    DEANGLE_AVAILABLE_MODELS,
    REANGLE_AVAILABLE_MODELS,
    DEANGLE_DEFAULT_MODEL,
    REANGLE_DEFAULT_MODEL,
    SETTINGS_PROMPT_MAX_LENGTH,
)
from app.core.exceptions import AppException, InvalidInputError
from app.schemas.settings_schema import (
    AvailableModels,
    ModelOption,
    SettingsResponse,
    SettingsUpdateRequest,
)


def _get_supabase_admin():
    return create_client(SUPABASE_URL, SUPABASE_SECRET_KEY)


@lru_cache(maxsize=16)
def _load_prompt_from_yaml(path: str) -> str:
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f) or {}
        prompt = (data.get("system_prompt") or "").strip()
        if not prompt:
            raise ValueError(f"system_prompt is empty in {path}")
        return prompt
    except Exception as e:
        logger.exception("[settings] Failed to load default prompt file: {}", path)
        raise AppException(
            message=f"Failed to load default prompt from {path}: {str(e)}",
            status_code=500,
            code="SETTINGS_CONFIG_ERROR",
        )


def _default_prompts() -> dict[str, str]:
    return {
        "deangle_detach_system_prompt": _load_prompt_from_yaml(
            DEFAULT_DEANGLE_DETACH_PROMPT_PATH
        ),
        "deangle_fact_check_system_prompt": _load_prompt_from_yaml(
            DEFAULT_DEANGLE_FACT_CHECK_PROMPT_PATH
        ),
        "reangle_system_prompt": _load_prompt_from_yaml(DEFAULT_REANGLE_PROMPT_PATH),
    }


def _available_models() -> AvailableModels:
    return AvailableModels(
        deangle=[
            ModelOption(id=item["id"], label=item["label"])
            for item in DEANGLE_AVAILABLE_MODELS
        ],
        reangle=[
            ModelOption(id=item["id"], label=item["label"])
            for item in REANGLE_AVAILABLE_MODELS
        ],
    )


def _allowed_model_ids(kind: str) -> set[str]:
    source = DEANGLE_AVAILABLE_MODELS if kind == "deangle" else REANGLE_AVAILABLE_MODELS
    return {item["id"] for item in source}


def _normalize_prompt(value: str | None, field_name: str) -> str | None:
    if value is None:
        return None

    normalized = value.strip()
    if not normalized:
        return None

    if len(normalized) > SETTINGS_PROMPT_MAX_LENGTH:
        raise InvalidInputError(
            f"{field_name} is too long (max {SETTINGS_PROMPT_MAX_LENGTH} chars)."
        )

    return normalized


def _validate_model(kind: str, model: str):
    allowed = _allowed_model_ids(kind)
    if model not in allowed:
        raise InvalidInputError(
            f"Unsupported {kind} model: {model}",
            details={"allowed_models": sorted(allowed)},
        )


def _fetch_user_settings_row(user_id: str) -> dict[str, Any]:
    supabase = _get_supabase_admin()
    try:
        result = (
            supabase.table("user_settings")
            .select(
                "deangle_model,reangle_model,deangle_detach_system_prompt,deangle_fact_check_system_prompt,reangle_system_prompt"
            )
            .eq("user_id", user_id)
            .limit(1)
            .execute()
        )

        # supabase-py / postgrest may return None or list depending on query mode/version.
        if result is None:
            logger.warning(
                "[settings] user_settings query returned None, fallback to defaults | user_id={}",
                user_id,
            )
            return {}

        data = getattr(result, "data", None)
        if isinstance(data, list):
            return data[0] if data else {}
        if isinstance(data, dict):
            return data
        return {}
    except Exception as e:
        logger.exception("[settings] Failed to fetch settings for user_id={}", user_id)
        raise AppException(
            message="Failed to fetch user settings",
            status_code=500,
            code="SETTINGS_FETCH_ERROR",
            details={"reason": str(e)},
        )


def _build_response(row: dict[str, Any]) -> SettingsResponse:
    defaults = _default_prompts()

    deangle_model = row.get("deangle_model") or DEANGLE_DEFAULT_MODEL
    reangle_model = row.get("reangle_model") or REANGLE_DEFAULT_MODEL

    # If stale/invalid model exists in DB, fail-safe to default.
    if deangle_model not in _allowed_model_ids("deangle"):
        deangle_model = DEANGLE_DEFAULT_MODEL
    if reangle_model not in _allowed_model_ids("reangle"):
        reangle_model = REANGLE_DEFAULT_MODEL

    raw_detach = row.get("deangle_detach_system_prompt")
    raw_fact_check = row.get("deangle_fact_check_system_prompt")
    raw_reangle = row.get("reangle_system_prompt")

    return SettingsResponse(
        deangle_model=deangle_model,
        reangle_model=reangle_model,
        deangle_detach_system_prompt=raw_detach
        if raw_detach
        else defaults["deangle_detach_system_prompt"],
        deangle_fact_check_system_prompt=raw_fact_check
        if raw_fact_check
        else defaults["deangle_fact_check_system_prompt"],
        reangle_system_prompt=raw_reangle
        if raw_reangle
        else defaults["reangle_system_prompt"],
        deangle_detach_uses_default=not bool(raw_detach),
        deangle_fact_check_uses_default=not bool(raw_fact_check),
        reangle_uses_default=not bool(raw_reangle),
        available_models=_available_models(),
    )


def get_settings(user_id: str) -> SettingsResponse:
    try:
        row = _fetch_user_settings_row(user_id)
    except AppException as e:
        logger.warning(
            "[settings] fallback to defaults on fetch error | user_id={} | code={} | message={}",
            user_id,
            e.code,
            e.message,
        )
        row = {}
    return _build_response(row)


def update_settings(user_id: str, request: SettingsUpdateRequest) -> SettingsResponse:
    fields = request.model_fields_set
    if not fields:
        return get_settings(user_id)

    payload: dict[str, Any] = {"user_id": user_id}

    if "deangle_model" in fields:
        next_deangle_model = request.deangle_model or DEANGLE_DEFAULT_MODEL
        _validate_model("deangle", next_deangle_model)
        payload["deangle_model"] = next_deangle_model

    if "reangle_model" in fields:
        next_reangle_model = request.reangle_model or REANGLE_DEFAULT_MODEL
        _validate_model("reangle", next_reangle_model)
        payload["reangle_model"] = next_reangle_model

    if "deangle_detach_system_prompt" in fields:
        payload["deangle_detach_system_prompt"] = _normalize_prompt(
            request.deangle_detach_system_prompt, "deangle_detach_system_prompt"
        )

    if "deangle_fact_check_system_prompt" in fields:
        payload["deangle_fact_check_system_prompt"] = _normalize_prompt(
            request.deangle_fact_check_system_prompt,
            "deangle_fact_check_system_prompt",
        )

    if "reangle_system_prompt" in fields:
        payload["reangle_system_prompt"] = _normalize_prompt(
            request.reangle_system_prompt, "reangle_system_prompt"
        )

    if len(payload) > 1:
        supabase = _get_supabase_admin()
        try:
            supabase.table("user_settings").upsert(payload).execute()
        except Exception as e:
            logger.exception("[settings] Failed to update settings for user_id={}", user_id)
            raise AppException(
                message="Failed to update user settings",
                status_code=500,
                code="SETTINGS_UPDATE_ERROR",
                details={"reason": str(e)},
            )

    return get_settings(user_id)
