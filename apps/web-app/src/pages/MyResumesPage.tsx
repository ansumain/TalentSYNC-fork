import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/home/appSideBar";
import { AppPageHeader } from "@/components/layout/AppPageHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { candidateService, type Candidate } from "@/lib/api/application.service";
import { API_CONFIG } from "@/lib/api/config";
import { JOB } from "@/constants/job";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyResumesPage() {
  const [resumes, setResumes] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    candidateService
      .getMyResumes()
      .then((res) => setResumes(res.resumes))
      .catch((err) => setError(err.message || "Failed to load resumes"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppPageHeader title={JOB.RESUME_PAGE.MY_RESUMES} />

        <div className="flex flex-col gap-4 p-4">

          {loading && (
            <div className="space-y-3 py-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="flex items-center gap-4 pt-4">
                    <Skeleton className="h-5 w-5 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-36" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {error && <div className="text-center text-red-500 py-8">{error}</div>}
          {!loading && !error && resumes.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              {JOB.RESUME_PAGE.NO_RESUME}
            </div>
          )}
          {!loading && !error && resumes.map((resume) => {
            const fileViewUrl = resume.fileName
              ? `${API_CONFIG.RESUME_SERVICE_URL}/files/${resume.fileName}`
              : null;

            return (
              <Card key={resume.id}>
                <CardContent className="flex items-center gap-4 pt-4 text-sm">
                  <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <span className="font-medium truncate">{resume.fileName ?? "Unknown file"}</span>
                    <span className="text-xs text-muted-foreground">
                      {JOB.RESUME_PAGE.UPLOADED} {new Date(resume.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {resume.status && (
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
                        resume.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : resume.status === "failed"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {resume.status}
                    </span>
                  )}
                  {fileViewUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(fileViewUrl, "_blank", "noopener,noreferrer")}
                    >
                      {JOB.RESUME_PAGE.VIEW}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
