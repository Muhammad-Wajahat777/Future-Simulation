'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SimulationRecord } from '../_lib/types';

interface OutcomeCardsProps {
  record: SimulationRecord;
  onReset: () => void;
}

const OUTCOME_META = [
  { key: 'best_case', label: 'Best Case', emoji: '🟢' },
  { key: 'average_case', label: 'Average Case', emoji: '🟡' },
  { key: 'worst_case', label: 'Worst Case', emoji: '🔴' },
] as const;

export default function OutcomeCards({ record, onReset }: OutcomeCardsProps) {
  return (
    <div className="w-full max-w-5xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Simulation Result</CardTitle>
          <CardDescription>{record.situation}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {record.decisions.map((decision, index) => (
              <span
                key={`${decision}-${index}`}
                className="rounded-md border bg-muted px-2 py-1 text-xs text-muted-foreground"
              >
                {decision}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {OUTCOME_META.map((meta) => {
          const outcome = record.outcomes[meta.key];
          return (
            <Card key={meta.key}>
              <CardHeader>
                <CardTitle className="text-base">
                  <span className="mr-2">{meta.emoji}</span>
                  {meta.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">{outcome.scenario}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={onReset} variant="outline">
          New Simulation
        </Button>
        <Button asChild>
          <Link href="/future-simulator/history">Open History</Link>
        </Button>
      </div>
    </div>
  );
}
