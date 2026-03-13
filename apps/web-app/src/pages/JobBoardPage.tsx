import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/home/appSideBar";
import { AppPageHeader } from "@/components/layout/AppPageHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { jobService, applicationService, candidateService, skillService } from "@/lib/api/application.service";
import type { Job, Skill } from "@/lib/api/application.service";
import { toast } from "sonner";
import { AlertCircle, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { TablePagination } from "@/components/ui/table-pagination";
import { JOB } from "@/constants/job";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useAuthStore } from "@/stores/authStore";
import { COMMON_MESSAGE } from "@/constants/common";
import { Skeleton } from "@/components/ui/skeleton";

type SortField = "createdAt" | "title";

export default function JobBoardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<Record<string, boolean>>({});
  const [applied, setApplied] = useState<Record<string, boolean>>({});
  const [hasResume, setHasResume] = useState<boolean | null>(null);
  // Confirm apply dialog
  const [confirmJob, setConfirmJob] = useState<Job | null>(null);
  const [confirmSkills, setConfirmSkills] = useState<Skill[]>([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  // Sorting
  const [sortBy, setSortBy] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSort = (field: SortField) => {
    const newOrder = field === sortBy ? (sortOrder === "asc" ? "desc" : "asc") : "asc";
    setSortBy(field);
    setSortOrder(newOrder);
    setPage(1);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortBy !== field) return <ArrowUpDown className="h-3 w-3 opacity-40" />;
    return sortOrder === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      jobService.getAllJobs({ page, limit, sortBy, sortOrder }),
      candidateService.getMyResumeStatus(),
    ])
      .then(([jobsRes, resumeRes]) => {
        setJobs(jobsRes.currentJobs);
        setTotal(jobsRes.total);
        setTotalPages(jobsRes.totalPages);
        setHasResume(resumeRes.hasResume);
      })
      .catch(() => toast.error("Failed to load jobs"))
      .finally(() => setLoading(false));
  }, [page, limit, sortBy, sortOrder]);

  const handleApply = async (jobId: string) => {
    setApplying((prev: Record<string, boolean>) => ({ ...prev, [jobId]: true }));
    try {
      await applicationService.applyToJob(jobId);
      setApplied((prev: Record<string, boolean>) => ({ ...prev, [jobId]: true }));
      toast.success("Application submitted successfully!");
    } catch (err: any) {
      const msg = err.message || "Failed to apply";
      if (msg.includes("already exists")) {
        toast.error("You have already applied to this job.");
        setApplied((prev: Record<string, boolean>) => ({ ...prev, [jobId]: true }));
      } else {
        toast.error(msg);
      }
    } finally {
      setApplying((prev: Record<string, boolean>) => ({ ...prev, [jobId]: false }));
    }
  };

  const handleApplyClick = async (job: Job) => {
    setConfirmJob(job);
    setConfirmLoading(true);
    try {
      const res = await skillService.getMySkills();
      setConfirmSkills(res.skills);
    } catch {
      setConfirmSkills([]);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleConfirmApply = async () => {
    if (!confirmJob) return;
    const jobId = confirmJob.jobId;
    setConfirmJob(null);
    await handleApply(jobId);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppPageHeader
          title={JOB.JOB_BOARD.OPEN_JOBS}
          actions={
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{JOB.JOB_BOARD.SORT_BY}</span>
              <button
                className={`flex items-center gap-1 rounded px-2 py-1 hover:bg-muted ${sortBy === "createdAt" ? "font-medium text-foreground" : ""}`}
                onClick={() => handleSort("createdAt")}
              >
                {JOB.JOB_BOARD.DATE} <SortIcon field="createdAt" />
              </button>
              <button
                className={`flex items-center gap-1 rounded px-2 py-1 hover:bg-muted ${sortBy === "title" ? "font-medium text-foreground" : ""}`}
                onClick={() => handleSort("title")}
              >
                {JOB.JOB_BOARD.TITLE} <SortIcon field="title" />
              </button>
            </div>
          }
        />

        <div className="flex flex-col gap-4 p-4">
          {!loading && hasResume === false && (
            <div className="flex items-center gap-3 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>
                {JOB.JOB_BOARD.APPLY_CONSTRAINT}{" "}
                <button
                  className="font-semibold underline hover:text-amber-900"
                  onClick={() => navigate("/upload")}
                >
                  {JOB.JOB_BOARD.GO_TO_UPLOAD}
                </button>
              </span>
            </div>
          )}

          {loading && (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="space-y-4 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-56" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                      <Skeleton className="h-8 w-20" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-3 w-48" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && jobs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">{JOB.JOB_BOARD.NO_JOBS}</div>
          )}

          {!loading &&
            jobs.map((job) => (
              <Card key={job.jobId}>
                <CardContent className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-left">
                      <CardTitle className="text-base">{job.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {job.location} &middot;{" "}
                        <span className="inline-flex items-center rounded-full bg-secondary text-secondary-foreground px-2 py-0.5 text-xs font-medium">
                          {job.jobType}
                        </span>
                      </p>
                    </div>
                    <Button
                      size="sm"
                      disabled={hasResume === false || applied[job.jobId] || applying[job.jobId]}
                      onClick={() => handleApplyClick(job)}
                    >
                      {applying[job.jobId] ? JOB.JOB_BOARD.APPLYING : applied[job.jobId] ? JOB.JOB_BOARD.APPLIED : JOB.JOB_BOARD.APPLY}
                    </Button>
                  </div>
                </CardContent>
                <CardContent className="text-left text-sm text-muted-foreground space-y-3">
                  <p className="line-clamp-3">{job.description}</p>
                  <div className="flex items-center gap-4 text-xs">
                    <span>{job.openings} {JOB.JOB_BOARD.OPENING}{job.openings !== 1 ? "s" : ""}</span>
                    <span>{JOB.JOB_BOARD.POSTED} {new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}

          {!loading && total > limit && (
            <TablePagination
              page={page}
              totalPages={totalPages}
              total={total}
              limit={limit}
              onPageChange={setPage}
            />
          )}
        </div>

        {/* Apply Confirmation Dialog */}
        <Dialog open={!!confirmJob} onOpenChange={(open) => { if (!open) setConfirmJob(null); }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{JOB.JOB_BOARD.CONFIRM_APPLICATION}</DialogTitle>
              <DialogDescription>
                {JOB.JOB_BOARD.REVIEW}
              </DialogDescription>
            </DialogHeader>

            {confirmJob && (
              <div className="space-y-4 py-2">
                <div className="rounded-md border bg-muted/40 px-4 py-3 space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{JOB.JOB_BOARD.JOB}</p>
                  <p className="font-semibold">{confirmJob.title}</p>
                  <p className="text-sm text-muted-foreground">{confirmJob.location} &middot; {confirmJob.jobType}</p>
                </div>

                <div className="rounded-md border bg-muted/40 px-4 py-3 space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{JOB.JOB_BOARD.PROFILE}</p>
                  <div className="text-sm space-y-1">
                    <p><span className="text-muted-foreground">{JOB.JOB_BOARD.NAME}</span> {user?.name}</p>
                    <p><span className="text-muted-foreground">{JOB.JOB_BOARD.EMAIL}</span> {user?.email}</p>
                    <p><span className="text-muted-foreground">{JOB.JOB_BOARD.PHONE}</span> {user?.phone || <span className="italic text-muted-foreground">{JOB.JOB_BOARD.NOT_SET}</span>}</p>
                    <p><span className="text-muted-foreground">{JOB.JOB_BOARD.RESUME}</span> {hasResume ? <span className="text-green-600">{JOB.JOB_BOARD.UPLOADED}</span> : <span className="text-amber-600">{JOB.JOB_BOARD.NOT_UPLOADED}</span>}</p>
                  </div>
                </div>

                <div className="rounded-md border bg-muted/40 px-4 py-3 space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{JOB.JOB_BOARD.YOUR_SKILLS}</p>
                  {confirmLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  ) : confirmSkills.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">{JOB.JOB_BOARD.NO_SKILLS_ADDED}</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {confirmSkills.map((s: Skill) => (
                        <span key={s.skillId} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">{s.skillName}</span>
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-xs text-muted-foreground">
                  {JOB.JOB_BOARD.IS_PROFILE_UPDATE_REQUIRED}
                </p>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmJob(null)}>{COMMON_MESSAGE.CANCEL}</Button>
              <Button onClick={handleConfirmApply} disabled={confirmLoading}>
                {COMMON_MESSAGE.CONFIRM} &amp; {COMMON_MESSAGE.APPLY}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
}
