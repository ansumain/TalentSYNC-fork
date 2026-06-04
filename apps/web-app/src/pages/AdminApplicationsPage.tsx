import { useEffect, useState, useCallback } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { AppSidebar } from "@/components/home/appSideBar";
import { AppPageHeader } from "@/components/layout/AppPageHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { applicationService } from "@/lib/api/application.service";
import type { JobApplication, ApplicationStatus } from "@/lib/api/application.service";
import { Trash2 } from "lucide-react";
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

const STATUS_COLORS: Record<string, string> = {
  applied: "bg-blue-100 text-blue-700",
  shortlisted: "bg-yellow-100 text-yellow-700",
  interviewing: "bg-purple-100 text-purple-700",
  selected: "bg-emerald-100 text-emerald-700",
  hired: "bg-green-100 text-green-700",
  offerRejected: "bg-orange-100 text-orange-700",
  rejected: "bg-red-100 text-red-700",
};

export default function ApplicationsAdminPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<Record<string, boolean>>({});
  const [deleting, setDeleting] = useState<Record<string, boolean>>({});
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
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredApplications = applications.filter(
    (app: JobApplication) => statusFilter === "all" || app.currentStatus === statusFilter
  );

  const handleSort = useCallback((column: string) => {
    const newOrder = column === sortBy ? (sortOrder === "asc" ? "desc" : "asc") : "asc";
    setSortBy(column);
    setSortOrder(newOrder);
    setPage(1);
  }, [sortBy, sortOrder]);

  const fetchApplications = useCallback((
    p = page, l = limit, sb = sortBy, so = sortOrder
  ) => {
    setLoading(true);
    applicationService
      .getAllApplications({ page: p, limit: l, sortBy: sb, sortOrder: so, search: search || undefined })
      .then((res) => {
        setApplications(res.allApplications);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      })
      .catch(() => toast.error("Failed to load applications"))
      .finally(() => setLoading(false));
  }, [page, limit, sortBy, sortOrder, search]);

  useEffect(() => {
    fetchApplications(page, limit, sortBy, sortOrder);
  }, [page, limit, sortBy, sortOrder, search]);

  const handleStatusChange = async (applicationId: string, newStatus: ApplicationStatus) => {
    setUpdating((prev: Record<string, boolean>) => ({ ...prev, [applicationId]: true }));
    try {
      await applicationService.updateApplicationStatus(applicationId, newStatus);
      setApplications((prev: JobApplication[]) =>
        prev.map((app: JobApplication) =>
          app.applicationId === applicationId ? { ...app, currentStatus: newStatus } : app
        )
      );
      toast.success(JOB.ADMIN_APPLICATION_PAGE.STATUS_UPDATED);
    } catch {
      toast.error(JOB.ADMIN_APPLICATION_PAGE.FAILED_UPDATE_STATUS);
    } finally {
      setUpdating((prev: Record<string, boolean>) => ({ ...prev, [applicationId]: false }));
    }
  };

  const handleDelete = async (applicationId: string) => {
    if (!window.confirm(JOB.ADMIN_APPLICATION_PAGE.REMOVE_APPLICATION)) return;
    setDeleting((prev: Record<string, boolean>) => ({ ...prev, [applicationId]: true }));
    try {
      await applicationService.deleteApplication(applicationId);
      setApplications((prev: JobApplication[]) => prev.filter((a: JobApplication) => a.applicationId !== applicationId));
      setTotal((t: number) => t - 1);
      toast.success(JOB.ADMIN_APPLICATION_PAGE.APPLICATION_REMOVED);
    } catch {
      toast.error(JOB.ADMIN_APPLICATION_PAGE.FAILED_REMOVE_APPLICATION);
    } finally {
      setDeleting((prev: Record<string, boolean>) => ({ ...prev, [applicationId]: false }));
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppPageHeader title="All Applications" />

        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex w-full max-w-xl gap-2">
              <Input
                placeholder={JOB.ADMIN_APPLICATION_PAGE.SEARCH_CANDIDATE_TITLE}
                value={searchInput}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value)}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') { setSearch(searchInput); setPage(1); } }}
              />
              <Button variant="outline" onClick={() => { setSearch(searchInput); setPage(1); }}>Search</Button>
              {search && <Button variant="ghost" onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }}>Clear</Button>}
            </div>

            <div className="w-full sm:w-[210px]">
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="interviewing">Interviewing</SelectItem>
                  <SelectItem value="selected">Selected</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                  <SelectItem value="offerRejected">Offer Rejected</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading && (
            <Card>
              <CardContent className="space-y-3 py-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          )}

          {!loading && applications.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">{JOB.ADMIN_APPLICATION_PAGE.NO_APPLICATIONS}</div>
          )}

          {!loading && (total > 0 || applications.length > 0) && (
            <Card>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="text-muted-foreground text-xs">
                        <SortableTh column="candidateName" label="Candidate" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
                        <SortableTh column="jobTitle" label="Job Title" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
                        <TableHead className="font-medium">Current Status</TableHead>
                        <SortableTh column="createdAt" label="Applied On" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
                        <TableHead className="font-medium">Action</TableHead>
                        <TableHead />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApplications.map((app: JobApplication) => (
                        <TableRow key={app.applicationId}>
                          <TableCell className="font-medium">
                            {app.candidateName ?? <span className="text-muted-foreground italic">{JOB.ADMIN_APPLICATION_PAGE.UNKNOWN}</span>}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {app.jobTitle ?? <span className="italic">{JOB.ADMIN_APPLICATION_PAGE.UNKNOWN}</span>}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[app.currentStatus] ?? "bg-secondary text-secondary-foreground"}`}
                            >
                              {app.currentStatus}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {app.currentStatus === "applied" ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-xs"
                                disabled={updating[app.applicationId]}
                                onClick={() => handleStatusChange(app.applicationId, "shortlisted")}
                              >
                                Shortlist
                              </Button>
                            ) : (
                              <span className="text-xs text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={deleting[app.applicationId]}
                              onClick={() => handleDelete(app.applicationId)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}

                      {filteredApplications.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground">
                            No applications match selected filters.
                          </TableCell>
                        </TableRow>
                      )}
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
