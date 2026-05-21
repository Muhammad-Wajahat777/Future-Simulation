import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchSimulations } from '../_actions/simulate';
import HistoryCard from '../_components/HistoryCard';

export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
  const simulations = await fetchSimulations();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Simulation History</h1>
          <p className="text-sm text-muted-foreground">
            Click any saved simulation to view the best, average, and worst outcomes again.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/future-simulator">Back to Simulator</Link>
        </Button>
      </div>

      {simulations.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader className="text-center">
            <CardTitle>No previous conversations found</CardTitle>
            <CardDescription>
              Run your first simulation and it will appear here automatically.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-6">
            <Button asChild>
              <Link href="/future-simulator">Start a Simulation</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {simulations.map((simulation) => (
            <HistoryCard key={simulation.id} record={simulation} />
          ))}
        </div>
      )}
    </main>
  );
}
