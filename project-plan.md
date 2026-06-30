# Edit Plan
1. src/lib/supabase.ts — NEW: Create Supabase client using @supabase/supabase-js, createClient from NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
2. src/lib/prisma.ts — NEW: PrismaClient singleton for Next.js
3. src/lib/utils.ts — NEW: cn() helper using clsx + tailwind-merge, formatDate, formatDuration, truncate helpers
4. src/types/index.ts — NEW: TypeScript types: Video, Template, User, VideoStatus enum, GenerateRequest, ApiResponse
5. src/app/api/auth/callback/route.ts — NEW: Supabase OAuth callback handler
6. src/app/api/user/profile/route.ts — NEW: GET user profile from Supabase session, return email + credits balance from Prisma
7. src/app/api/gallery/route.ts — NEW: GET all videos for authenticated user from Prisma, return as JSON array
8. src/app/api/videos/[id]/route.ts — NEW: GET single video, DELETE video by id, both require auth
9. src/app/api/generate/route.ts — NEW: POST handler. Get user from Supabase session. Create Video record in Prisma with status "processing". Queue generation job. Return jobId and videoId. NOTE: actual AI generation uses OPENROUTER_API_KEY — if not set, return a placeholder video URL instead so the app still works
10. src/app/api/generate/status/[id]/route.ts — NEW: GET job status from Prisma video record. Return status, progress, videoUrl when done
11. src/app/api/templates/route.ts — NEW: GET all public templates from Prisma
12. src/app/api/credits/route.ts — NEW: GET user credit balance, POST to deduct credits
13. src/services/videoGeneration.ts — NEW: Video generation service. If OPENROUTER_API_KEY is set, call OpenRouter API to generate a video script using claude-3-haiku. If not set, simulate with a 5 second delay and return a placeholder MP4 URL. Export generateVideo(prompt, aspectRatio, duration) function
14. src/app/generate/page.tsx — EDIT: REWRITE: Full generator UI. Prompt textarea with suggestions, aspect ratio selector (16:9, 9:16, 1:1) with visual previews, duration slider (5-60s), style selector (cinematic, animated, minimal, bold), Submit button. POST to /api/generate, show real-time progress bar polling /api/generate/status/[id] every 2s, display video player when done. Dark theme, orange accents. "use client"
15. src/app/gallery/page.tsx — EDIT: REWRITE: Video gallery. Fetch from /api/gallery. Grid of video cards with thumbnail placeholder, title, status badge (processing/completed/failed), duration, aspect ratio badge. Click to open video modal. Download button. Delete button with confirm. Empty state. "use client"
16. src/components/VideoCard.tsx — NEW: Reusable video card component with thumbnail, status badge, duration, download/delete actions. Dark theme.
17. src/components/VideoModal.tsx — NEW: Modal to preview video with HTML5 video player, download button, share button, video metadata. "use client"
18. src/components/Navbar.tsx — NEW: Top navigation. Logo, nav links (Generate, Gallery, Templates, Pricing, Dashboard). Auth state from Supabase — show Sign In or user avatar + dropdown. Mobile hamburger. Dark theme, orange accent.
19. src/components/ProgressBar.tsx — NEW: Animated progress bar component with percentage, label, and color variants
20. src/components/StatusBadge.tsx — NEW: Status badge for video states: processing (orange pulse), completed (green), failed (red), draft (gray)
21. src/app/dashboard/page.tsx — EDIT: REWRITE: User dashboard. Fetch /api/user/profile. Show: welcome message, credits balance with top-up button, stats grid (total videos, completed, processing, storage used), recent videos list (last 5), quick action cards. "use client"
22. src/app/templates/page.tsx — EDIT: REWRITE: Templates browser. Fetch /api/templates. Grid of template cards with preview, category badge, duration, Use Template button. Filter by category. "use client"
23. src/app/pricing/page.tsx — EDIT: REWRITE: Pricing page. 3 tiers: Free (10 credits/mo, 720p, 10s max), Pro (£19/mo, 500 credits, 1080p, 60s, priority), Business (£49/mo, unlimited, 4K, custom branding). Feature comparison table. Highlight Pro tier. CTA buttons.
24. src/app/login/page.tsx — EDIT: REWRITE: Full auth page. Email/password with Supabase. Google OAuth button. Toggle login/signup. Forgot password link. Redirect to /generate on success. Show error messages. "use client"
25. src/app/page.tsx — EDIT: REWRITE: Landing page. Hero: large headline "Create AI Video Ads in Seconds", subheading, two CTAs (Start Free, Watch Demo). Features section: 4 cards with icons. How it works: 3 steps with numbers. Social proof: fake testimonials. Pricing teaser. Footer with links. No external imports — use inline SVG for icons.
26. src/components/Footer.tsx — NEW: Site footer. Logo, tagline, nav columns (Product, Company, Legal), social links, copyright. Dark theme.
27. src/app/api/webhooks/stripe/route.ts — NEW: Stripe webhook handler. Handle checkout.session.completed to add credits to user. Use STRIPE_SECRET_KEY env var. If not set, return 200 with message "Stripe not configured".
28. src/app/api/admin/stats/route.ts — NEW: Admin stats endpoint. Requires ADMIN_SECRET header. Returns total users, videos, revenue placeholder.
29. src/hooks/useAuth.ts — NEW: Custom hook returning Supabase session, user, loading state, signOut function. "use client"
30. src/hooks/useVideos.ts — NEW: Custom hook to fetch and manage user videos. Returns videos array, loading, error, refetch, deleteVideo. "use client"
31. src/hooks/useCredits.ts — NEW: Custom hook to fetch and display credit balance with real-time updates. "use client"
32. src/components/CreditsBadge.tsx — NEW: Credit balance display component with low-credit warning. Shows balance, top-up button.
33. src/app/layout.tsx — EDIT: UPDATE: Add Navbar and Footer to layout, import globals.css, add metadata (title T4N Ads, description)
34. src/app/not-found.tsx — NEW: Custom 404 page. Dark theme, animated. Link back to home.
35. src/app/error.tsx — NEW: Custom error boundary. Show error message, retry button, go home link. "use client"
36. src/app/loading.tsx — NEW: Global loading component with animated spinner. "use client"
37. prisma/seed.ts — NEW: Seed script to create sample templates (Social Media 15s, Product Demo 30s, Testimonial 45s, Brand Story 60s) with categories and tags
38. src/app/generate/loading.tsx — NEW: Loading state for generate page. "use client"
39. src/app/gallery/loading.tsx — NEW: Loading state for gallery page. "use client"
40. README.md — NEW: Full setup guide with env vars, npm commands, Prisma setup, deployment instructions