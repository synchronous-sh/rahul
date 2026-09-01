# Curious

A polished iOS-first learning and discovery prototype built with Expo Router, React Native, TypeScript, and Supabase.

## Run

```bash
npm install
cp .env.example .env
npm run ios
```

The seeded demo works without Supabase credentials. Add the project URL and publishable key to enable authentication and remote data wiring.

## Supabase

Create a Supabase project, link the CLI, and apply `supabase/migrations/20260826000000_initial_schema.sql`. Configure Apple and Google providers, including the `curious://auth` redirect. Never put a secret or service-role key in the Expo app.

The schema enables RLS on every exposed table, keeps user data owner-scoped, and creates separate public content and private avatar storage policies.

## Demo flow

Choose at least three interests, swipe Explore, save a post, tap **Learn AI →**, open Neural Networks, complete or skip the optional check, earn 25 XP, then visit Learn and News.
