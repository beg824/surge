# Surge Dashboard

An internal dashboard built with Next.js 14, TypeScript, Supabase, and Tailwind CSS for visualizing data from your Supabase database.

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Supabase** for database
- **Tailwind CSS** for styling
- **shadcn/ui** for components
- **Recharts** for charts and analytics

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Supabase project

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

Copy the example environment file:
```bash
cp env.example .env.local
```

Then edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: For server-side operations
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
surge/
├── app/                          # Next.js App Router pages
│   ├── dashboard/               # Dashboard pages
│   │   ├── example/            # Example page with Recharts
│   │   ├── server-example/     # Server component example
│   │   └── page.tsx            # Main dashboard page
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
├── components/                  # React components
│   ├── ui/                     # shadcn/ui components
│   │   ├── button.tsx
│   │   └── card.tsx
│   └── dashboard/              # Dashboard-specific components
│       ├── ChartCard.tsx       # Reusable chart wrapper
│       └── ExampleChart.tsx    # Example Recharts component
├── hooks/                       # Custom React hooks
│   └── useSupabaseData.ts      # Hook for fetching Supabase data
├── lib/                         # Utility libraries
│   ├── supabase/               # Supabase client configuration
│   │   ├── client.ts           # Client-side Supabase client
│   │   └── server.ts           # Server-side Supabase client
│   ├── types/                  # TypeScript type definitions
│   │   └── database.ts         # Database types (update with your schema)
│   └── utils.ts                # Utility functions
├── public/                      # Static assets
├── env.example                  # Environment variables template
├── components.json              # shadcn/ui configuration
└── vercel.json                  # Vercel deployment configuration
```

## Supabase Setup

The project includes two Supabase clients:

- **Client-side**: `lib/supabase/client.ts` - For client components
- **Server-side**: `lib/supabase/server.ts` - For server components and API routes

### Using Supabase in Client Components

```tsx
"use client"

import { supabase } from "@/lib/supabase/client"
import { useSupabaseData } from "@/hooks/useSupabaseData"

export function MyComponent() {
  const { data, loading, error } = useSupabaseData("your_table")
  
  // Or use directly:
  // const { data } = await supabase.from("your_table").select("*")
}
```

### Using Supabase in Server Components

```tsx
import { createServerClient } from "@/lib/supabase/server"

export default async function MyPage() {
  const supabase = await createServerClient()
  const { data } = await supabase.from("your_table").select("*")
  
  return <div>{/* Render data */}</div>
}
```

### Generating TypeScript Types

To generate TypeScript types from your Supabase schema:

```bash
npx supabase gen types typescript --project-id your-project-id > lib/types/database.ts
```

## Deployment on Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Import your project in [Vercel](https://vercel.com)

3. Add your environment variables in Vercel's project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (optional)

4. Deploy! Vercel will automatically detect Next.js and deploy your project.

The `vercel.json` file is already configured for optimal deployment.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Adding More shadcn/ui Components

To add more shadcn/ui components, you can use the shadcn CLI:

```bash
npx shadcn-ui@latest add [component-name]
```

Or manually add components following the pattern in `components/ui/`.

## Example Pages

- `/dashboard/example` - Example page showing how to use Recharts with sample data
- `/dashboard/server-example` - Example page showing server-side data fetching

## Next Steps

1. Update `lib/types/database.ts` with your Supabase schema types
2. Create your dashboard components in `components/dashboard/`
3. Build your pages in `app/dashboard/`
4. Customize the styling in `app/globals.css` and `tailwind.config.ts`

