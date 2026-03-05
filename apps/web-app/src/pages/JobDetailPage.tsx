import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/home/appSideBar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { jobService } from "@/lib/api/application.service";
import type { Job } from "@/lib/api/application.service";

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;
    setLoading(true);
    jobService
      .getJobById(jobId)
      .then((res) => {
        setJob(res.job);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load job.");
        setLoading(false);
      });
  }, [jobId]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/jobs")}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-xl font-semibold">{job ? job.title : "Job Details"}</h1>
        </header>

        <div className="flex flex-col gap-4 p-4 pt-0">
          {loading && <div className="text-center py-8">Loading...</div>}
          {error && <div className="text-center text-red-500 py-8">{error}</div>}

          {!loading && !error && job && (
            <>
              {/* Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Job Overview</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Title</p>
                    <p className="font-medium">{job.title}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Location</p>
                    <p>{job.location}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Job Type</p>
                    <span className="inline-flex items-center rounded-full bg-secondary text-secondary-foreground px-2.5 py-0.5 text-xs font-medium">{job.jobType}</span>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Openings</p>
                    <p>{job.openings}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Posted At</p>
                    <p>{new Date(job.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Last Updated</p>
                    <p>{new Date(job.updatedAt).toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{job.description}</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
