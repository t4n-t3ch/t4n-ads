import Link from "next/link";
import { Sparkles, PenLine, Wand2, Download, ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";

const steps = [
  {
    icon: PenLine,
    title: "Describe your ad",
    description:
      "Write a prompt for the video you want — product, mood, style, aspect ratio, and duration.",
  },
  {
    icon: Wand2,
    title: "Veo 3.1 generates it",
    description:
      "Your prompt is sent straight to Google's Veo 3.1 model, which renders a real video ad in minutes.",
  },
  {
    icon: Download,
    title: "Download & publish",
    description:
      "Preview the result, download the file, and ship it to your campaigns — no editing required.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0f0f11] text-white">
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0f0f11]/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-500">
              <span className="text-sm font-bold text-white">T4N</span>
            </div>
            <span className="flex flex-col leading-tight">
              <span className="text-lg font-bold text-white">T4N Ads</span>
              <span className="text-[10px] uppercase tracking-wide text-gray-500">Trade-Link-UK</span>
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/pricing"
              className="hidden text-sm text-gray-400 transition-colors hover:text-white sm:block"
            >
              Pricing
            </Link>
            <Link
              href="/login"
              className="hidden text-sm text-gray-400 transition-colors hover:text-white sm:block"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-sm font-medium text-white transition-all hover:from-orange-600 hover:to-amber-600"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <section className="container mx-auto px-4 pb-20 pt-20 text-center sm:pt-28">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-medium tracking-wide text-orange-400">
            <Sparkles className="h-3.5 w-3.5" />
            AI-POWERED VIDEO AD GENERATION
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">
            Turn a prompt into a{" "}
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              video ad
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-gray-400">
            Describe the ad you want. T4N Ads generates it with Google&apos;s
            Veo 3.1 — no camera, no editing, no design skills needed.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 font-medium text-white transition-all hover:from-orange-600 hover:to-amber-600"
            >
              Start creating
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg border border-white/15 px-6 py-3 font-medium text-white transition-colors hover:bg-white/5"
            >
              View pricing
            </Link>
          </div>
        </section>

        <section className="border-t border-white/10 bg-white/[0.02]">
          <div className="container mx-auto px-4 py-20">
            <p className="mb-2 text-center text-xs font-semibold tracking-widest text-orange-400">
              HOW IT WORKS
            </p>
            <h2 className="mb-12 text-center text-3xl font-bold">
              From idea to video ad in three steps
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {steps.map((step) => (
                <div
                  key={step.title}
                  className="rounded-xl border border-white/10 bg-[#18181b] p-6"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-500">
                    <step.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                  <p className="text-sm text-gray-400">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
