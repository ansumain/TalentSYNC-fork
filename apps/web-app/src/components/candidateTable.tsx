"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCandidateStore } from "@/stores/candidateStore";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SortableHead, TablePagination } from "@/components/ui/table-pagination";
import { CANDIDATE } from "@/constants/candidate";
import { COMMON_MESSAGE } from "@/constants/common";

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
            placeholder={CANDIDATE.CANDIDATE_TABLE.SEARCH_BY_NAME}
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
            className="w-64"
          />
          <Button onClick={handleSearch} variant="outline">{COMMON_MESSAGE.SEARCH}</Button>
          <Button onClick={() => { setSearch(""); clearFilter(); fetchAll(); }} variant="ghost">{COMMON_MESSAGE.CLEAR}</Button>
        </div>
      </div>
      {loading && (
        <div className="space-y-3 py-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}
      {error && <div className="text-center text-red-500 py-8">{error}</div>}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHead column="name" label={CANDIDATE.CANDIDATE_TABLE.NAME} currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={setSort} />
                <SortableHead column="email" label={CANDIDATE.CANDIDATE_TABLE.EMAIL} currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={setSort} />
                <th className="px-4 py-2 text-left text-sm font-medium">{CANDIDATE.CANDIDATE_TABLE.PHONE}</th>
                <SortableHead column="createdAt" label={CANDIDATE.CANDIDATE_TABLE.UPLOADED_AT} currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={setSort} />
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.length === 0 ? (
                <TableRow>
                  <td colSpan={4} className="text-center py-8 text-muted-foreground">{CANDIDATE.CANDIDATE_TABLE.NO_DATA}</td>
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
