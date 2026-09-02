-- This event-trigger helper only needs to be invoked by PostgreSQL itself.
-- Prevent it from being exposed through the Data API as an RPC endpoint.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
