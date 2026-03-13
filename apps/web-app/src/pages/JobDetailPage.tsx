import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/home/appSideBar";
import { AppPageHeader } from "@/components/layout/AppPageHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Medal } from "lucide-react";
import { jobService, applicationService } from "@/lib/api/application.service";
import type { Job, RankedApplicant } from "@/lib/api/application.service";
import { useAuthStore } from "@/stores/authStore";
import { JOB } from "@/constants/job";
import { COMMON_MESSAGE } from "@/constants/common";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_COLORS: Record<string, string> = {
  applied: "bg-blue-100 text-blue-700",
  shortlisted: "bg-yellow-100 text-yellow-700",
  interviewing: "bg-purple-100 text-purple-700",
  hired: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const RANK_COLORS = ["bg-yellow-400 text-yellow-900", "bg-gray-300 text-gray-800", "bg-orange-300 text-orange-900"];

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const roles = useAuthStore((s) => s.user?.roles ?? []);
  const isAdmin = roles.includes("admin") || roles.includes("manager");

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rankedApplicants, setRankedApplicants] = useState<RankedApplicant[]>([]);
  const [rankedLoading, setRankedLoading] = useState(false);

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

    if (isAdmin) {
      setRankedLoading(true);
      applicationService
        .getRankedApplicants(jobId)
        .then((res) => setRankedApplicants(res.rankedApplicants))
        .catch(() => { })
        .finally(() => setRankedLoading(false));
    }
  }, [jobId, isAdmin]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppPageHeader
          title={job ? job.title : "Job Details"}
          leading={
            <Button variant="ghost" size="sm" onClick={() => navigate("/jobs")}>
              <ChevronLeft className="mr-1 h-4 w-4" />
              {COMMON_MESSAGE.BACK}
            </Button>
          }
        />

        <div className="flex flex-col gap-4 p-4 pt-0">
          {loading && (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-40" />
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="space-y-2">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-36" />
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Skeleton key={index} className="h-6 w-20 rounded-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-28" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            </>
          )}
          {error && <div className="text-center text-red-500 py-8">{error}</div>}

          {!loading && !error && job && (
            <>
              {/* Overview */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-left">{JOB.JOB_DETAIL.JOB_OVERVIEW}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-left">
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">{JOB.JOB_DETAIL.TITLE}</p>
                    <p className="font-medium">{job.title}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">{JOB.JOB_DETAIL.LOCATION}</p>
                    <p>{job.location}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">{JOB.JOB_DETAIL.JOB_TYPE}</p>
                    <span className="inline-flex items-center rounded-full bg-secondary text-secondary-foreground px-2.5 py-0.5 text-xs font-medium">{job.jobType}</span>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">{JOB.JOB_DETAIL.OPENINGS}</p>
                    <p>{job.openings}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">{JOB.JOB_DETAIL.POSTED_AT}</p>
                    <p>{new Date(job.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">{JOB.JOB_DETAIL.LAST_UPDATED}</p>
                    <p>{new Date(job.updatedAt).toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Required Skills */}
              {job.skills && job.skills.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-left">{JOB.JOB_DETAIL.REQUIRED_SKILLS}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-left">
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <span
                          key={skill.skillId}
                          className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium"
                        >
                          {skill.skillName}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Description */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-left">{JOB.JOB_DETAIL.DESCRIPTION}</CardTitle>
                </CardHeader>
                <CardContent className="text-left">
                  <p className="text-sm whitespace-pre-wrap">{job.description}</p>
                </CardContent>
              </Card>

              {/* Ranked Applicants — admin/manager only */}
              {isAdmin && (
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 text-left">
                      <Medal className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-base">{JOB.JOB_DETAIL.RANKING}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {rankedLoading && (
                      <div className="space-y-3 py-2">
                        <Skeleton className="h-14 w-full" />
                        <Skeleton className="h-14 w-full" />
                        <Skeleton className="h-14 w-full" />
                      </div>
                    )}
                    {!rankedLoading && rankedApplicants.length === 0 && (
                      <p className="text-sm text-muted-foreground py-2">{JOB.JOB_DETAIL.NO_APPLICANTS}</p>
                    )}
                    {!rankedLoading && rankedApplicants.length > 0 && (
                      <div className="space-y-3">
                        {rankedApplicants.map((applicant) => {
                          const totalRequired = job.skills?.length ?? 0;
                          const rankColorClass = RANK_COLORS[applicant.rank - 1] ?? "bg-secondary text-secondary-foreground";
                          return (
                            <div
                              key={applicant.applicationId}
                              className="flex flex-col sm:flex-row sm:items-start gap-3 rounded-lg border p-3"
                            >
                              {/* Rank badge */}
                              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${rankColorClass}`}>
                                #{applicant.rank}
                              </div>

                              <div className="flex-1 space-y-3 text-left">
                                <div className="flex flex-wrap items-center gap-4">
                                  <span className="font-medium text-sm">
                                    {applicant.candidateName ?? <span className="italic text-muted-foreground">{JOB.JOB_DETAIL.UNKNOWN}</span>}
                                  </span>
                                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[applicant.currentStatus] ?? "bg-secondary text-secondary-foreground"}`}>
                                    {applicant.currentStatus}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {JOB.JOB_DETAIL.APPLIED} {new Date(applicant.appliedAt).toLocaleDateString()}
                                  </span>
                                </div>

                                {/* Match score */}
                                <p className="text-xs text-muted-foreground">
                                  <span className="font-semibold text-foreground">{applicant.matchCount}</span>
                                  {totalRequired > 0 ? `/${totalRequired}` : ""} {JOB.JOB_DETAIL.REQUIRED_SKILL}{applicant.matchCount !== 1 ? "s" : ""} {JOB.JOB_DETAIL.MATCHED}
                                </p>

                                {/* Matched skills */}
                                {applicant.matchedSkills.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {applicant.matchedSkills.map((skill) => (
                                      <span key={skill} className="inline-flex items-center rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-xs font-medium">
                                        {skill}
                                      </span>
                                    ))}
                                    {applicant.candidateSkills
                                      .filter((cs) => !applicant.matchedSkills.some((ms) => ms.toLowerCase() === cs.toLowerCase()))
                                      .slice(0, 5)
                                      .map((skill) => (
                                        <span key={skill} className="inline-flex items-center rounded-full bg-secondary text-secondary-foreground px-2 py-0.5 text-xs">
                                          {skill}
                                        </span>
                                      ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
