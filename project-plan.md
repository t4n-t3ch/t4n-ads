Edit Plan
1. package.json — NEW: Next.js 14, React 18, Prisma, Supabase, Tailwind, Stripe, TypeScript dependencies
2. next.config.js — NEW: minimal valid config with no API keys exposed
3. tsconfig.json — NEW: standard Next.js TypeScript configuration
4. prisma/schema.prisma — NEW: PostgreSQL schema with User, Video, Template models, optional captionStyle and tags fields
5. src/app/layout.tsx — NEW: root layout with Tailwind CSS and dark theme setup
6. src/app/page.tsx — NEW: landing page with hero section, orange accent (#f97316), client component
7. src/app/generate/page.tsx — NEW: video generator form page, client component
8. src/app/gallery/page.tsx — NEW: video gallery grid page, client component
9. src/app/login/page.tsx — NEW: email/password authentication form, client component
10. src/middleware.ts — NEW: authentication middleware to protect /generate and /gallery routes without @supabase/ssr