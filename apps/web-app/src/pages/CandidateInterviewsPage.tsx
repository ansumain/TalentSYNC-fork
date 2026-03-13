import { useEffect, useState, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { AppSidebar } from "@/components/home/appSideBar";
import { AppPageHeader } from "@/components/layout/AppPageHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

        <div className="flex flex-col gap-4 p-4 pt-0">
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
              Interview result submitted? Check{" "}
              <Link to="/my-applications" className="font-medium underline underline-offset-2">
                My Applications
              </Link>{" "}
              to see your offer status and accept or decline.
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-left">
                  {filtered.length} Interview{filtered.length !== 1 ? "s" : ""}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Interview ID</TableHead>
                        <TableHead>Scheduled At</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Result</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((iv) => (
                        <TableRow key={iv.interviewId}>
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {iv.interviewId.slice(0, 8)}…
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
                              <span className="text-muted-foreground text-xs">—</span>
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

// import { useCallback, useEffect, useMemo, useState } from "react";
// import { AppSidebar } from "@/components/home/appSideBar";
// import { AppPageHeader } from "@/components/layout/AppPageHeader";
// import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import { Plus } from "lucide-react";
// import { interviewService, type Interview } from "@/lib/api/interview.service";
// import { applicationService, type JobApplication } from "@/lib/api/application.service";
// import { useAuthStore } from "@/stores/authStore";
// import { InterviewsTable } from "@/components/interviews/InterviewsTable";
// import { ScheduleInterviewDialog } from "@/components/interviews/scheduleInterviewDialog";
// import { RescheduleInterviewDialog } from "@/components/interviews/RescheduleInterviewDialog";

// export default function InterviewsPage() {
//   const user = useAuthStore((state) => state.user);

//   const [interviews, setInterviews] = useState<Interview[]>([]);
//   const [applications, setApplications] = useState<JobApplication[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [scheduleOpen, setScheduleOpen] = useState(false);
//   const [rescheduleTarget, setRescheduleTarget] = useState<Interview | null>(null);

//   // Application lookup: applicationId → application data
//   const appMap = useMemo(
//     () => new Map<string, JobApplication>(applications.map((a) => [a.applicationId, a] as [string, JobApplication])),
//     [applications]
//   );

//   const fetchInterviews = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await interviewService.getAll();
//       setInterviews(res.scheduledInterviews);
//     } catch {
//       toast.error("Failed to load interviews.");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchInterviews();
//     // Fetch applications to build candidate/job lookup map
//     applicationService
//       .getAllApplications({ page: 1, limit: 500 })
//       .then((res) => setApplications(res.allApplications))
//       .catch(() => {});
//   }, [fetchInterviews]);

//   // Only shortlisted applications are eligible for scheduling
//   const schedulableApps = applications.filter((a) => a.currentStatus === "shortlisted");

//   // Cancel
//   const handleCancel = async (interviewId: string) => {
//     if (!window.confirm("Cancel this interview? The application will be rolled back to shortlisted.")) return;
//     try {
//       await interviewService.cancel(interviewId);
//       toast.success("Interview cancelled.");
//       fetchInterviews();
//     } catch (e: any) {
//       toast.error(e.message || "Failed to cancel interview.");
//     }
//   };


//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset>
//         <AppPageHeader
//           title="Interviews"
//           actions={
//             <Button size="sm" onClick={() => setScheduleOpen(true)}>
//               <Plus className="mr-1 h-4 w-4" /> Schedule Interview
//             </Button>
//           }
//         />

//         <div className="flex flex-col gap-4 p-4">
//           <InterviewsTable
//             loading={loading}
//             interviews={interviews}
//             appMap={appMap}
//             onCancel={handleCancel}
//             onOpenReschedule={setRescheduleTarget}
//           />
//         </div>

//         <ScheduleInterviewDialog
//           open={scheduleOpen}
//           onOpenChange={setScheduleOpen}
//           managerId={user?.userId ?? ""}
//           schedulableApps={schedulableApps}
//           onScheduled={fetchInterviews}
//         />

//         <RescheduleInterviewDialog
//           target={rescheduleTarget}
//           appMap={appMap}
//           onOpenChange={setRescheduleTarget}
//           onRescheduled={fetchInterviews}
//         />
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }
