"""
输入处理编排服务。
从 v1 rewrite.py 提取的输入解析逻辑将在此实现。
支持并行提取内容和主题验证。
"""

import asyncio
from typing import List, Any
from loguru import logger

from app.schemas.inputs_schema import InputItem
from app.core.exceptions import ContentExtractionError, ThemeValidationError
from app.services.inputs.extractors import (
    extract_text_from_url,
    extract_text_from_docx,
    extract_text_from_pdf,
    extract_text_from_image,
)
from app.services.inputs.theme_validator import validate_theme


async def extract_item(item: InputItem, files: list[Any]) -> str:
    """提取单个 InputItem 的文本内容。"""
    t = (item.type or "").lower()

    if t == "text":
        return (item.content or "").strip()

    elif t == "url":
        url = (item.content or "").strip()
        if not url:
            return ""
        try:
            return await extract_text_from_url(url)
        except Exception as e:
            logger.warning(
                "[inputs] url extraction failed | url={} | reason={}",
                url,
                e,
            )
            # URL解析失败时，记录一下URL本身以防彻底没信息
            return str(url)

    elif t == "youtube":
        yt = (item.content or "").strip()
        # 目前暂时只保留文本或链接。未来如需提取字幕，在此处扩充。
        return str(yt)

    elif t == "file":
        content_key = item.contentKey
        if not content_key:
            return ""

        # 解析 content_key，约定格式为 "files_0", "files_1" 以对应 files 列表的索引
        try:
            file_idx = int(content_key.split("_")[1])
            if file_idx < 0 or file_idx >= len(files):
                logger.warning("[inputs] file index out of bounds | content_key={} | idx={}", content_key, file_idx)
                return ""
            upload = files[file_idx]
        except (IndexError, ValueError) as e:
            logger.warning("[inputs] invalid content_key format or missing files | content_key={} | reason={}", content_key, e)
            return ""

        if not upload:
            logger.warning("[inputs] file not found in form | content_key={}", content_key)
            return ""

        filename = (getattr(upload, "filename", "") or "").lower()
        try:
            if filename.endswith(".docx"):
                return await extract_text_from_docx(upload)
            elif filename.endswith(".pdf"):
                return await extract_text_from_pdf(upload)
            elif filename.endswith((".png", ".jpg", ".jpeg", ".webp")):
                return await extract_text_from_image(upload)
            else:
                raw = await upload.read()
                try:
                    return raw.decode("utf-8")
                except UnicodeDecodeError:
                    return raw.decode("gbk", errors="ignore")
        except Exception as e:
            logger.error(
                "[inputs] file extraction failed | filename={} | reason={}",
                filename,
                e,
            )
            raise ContentExtractionError(
                f"Failed to extract content from file: {str(e)}",
                details={"filename": filename, "reason": str(e)},
            )
    else:
        logger.warning(f"Unknown input type: {t}")
        return ""


async def process_inputs(items: List[InputItem], files: list[Any]) -> str:
    """
    处理多源输入队列：
    1. 并行提取所有输入源的纯文本内容。
    2. 进行主题一致性验证（如果有多个输入源）。
    3. 合并通过验证的文本内容。
    """
    logger.info(f"[inputs] Starting extraction for {len(items)} items, {len(files)} files...")

    # 1. 并行提取
    tasks = [extract_item(item, files) for item in items]
    extracted_texts = await asyncio.gather(*tasks, return_exceptions=False)

    # 过滤空文本
    valid_texts = [text.strip() for text in extracted_texts if text.strip()]

    if not valid_texts:
        raise ContentExtractionError("Extracted text is empty or invalid for all sources.")

    # 2. 主题一致性验证
    validation = await validate_theme(valid_texts)
    if not validation.is_valid:
        raise ThemeValidationError(
            message=validation.reason,
            details={"reason": validation.reason, "count": len(valid_texts)}
        )

    # 3. 拼接文本
    # 构建结构化的合并文本
    parts = []
    for i, (item, text) in enumerate(zip(items, extracted_texts)):
        if text.strip():
            # 可以根据需求加入更友好的类型提示
            t_display = item.type.upper() if item.type else "SOURCE"
            title = f"[{t_display} {i+1}]"
            # 尝试通过 meta 获取原本的文件名或标题
            if item.meta and item.meta.get("title"):
                title += f" {item.meta.get('title')}"
            elif item.type == 'file' and item.contentKey:
                try:
                    file_idx = int(item.contentKey.split("_")[1])
                    if file_idx >= 0 and file_idx < len(files):
                        title += f" {getattr(files[file_idx], 'filename', '')}"
                except Exception:
                    pass
            elif item.type in ('url', 'youtube'):
                title += f"\n源: {item.content}"

            parts.append(f"{title}\n{text.strip()}")

    clean_text = "\n\n---\n\n".join(parts)
    return clean_text
