import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/home/appSideBar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { applicationService } from "@/lib/api/application.service";
import type { JobApplication } from "@/lib/api/application.service";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, string> = {
  applied: "bg-blue-100 text-blue-700",
  shortlisted: "bg-yellow-100 text-yellow-700",
  interviewing: "bg-purple-100 text-purple-700",
  hired: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationService
      .getMyApplications()
      .then((res) => setApplications(res.applications))
      .catch(() => toast.error("Failed to load your applications"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <h1 className="text-xl font-semibold">My Applications</h1>
        </header>

        <div className="flex flex-col gap-4 p-4 pt-0">
          {loading && <div className="text-center py-8 text-muted-foreground">Loading...</div>}

          {!loading && applications.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              You haven't applied to any jobs yet.
            </div>
          )}

          {!loading && applications.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-left">
                  {applications.length} Application{applications.length !== 1 ? "s" : ""}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b text-muted-foreground text-xs">
                        <th className="py-2 pr-4 font-medium">Job Title</th>
                        <th className="py-2 pr-4 font-medium">Location</th>
                        <th className="py-2 pr-4 font-medium">Type</th>
                        <th className="py-2 pr-4 font-medium">Status</th>
                        <th className="py-2 font-medium">Applied On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app) => (
                        <tr key={app.applicationId} className="border-b last:border-0 hover:bg-muted/40">
                          <td className="py-3 pr-4 font-medium">{app.job?.title ?? "—"}</td>
                          <td className="py-3 pr-4 text-muted-foreground">{app.job?.location ?? "—"}</td>
                          <td className="py-3 pr-4 text-muted-foreground">{app.job?.jobType ?? "—"}</td>
                          <td className="py-3 pr-4">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                                STATUS_COLORS[app.currentStatus] ?? "bg-secondary text-secondary-foreground"
                              }`}
                            >
                              {app.currentStatus}
                            </span>
                          </td>
                          <td className="py-3 text-muted-foreground">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
