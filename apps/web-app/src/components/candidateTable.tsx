"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Sample Data
const users = [
  { name: "Ansuman Panda", email: "ansuman@gmail.com", phone: "8989898989" },
  { name: "Sarthak Mishra", email: "sarthak@gmail.com", phone: "3535353535" },
  { name: "Rushik Dumpala", email: "rushik@gmail.com", phone: "7878787878" },
  { name: "Sobhan Sahoo", email: "sobhan@gmail.com", phone: "6767676767" },
  { name: "Rahul Sahoo", email: "rahul@gmail.com", phone: "9090909090" }
];

export function CandidateTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.email}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
