# Edit Plan

1. src/lib/supabase.ts — NEW: Create Supabase client using @supabase/supabase-js with createClient from NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
2. src/lib/prisma.ts — NEW: Create PrismaClient singleton for Next.js with globalThis caching
3. src/lib/utils.ts — NEW: Create cn() helper using clsx + tailwind-merge, plus formatDate, formatDuration, truncate utility functions
4. src/types/index.ts — NEW: Define TypeScript types: Video, Template, User, VideoStatus enum, GenerateRequest, ApiResponse
5. src/app/api/auth/callback/route.ts — NEW: Create Supabase OAuth callback handler that exchanges code for session and redirects
6. src/app/api/user/profile/route.ts — NEW: Create GET handler to fetch user profile from Supabase session and return email + credits balance from Prisma
7. src/app/api/gallery/route.ts — NEW: Create GET handler to fetch all videos for authenticated user from Prisma, return as JSON array
8. src/app/api/videos/[id]/route.ts — NEW: Create GET single video and DELETE video by id handlers, both require authentication
9. src/app/api/generate/route.ts — EDIT: Enhance existing POST handler to get user from Supabase session, create Video record in Prisma with status "processing", queue generation job, return jobId and videoId. Add fallback when OPENROUTER_API_KEY not set
10. src/app/api/generate/status/[id]/route.ts — NEW: Create GET handler to fetch job status from Prisma video record, return status, progress, videoUrl when done
11. src/app/api/templates/route.ts — NEW: Create GET handler to fetch all public templates from Prisma database
12. src/app/api/credits/route.ts — NEW: Create GET handler for user credit balance and POST handler to deduct credits with validation
13. src/services/videoGeneration.ts — NEW: Create video generation service with OpenRouter API integration (claude-3-haiku) and fallback simulation when API key not set
14. src/app/generate/page.tsx — EDIT: Rewrite existing page with full generator UI including prompt textarea with suggestions, aspect ratio selector with visual previews, duration slider, style selector, real-time progress bar polling, and video player
15. src/app/gallery/page.tsx — EDIT: Rewrite existing page with video gallery grid, status badges, video modal, download/delete functionality, and empty state
16. src/components/VideoCard.tsx — NEW: Create reusable video card component with thumbnail placeholder, status badge, duration, and download/delete actions
17. src/components/VideoModal.tsx — NEW: Create modal component for video preview with HTML5 video player, download button, share button, and metadata display
18. src/components/Navbar.tsx — NEW: Create top navigation component with logo, nav links, Supabase auth state, mobile hamburger menu
19. src/components/ProgressBar.tsx — NEW: Create animated progress bar component with percentage display, label, and color variants
20. src/components/StatusBadge.tsx — NEW: Create status badge component for video states with appropriate colors and animations
21. src/app/dashboard/page.tsx — EDIT: Rewrite existing page to fetch user profile, display credits balance, stats grid, recent videos list, and quick action cards
22. src/app/templates/page.tsx — EDIT: Rewrite existing page to fetch templates from API, display grid with filters, category badges, and Use Template buttons
23. src/app/pricing/page.tsx — EDIT: Rewrite existing page with 3 pricing tiers, feature comparison table, and highlighted Pro tier
24. src/app/login/page.tsx — EDIT: Rewrite existing page with full auth functionality including email/password, Google OAuth, login/signup toggle, and error handling
25. src/app/page.tsx — EDIT: Rewrite existing landing page with hero section, features cards, how-it-works steps, testimonials, pricing teaser, and footer
26. src/components/Footer.tsx — NEW: Create site footer component with logo, tagline, navigation columns, social links, and copyright
27. src/app/api/webhooks/stripe/route.ts — NEW: Create Stripe webhook handler for checkout.session.completed events to add credits to user
28. src/app/api/admin/stats/route.ts — NEW: Create admin stats endpoint requiring ADMIN_SECRET header, returning total users, videos, and revenue placeholder
29. src/hooks/useAuth.ts — NEW: Create custom hook returning Supabase session, user, loading state, and signOut function
30. src/hooks/useVideos.ts — NEW: Create custom hook to fetch and manage user videos with CRUD operations
31. src/hooks/useCredits.ts — NEW: Create custom hook to fetch and display credit balance with real-time updates
32. src/components/CreditsBadge.tsx — NEW: Create credit balance display component with low-credit warning and top-up button
33. src/app/layout.tsx — EDIT: Update existing layout to add Navbar and Footer components, import globals.css, and add metadata
34. src/app/not-found.tsx — NEW: Create custom 404 page with dark theme, animation, and home link
35. src/app/error.tsx — NEW: Create custom error boundary component with error message, retry button, and home link
36. src/app/loading.tsx — NEW: Create global loading component with animated spinner for page transitions
37. prisma/seed.ts — NEW: Create seed script to populate database with sample video templates in different categories
38. src/app/generate/loading.tsx — NEW: Create loading state component specifically for generate page
39. src/app/gallery/loading.tsx — NEW: Create loading state component specifically for gallery page
40. README.md — EDIT: Update existing README with full setup guide including environment variables, npm commands, Prisma setup, and deployment instructions