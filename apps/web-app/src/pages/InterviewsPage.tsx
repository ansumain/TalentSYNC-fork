import { useEffect, useState, useCallback } from "react";
import { AppSidebar } from "@/components/home/appSideBar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { interviewService, type Interview, type AvailableInterviewer } from "@/lib/api/interview.service";
import { applicationService, type JobApplication } from "@/lib/api/application.service";
import { useAuthStore } from "@/stores/authStore";

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

const EMPTY_FORM = { applicationId: "", scheduledAt: "", interviewerId: "" };

export default function InterviewsPage() {
  const user = useAuthStore((state) => state.user);

  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  // Schedule dialog
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [availableInterviewers, setAvailableInterviewers] = useState<AvailableInterviewer[]>([]);
  const [fetchingInterviewers, setFetchingInterviewers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  // Reschedule dialog
  const [rescheduleTarget, setRescheduleTarget] = useState<Interview | null>(null);
  const [rescheduleForm, setRescheduleForm] = useState({ scheduledAt: "", interviewerId: "" });
  const [rescheduleInterviewers, setRescheduleInterviewers] = useState<AvailableInterviewer[]>([]);
  const [fetchingRescheduleInterviewers, setFetchingRescheduleInterviewers] = useState(false);
  const [rescheduling, setRescheduling] = useState(false);
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);

  // Application lookup: applicationId → application data
  const appMap = new Map<string, JobApplication>(
    applications.map((a) => [a.applicationId, a] as [string, JobApplication])
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
    // Fetch applications (large page) to build candidate/job lookup map
    applicationService
      .getAllApplications({ page: 1, limit: 500 })
      .then((res) => setApplications(res.allApplications))
      .catch(() => {});
  }, [fetchInterviews]);

  // Only shortlisted applications are eligible for scheduling
  const schedulableApps = applications.filter((a) => a.currentStatus === "shortlisted");

  // --- Schedule ---
  const handleFindInterviewers = async () => {
    if (!form.applicationId || !form.scheduledAt) {
      setScheduleError("Select an application and date/time first.");
      return;
    }
    setScheduleError(null);
    setFetchingInterviewers(true);
    try {
      const date = form.scheduledAt.split("T")[0];
      const res = await interviewService.getAvailableInterviewers(date, form.applicationId);
      setAvailableInterviewers(res.availableInterviewers);
      if (res.availableInterviewers.length === 0) {
        setScheduleError("No interviewers available for this date/application.");
      }
    } catch (e: any) {
      setScheduleError(e.message || "Failed to fetch interviewers.");
    } finally {
      setFetchingInterviewers(false);
    }
  };

  const handleSchedule = async () => {
    setScheduleError(null);
    if (!form.applicationId || !form.scheduledAt || !form.interviewerId) {
      setScheduleError("All fields are required.");
      return;
    }
    setSubmitting(true);
    try {
      await interviewService.schedule({
        applicationId: form.applicationId,
        interviewerId: form.interviewerId,
        managerId: user!.userId,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
      });
      toast.success("Interview scheduled.");
      setScheduleOpen(false);
      setForm({ ...EMPTY_FORM });
      setAvailableInterviewers([]);
      fetchInterviews();
    } catch (e: any) {
      setScheduleError(e.message || "Failed to schedule interview.");
    } finally {
      setSubmitting(false);
    }
  };

  const openScheduleDialog = () => {
    setForm({ ...EMPTY_FORM });
    setAvailableInterviewers([]);
    setScheduleError(null);
    setScheduleOpen(true);
  };

  // --- Cancel ---
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

  // --- Reschedule ---
  const openReschedule = (interview: Interview) => {
    setRescheduleTarget(interview);
    setRescheduleForm({ scheduledAt: "", interviewerId: "" });
    setRescheduleInterviewers([]);
    setRescheduleError(null);
  };

  const handleFindRescheduleInterviewers = async () => {
    if (!rescheduleForm.scheduledAt || !rescheduleTarget) {
      setRescheduleError("Select a new date/time first.");
      return;
    }
    setRescheduleError(null);
    setFetchingRescheduleInterviewers(true);
    try {
      const date = rescheduleForm.scheduledAt.split("T")[0];
      const res = await interviewService.getAvailableInterviewers(date, rescheduleTarget.applicationId);
      setRescheduleInterviewers(res.availableInterviewers);
      if (res.availableInterviewers.length === 0) {
        setRescheduleError("No interviewers available for this date.");
      }
    } catch (e: any) {
      setRescheduleError(e.message || "Failed to fetch interviewers.");
    } finally {
      setFetchingRescheduleInterviewers(false);
    }
  };

  const handleReschedule = async () => {
    if (!rescheduleTarget || !rescheduleForm.scheduledAt || !rescheduleForm.interviewerId) {
      setRescheduleError("All fields are required.");
      return;
    }
    setRescheduling(true);
    try {
      await interviewService.update(rescheduleTarget.interviewId, {
        scheduledAt: new Date(rescheduleForm.scheduledAt).toISOString(),
        interviewerId: rescheduleForm.interviewerId,
        status: "scheduled",
      });
      toast.success("Interview rescheduled.");
      setRescheduleTarget(null);
      fetchInterviews();
    } catch (e: any) {
      setRescheduleError(e.message || "Failed to reschedule interview.");
    } finally {
      setRescheduling(false);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <h1 className="text-xl font-semibold flex-1">Interviews</h1>
          <Button size="sm" onClick={openScheduleDialog}>
            <Plus className="h-4 w-4 mr-1" /> Schedule Interview
          </Button>
        </header>

        <div className="flex flex-col gap-4 p-4 pt-0">
          {loading && <div className="text-center py-8 text-muted-foreground">Loading...</div>}

          {!loading && interviews.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No interviews found.</div>
          )}

          {!loading && interviews.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-left">
                  {interviews.length} Interview{interviews.length !== 1 ? "s" : ""}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Candidate</TableHead>
                        <TableHead>Job</TableHead>
                        <TableHead>Scheduled At</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {interviews.map((iv) => {
                        const app = appMap.get(iv.applicationId);
                        return (
                          <TableRow key={iv.interviewId}>
                            <TableCell className="font-medium">
                              {app?.candidateName ?? (
                                <span className="font-mono text-xs text-muted-foreground">
                                  {iv.applicationId.slice(0, 8)}…
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {app?.jobTitle ?? "—"}
                            </TableCell>
                            <TableCell className="text-muted-foreground whitespace-nowrap">
                              {new Date(iv.scheduledAt).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                                  STATUS_COLORS[iv.status] ?? "bg-secondary text-secondary-foreground"
                                }`}
                              >
                                {iv.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              {iv.result ? (
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                                    RESULT_COLORS[iv.result] ?? ""
                                  }`}
                                >
                                  {iv.result}
                                </span>
                              ) : (
                                <span className="text-muted-foreground text-xs">—</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-destructive border-destructive hover:bg-destructive/10 h-7 px-2 text-xs"
                                  disabled={iv.status !== "scheduled"}
                                  onClick={() => handleCancel(iv.interviewId)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 px-2 text-xs"
                                  disabled={iv.status !== "cancelled"}
                                  onClick={() => openReschedule(iv)}
                                >
                                  Reschedule
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Schedule Interview Dialog */}
        <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule Interview</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-1.5">
                <Label>
                  Application <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.applicationId}
                  onValueChange={(val: string) => {
                    setForm((p) => ({ ...p, applicationId: val, interviewerId: "" }));
                    setAvailableInterviewers([]);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a candidate..." />
                  </SelectTrigger>
                  <SelectContent>
                    {schedulableApps.map((a) => (
                      <SelectItem key={a.applicationId} value={a.applicationId}>
                        {a.candidateName ?? a.applicationId.slice(0, 8)} — {a.jobTitle ?? "Unknown Job"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {schedulableApps.length === 0 && (
                  <p className="text-xs text-muted-foreground">No shortlisted applications available.</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>
                  Date & Time <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, scheduledAt: e.target.value, interviewerId: "" }));
                    setAvailableInterviewers([]);
                  }}
                />
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={fetchingInterviewers}
                onClick={handleFindInterviewers}
              >
                {fetchingInterviewers ? "Searching..." : "Find Available Interviewers"}
              </Button>

              {availableInterviewers.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <Label>
                    Interviewer <span className="text-red-500">*</span>
                  </Label>
                  <Select value={form.interviewerId} onValueChange={(val: string) => setForm((p) => ({ ...p, interviewerId: val }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an interviewer..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableInterviewers.map((i) => (
                        <SelectItem key={i.id} value={i.id}>
                          {i.name} ({i.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {scheduleError && <p className="text-sm text-destructive">{scheduleError}</p>}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setScheduleOpen(false)}>
                Cancel
              </Button>
              <Button disabled={submitting || !form.interviewerId} onClick={handleSchedule}>
                {submitting ? "Scheduling..." : "Schedule"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reschedule Interview Dialog */}
        <Dialog
          open={!!rescheduleTarget}
          onOpenChange={(open) => { if (!open) setRescheduleTarget(null); }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Reschedule Interview</DialogTitle>
            </DialogHeader>
            {rescheduleTarget && (
              <div className="flex flex-col gap-4 py-2">
                <div className="text-sm text-muted-foreground rounded-md bg-muted p-3">
                  Candidate:{" "}
                  <span className="font-medium text-foreground">
                    {appMap.get(rescheduleTarget.applicationId)?.candidateName ??
                      rescheduleTarget.applicationId.slice(0, 8)}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label>
                    New Date & Time <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="datetime-local"
                    value={rescheduleForm.scheduledAt}
                    onChange={(e) => {
                      setRescheduleForm((p) => ({ ...p, scheduledAt: e.target.value, interviewerId: "" }));
                      setRescheduleInterviewers([]);
                    }}
                  />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={fetchingRescheduleInterviewers}
                  onClick={handleFindRescheduleInterviewers}
                >
                  {fetchingRescheduleInterviewers ? "Searching..." : "Find Available Interviewers"}
                </Button>

                {rescheduleInterviewers.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    <Label>
                      Interviewer <span className="text-red-500">*</span>
                    </Label>
                    <Select value={rescheduleForm.interviewerId} onValueChange={(val: string) => setRescheduleForm((p) => ({ ...p, interviewerId: val }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an interviewer..." />
                      </SelectTrigger>
                      <SelectContent>
                        {rescheduleInterviewers.map((i) => (
                          <SelectItem key={i.id} value={i.id}>
                            {i.name} ({i.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {rescheduleError && <p className="text-sm text-destructive">{rescheduleError}</p>}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setRescheduleTarget(null)}>
                Cancel
              </Button>
              <Button
                disabled={rescheduling || !rescheduleForm.interviewerId}
                onClick={handleReschedule}
              >
                {rescheduling ? "Rescheduling..." : "Reschedule"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
}
