import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100svh-5rem)] w-full max-w-5xl flex-col gap-6 p-6 md:p-10">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          You are signed in. Open the simulator or continue working from here.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Future Simulator</CardTitle>
            <CardDescription>Run a future scenario simulation..</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/future-simulator">Open Simulator</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>History</CardTitle>
            <CardDescription>Review past simulations saved in your Supabase table.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="outline">
              <Link href="/future-simulator/history">Open History</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}