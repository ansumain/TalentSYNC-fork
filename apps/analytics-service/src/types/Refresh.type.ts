interface RefreshRunStatus {
  refreshId: number;
  startedAt: string;
  completedAt: string | null;
  status: 'running' | 'success' | 'failed';
  triggeredBy: 'cron' | 'manual';
  notes: string | null;
}

export type { RefreshRunStatus };
