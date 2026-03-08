import { useEffect, useState, useCallback } from "react";
import { AppSidebar } from "@/components/home/appSideBar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { applicationService } from "@/lib/api/application.service";
import type { JobApplication } from "@/lib/api/application.service";
import { toast } from "sonner";
import { SortableTh, TablePagination } from "@/components/ui/table-pagination";

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
  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  // Sorting
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  // Search
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const handleSort = useCallback((column: string) => {
    const newOrder = column === sortBy ? (sortOrder === "asc" ? "desc" : "asc") : "asc";
    setSortBy(column);
    setSortOrder(newOrder);
    setPage(1);
  }, [sortBy, sortOrder]);

  useEffect(() => {
    setLoading(true);
    applicationService
      .getMyApplications({ page, limit, sortBy, sortOrder, search: search || undefined })
      .then((res) => {
        setApplications(res.applications);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      })
      .catch(() => toast.error("Failed to load your applications"))
      .finally(() => setLoading(false));
  }, [page, limit, sortBy, sortOrder, search]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <h1 className="text-xl font-semibold">My Applications</h1>
        </header>

        <div className="flex flex-col gap-4 p-4 pt-0">
          <div className="flex gap-2">
            <Input
              placeholder="Search by job title..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { setSearch(searchInput); setPage(1); } }}
              className="max-w-sm"
            />
            <Button variant="outline" onClick={() => { setSearch(searchInput); setPage(1); }}>Search</Button>
            {search && <Button variant="ghost" onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }}>Clear</Button>}
          </div>

          {loading && <div className="text-center py-8 text-muted-foreground">Loading...</div>}

          {!loading && total === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              You haven't applied to any jobs yet.
            </div>
          )}

          {!loading && (total > 0 || applications.length > 0) && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-left">
                  {total} Application{total !== 1 ? "s" : ""}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b text-muted-foreground text-xs">
                        <SortableTh column="jobTitle" label="Job Title" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
                        <SortableTh column="jobLocation" label="Location" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
                        <SortableTh column="jobType" label="Type" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
                        <SortableTh column="currentStatus" label="Status" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
                        <SortableTh column="createdAt" label="Applied On" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
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
                <TablePagination
                  page={page}
                  totalPages={totalPages}
                  total={total}
                  limit={limit}
                  onPageChange={setPage}
                  onLimitChange={(l) => { setLimit(l); setPage(1); }}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
