# Edit Plan
1. src/lib/utils.ts — EDIT: add formatDate, formatDuration, and truncate functions while preserving existing cn() function
2. src/lib/supabase.ts — EDIT: add getSession() and fetchAds() async functions while keeping existing supabase client export
3. src/lib/prisma.ts — EDIT: add "export default prisma" at the end while preserving existing named export
4. src/components/VideoCard.tsx — EDIT: add "export default VideoCard" at the end while keeping existing named export
5. src/types/supabase.ts — NEW: create file with minimal Database type placeholder for Supabase
6. src/lib/supabase/server.ts — NEW: create file with createClient() function for Server Actions using createServerActionClient
7. src/types/index.ts — EDIT: add new exported "Ad" interface without changing existing interfaces or enums
8. src/app/ads/[id]/page.tsx — NEW: create dynamic route page that fetches and displays single ad details