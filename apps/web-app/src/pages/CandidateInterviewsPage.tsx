import { useEffect, useState, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { AppSidebar } from "@/components/home/appSideBar";
import { AppPageHeader } from "@/components/layout/AppPageHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { interviewService, type Interview } from "@/lib/api/interview.service";

const STATUS_COLORS: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  noshow: "bg-orange-100 text-orange-700",
};

const RESULT_COLORS: Record<string, string> = {
  passed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
};

export default function CandidateInterviewsPage() {
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get("status") ?? "scheduled";

  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInterviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await interviewService.getCandidateInterviews();
      setInterviews(res.interviews);
    } catch {
      toast.error("Failed to load your interviews.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const filtered = interviews.filter((iv) => iv.status === statusFilter);

  const title = statusFilter === "scheduled" ? "Scheduled Interviews" : "Completed Interviews";

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppPageHeader
          title={title}
          actions={
            <Button size="sm" variant="outline" onClick={fetchInterviews} className="gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </Button>
          }
        />

        <div className="flex flex-col gap-4 p-4">
          {loading && (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No {statusFilter} interviews found.
            </div>
          )}

          {statusFilter === "completed" && (
            <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              Interview Completed? Check{" "}
              <Link to="/my-applications" className="font-medium underline underline-offset-2">
                My Applications
              </Link>{" "}
              to see your result.
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <Card>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Interview Id</TableHead>
                        <TableHead>Scheduled At</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Result</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((iv) => (
                        <TableRow key={iv.interviewId}>
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            #{iv.interviewId.slice(0, 6)}
                          </TableCell>
                          <TableCell className="text-muted-foreground whitespace-nowrap">
                            {new Date(iv.scheduledAt).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[iv.status] ?? "bg-secondary text-secondary-foreground"
                                }`}
                            >
                              {iv.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            {iv.result ? (
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${RESULT_COLORS[iv.result] ?? ""
                                  }`}
                              >
                                {iv.result}
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-xs">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}