import { useCallback, useEffect, useMemo, useState } from "react";
import { AppSidebar } from "@/components/home/appSideBar";
import { AppPageHeader } from "@/components/layout/AppPageHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { interviewService, type Interview } from "@/lib/api/interview.service";
import { applicationService, type JobApplication } from "@/lib/api/application.service";
import { useAuthStore } from "@/stores/authStore";
import { InterviewsTable } from "@/components/interviews/InterviewsTable";
import { ScheduleInterviewDialog } from "@/components/interviews/scheduleInterviewDialog";
import { RescheduleInterviewDialog } from "@/components/interviews/RescheduleInterviewDialog";

export default function InterviewsPage() {
  const user = useAuthStore((state) => state.user);

  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState<Interview | null>(null);

  // Application lookup: applicationId -> application data
  const appMap = useMemo(
    () => new Map<string, JobApplication>(applications.map((a) => [a.applicationId, a] as [string, JobApplication])),
    [applications]
  );

  const fetchInterviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await interviewService.getAll();
      setInterviews(res.scheduledInterviews);
    } catch {
      toast.error("Failed to load interviews.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInterviews();
    // Fetch applications to build candidate/job lookup map
    applicationService
      .getAllApplications({ page: 1, limit: 500 })
      .then((res) => setApplications(res.allApplications))
      .catch(() => {});
  }, [fetchInterviews]);

  // Only shortlisted applications are eligible for scheduling
  const schedulableApps = applications.filter((a) => a.currentStatus === "shortlisted");

  // Cancel 
  const handleCancel = async (interviewId: string) => {
    if (!window.confirm("Cancel this interview? The application will be rolled back to shortlisted.")) return;
    try {
      await interviewService.cancel(interviewId);
      toast.success("Interview cancelled.");
      fetchInterviews();
    } catch (e: any) {
      toast.error(e.message || "Failed to cancel interview.");
    }
  };


  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppPageHeader
          title="Interviews"
          actions={
            <Button size="sm" onClick={() => setScheduleOpen(true)}>
              <Plus className="mr-1 h-4 w-4" /> Schedule Interview
            </Button>
          }
        />

        <div className="flex flex-col gap-4 p-4">
          <InterviewsTable
            loading={loading}
            interviews={interviews}
            appMap={appMap}
            onCancel={handleCancel}
            onOpenReschedule={setRescheduleTarget}
          />
        </div>

        <ScheduleInterviewDialog
          open={scheduleOpen}
          onOpenChange={setScheduleOpen}
          managerId={user?.userId ?? ""}
          schedulableApps={schedulableApps}
          onScheduled={fetchInterviews}
        />

        <RescheduleInterviewDialog
          target={rescheduleTarget}
          appMap={appMap}
          onOpenChange={setRescheduleTarget}
          onRescheduled={fetchInterviews}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}