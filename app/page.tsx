"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

export default function Home() {
  return (
    <main className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-[#050816] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.16),transparent_28%),radial-gradient(circle_at_bottom,rgba(15,23,42,0.9),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[80px_80px] mask-[radial-gradient(circle_at_center,black,transparent_78%)] opacity-20" />

      <section className="relative z-10 mx-auto grid min-h-[calc(100svh-5rem)] w-full max-w-7xl items-center gap-10 px-6 pb-16 pt-8 md:grid-cols-[1.05fr_0.95fr] md:px-10 lg:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8"
        >
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-medium text-cyan-200 shadow-[0_0_30px_rgba(34,211,238,0.08)] backdrop-blur-xl">
              <Wand2 className="size-4" />
              Predict outcomes with AI-powered scenario design
            </div>

            <div className="max-w-3xl space-y-6">
              <h1 className="text-5xl font-semibold tracking-tighter text-white sm:text-6xl lg:text-7xl">
                <span className="block text-white/95">See Your Future</span>
                <span className="block bg-linear-to-r from-cyan-200 via-white to-fuchsia-200 bg-clip-text text-transparent">
                  before you live it
                </span>
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-white/68 sm:text-xl">
                Future Simulator helps you compare best-case, average-case, and worst-case outcomes before making a decision. Clean, fast, and built for clarity.
              </p>
            </div>

            <div className="flex justify-start">
              <Button asChild size="lg" className="h-12 rounded-full bg-cyan-300 px-6 text-slate-950 hover:bg-cyan-200">
                <Link href="/login" className="inline-flex items-center gap-2">
                  Login
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                title: 'Protected History',
                desc: 'Saved per user with Supabase RLS.',
                icon: ShieldCheck,
              },
              {
                title: 'Three Outcomes',
                desc: 'Best, average, and worst-case analysis.',
                icon: Sparkles,
              },
              {
                title: 'Premium UI',
                desc: 'Dark glassmorphism with subtle glow.',
                icon: Wand2,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="border-white/10 bg-white/5 shadow-[0_0_50px_rgba(15,23,42,0.45)] backdrop-blur-xl">
                  <CardContent className="flex items-start gap-3 p-5">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10">
                      <Icon className="size-4 text-cyan-200" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                      <p className="text-sm leading-6 text-white/55">{item.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="absolute -inset-8 rounded-[2.5rem] bg-cyan-400/10 blur-3xl" />
          <Card className="relative overflow-hidden border-white/10 bg-white/6 shadow-[0_40px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
            <CardContent className="space-y-6 p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/40">Live Preview</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Decision runway</h2>
                </div>
                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                  AI Ready
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    label: 'Best Case',
                    tone: 'from-emerald-400/20 to-emerald-400/5 border-emerald-300/20',
                    text: 'Momentum builds, the decision pays off, and you gain clarity quickly.',
                  },
                  {
                    label: 'Average Case',
                    tone: 'from-amber-400/20 to-amber-400/5 border-amber-300/20',
                    text: 'You progress steadily with a few tradeoffs, but the outcome remains workable.',
                  },
                  {
                    label: 'Worst Case',
                    tone: 'from-rose-400/20 to-rose-400/5 border-rose-300/20',
                    text: 'A few setbacks appear, but the scenario gives you warning signs to adjust early.',
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    variants={fadeUp}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ ...fadeUp.transition, delay: index * 0.12 }}
                    className={`rounded-2xl border bg-linear-to-br ${item.tone} p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">{item.label}</p>
                      <span className="text-xs text-white/45">Scenario</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/70">{item.text}</p>
                  </motion.div>
                ))}
              </div>

              <div className="grid gap-3 rounded-3xl border border-white/10 bg-slate-950/40 p-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/35">Dashboard</p>
                  <p className="mt-2 text-sm text-white/65">Login to enter your personal workspace.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/35">History</p>
                  <p className="mt-2 text-sm text-white/65">Only your own simulations are visible.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </main>
  );
}
