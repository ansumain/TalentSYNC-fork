import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { AnalyticsGraphs } from '@/lib/types/Analytics.type';

interface SkillGapBarChartProps {
  data: AnalyticsGraphs['skillGapBar'];
  top: 3 | 5 | 10;
}

interface SkillTooltipPayload {
  skill: string;
  demand: number;
  hired: number;
}

function SkillGapTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: SkillTooltipPayload }> }) {
  if (!active || !payload?.length) return null;

  const point = payload[0].payload;

  return (
    <div className="rounded-md border bg-background px-3 py-2 text-sm shadow-sm">
      <p className="font-medium">{point.skill}</p>
      <p className="text-blue-700">Demand: {point.demand}</p>
      <p className="text-emerald-700">Hired: {point.hired}</p>
    </div>
  );
}

export function SkillGapBarChart({ data, top }: SkillGapBarChartProps) {
  const chartData = data.slice(0, top).map((item) => ({
    skill: item.skillName,
    demand: item.demandCount,
    hired: item.supplyCount,
  }));

  if (chartData.length === 0) {
    return <p className="text-sm text-muted-foreground">No skill gap data available for selected range.</p>;
  }

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="skill" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip content={<SkillGapTooltip />} />
          <Legend />
          <Bar dataKey="demand" name="Demand" fill="#2563eb" radius={[4, 4, 0, 0]} />
          <Bar dataKey="hired" name="Hired" fill="#16a34a" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
