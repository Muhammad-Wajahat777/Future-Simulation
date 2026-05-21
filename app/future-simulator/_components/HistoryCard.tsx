'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SimulationRecord } from '../_lib/types';

interface HistoryCardProps {
  record: SimulationRecord;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default function HistoryCard({ record }: HistoryCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-base">{record.situation}</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">{formatDate(record.created_at)}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setExpanded((value) => !value)}>
          {expanded ? 'Hide' : 'View'}
        </Button>
      </CardHeader>
      {expanded ? (
        <CardContent className="space-y-4">
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">Decisions</p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {record.decisions.map((decision, index) => (
                <li key={`${decision}-${index}`}>{decision}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium">🟢 Best Case</p>
              <p className="text-sm text-muted-foreground">{record.outcomes.best_case.scenario}</p>
            </div>
            <div>
              <p className="text-sm font-medium">🟡 Average Case</p>
              <p className="text-sm text-muted-foreground">{record.outcomes.average_case.scenario}</p>
            </div>
            <div>
              <p className="text-sm font-medium">🔴 Worst Case</p>
              <p className="text-sm text-muted-foreground">{record.outcomes.worst_case.scenario}</p>
            </div>
          </div>
        </CardContent>
      ) : null}
    </Card>
  );
}
