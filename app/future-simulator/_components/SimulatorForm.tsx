'use client';

import { useMemo, useState, useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { runSimulation } from '../_actions/simulate';
import { SimulationRecord } from '../_lib/types';

interface SimulatorFormProps {
  onResult: (record: SimulationRecord) => void;
}

function parseDecisions(input: string): string[] {
  return input
    .split(/\n|,/g)
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function SimulatorForm({ onResult }: SimulatorFormProps) {
  const [situation, setSituation] = useState('');
  const [decisionText, setDecisionText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const decisions = useMemo(() => parseDecisions(decisionText), [decisionText]);

  const canSubmit = situation.trim().length > 10 && decisions.length >= 3 && !isPending;

  const onSubmit = () => {
    setError(null);

    startTransition(async () => {
      const result = await runSimulation(situation, decisions);

      if (result.success) {
        onResult(result.data);
        return;
      }

      setError(result.error);
    });
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Simulate Future</CardTitle>
        <CardDescription>
          Add your situation and at least 3 possible decisions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="situation">What is your current situation?</Label>
          <textarea
            id="situation"
            value={situation}
            onChange={(event) => setSituation(event.target.value)}
            rows={4}
            placeholder="Example: I have two job offers and need to decide this week."
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="decisions">What decisions are you about to make? (min 3)</Label>
          <textarea
            id="decisions"
            value={decisionText}
            onChange={(event) => setDecisionText(event.target.value)}
            rows={6}
            placeholder={[
              'Write one decision per line, for example:',
              'Accept Company A offer',
              'Accept Company B offer',
              'Stay in current role',
            ].join('\n')}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
          <p className="text-xs text-muted-foreground">Detected options: {decisions.length}</p>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button onClick={onSubmit} disabled={!canSubmit} className="w-full">
          {isPending ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Simulating...
            </span>
          ) : (
            'Simulate Future'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
