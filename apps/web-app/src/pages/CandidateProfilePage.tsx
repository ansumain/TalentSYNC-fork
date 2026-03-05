import { useLocation, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/home/appSideBar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import type { Candidate } from "@/stores/candidateStore";

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
              <p className="text-muted-foreground mb-4">Candidate data not found.</p>
              <Button variant="outline" onClick={() => navigate("/candidates")}>
                Back to Candidates
              </Button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const { parsedJSON, createdAt } = candidate;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/candidates")}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-xl font-semibold">{parsedJSON.name || "Candidate Profile"}</h1>
        </header>

        <div className="flex flex-col gap-4 p-4 pt-0">

          {/* Basic Info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-left">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-left">
              <div>
                <p className="text-muted-foreground text-xs mb-1">Name</p>
                <p>{parsedJSON.name || <span className="text-muted-foreground">-</span>}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Email</p>
                <p>{parsedJSON.email || <span className="text-muted-foreground">-</span>}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Phone</p>
                <p>{parsedJSON.phone || <span className="text-muted-foreground">-</span>}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Total Experience</p>
                <p>{parsedJSON.totalExperience != null ? `${parsedJSON.totalExperience} months` : <span className="text-muted-foreground">-</span>}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Uploaded At</p>
                <p>{new Date(createdAt).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-left">Skills</CardTitle>
            </CardHeader>
            <CardContent className="text-left">
              {parsedJSON.skills?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {parsedJSON.skills.map((skill, i) => (
                    <span key={i} className="inline-flex items-center rounded-full bg-secondary text-secondary-foreground px-2.5 py-0.5 text-xs font-medium">{skill}</span>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No skills found.</p>
              )}
            </CardContent>
          </Card>

          {/* Education + Experience side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Education */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-left">Education</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-left">
                {parsedJSON.education?.length > 0 ? parsedJSON.education.map((edu, i) => (
                  <div key={i} className="text-sm border-b pb-2 last:border-0 last:pb-0">
                    <p className="font-medium">{edu.name}</p>
                    <p className="text-muted-foreground text-xs">{edu.batch}</p>
                  </div>
                )) : (
                  <p className="text-muted-foreground text-sm">No education data found.</p>
                )}
              </CardContent>
            </Card>

            {/* Work Experience */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-left">Work Experience</CardTitle>
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
                  <p className="text-muted-foreground text-sm">No experience data found.</p>
                )}
              </CardContent>
            </Card>

          </div>

        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
