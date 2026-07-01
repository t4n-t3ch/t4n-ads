# Edit Plan
1. src/components/ui/use-toast.tsx — NEW: Create a minimal toast hook and component following shadcn/ui conventions with useToast hook and toast function, using only React without external dependencies
2. src/lib/actions/ads.ts — NEW: Create createAd and updateAd functions that interact with Supabase client to write to the ads table
3. src/lib/actions/storage.ts — NEW: Create uploadImage function that uploads files to Supabase Storage and returns the public URL