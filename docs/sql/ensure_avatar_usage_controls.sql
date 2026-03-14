-- Idempotent SQL for Avatar feature gating and quota control.
-- Run in Supabase SQL editor once per environment.

alter table public.profiles
    add column if not exists avatar_usage_count integer not null default 0,
    add column if not exists avatar_usage_limit integer not null default 0;

-- Backfill limits by current subscription status:
-- active/trialing => 5 uses per billing cycle, others => 0 (disabled).
update public.profiles p
set avatar_usage_limit = case
    when exists (
        select 1
        from public.subscriptions s
        where s.user_id = p.id
          and s.status in ('active', 'trialing')
    ) then 5
    else 0
end;

-- Keep count non-null.
update public.profiles
set avatar_usage_count = coalesce(avatar_usage_count, 0);

create or replace function public.increment_avatar_usage(row_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
    touched integer := 0;
begin
    update public.profiles
    set avatar_usage_count = avatar_usage_count + 1
    where id = row_id
      and avatar_usage_limit <> 0
      and (
          avatar_usage_limit = -1
          or avatar_usage_count < avatar_usage_limit
      );

    get diagnostics touched = row_count;
    return touched > 0;
end;
$$;

grant execute on function public.increment_avatar_usage(uuid)
to authenticated, service_role;
