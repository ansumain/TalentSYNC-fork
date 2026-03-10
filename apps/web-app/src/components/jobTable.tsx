"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJobStore } from "@/stores/jobStore";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SortableHead, TablePagination } from "@/components/ui/table-pagination";
import { JOB } from "@/constants/job";
import { COMMON_MESSAGE } from "@/constants/common";

export function JobTable() {
  const {
    jobs,
    loading,
    error,
    fetchAll,
    filterByTitle,
    clearFilter,
    deleteJob,
    page,
    limit,
    total,
    totalPages,
    sortBy,
    sortOrder,
    setPage,
    setSort,
    setLimit,
  } = useJobStore();

  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleSearch = () => {
    if (!search.trim()) {
      clearFilter();
      return;
    }
    filterByTitle(search);
  };

  const handleClear = () => {
    setSearch("");
    clearFilter();
  };

  const handleDelete = async (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    if (!window.confirm('Delete this job? This cannot be undone.')) return;
    setDeleting(prev => ({ ...prev, [jobId]: true }));
    try {
      await deleteJob(jobId);
      toast.success('Job deleted.');
    } catch {
      toast.error('Failed to delete job.');
    } finally {
      setDeleting(prev => ({ ...prev, [jobId]: false }));
    }
  };

  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div className="flex gap-2 w-full sm:w-auto">
          <Input
            placeholder={JOB.JOB_TABLE.SEARCH_BY_TITLE}
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
            className="w-64"
          />
          <Button onClick={handleSearch} variant="outline">{COMMON_MESSAGE.SEARCH}</Button>
          <Button onClick={handleClear} variant="ghost">{COMMON_MESSAGE.CLEAR}</Button>
        </div>
      </div>
      {loading && <div className="text-center py-8">{COMMON_MESSAGE.LOADING}</div>}
      {error && <div className="text-center text-red-500 py-8">{error}</div>}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHead column="title" label={JOB.JOB_TABLE.TITLE} currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={setSort} />
                <SortableHead column="location" label={JOB.JOB_TABLE.LOCATION} currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={setSort} />
                <SortableHead column="jobType" label={JOB.JOB_TABLE.JOB_TYPE} currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={setSort} />
                <SortableHead column="openings" label={JOB.JOB_TABLE.OPENINGS} currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={setSort} />
                <SortableHead column="createdAt" label={JOB.JOB_TABLE.POSTED_AT} currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={setSort} />
                <th></th>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.length === 0 ? (
                <TableRow>
                  <td colSpan={6} className="text-center py-8 text-muted-foreground">No jobs found.</td>
                </TableRow>
              ) : jobs.map((job) => (
                <TableRow
                  key={job.jobId}
                  className="border-b hover:bg-muted/50 cursor-pointer"
                  onClick={() => navigate(`/jobs/${job.jobId}`)}
                >
                  <td className="px-4 py-3 text-left">{job.title}</td>
                  <td className="px-4 py-3 text-left">{job.location}</td>
                  <td className="px-4 py-3 text-left">{job.jobType}</td>
                  <td className="px-4 py-3 text-left">{job.openings}</td>
                  <td className="px-4 py-3 text-left text-xs">{new Date(job.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={deleting[job.jobId]}
                      onClick={(e) => handleDelete(e, job.jobId)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        </div>
      )}
    </Card>
  );
}
