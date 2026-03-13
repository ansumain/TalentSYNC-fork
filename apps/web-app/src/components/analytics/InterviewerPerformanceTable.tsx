import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { AnalyticsTables } from '@/lib/types/Analytics.type';
import { Skeleton } from '@/components/ui/skeleton';

interface InterviewerPerformanceTableProps {
  rows: AnalyticsTables['interviewerPerformance'];
  loading: boolean;
}

export function InterviewerPerformanceTable({ rows, loading }: InterviewerPerformanceTableProps) {
  const [query, setQuery] = useState('');

  const filteredRows = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return rows;
    return rows.filter((row) => row.interviewerName.toLowerCase().includes(search));
  }, [rows, query]);

  return (
    <Card className="xl:col-span-2">
      <CardHeader>
        <CardTitle className="text-left">Interviewer Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-3 max-w-sm">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search interviewer by name"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Interviewer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Passed</TableHead>
              <TableHead>Failed</TableHead>
              <TableHead>Pass Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading &&
              Array.from({ length: 4 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                </TableRow>
              ))}

            {filteredRows.map((row) => (
              <TableRow key={row.interviewerId}>
                <TableCell className="font-medium">{row.interviewerName}</TableCell>
                <TableCell>{row.totalInterviews}</TableCell>
                <TableCell className="text-emerald-700">{row.passedCount}</TableCell>
                <TableCell className="text-rose-700">{row.failedCount}</TableCell>
                <TableCell>{row.passRate}%</TableCell>
              </TableRow>
            ))}
            {!loading && filteredRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No interviewer data available for selected range.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
