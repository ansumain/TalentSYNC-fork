"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJobStore } from "@/stores/jobStore";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function JobTable() {
  const {
    jobs,
    loading,
    error,
    fetchAll,
    filterByTitle,
    clearFilter
  } = useJobStore();

  const navigate = useNavigate();
  const [search, setSearch] = useState("");

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

  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div className="flex gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search by title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
            className="w-64"
          />
          <Button onClick={handleSearch} variant="outline">Search</Button>
          <Button onClick={handleClear} variant="ghost">Clear</Button>
        </div>
      </div>
      {loading && <div className="text-center py-8">Loading...</div>}
      {error && <div className="text-center text-red-500 py-8">{error}</div>}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Job Type</TableHead>
                <TableHead>Openings</TableHead>
                <TableHead>Posted At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8">No jobs found.</TableCell></TableRow>
              ) : jobs.map((job) => (
                <TableRow
                  key={job.jobId}
                  className="border-b hover:bg-muted/50 cursor-pointer"
                  onClick={() => navigate(`/jobs/${job.jobId}`)}
                >
                  <TableCell className="text-left">{job.title}</TableCell>
                  <TableCell className="text-left">{job.location}</TableCell>
                  <TableCell className="text-left">{job.jobType}</TableCell>
                  <TableCell className="text-left">{job.openings}</TableCell>
                  <TableCell className="text-left text-xs">{new Date(job.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
}
