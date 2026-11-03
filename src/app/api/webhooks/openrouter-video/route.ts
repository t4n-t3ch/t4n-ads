import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase/admin";
import { submitVideoGeneration } from "@/services/videoGeneration";
import { VideoStatus } from "@/types";

// Veo rejects a reference-image set it can't reconcile into one consistent
// subject (e.g. a logo + unrelated screenshots). Automations pick reference
// photos at random from a subject's whole archive, so this is expected to
// happen sometimes - retry once, prompt-only, rather than leaving a
// scheduled run silently failed.
function isReferenceMixError(message: string | undefined): boolean {
  return !!message && /reference/i.test(message);
}

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
      const metadata = (video.metadata as { referenceRetryAttempted?: boolean } | null) || {};

      if (
        type === "video.generation.failed" &&
        isReferenceMixError(data.error) &&
        !metadata.referenceRetryAttempted &&
        video.prompt
      ) {
        const subject = video.subjectId
          ? await prisma.subject.findUnique({ where: { id: video.subjectId }, select: { description: true } })
          : null;

        const forwardedHost = request.headers.get("x-forwarded-host") || request.headers.get("host");
        const forwardedProto = request.headers.get("x-forwarded-proto") || request.nextUrl.protocol.replace(":", "");
        const origin = forwardedHost ? `${forwardedProto}://${forwardedHost}` : request.nextUrl.origin;
        const callbackUrl = `${origin}/api/webhooks/openrouter-video`;

        const retry = await submitVideoGeneration(
          {
            prompt: video.prompt,
            aspectRatio: (video.aspectRatio as "16:9" | "9:16" | "1:1") || "16:9",
            duration: video.duration || 8,
            generateAudio: true,
            subjectContext: subject?.description || undefined,
            // No referenceImageUrls this time - that's the whole point of the retry.
          },
          callbackUrl
        );

        if (retry.success && retry.jobId) {
          await prisma.video.update({
            where: { id: video.id },
            data: {
              jobId: retry.jobId,
              status: VideoStatus.PROCESSING,
              progress: 0,
              error: null,
              metadata: { referenceRetryAttempted: true },
            },
          });
          return NextResponse.json({ ok: true, retried: true });
        }

        await prisma.video.update({
          where: { id: video.id },
          data: {
            status: VideoStatus.FAILED,
            error: `${data.error} (retry without references also failed: ${retry.error})`,
            metadata: { referenceRetryAttempted: true },
          },
        });
        return NextResponse.json({ ok: true });
      }

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
