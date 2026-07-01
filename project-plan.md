# Edit Plan
1. src/app/api/generate/route.ts — EDIT: Remove thumbnailUrl and metadata fields from prisma.video.update call in success block since they don't exist on VideoGenerationResult type