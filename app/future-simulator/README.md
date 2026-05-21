# Future Simulator

## What this module does

- Collects two inputs:
  - Situation (free text)
  - Decisions (at least 3 options)
- Sends a structured prompt to Groq
- Renders 3 outcome cards:
  - Best case
  - Average case
  - Worst case
- Saves each simulation in Supabase
- Displays saved simulations in a history page
- History is isolated per logged-in user through Supabase RLS

## Auth flow

- Email/password and Google sign-in both store the session in Supabase cookies
- Server actions read that cookie-backed session before allowing a simulation
- A Next.js proxy keeps the Supabase auth session fresh for server-side reads

## Routes

- `/future-simulator`
- `/future-simulator/history`

## Required env vars

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GROQ_API_KEY`
- optional `GROQ_MODEL`

## Supabase setup

- Run the SQL in `app/future-simulator/schema.sql` in the Supabase SQL editor
- If `public.simulations` already exists, run `supabase/migrations/20260521_future_simulations_schema_fix.sql` to add the missing `user_id` column and policies
- After applying the SQL, refresh the schema cache in Supabase if inserts still complain about `user_id`

## Run locally

1. Sign in at `/login`
2. Open `/future-simulator`
3. Enter a situation and at least 3 decisions
4. Click simulate to generate and save outcomes

## Notes

- The history page only shows records for the current authenticated user
- Simulations are stored in `public.simulations` with row-level security enabled
