import { LoginForm } from "@/components/login-form";
import Link from "next/link";

export default function Page() {
  return (
    <main className="relative flex min-h-[calc(100svh-5rem)] items-center justify-center bg-[#050816] text-white">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.06),transparent_20%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.04),transparent_20%)]" />

      <div className="z-10 w-full max-w-md px-6 py-10">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="mt-2 text-sm text-white/60">Sign in to access your dashboard and simulations</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_40px_80px_rgba(2,6,23,0.6)] backdrop-blur-lg">
          <LoginForm />
        </div>

        <p className="mt-4 text-center text-sm text-white/50">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-cyan-300 underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
