import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/home/appSideBar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { applicationService } from "@/lib/api/application.service";
import type { JobApplication, ApplicationStatus } from "@/lib/api/application.service";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

const ALL_STATUSES: ApplicationStatus[] = [
  "applied",
  "shortlisted",
  "interviewing",
  "hired",
  "rejected",
];

const STATUS_COLORS: Record<string, string> = {
  applied: "bg-blue-100 text-blue-700",
  shortlisted: "bg-yellow-100 text-yellow-700",
  interviewing: "bg-purple-100 text-purple-700",
  hired: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function ApplicationsAdminPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<Record<string, boolean>>({});
  const [deleting, setDeleting] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = () => {
    setLoading(true);
    applicationService
      .getAllApplications()
      .then((res) => setApplications(res.allApplications))
      .catch(() => toast.error("Failed to load applications"))
      .finally(() => setLoading(false));
  };

  const handleStatusChange = async (applicationId: string, newStatus: ApplicationStatus) => {
    setUpdating((prev) => ({ ...prev, [applicationId]: true }));
    try {
      await applicationService.updateApplicationStatus(applicationId, newStatus);
      setApplications((prev) =>
        prev.map((app) =>
          app.applicationId === applicationId ? { ...app, currentStatus: newStatus } : app
        )
      );
      toast.success("Status updated.");
    } catch {
      toast.error("Failed to update status.");
    } finally {
      setUpdating((prev) => ({ ...prev, [applicationId]: false }));
    }
  };

  const handleDelete = async (applicationId: string) => {
    if (!window.confirm('Remove this application? This cannot be undone.')) return;
    setDeleting((prev) => ({ ...prev, [applicationId]: true }));
    try {
      await applicationService.deleteApplication(applicationId);
      setApplications((prev) => prev.filter((a) => a.applicationId !== applicationId));
      toast.success('Application removed.');
    } catch {
      toast.error('Failed to remove application.');
    } finally {
      setDeleting((prev) => ({ ...prev, [applicationId]: false }));
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <h1 className="text-xl font-semibold">All Applications</h1>
        </header>

        <div className="flex flex-col gap-4 p-4 pt-0">
          {loading && <div className="text-center py-8 text-muted-foreground">Loading...</div>}

          {!loading && applications.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No applications yet.</div>
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
                        <th className="py-2 pr-4 font-medium">Candidate</th>
                        <th className="py-2 pr-4 font-medium">Job Title</th>
                        <th className="py-2 pr-4 font-medium">Current Status</th>
                        <th className="py-2 pr-4 font-medium">Applied On</th>
                        <th className="py-2 pr-4 font-medium">Update Status</th>
                        <th className="py-2 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app) => (
                        <tr key={app.applicationId} className="border-b last:border-0 hover:bg-muted/40">
                          <td className="py-3 pr-4 font-medium">
                            {app.candidateName ?? <span className="text-muted-foreground italic">Unknown</span>}
                          </td>
                          <td className="py-3 pr-4 text-muted-foreground">
                            {app.jobTitle ?? <span className="italic">Unknown</span>}
                          </td>
                          <td className="py-3 pr-4">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[app.currentStatus] ?? "bg-secondary text-secondary-foreground"
                                }`}
                            >
                              {app.currentStatus}
                            </span>
                          </td>
                          <td className="py-3 pr-4 text-muted-foreground">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 pr-4">
                            <select
                              className="text-xs border rounded-md px-2 py-1 bg-background disabled:opacity-50"
                              value={app.currentStatus}
                              disabled={updating[app.applicationId]}
                              onChange={(e) =>
                                handleStatusChange(app.applicationId, e.target.value as ApplicationStatus)
                              }
                            >
                              {ALL_STATUSES.map((s) => (
                                <option key={s} value={s}>
                                  {s.charAt(0).toUpperCase() + s.slice(1)}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-3">
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={deleting[app.applicationId]}
                              onClick={() => handleDelete(app.applicationId)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
