import { useLocation, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/home/appSideBar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText } from "lucide-react";
import type { Candidate } from "@/lib/api/application.service";
import { API_CONFIG } from "@/lib/api/config";
import { CANDIDATE } from "@/constants/candidate";
import { COMMON_MESSAGE } from "@/constants/common";

export default function CandidateProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const candidate: Candidate | undefined = location.state?.candidate;

  if (!candidate) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 items-center justify-center p-8">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">{CANDIDATE.CANDIDATE_TABLE.NO_DATA}</p>
              <Button variant="outline" onClick={() => navigate("/candidates")}>
                {CANDIDATE.CANDIDATE_PROFILE.BACK_TO_CANDIDATES}
              </Button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const { parsedJSON, createdAt, fileName, status } = candidate;

  const fileViewUrl = fileName ? `${API_CONFIG.RESUME_SERVICE_URL}/files/${fileName}` : null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/candidates")}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            {COMMON_MESSAGE.BACK}
          </Button>
          <h1 className="text-xl font-semibold">{parsedJSON.name || "Candidate Profile"}</h1>
        </header>

        <div className="flex flex-col gap-4 p-4 pt-0">

          {/* Basic Info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-left">{CANDIDATE.CANDIDATE_PROFILE.BASIC_INFO}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-left">
              <div>
                <p className="text-muted-foreground text-xs mb-1">{CANDIDATE.CANDIDATE_TABLE.NAME}</p>
                <p>{parsedJSON.name || <span className="text-muted-foreground">-</span>}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">{CANDIDATE.CANDIDATE_TABLE.EMAIL}</p>
                <p>{parsedJSON.email || <span className="text-muted-foreground">-</span>}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">{CANDIDATE.CANDIDATE_TABLE.PHONE}</p>
                <p>{parsedJSON.phone || <span className="text-muted-foreground">-</span>}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">{CANDIDATE.CANDIDATE_PROFILE.TOTAL_EXP}</p>
                <p>{parsedJSON.totalExperience != null ? `${parsedJSON.totalExperience} months` : <span className="text-muted-foreground">-</span>}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">{CANDIDATE.CANDIDATE_TABLE.UPLOADED_AT}</p>
                <p>{new Date(createdAt).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Resume File */}
          {fileViewUrl && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-left">{CANDIDATE.CANDIDATE_PROFILE.RESUME_FILE}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-4 text-sm text-left">
                <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                <span className="truncate text-muted-foreground">{fileName}</span>
                {status && (
                  <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${
                    status === 'completed' ? 'bg-green-100 text-green-700' :
                    status === 'failed' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>{status}</span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(fileViewUrl, '_blank', 'noopener,noreferrer')}
                >
                  {CANDIDATE.CANDIDATE_PROFILE.VIEW}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Skills */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-left">{CANDIDATE.CANDIDATE_PROFILE.SKILLS}</CardTitle>
            </CardHeader>
            <CardContent className="text-left">
              {parsedJSON.skills?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {parsedJSON.skills.map((skill, i) => (
                    <span key={i} className="inline-flex items-center rounded-full bg-secondary text-secondary-foreground px-2.5 py-0.5 text-xs font-medium">{skill}</span>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">{CANDIDATE.CANDIDATE_PROFILE.NO_SKILLS}</p>
              )}
            </CardContent>
          </Card>

          {/* Education + Experience side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Education */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-left">{CANDIDATE.CANDIDATE_PROFILE.EDUCATION}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-left">
                {parsedJSON.education?.length > 0 ? parsedJSON.education.map((edu, i) => (
                  <div key={i} className="text-sm border-b pb-2 last:border-0 last:pb-0">
                    <p className="font-medium">{edu.name}</p>
                    <p className="text-muted-foreground text-xs">{edu.batch}</p>
                  </div>
                )) : (
                  <p className="text-muted-foreground text-sm">{CANDIDATE.CANDIDATE_PROFILE.NO_EDUCATION}</p>
                )}
              </CardContent>
            </Card>

            {/* Work Experience */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-left">{CANDIDATE.CANDIDATE_PROFILE.WORK_EXP}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-left">
                {parsedJSON.experience?.length > 0 ? parsedJSON.experience.map((exp, i) => (
                  <div key={i} className="text-sm border-b pb-2 last:border-0 last:pb-0">
                    <p className="font-medium">{exp.designation}</p>
                    <p className="text-muted-foreground">{exp.company}</p>
                    <p className="text-muted-foreground text-xs">
                      {exp.startDate} — {exp.endDate}
                      {exp.durationMonths != null && ` (${exp.durationMonths} months)`}
                    </p>
                  </div>
                )) : (
                  <p className="text-muted-foreground text-sm">{CANDIDATE.CANDIDATE_PROFILE.NO_WORK_EXP}</p>
                )}
              </CardContent>
            </Card>

          </div>

        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
