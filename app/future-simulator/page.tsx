'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import SimulatorForm from './_components/SimulatorForm';
import OutcomeCards from './_components/OutcomeCards';
import { SimulationPhase, SimulationRecord } from './_lib/types';

export default function FutureSimulatorPage() {
  const [phase, setPhase] = useState<SimulationPhase>('form');
  const [record, setRecord] = useState<SimulationRecord | null>(null);

  const onResult = (nextRecord: SimulationRecord) => {
    setRecord(nextRecord);
    setPhase('results');
  };

  const onReset = () => {
    setRecord(null);
    setPhase('form');
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center gap-8 px-4 py-10">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-3xl font-semibold">Future Simulator</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your situation and at least 3 possible decisions to simulate best, average, and worst outcomes.
        </p>
        <div className="mt-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/future-simulator/history">View History</Link>
          </Button>
        </div>
      </div>

      {phase === 'form' ? (
        <SimulatorForm
          onResult={(value) => {
            onResult(value);
          }}
        />
      ) : null}

      {phase === 'results' && record ? <OutcomeCards record={record} onReset={onReset} /> : null}
    </main>
  );
}
