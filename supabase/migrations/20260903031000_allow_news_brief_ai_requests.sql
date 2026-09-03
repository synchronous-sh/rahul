alter table public.ai_requests
  drop constraint if exists ai_requests_kind_check;

alter table public.ai_requests
  add constraint ai_requests_kind_check
  check (kind in ('course', 'ask', 'semantic_search', 'transcription', 'speech', 'news_brief'));
