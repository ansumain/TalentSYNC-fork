"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCandidateStore } from "@/stores/candidateStore";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SortableHead, TablePagination } from "@/components/ui/table-pagination";

export function CandidateTable() {
  const {
    candidates,
    loading,
    error,
    fetchAll,
    filterByName,
    clearFilter,
    page,
    limit,
    total,
    totalPages,
    sortBy,
    sortOrder,
    setPage,
    setSort,
    setLimit,
  } = useCandidateStore();

  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleSearch = () => {
    if (!search) {
      fetchAll();
      return;
    }
    filterByName(search);
  };

  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div className="flex gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
            className="w-64"
          />
          <Button onClick={handleSearch} variant="outline">Search</Button>
          <Button onClick={() => { setSearch(""); clearFilter(); fetchAll(); }} variant="ghost">Clear</Button>
        </div>
      </div>
      {loading && <div className="text-center py-8">Loading...</div>}
      {error && <div className="text-center text-red-500 py-8">{error}</div>}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHead column="name" label="Name" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={setSort} />
                <SortableHead column="email" label="Email" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={setSort} />
                <SortableHead column="phone" label="Phone" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={setSort} />
                <SortableHead column="createdAt" label="Uploaded At" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={setSort} />
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.length === 0 ? (
                <TableRow>
                  <td colSpan={4} className="text-center py-8 text-muted-foreground">No Candidate Data Found.</td>
                </TableRow>
              ) : candidates.map((c) => (
                <TableRow
                  key={c.id}
                  className="border-b hover:bg-muted/50 cursor-pointer"
                  onClick={() => navigate(`/candidates/${c.id}`, { state: { candidate: c } })}
                >
                  <td className="px-4 py-3 text-left">{c.parsedJSON?.name || <span className="text-muted-foreground">-</span>}</td>
                  <td className="px-4 py-3 text-left">{c.parsedJSON?.email || <span className="text-muted-foreground">-</span>}</td>
                  <td className="px-4 py-3 text-left">{c.parsedJSON?.phone || <span className="text-muted-foreground">-</span>}</td>
                  <td className="px-4 py-3 text-left text-xs">{new Date(c.createdAt).toLocaleString()}</td>
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
