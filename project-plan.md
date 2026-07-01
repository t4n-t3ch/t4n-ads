# Project Plan
1. package.json — Project dependencies and scripts
2. tsconfig.json — TypeScript configuration
3. next.config.js — Next.js configuration
4. tailwind.config.ts — Tailwind CSS configuration
5. prisma/schema.prisma — Database schema with all models
6. src/lib/prisma.ts — Prisma client instance
7. src/lib/utils.ts — Utility functions
8. src/lib/validations.ts — Zod schemas for form validation
9. src/components/ui/button.tsx — Button component
10. src/components/ui/card.tsx — Card component
11. src/components/ui/input.tsx — Input component
12. src/components/ui/label.tsx — Label component
13. src/components/ui/badge.tsx — Badge component
14. src/components/ui/skeleton.tsx — Skeleton loader component
15. src/components/ui/separator.tsx — Separator component
16. src/components/theme-provider.tsx — Theme context provider
17. src/components/theme-toggle.tsx — Dark/light theme switcher
18. src/components/user-nav.tsx — User menu with auth state
19. src/components/search-bar.tsx — Search component with debouncing
20. src/components/category-filter.tsx — Category filter dropdown
21. src/components/price-range-slider.tsx — Dual-handle price filter
22. src/components/ad-card.tsx — Compact ad preview component
23. src/components/ad-form.tsx — Reusable form for create/edit ads
24. src/components/empty-state.tsx — Component for no results
25. src/app/layout.tsx — Root layout with metadata and providers
26. src/app/globals.css — Global styles and Tailwind directives
27. src/app/page.tsx — Homepage with featured ads and categories
28. src/app/auth/login/page.tsx — Login page
29. src/app/auth/register/page.tsx — Registration page
30. src/app/ads/page.tsx — All ads listing page with filters
31. src/app/ads/[id]/page.tsx — Individual ad detail page
32. src/app/ads/create/page.tsx — Create new advertisement page
33. src/app/ads/edit/[id]/page.tsx — Edit existing ad page
34. src/app/dashboard/page.tsx — User's personal dashboard
35. src/app/categories/page.tsx — Browse all categories page
36. src/app/api/auth/[...nextauth]/route.ts — NextAuth.js authentication routes
37. src/app/api/ads/route.ts — GET/POST ads API endpoint
38. src/app/api/ads/[id]/route.ts — GET/PATCH/DELETE single ad API
39. src/app/api/categories/route.ts — GET/POST categories API
40. src/app/api/users/me/ads/route.ts — Get current user's ads API
41. .env.example — Environment variables template
42. README.md — Project documentation