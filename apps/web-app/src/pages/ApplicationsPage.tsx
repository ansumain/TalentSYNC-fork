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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { JOB } from "@/constants/job";
import { RefreshCw } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  applied: "bg-blue-100 text-blue-700",
  shortlisted: "bg-yellow-100 text-yellow-700",
  interviewing: "bg-purple-100 text-purple-700",
  selected: "bg-emerald-100 text-emerald-700",
  hired: "bg-green-100 text-green-700",
  offerRejected: "bg-orange-100 text-orange-700",
  rejected: "bg-red-100 text-red-700",
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [offerLoading, setOfferLoading] = useState<Record<string, boolean>>({});
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

  const fetchApplications = useCallback(() => {
    setLoading(true);
    applicationService
      .getMyApplications({ page, limit, sortBy, sortOrder, search: search || undefined })
      .then((res) => {
        setApplications(res.applications);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      })
      .catch(() => toast.error(JOB.APPLICATION_PAGE.FAILED_TO_LOAD_APPLICATIONS))
      .finally(() => setLoading(false));
  }, [page, limit, sortBy, sortOrder, search]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleOffer = async (applicationId: string, action: 'accept' | 'reject') => {
    setOfferLoading((prev) => ({ ...prev, [applicationId]: true }));
    try {
      await applicationService.acceptOrRejectOffer(applicationId, action);
      const newStatus = action === 'accept' ? 'hired' : 'offerRejected';
      setApplications((prev) =>
        prev.map((a) => (a.applicationId === applicationId ? { ...a, currentStatus: newStatus } : a))
      );
      toast.success(action === 'accept' ? 'Offer accepted! Congratulations!' : 'Offer declined.');
    } catch (e: any) {
      toast.error(e.message || 'Failed to respond to offer.');
    } finally {
      setOfferLoading((prev) => ({ ...prev, [applicationId]: false }));
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <h1 className="text-xl font-semibold flex-1">{JOB.APPLICATION_PAGE.MY_APPLICATIONS}</h1>
          <Button size="sm" variant="outline" onClick={fetchApplications} className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
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
              {JOB.APPLICATION_PAGE.NO_JOB_APPLICATIONS}
            </div>
          )}

          {!loading && (total > 0 || applications.length > 0) && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-left">
                  {total} {JOB.APPLICATION_PAGE.APPLICATION}{total !== 1 ? "s" : ""}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="text-muted-foreground text-xs">
                        <SortableTh column="jobTitle" label="Job Title" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
                        <SortableTh column="jobLocation" label="Location" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
                        <SortableTh column="jobType" label="Type" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
                        <SortableTh column="currentStatus" label="Status" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
                        <SortableTh column="createdAt" label="Applied On" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
                        <TableHead className="font-medium">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.map((app) => (
                        <TableRow key={app.applicationId}>
                          <TableCell className="font-medium">{app.job?.title ?? "—"}</TableCell>
                          <TableCell className="text-muted-foreground">{app.job?.location ?? "—"}</TableCell>
                          <TableCell className="text-muted-foreground">{app.job?.jobType ?? "—"}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                                STATUS_COLORS[app.currentStatus] ?? "bg-secondary text-secondary-foreground"
                              }`}
                            >
                              {app.currentStatus}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {app.currentStatus === 'selected' && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  className="h-7 px-2 text-xs"
                                  disabled={offerLoading[app.applicationId]}
                                  onClick={() => handleOffer(app.applicationId, 'accept')}
                                >
                                  Accept Offer
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 px-2 text-xs"
                                  disabled={offerLoading[app.applicationId]}
                                  onClick={() => handleOffer(app.applicationId, 'reject')}
                                >
                                  Decline
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
