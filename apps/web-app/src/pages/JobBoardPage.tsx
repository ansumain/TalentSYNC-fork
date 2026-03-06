import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/home/appSideBar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { jobService, applicationService, candidateService } from "@/lib/api/application.service";
import type { Job } from "@/lib/api/application.service";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

export default function JobBoardPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<Record<string, boolean>>({});
  const [applied, setApplied] = useState<Record<string, boolean>>({});
  const [hasResume, setHasResume] = useState<boolean | null>(null);

  useEffect(() => {
    Promise.all([
      jobService.getAllJobs(),
      candidateService.getMyResumeStatus(),
    ])
      .then(([jobsRes, resumeRes]) => {
        setJobs(jobsRes.currentJobs);
        setHasResume(resumeRes.hasResume);
      })
      .catch(() => toast.error("Failed to load jobs"))
      .finally(() => setLoading(false));
  }, []);

  const handleApply = async (jobId: string) => {
    setApplying((prev) => ({ ...prev, [jobId]: true }));
    try {
      await applicationService.applyToJob(jobId);
      setApplied((prev) => ({ ...prev, [jobId]: true }));
      toast.success("Application submitted successfully!");
    } catch (err: any) {
      const msg = err.message || "Failed to apply";
      if (msg.includes("already exists")) {
        toast.error("You have already applied to this job.");
        setApplied((prev) => ({ ...prev, [jobId]: true }));
      } else {
        toast.error(msg);
      }
    } finally {
      setApplying((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <h1 className="text-xl font-semibold">Open Jobs</h1>
        </header>

        <div className="flex flex-col gap-4 p-4 pt-0">
          {!loading && hasResume === false && (
            <div className="flex items-center gap-3 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>
                You need to upload a resume before you can apply for jobs.{" "}
                <button
                  className="font-semibold underline hover:text-amber-900"
                  onClick={() => navigate("/upload")}
                >
                  Go to Upload →
                </button>
              </span>
            </div>
          )}

          {loading && <div className="text-center py-8 text-muted-foreground">Loading jobs...</div>}

          {!loading && jobs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No open jobs available at the moment.</div>
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
                      onClick={() => handleApply(job.jobId)}
                    >
                      {applying[job.jobId] ? "Applying..." : applied[job.jobId] ? "Applied" : "Apply"}
                    </Button>
                  </div>
                </CardContent>
                <CardContent className="text-left text-sm text-muted-foreground space-y-3">
                  <p className="line-clamp-3">{job.description}</p>
                  <div className="flex items-center gap-4 text-xs">
                    <span>{job.openings} opening{job.openings !== 1 ? "s" : ""}</span>
                    <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
