-- MindMate — initial database schema
-- Run via Supabase SQL Editor or: supabase db push

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE public.mood_type AS ENUM (
    'senang', 'tenang', 'biasa', 'stres', 'sedih', 'cemas', 'marah'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.emotion_type AS ENUM (
    'happy', 'sad', 'anxiety', 'burnout', 'neutral', 'anger', 'calm'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.message_role AS ENUM ('user', 'assistant');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
-- Profiles (app user id — works with or without Supabase Auth)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id              TEXT PRIMARY KEY,
  display_name    TEXT,
  email           TEXT,
  auth_user_id    UUID UNIQUE REFERENCES auth.users (id) ON DELETE SET NULL,
  avatar_url      TEXT,
  timezone        TEXT NOT NULL DEFAULT 'Asia/Jakarta',
  preferences     JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT profiles_email_format CHECK (
    email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  )
);

CREATE INDEX IF NOT EXISTS idx_profiles_auth_user ON public.profiles (auth_user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles (email) WHERE email IS NOT NULL;

-- ---------------------------------------------------------------------------
-- Chat sessions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          TEXT NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  title            TEXT,
  is_active        BOOLEAN NOT NULL DEFAULT true,
  message_count    INTEGER NOT NULL DEFAULT 0,
  last_message_at  TIMESTAMPTZ,
  metadata         JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_active
  ON public.chat_sessions (user_id, is_active, last_message_at DESC NULLS LAST);

-- ---------------------------------------------------------------------------
-- Chat messages
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id     UUID NOT NULL REFERENCES public.chat_sessions (id) ON DELETE CASCADE,
  user_id        TEXT NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  role           public.message_role NOT NULL,
  content        TEXT NOT NULL,
  emotion        public.emotion_type,
  stress_level   SMALLINT CHECK (stress_level IS NULL OR stress_level BETWEEN 1 AND 10),
  tokens_used    INTEGER,
  model          TEXT,
  metadata       JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chat_messages_content_not_empty CHECK (char_length(trim(content)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_user_created
  ON public.chat_messages (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session_created
  ON public.chat_messages (session_id, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_chat_messages_emotion
  ON public.chat_messages (user_id, emotion)
  WHERE emotion IS NOT NULL;

-- ---------------------------------------------------------------------------
-- Mood entries (one per user per calendar day)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mood_entries (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      TEXT NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  mood         public.mood_type NOT NULL,
  mood_score   SMALLINT GENERATED ALWAYS AS (
    CASE mood
      WHEN 'senang' THEN 5
      WHEN 'tenang' THEN 4
      WHEN 'biasa'  THEN 3
      WHEN 'stres'  THEN 2
      WHEN 'sedih'  THEN 1
      WHEN 'cemas'  THEN 2
      WHEN 'marah'  THEN 2
    END
  ) STORED,
  note         TEXT,
  entry_date   DATE NOT NULL DEFAULT (CURRENT_DATE),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, entry_date)
);

CREATE INDEX IF NOT EXISTS idx_mood_entries_user_date
  ON public.mood_entries (user_id, entry_date DESC);

CREATE INDEX IF NOT EXISTS idx_mood_entries_user_mood
  ON public.mood_entries (user_id, mood);

-- ---------------------------------------------------------------------------
-- Daily AI / rule-based summaries
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.daily_summaries (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           TEXT NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  summary_date      DATE NOT NULL,
  summary_text      TEXT NOT NULL,
  mood_score_avg    NUMERIC(4, 2),
  dominant_emotion  public.emotion_type,
  highlights        JSONB NOT NULL DEFAULT '[]'::jsonb,
  generated_by      TEXT NOT NULL DEFAULT 'rule_engine',
  metadata          JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, summary_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_summaries_user_date
  ON public.daily_summaries (user_id, summary_date DESC);

-- ---------------------------------------------------------------------------
-- Updated_at trigger
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_chat_sessions_updated_at ON public.chat_sessions;
CREATE TRIGGER trg_chat_sessions_updated_at
  BEFORE UPDATE ON public.chat_sessions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_mood_entries_updated_at ON public.mood_entries;
CREATE TRIGGER trg_mood_entries_updated_at
  BEFORE UPDATE ON public.mood_entries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_daily_summaries_updated_at ON public.daily_summaries;
CREATE TRIGGER trg_daily_summaries_updated_at
  BEFORE UPDATE ON public.daily_summaries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Bump session stats after new message
CREATE OR REPLACE FUNCTION public.on_chat_message_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.chat_sessions
  SET
    message_count   = message_count + 1,
    last_message_at = NEW.created_at,
    updated_at      = now()
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_chat_message_insert ON public.chat_messages;
CREATE TRIGGER trg_chat_message_insert
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW EXECUTE FUNCTION public.on_chat_message_insert();

-- Auto-create profile when Supabase Auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, auth_user_id, email, display_name)
  VALUES (
    NEW.id::text,
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO UPDATE SET
    auth_user_id = EXCLUDED.auth_user_id,
    email        = COALESCE(EXCLUDED.email, public.profiles.email),
    updated_at   = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();
