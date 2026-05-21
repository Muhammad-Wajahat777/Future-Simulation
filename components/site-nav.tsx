"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import type { Session } from "@supabase/supabase-js"
import { LogOut, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabaseClient"

type SiteNavProps = {
  initialSession: Session | null
}

const navItems = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/future-simulator", label: "Simulator" },
  { href: "/future-simulator/history", label: "History" },
]

export function SiteNav({ initialSession }: SiteNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [session, setSession] = useState(initialSession)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      router.refresh()
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
    router.push("/")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050816]/85 backdrop-blur-xl">
      <div className="mx-auto flex min-h-20 w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group inline-flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_30px_rgba(56,189,248,0.12)] backdrop-blur-xl transition-transform duration-300 group-hover:scale-105">
            <Sparkles className="size-5 text-cyan-300" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-[0.28em] text-white/90 uppercase">
              Future Simulator
            </p>
            <p className="text-xs text-white/45">See your future before you live it.</p>
          </div>
        </Link>

        {session ? (
          <nav className="flex flex-wrap items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`)

              return (
                <Button
                  key={item.href}
                  asChild
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "rounded-full px-4 text-white/70 transition-colors hover:bg-white/10 hover:text-white",
                    isActive && "bg-white/10 text-white"
                  )}
                >
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              )
            })}
          </nav>
        ) : null}

        <div className="flex items-center gap-2">
          {session ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="rounded-full border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
            >
              <LogOut className="size-4" />
              Log out
            </Button>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="rounded-full text-white/75 hover:bg-white/10 hover:text-white"
              >
                <Link href="/login">Sign in</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="rounded-full bg-cyan-300 text-slate-950 hover:bg-cyan-200"
              >
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}