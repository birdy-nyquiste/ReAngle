-- Settings table for model/prompt customization.
-- Run in Supabase SQL editor once per environment.

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
