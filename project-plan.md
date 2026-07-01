# Project Plan
1. package.json — Project dependencies and scripts
2. tsconfig.json — TypeScript configuration
3. next.config.js — Next.js configuration with image domains
4. tailwind.config.ts — Tailwind CSS configuration with theme colors
5. src/lib/prisma.ts — Prisma client initialization
6. prisma/schema.prisma — Database schema with all models
7. src/lib/utils.ts — Utility functions including cn() for class merging
8. src/components/ui/button.tsx — Reusable button component with orange accent
9. src/components/ui/card.tsx — Card component for ad displays
10. src/components/ui/input.tsx — Input component with dark theme styling
11. src/components/ui/label.tsx — Label component for form inputs
12. src/components/ui/textarea.tsx — Textarea component for descriptions
13. src/components/ui/select.tsx — Select component for category filtering
14. src/components/ui/skeleton.tsx — Skeleton loading component
15. src/components/ui/toaster.tsx — Toast notification component
16. src/components/ui/dialog.tsx — Dialog/modal component
17. src/components/ui/sheet.tsx — Sheet component for mobile filters
18. src/components/ui/slider.tsx — Price range slider component
19. src/components/ui/avatar.tsx — Avatar component for user profiles
20. src/components/ui/badge.tsx — Badge component for categories
21. src/components/ui/dropdown-menu.tsx — Dropdown menu for user navigation
22. src/components/ui/separator.tsx — Separator component
23. src/components/ui/form.tsx — Form component with React Hook Form integration
24. src/components/ui/alert.tsx — Alert component for error messages
25. src/components/ui/pagination.tsx — Pagination component
26. src/components/theme-provider.tsx — Theme context provider
27. src/components/navbar.tsx — Main navigation with search and user menu
28. src/components/footer.tsx — Footer component
29. src/components/search-bar.tsx — Global search with autocomplete
30. src/components/category-filter.tsx — Sidebar filter component
31. src/components/ad-card.tsx — Preview card for ads in listings
32. src/components/image-uploader.tsx — Drag-and-drop image upload for ads
33. src/components/contact-seller-button.tsx — Modal/form to contact ad owner
34. src/components/empty-state.tsx — Component for empty results
35. src/app/globals.css — Global CSS with Tailwind directives
36. src/app/layout.tsx — Root layout with metadata and providers
37. src/app/page.tsx — Homepage with featured ads and category browse
38. src/app/ads/page.tsx — All ads listing page with filters sidebar
39. src/app/ads/[id]/page.tsx — Individual ad detail page with image gallery
40. src/app/ads/create/page.tsx — Form to create new ad (authenticated)
41. src/app/ads/[id]/edit/page.tsx — Edit existing ad page (owner only)
42. src/app/categories/[category]/page.tsx — Ads filtered by specific category
43. src/app/search/page.tsx — Search results page
44. src/app/profile/page.tsx — User profile and dashboard
45. src/app/login/page.tsx — Login page
46. src/app/register/page.tsx — Registration page
47. src/app/api/auth/[...nextauth]/route.ts — NextAuth.js configuration
48. src/app/api/ads/route.ts — GET and POST endpoints for ads
49. src/app/api/ads/[id]/route.ts — GET, PATCH, DELETE for single ad
50. src/app/api/categories/route.ts — Get all available categories
51. src/app/api/upload/route.ts — Handle image uploads to Cloudinary
52. src/app/api/profile/[userId]/route.ts — Get user profile info
53. src/app/api/contact/route.ts — Send message to ad owner
54. src/middleware.ts — Authentication middleware for protected routes
55. src/types/index.ts — TypeScript type definitions
56. src/lib/validations.ts — Zod validation schemas
57. src/lib/cloudinary.ts — Cloudinary configuration and helpers
58. src/lib/auth.ts — Authentication utilities
59. src/lib/constants.ts — App constants (categories, theme colors, etc.)
60. .env.example — Environment variables template
61. README.md — Project documentation and setup instructions