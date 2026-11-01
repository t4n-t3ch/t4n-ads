import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase/admin";
import { VideoStatus } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { type, data } = payload;

    if (!data?.id) {
      return NextResponse.json({ error: "Missing job id in webhook payload" }, { status: 400 });
    }

    const video = await prisma.video.findFirst({ where: { jobId: data.id } });
    if (!video) {
      return NextResponse.json({ error: "No matching video for this job" }, { status: 404 });
    }

    if (type === "video.generation.completed") {
      // `urls` is a pre-signed, directly-fetchable link (e.g. GCS) good for a
      // limited time. `unsigned_urls` are actually OpenRouter API endpoints
      // that require our OPENROUTER_API_KEY as a Bearer token - fetching them
      // with no auth returns a 401 JSON error body, not video bytes.
      const signedUrl = data.urls?.[0];
      const apiUrl = data.unsigned_urls?.[0];
      const sourceUrl = signedUrl || apiUrl;

      if (!sourceUrl) {
        await prisma.video.update({
          where: { id: video.id },
          data: { status: VideoStatus.FAILED, error: "No video URL in completion payload" },
        });
        return NextResponse.json({ ok: true });
      }

      let finalUrl: string | null = null;
      try {
        const fetchHeaders: Record<string, string> = signedUrl
          ? {}
          : { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` };

        const videoResponse = await fetch(sourceUrl, { headers: fetchHeaders });
        const contentType = videoResponse.headers.get("content-type") || "";

        if (!videoResponse.ok || !contentType.startsWith("video/")) {
          throw new Error(
            `Unexpected video fetch response: ${videoResponse.status} ${contentType}`
          );
        }

        const arrayBuffer = await videoResponse.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const supabase = createAdminClient();
        const fileName = `${video.id}-${Date.now()}.mp4`;
        const { error: uploadError } = await supabase.storage
          .from("videos")
          .upload(fileName, buffer, { contentType: "video/mp4", upsert: false });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from("videos").getPublicUrl(fileName);
        finalUrl = urlData.publicUrl;
      } catch (uploadErr) {
        console.error("Video re-upload to Supabase failed:", uploadErr);
        // Fall back to the signed URL directly if we at least have one -
        // better than nothing, even though it will expire eventually.
        finalUrl = signedUrl || null;
      }

      if (!finalUrl) {
        await prisma.video.update({
          where: { id: video.id },
          data: { status: VideoStatus.FAILED, error: "Could not retrieve generated video" },
        });
        return NextResponse.json({ ok: true });
      }

      const cost = data.usage?.cost;
      const costCents = typeof cost === "number" ? Math.round(cost * 100) : undefined;

      await prisma.video.update({
        where: { id: video.id },
        data: {
          status: VideoStatus.COMPLETED,
          progress: 100,
          videoUrl: finalUrl,
          costCents,
        },
      });
    } else if (type === "video.generation.failed" || type === "video.generation.cancelled" || type === "video.generation.expired") {
      await prisma.video.update({
        where: { id: video.id },
        data: {
          status: VideoStatus.FAILED,
          error: data.error || "Video generation did not complete",
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
