-- Enrich profile creation from Supabase Auth metadata (phone, full name)

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, auth_user_id, email, display_name, preferences)
  VALUES (
    NEW.id::text,
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      TRIM(CONCAT(
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        ' ',
        COALESCE(NEW.raw_user_meta_data->>'last_name', '')
      )),
      split_part(COALESCE(NEW.email, 'user'), '@', 1)
    ),
    jsonb_strip_nulls(jsonb_build_object(
      'phone', NEW.raw_user_meta_data->>'phone',
      'first_name', NEW.raw_user_meta_data->>'first_name',
      'last_name', NEW.raw_user_meta_data->>'last_name'
    ))
  )
  ON CONFLICT (id) DO UPDATE SET
    auth_user_id = EXCLUDED.auth_user_id,
    email        = COALESCE(EXCLUDED.email, public.profiles.email),
    display_name = COALESCE(EXCLUDED.display_name, public.profiles.display_name),
    preferences  = public.profiles.preferences || EXCLUDED.preferences,
    updated_at   = now();
  RETURN NEW;
END;
$$;
