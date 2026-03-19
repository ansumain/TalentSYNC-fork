import { useMemo, useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "@/components/ui/table-pagination";
import type { Interview } from "@/lib/api/interview.service";
import type { JobApplication } from "@/lib/api/application.service";

const STATUS_COLORS: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  noshow: "bg-orange-100 text-orange-700",
};

const RESULT_COLORS: Record<string, string> = {
  passed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
};

interface InterviewsTableProps {
  loading: boolean;
  interviews: Interview[];
  appMap: Map<string, JobApplication>;
  onCancel: (interviewId: string) => void;
  onOpenReschedule: (interview: Interview) => void;
}

export function InterviewsTable({
  loading,
  interviews,
  appMap,
  onCancel,
  onOpenReschedule,
}: InterviewsTableProps) {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [resultFilter, setResultFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const filteredInterviews = useMemo(() => {
    return interviews.filter((iv) => {
      const app = appMap.get(iv.applicationId);
      const candidateName = (app?.candidateName ?? "").toLowerCase();
      const jobTitle = (app?.jobTitle ?? "").toLowerCase();
      const searchQuery = search.trim().toLowerCase();

      const matchesSearch =
        searchQuery.length === 0 ||
        candidateName.includes(searchQuery) ||
        jobTitle.includes(searchQuery);

      const matchesStatus = statusFilter === "all" || iv.status === statusFilter;
      const matchesResult = resultFilter === "all" || (iv.result ?? "none") === resultFilter;

      return matchesSearch && matchesStatus && matchesResult;
    });
  }, [interviews, appMap, search, statusFilter, resultFilter]);

  const total = filteredInterviews.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const paginatedInterviews = filteredInterviews.slice((page - 1) * limit, page * limit);

  if (loading) {
    return (
      <Card>
        <CardContent className="space-y-3 py-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (interviews.length === 0) {
    return <div className="py-8 text-center text-muted-foreground">No interviews found.</div>;
  }

  return (
    <Card>
      <CardContent>
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:max-w-xl">
            <Input
              placeholder="Search candidate or job"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearch(searchInput);
                  setPage(1);
                }
              }}
            />
            <Button
              variant="outline"
              onClick={() => {
                setSearch(searchInput);
                setPage(1);
              }}
            >
              Search
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setSearchInput("");
                setSearch("");
                setPage(1);
              }}
            >
              Clear
            </Button>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="noshow">No Show</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={resultFilter}
              onValueChange={(value) => {
                setResultFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Results</SelectItem>
                <SelectItem value="passed">Passed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="none">No Result</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Job</TableHead>
                <TableHead>Scheduled At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedInterviews.map((iv) => {
                const app = appMap.get(iv.applicationId);
                return (
                  <TableRow key={iv.interviewId}>
                    <TableCell className="font-medium">
                      {app?.candidateName ?? <span className="text-xs text-muted-foreground">Unknown candidate</span>}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{app?.jobTitle ?? "-"}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {new Date(iv.scheduledAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[iv.status] ?? "bg-secondary text-secondary-foreground"
                          }`}
                      >
                        {iv.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {iv.result ? (
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${RESULT_COLORS[iv.result] ?? ""
                            }`}
                        >
                          {iv.result}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 border-destructive px-2 text-xs text-destructive hover:bg-destructive/10"
                          disabled={iv.status !== "scheduled"}
                          onClick={() => onCancel(iv.interviewId)}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-xs"
                          disabled={iv.status !== "cancelled"}
                          onClick={() => onOpenReschedule(iv)}
                        >
                          Reschedule
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}

              {paginatedInterviews.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No interviews match selected filters.
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
          onLimitChange={(value) => {
            setLimit(value);
            setPage(1);
          }}
        />
      </CardContent>
    </Card>
  );
}