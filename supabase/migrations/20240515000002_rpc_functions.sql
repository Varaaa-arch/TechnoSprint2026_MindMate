-- Analytics RPC functions (used by FastAPI Supabase repository)

-- Mood statistics for a user
CREATE OR REPLACE FUNCTION public.get_mood_stats(p_user_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total        INTEGER;
  v_positive     INTEGER;
  v_avg_score    NUMERIC;
  v_dominant     public.mood_type;
  v_streak       INTEGER := 0;
  v_cursor       DATE := CURRENT_DATE;
BEGIN
  SELECT COUNT(*)::int,
         COUNT(*) FILTER (WHERE mood IN ('senang', 'tenang'))::int,
         ROUND(AVG(mood_score)::numeric, 2)
    INTO v_total, v_positive, v_avg_score
    FROM public.mood_entries
   WHERE user_id = p_user_id;

  IF v_total = 0 THEN
    RETURN jsonb_build_object(
      'total_entries', 0,
      'streak_days', 0,
      'positive_percent', 0,
      'average_score', 0,
      'dominant_mood', NULL
    );
  END IF;

  SELECT mood INTO v_dominant
    FROM public.mood_entries
   WHERE user_id = p_user_id
   GROUP BY mood
   ORDER BY COUNT(*) DESC, MAX(entry_date) DESC
   LIMIT 1;

  WHILE EXISTS (
    SELECT 1 FROM public.mood_entries
     WHERE user_id = p_user_id AND entry_date = v_cursor
  ) LOOP
    v_streak := v_streak + 1;
    v_cursor := v_cursor - 1;
  END LOOP;

  RETURN jsonb_build_object(
    'total_entries', v_total,
    'streak_days', v_streak,
    'positive_percent', ROUND((v_positive::numeric / v_total) * 100, 1),
    'average_score', COALESCE(v_avg_score, 0),
    'dominant_mood', v_dominant::text
  );
END;
$$;

-- Last N days mood scores (for charts)
CREATE OR REPLACE FUNCTION public.get_mood_trend(p_user_id TEXT, p_days INTEGER DEFAULT 7)
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH days AS (
    SELECT (CURRENT_DATE - offs) AS d, offs
      FROM generate_series(0, GREATEST(p_days - 1, 0)) AS offs
  )
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'date', days.d,
        'mood', me.mood::text,
        'score', me.mood_score
      )
      ORDER BY days.d ASC
    ),
    '[]'::jsonb
  )
  FROM days
  LEFT JOIN public.mood_entries me
    ON me.user_id = p_user_id AND me.entry_date = days.d;
$$;

-- Ensure profile exists (callable from backend)
CREATE OR REPLACE FUNCTION public.ensure_profile(
  p_user_id TEXT,
  p_email TEXT DEFAULT NULL,
  p_display_name TEXT DEFAULT NULL
)
RETURNS public.profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_profile public.profiles;
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (p_user_id, p_email, p_display_name)
  ON CONFLICT (id) DO UPDATE SET
    email        = COALESCE(EXCLUDED.email, public.profiles.email),
    display_name = COALESCE(EXCLUDED.display_name, public.profiles.display_name),
    updated_at   = now()
  RETURNING * INTO v_profile;

  RETURN v_profile;
END;
$$;

-- Get or create active chat session
CREATE OR REPLACE FUNCTION public.get_or_create_active_session(
  p_user_id TEXT,
  p_title TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_session_id UUID;
BEGIN
  PERFORM public.ensure_profile(p_user_id);

  SELECT id INTO v_session_id
    FROM public.chat_sessions
   WHERE user_id = p_user_id AND is_active = true
   ORDER BY last_message_at DESC NULLS LAST, created_at DESC
   LIMIT 1;

  IF v_session_id IS NOT NULL THEN
    RETURN v_session_id;
  END IF;

  INSERT INTO public.chat_sessions (user_id, title, is_active)
  VALUES (p_user_id, COALESCE(p_title, 'Sesi Chat'), true)
  RETURNING id INTO v_session_id;

  RETURN v_session_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_mood_stats(TEXT) TO service_role, authenticated;
GRANT EXECUTE ON FUNCTION public.get_mood_trend(TEXT, INTEGER) TO service_role, authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_profile(TEXT, TEXT, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_or_create_active_session(TEXT, TEXT) TO service_role;
