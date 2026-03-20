import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { AnalyticsGraphs } from '@/lib/types/Analytics.type';

interface JobApplicationsPieChartProps {
  data: AnalyticsGraphs['jobApplicationsPie'];
}

const COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#e11d48', '#8b5cf6', '#0891b2', '#f97316'];

export function JobApplicationsPieChart({ data }: JobApplicationsPieChartProps) {
  const chartData = data.map((item) => ({
    name: item.jobTitle,
    value: item.applicationCount,
  }));

  if (chartData.length === 0) {
    return <p className="text-sm text-muted-foreground">No application distribution data available.</p>;
  }

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={85}
            innerRadius={40}
            paddingAngle={2}
          >
            {chartData.map((entry, index) => (
              <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
