import { useEffect, useState, useCallback } from "react";
import { AppSidebar } from "@/components/home/appSideBar";
import { AppPageHeader } from "@/components/layout/AppPageHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");

  const filteredApplications = applications.filter((app: JobApplication) => {
    const statusOk = statusFilter === "all" || app.currentStatus === statusFilter;
    const locationOk = locationFilter === "all" || app.job?.location === locationFilter;
    const typeOk = jobTypeFilter === "all" || app.job?.jobType === jobTypeFilter;
    return statusOk && locationOk && typeOk;
  });

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
        <AppPageHeader
          title={JOB.APPLICATION_PAGE.MY_APPLICATIONS}
          actions={
            <Button size="sm" variant="outline" onClick={fetchApplications} className="gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </Button>
          }
        />

        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex w-full max-w-xl gap-2">
              <Input
                placeholder="Search by job title..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { setSearch(searchInput); setPage(1); } }}
              />
              <Button variant="outline" onClick={() => { setSearch(searchInput); setPage(1); }}>Search</Button>
              {search && <Button variant="ghost" onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }}>Clear</Button>}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setPage(1); }}>
                <SelectTrigger className="w-full sm:w-[170px]"><SelectValue placeholder="Status" /></SelectTrigger>
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

              <Select value={locationFilter} onValueChange={(value) => { setLocationFilter(value); setPage(1); }}>
                <SelectTrigger className="w-full sm:w-[170px]"><SelectValue placeholder="Location" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {Array.from(new Set(applications.map((a) => a.job?.location).filter(Boolean) as string[])).map((location) => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={jobTypeFilter} onValueChange={(value) => { setJobTypeFilter(value); setPage(1); }}>
                <SelectTrigger className="w-full sm:w-[170px]"><SelectValue placeholder="Job Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Array.from(new Set(applications.map((a) => a.job?.jobType).filter(Boolean) as string[])).map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
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
                        <TableHead className="font-medium">Location</TableHead>
                        <TableHead className="font-medium">Type</TableHead>
                        <TableHead className="font-medium">Status</TableHead>
                        <SortableTh column="createdAt" label="Applied On" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
                        <TableHead className="font-medium">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApplications.map((app) => (
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
