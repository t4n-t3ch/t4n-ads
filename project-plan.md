# Edit Plan
1. next.config.js — EDIT: Remove 'appDir' from experimental block entirely, keep config minimal and valid for Next.js 14.0.4
2. package.json — EDIT: Add "lucide-react" to dependencies
3. src/app/gallery/page.tsx — NEW: Create complete page component with "use client", fetch from /api/gallery, video grid with status badges and download buttons
4. src/app/globals.css — NEW: Create file with Tailwind directives and dark theme (background #0f0f11, white text)