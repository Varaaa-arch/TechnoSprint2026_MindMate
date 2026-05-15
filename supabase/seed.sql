-- Optional dev seed (run manually in SQL Editor)
-- Uses fixed demo user id matching frontend localStorage tests

SELECT public.ensure_profile(
  'demo-user',
  'demo@mindmate.app',
  'Demo User'
);

INSERT INTO public.mood_entries (user_id, mood, note, entry_date)
VALUES
  ('demo-user', 'tenang', 'Pagi produktif', CURRENT_DATE - 2),
  ('demo-user', 'biasa', 'Hari biasa', CURRENT_DATE - 1),
  ('demo-user', 'stres', 'Deadline', CURRENT_DATE)
ON CONFLICT (user_id, entry_date) DO NOTHING;
