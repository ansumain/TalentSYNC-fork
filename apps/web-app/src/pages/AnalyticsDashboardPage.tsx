import { useEffect, useMemo, useState } from 'react';
import { AppSidebar } from '@/components/home/appSideBar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppPageHeader } from '@/components/layout/AppPageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Download, LoaderCircle, RefreshCw } from 'lucide-react';
import { analyticsService } from '@/lib/api/analytics.service';
import { jobService } from '@/lib/api/application.service';
import { useAuthStore } from '@/stores/authStore';
import { AnalyticsFilters } from '@/components/analytics/AnalyticsFilters';
import { AnalyticsKpiCards } from '@/components/analytics/AnalyticsKpiCards';
import { SkillGapBarChart } from '@/components/analytics/SkillGapBarChart';
import { JobApplicationsPieChart } from '@/components/analytics/JobApplicationsPieChart';
import { RecruitmentFunnelCard } from '@/components/analytics/RecruitmentFunnelCard';
import { InterviewerPerformanceTable } from '@/components/analytics/InterviewerPerformanceTable';
import type {
  AnalyticsCounters,
  AnalyticsGraphs,
  AnalyticsTables,
  AnalyticsTop,
} from '@/lib/types/Analytics.type';

const getDefaultDateRange = () => {
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  return {
    fromDate: monthStart.toISOString().slice(0, 10),
    toDate: today.toISOString().slice(0, 10),
  };
};

const formatDateTime = (value: string | null) => {
  if (!value) return 'N/A';
  return new Date(value).toLocaleString();
};

export default function AnalyticsDashboardPage() {
  const defaults = getDefaultDateRange();
  const user = useAuthStore((state) => state.user);

  const [fromDate, setFromDate] = useState(defaults.fromDate);
  const [toDate, setToDate] = useState(defaults.toDate);
  const [top, setTop] = useState<AnalyticsTop>(5);
  const [jobId, setJobId] = useState('all');

  const [counters, setCounters] = useState<AnalyticsCounters | null>(null);
  const [graphs, setGraphs] = useState<AnalyticsGraphs | null>(null);
  const [tables, setTables] = useState<AnalyticsTables | null>(null);
  const [jobs, setJobs] = useState<Array<{ jobId: string; title: string }>>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingXlsx, setExportingXlsx] = useState(false);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [counterData, graphData, tableData] = await Promise.all([
        analyticsService.getCounters({ fromDate, toDate }),
        analyticsService.getGraphs({ fromDate, toDate, top }),
        analyticsService.getTables({ fromDate, toDate, jobId: jobId === 'all' ? undefined : jobId }),
      ]);

      setCounters(counterData);
      setGraphs(graphData);
      setTables(tableData);
    } catch {
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await jobService.getAllJobs({ page: 1, limit: 200, sortBy: 'createdAt', sortOrder: 'desc' });
      setJobs(
        response.currentJobs.map((job) => ({
          jobId: job.jobId,
          title: job.title,
        }))
      );
    } catch {
      setJobs([]);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApplyFilters = () => {
    if (!fromDate || !toDate || fromDate > toDate) {
      toast.error('Please select a valid date range');
      return;
    }

    fetchDashboard();
  };

  const handleExport = async (format: 'pdf' | 'xlsx') => {
    try {
      if (format === 'pdf') setExportingPdf(true);
      if (format === 'xlsx') setExportingXlsx(true);

      await analyticsService.requestExport({
        format,
        fromDate,
        toDate,
        jobId: jobId === 'all' ? 'all' : jobId,
        top,
      });

      toast.success(`Export queued. You will receive ${format.toUpperCase()} by email.`);
    } catch {
      toast.error('Failed to queue export request');
    } finally {
      setExportingPdf(false);
      setExportingXlsx(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await analyticsService.triggerRefresh();
      await fetchDashboard();
      toast.success('Analytics data refreshed successfully.');
    } catch {
      toast.error('Failed to refresh analytics data');
    } finally {
      setRefreshing(false);
    }
  };

  const lastUpdated = useMemo(() => {
    const timestamps = [counters?.lastUpdatedAt, graphs?.lastUpdatedAt, tables?.lastUpdatedAt].filter(Boolean) as string[];
    if (timestamps.length === 0) return 'N/A';
    return formatDateTime(timestamps.sort().at(-1) ?? null);
  }, [counters?.lastUpdatedAt, graphs?.lastUpdatedAt, tables?.lastUpdatedAt]);

  const totalApplications = useMemo(
    () =>
      graphs?.jobApplicationsPie.reduce(
        (acc: number, item: { applicationCount: number }) => acc + item.applicationCount,
        0
      ) ?? 0,
    [graphs?.jobApplicationsPie]
  );

  const canRefresh = user?.roles?.includes('admin') ?? false;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppPageHeader
          title="Analytics Dashboard"
          description={`Last updated: ${lastUpdated}`}
          actions={
            <>
              {canRefresh ? (
                <Button
                  variant="secondary"
                  onClick={handleRefresh}
                  disabled={refreshing || loading}
                  className="gap-2"
                >
                  {refreshing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  Refresh Data
                </Button>
              ) : null}
              <Button
                variant="outline"
                onClick={() => handleExport('pdf')}
                disabled={exportingPdf || loading}
                className="gap-2"
              >
                {exportingPdf ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                Export PDF
              </Button>
              <Button
                onClick={() => handleExport('xlsx')}
                disabled={exportingXlsx || loading}
                className="gap-2"
              >
                {exportingXlsx ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                Export Excel
              </Button>
            </>
          }
        />

        <div className="flex flex-col gap-4 p-4">
          <AnalyticsFilters
            fromDate={fromDate}
            toDate={toDate}
            top={top}
            jobId={jobId}
            jobs={jobs}
            loading={loading}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
            onTopChange={setTop}
            onJobIdChange={setJobId}
            onApply={handleApplyFilters}
          />

          <AnalyticsKpiCards counters={counters} />

          <div className="grid gap-4 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader className="text-left">
                <CardTitle>Skill Gap Overview</CardTitle>
                <CardDescription>Top {top} skills by demand vs hired talent</CardDescription>
              </CardHeader>
              <CardContent>
                <SkillGapBarChart data={graphs?.skillGapBar ?? []} top={top} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Applications Distribution</CardTitle>
                <CardDescription>Total applications: {totalApplications}</CardDescription>
              </CardHeader>
              <CardContent>
                <JobApplicationsPieChart data={graphs?.jobApplicationsPie ?? []} />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <RecruitmentFunnelCard funnel={tables?.funnel} />

            <InterviewerPerformanceTable
              rows={tables?.interviewerPerformance ?? []}
              loading={loading}
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
