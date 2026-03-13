import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { AnalyticsTables } from '@/lib/types/Analytics.type';

interface RecruitmentFunnelCardProps {
  funnel: AnalyticsTables['funnel'] | null | undefined;
}

export function RecruitmentFunnelCard({ funnel }: RecruitmentFunnelCardProps) {
  const timeToHireDays = Math.ceil(funnel?.timeToHireDays ?? 0);

  return (
    <Card className="xl:col-span-1">
      <CardHeader>
        <CardTitle>Recruitment Funnel</CardTitle>
        <CardDescription>{funnel?.jobTitle ?? 'All Jobs'}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
          <p className="text-xs text-blue-700">Applied</p>
          <p className="text-2xl font-semibold">{funnel?.applied ?? 0}</p>
        </div>
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
          <p className="text-xs text-yellow-700">Shortlisted</p>
          <p className="text-2xl font-semibold">{funnel?.shortlisted ?? 0}</p>
        </div>
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3">
          <p className="text-xs text-indigo-700">Selected</p>
          <p className="text-2xl font-semibold">{funnel?.selected ?? 0}</p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
          <p className="text-xs text-emerald-700">Hired</p>
          <p className="text-2xl font-semibold">{funnel?.hired ?? 0}</p>
        </div>
        <div className="rounded-lg border border-violet-200 bg-violet-50 p-3">
          <p className="text-xs text-violet-700">Conversion Rate</p>
          <p className="text-2xl font-semibold text-violet-800">{funnel?.conversionRate ?? 0}%</p>
          <p className="mt-1 text-xs text-violet-700">Time to hire: {timeToHireDays} days</p>
        </div>
      </CardContent>
    </Card>
  );
}
