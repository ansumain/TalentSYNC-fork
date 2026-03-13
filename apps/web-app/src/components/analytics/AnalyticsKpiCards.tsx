import { TrendingUp, Users, BriefcaseBusiness, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { AnalyticsCounters } from '@/lib/types/Analytics.type';

interface AnalyticsKpiCardsProps {
  counters: AnalyticsCounters | null;
}

export function AnalyticsKpiCards({ counters }: AnalyticsKpiCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader className="pb-2 text-center">
          <CardDescription>Scheduled Interviews</CardDescription>
          <CardTitle className="text-3xl">{counters?.interviews.scheduled ?? 0}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-1">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            Completed: {counters?.interviews.completed ?? 0}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 text-center">
          <CardDescription>Open Jobs</CardDescription>
          <CardTitle className="text-3xl">{counters?.openJobs ?? 0}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-1">
            <BriefcaseBusiness className="h-4 w-4 text-emerald-600" />
            Active hiring demand
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 text-center">
          <CardDescription>Hires</CardDescription>
          <CardTitle className="text-3xl">{counters?.hires ?? 0}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-1">
            <CheckCircle2 className="h-4 w-4 text-amber-600" />
            Conversion tracked from funnel
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 text-center">
          <CardDescription>No Show + Cancelled</CardDescription>
          <CardTitle className="text-3xl">
            {(counters?.interviews.noShow ?? 0) + (counters?.interviews.cancelled ?? 0)}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <div className="space-y-1 text-center">
            <div className="flex items-center justify-center gap-1">
              <Users className="h-4 w-4 text-rose-600" />
              No Show: {counters?.interviews.noShow ?? 0}
            </div>
            <div className="flex items-center justify-center gap-1">
              <span>Cancelled: {counters?.interviews.cancelled ?? 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
