-- Row Level Security — safe direct access from frontend (anon/authenticated)

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_summaries ENABLE ROW LEVEL SECURITY;

-- Helper: match profile by auth uid OR legacy text id
CREATE OR REPLACE FUNCTION public.is_profile_owner(p_user_id TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = p_user_id
      AND (
        p.auth_user_id = auth.uid()
        OR p.id = auth.uid()::text
      )
  );
$$;

-- Profiles
DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
CREATE POLICY profiles_select_own ON public.profiles
  FOR SELECT USING (public.is_profile_owner(id));

DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE USING (public.is_profile_owner(id));

DROP POLICY IF EXISTS profiles_insert_own ON public.profiles;
CREATE POLICY profiles_insert_own ON public.profiles
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND (id = auth.uid()::text OR auth_user_id = auth.uid())
  );

-- Chat sessions
DROP POLICY IF EXISTS chat_sessions_all_own ON public.chat_sessions;
CREATE POLICY chat_sessions_all_own ON public.chat_sessions
  FOR ALL USING (public.is_profile_owner(user_id))
  WITH CHECK (public.is_profile_owner(user_id));

-- Chat messages
DROP POLICY IF EXISTS chat_messages_all_own ON public.chat_messages;
CREATE POLICY chat_messages_all_own ON public.chat_messages
  FOR ALL USING (public.is_profile_owner(user_id))
  WITH CHECK (public.is_profile_owner(user_id));

-- Mood entries
DROP POLICY IF EXISTS mood_entries_all_own ON public.mood_entries;
CREATE POLICY mood_entries_all_own ON public.mood_entries
  FOR ALL USING (public.is_profile_owner(user_id))
  WITH CHECK (public.is_profile_owner(user_id));

-- Daily summaries
DROP POLICY IF EXISTS daily_summaries_all_own ON public.daily_summaries;
CREATE POLICY daily_summaries_all_own ON public.daily_summaries
  FOR ALL USING (public.is_profile_owner(user_id))
  WITH CHECK (public.is_profile_owner(user_id));

-- Service role (backend) bypasses RLS automatically
