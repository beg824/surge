# Quick Start Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Environment Variables

1. Copy the example file:
   ```bash
   cp env.example .env.local
   ```

2. Get your Supabase credentials:
   - Go to your Supabase project dashboard
   - Navigate to Settings > API
   - Copy your Project URL and anon/public key

3. Update `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 4. Generate TypeScript Types (Optional but Recommended)

```bash
npx supabase gen types typescript --project-id your-project-id > lib/types/database.ts
```

## 5. Start Building

- Check out `/dashboard/example` for a Recharts example
- Check out `/dashboard/server-example` for server component data fetching
- Use `useSupabaseData` hook for client-side data fetching
- Use `createServerClient()` for server-side data fetching

## 6. Deploy to Vercel

1. Push your code to GitHub/GitLab/Bitbucket
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

The `vercel.json` is already configured for optimal deployment.

