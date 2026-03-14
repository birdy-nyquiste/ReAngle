-- Idempotent repair SQL for `public.user_settings`.
-- Safe to run multiple times.

create table if not exists public.user_settings (
    user_id uuid primary key references auth.users(id) on delete cascade,
    deangle_model text,
    reangle_model text,
    deangle_detach_system_prompt text,
    deangle_fact_check_system_prompt text,
    reangle_system_prompt text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.user_settings
    add column if not exists deangle_model text,
    add column if not exists reangle_model text,
    add column if not exists deangle_detach_system_prompt text,
    add column if not exists deangle_fact_check_system_prompt text,
    add column if not exists reangle_system_prompt text,
    add column if not exists created_at timestamptz not null default now(),
    add column if not exists updated_at timestamptz not null default now();
