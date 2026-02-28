"use client";

import { useEffect, useState } from "react";
import { useCandidateStore } from "@/stores/candidateStore";
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

export function CandidateTable() {
  const {
    candidates,
    loading,
    error,
    fetchAll,
    filterByName,
    clearFilter
  } = useCandidateStore();

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
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Uploaded At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-left text-center py-8">No Candidate Data Found.</TableCell></TableRow>
              ) : candidates.map((c) => (
                <TableRow key={c.id} className="border-b hover:bg-muted/50">
                  <TableCell className="text-left">{c.parsedJSON.name || <span className="text-muted-foreground">-</span>}</TableCell>
                  <TableCell className="text-left">{c.parsedJSON.email || <span className="text-muted-foreground">-</span>}</TableCell>
                  <TableCell className="text-left">{c.parsedJSON.phone || <span className="text-muted-foreground">-</span>}</TableCell>
                  <TableCell className="text-left text-xs">{new Date(c.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
}
