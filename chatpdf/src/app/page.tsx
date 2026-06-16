import { auth } from "@clerk/nextjs/server";
import { Button } from "../components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  FileSearch,
  Quote,
  ShieldCheck,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";
import FileUpload from "../components/FileUploadLazy";
import { checkSubscription } from "../lib/subscription";
import { db } from "../lib/db";
import { eq } from "drizzle-orm";
import { chats } from "../lib/db/schema";
import SubscriptionButton from "../components/SubscriptionButton";
import Navbar from "../components/Navbar";

const features = [
  {
    icon: Zap,
    title: "Instant answers",
    body: "Ask anything and get a clear, streamed answer in seconds — no more skimming a hundred pages to find one line.",
  },
  {
    icon: Quote,
    title: "Grounded in your doc",
    body: "Responses are drawn from the actual contents of your PDF, so you can trust what you read instead of guessing.",
  },
  {
    icon: FileSearch,
    title: "Search by meaning",
    body: "Semantic search understands intent, not just keywords — find the right passage even when the wording differs.",
  },
  {
    icon: ShieldCheck,
    title: "Private & secure",
    body: "Your files are stored securely and only ever accessible to you. Sign in, upload, and your library stays yours.",
  },
];

const steps = [
  {
    n: "01",
    title: "Upload a PDF",
    body: "Drag and drop any document up to 10 MB — papers, contracts, manuals, textbooks.",
  },
  {
    n: "02",
    title: "We read it for you",
    body: "Your document is parsed and indexed so every page becomes instantly searchable.",
  },
  {
    n: "03",
    title: "Start the conversation",
    body: "Ask questions in plain language and get sourced answers, page after page.",
  },
];

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;
  const isPro = await checkSubscription();

  let firstUser;
  if (userId) {
    const rows = await db.select().from(chats).where(eq(chats.userId, userId));
    firstUser = rows[0];
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-hero-glow" aria-hidden />
          <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
          <div className="mx-auto max-w-6xl px-4 pb-10 pt-16 sm:px-6 sm:pt-24">
            <div className="mx-auto flex max-w-3xl flex-col items-center text-center animate-fade-in-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Your documents, finally conversational
              </span>

              <h1 className="mt-6 font-display text-5xl leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl">
                Chat with any PDF,
                <br />
                <span className="text-gradient">get answers instantly.</span>
              </h1>

              <p className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-muted-foreground">
                Upload a document and ask it anything. PaperChat reads the whole
                thing and replies with clear, sourced answers — join the
                students, researchers, and professionals who&apos;d rather ask
                than scroll.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                {isAuth && firstUser ? (
                  <Link href={`/chat/${firstUser.id}`}>
                    <Button size="lg" className="gap-2">
                      Go to your chats
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                ) : isAuth ? (
                  <a href="#upload">
                    <Button size="lg" className="gap-2">
                      Upload your first PDF
                      <Upload className="h-4 w-4" />
                    </Button>
                  </a>
                ) : (
                  <Link href="/sign-in">
                    <Button size="lg" className="gap-2">
                      Get started free
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                {isAuth && <SubscriptionButton isPro={isPro} />}
              </div>

              <p className="mt-4 text-xs text-muted-foreground">
                No credit card required · PDFs up to 10 MB
              </p>
            </div>
          </div>
        </section>

        {/* Upload / start */}
        <section
          id="upload"
          className="mx-auto max-w-2xl scroll-mt-20 px-4 pb-20 sm:px-6"
        >
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            {isAuth ? (
              <>
                <h2 className="font-display text-2xl tracking-tight">
                  Start a new conversation
                </h2>
                <p className="mb-5 mt-1 text-sm text-muted-foreground">
                  Drop a PDF below and we&apos;ll have it ready to chat in
                  moments.
                </p>
                <FileUpload />
              </>
            ) : (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <Upload className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="font-display text-2xl tracking-tight">
                    Sign in to upload your first PDF
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Create a free account to start chatting with your documents.
                  </p>
                </div>
                <Link href="/sign-in">
                  <Button size="lg" className="gap-2">
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="scroll-mt-20 border-t border-border bg-secondary/40"
        >
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
                Everything you need to read less and know more
              </h2>
              <p className="mt-3 text-muted-foreground">
                Purpose-built for dense documents, so the answer comes to you.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-medium">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {f.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="scroll-mt-20">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
                Up and running in three steps
              </h2>
            </div>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {steps.map((s) => (
                <div key={s.n} className="relative">
                  <span className="font-display text-4xl text-primary/40">
                    {s.n}
                  </span>
                  <h3 className="mt-2 text-lg font-medium">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border bg-secondary/40">
          <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
              Stop scrolling. Start asking.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              Your next document is one upload away from being a conversation.
            </p>
            <div className="mt-8">
              <Link href={isAuth ? "#upload" : "/sign-in"}>
                <Button size="lg" className="gap-2">
                  {isAuth ? "Upload a PDF" : "Get started free"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} PaperChat. All rights reserved.</p>
          <p className="text-xs">Chat with your PDFs, anywhere.</p>
        </div>
      </footer>
    </div>
  );
}
