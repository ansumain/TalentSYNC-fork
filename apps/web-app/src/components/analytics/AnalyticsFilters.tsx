import type { ChangeEvent } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { AnalyticsTop } from '@/lib/types/Analytics.type';

interface AnalyticsFiltersProps {
  fromDate: string;
  toDate: string;
  top: AnalyticsTop;
  jobId: string;
  jobs: Array<{ jobId: string; title: string }>;
  loading: boolean;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onTopChange: (value: AnalyticsTop) => void;
  onJobIdChange: (value: string) => void;
  onApply: () => void;
}

export function AnalyticsFilters({
  fromDate,
  toDate,
  top,
  jobId,
  jobs,
  loading,
  onFromDateChange,
  onToDateChange,
  onTopChange,
  onJobIdChange,
  onApply,
}: AnalyticsFiltersProps) {
  return (
    <Card>
      <CardContent className="grid gap-3 py-6 md:grid-cols-5">
        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">From</Label>
          <Input
            type="date"
            value={fromDate}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onFromDateChange(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">To</Label>
          <Input
            type="date"
            value={toDate}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onToDateChange(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">Top</Label>
          <Select value={String(top)} onValueChange={(value: string) => onTopChange(Number(value) as AnalyticsTop)}>
            <SelectTrigger className="mt-1 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">Top 3</SelectItem>
              <SelectItem value="5">Top 5</SelectItem>
              <SelectItem value="10">Top 10</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">Job</Label>
          <Select value={jobId} onValueChange={onJobIdChange}>
            <SelectTrigger className="mt-1 w-full">
              <SelectValue placeholder="Select a job" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem>
              {jobs.map((job) => (
                <SelectItem key={job.jobId} value={job.jobId}>
                  {job.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button className="w-full" onClick={onApply} disabled={loading}>
            {loading ? 'Applying Filters...' : 'Apply Filters'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
