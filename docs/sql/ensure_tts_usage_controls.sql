-- Idempotent SQL for TTS quota control.
-- Run in Supabase SQL editor once per environment.

alter table public.profiles
    add column if not exists tts_usage_count integer not null default 0,
    add column if not exists tts_usage_limit integer not null default 1;

-- Backfill limits by current subscription status:
-- active/trialing => 20 per month, others => 1 per month.
update public.profiles p
set tts_usage_limit = case
    when exists (
        select 1
        from public.subscriptions s
        where s.user_id = p.id
          and s.status in ('active', 'trialing')
    ) then 20
    else 1
end;

-- Keep count non-null.
update public.profiles
set tts_usage_count = coalesce(tts_usage_count, 0);

create or replace function public.increment_tts_usage(row_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
    touched integer := 0;
begin
    update public.profiles
    set tts_usage_count = tts_usage_count + 1
    where id = row_id
      and tts_usage_limit <> 0
      and (
          tts_usage_limit = -1
          or tts_usage_count < tts_usage_limit
      );

    get diagnostics touched = row_count;
    return touched > 0;
end;
$$;

grant execute on function public.increment_tts_usage(uuid)
to authenticated, service_role;
