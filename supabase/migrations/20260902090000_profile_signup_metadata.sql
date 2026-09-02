create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users(id, username, display_name, phone)
  values (
    new.id,
    nullif(new.raw_user_meta_data->>'username', ''),
    coalesce(nullif(new.raw_user_meta_data->>'full_name', ''), nullif(new.raw_user_meta_data->>'username', ''), 'Learner'),
    new.phone
  );
  insert into public.user_stats(user_id) values(new.id);
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
