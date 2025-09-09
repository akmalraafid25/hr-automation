'use client'
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

export default function SnowflakeTable() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // 👈 change this number as needed

  useEffect(() => {
    fetch("/api/query/candidates")
      .then((res) => res.json())
      .then((d) => {
        let parsed;
        if (typeof d === "string") {
          try {
            parsed = JSON.parse(d);
          } catch {
            parsed = [];
          }
        } else if (Array.isArray(d)) {
          parsed = d;
        } else if (d?.rows) {
          parsed = d.rows;
        } else {
          parsed = [];
        }
        setData(parsed);
      })
      .catch((err) => {
        console.error("❌ Fetch error:", err);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  // Pagination logic
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle className="text-balance">Candidates</CardTitle>
        <CardDescription>Candidates Information.</CardDescription>
      </CardHeader>
      <div className="p-6">
        {/* Table Container */}
        <div className="border border-gray-300 rounded-xl overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="border">No</TableHead>
                <TableHead className="border">Name</TableHead>
                <TableHead className="border">Email</TableHead>
                <TableHead className="border">Phone</TableHead>
                <TableHead className="border">Job Applied</TableHead>
                <TableHead className="border">LinkedIn</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="border">{startIndex + index + 1}</TableCell>
                  <TableCell className="border">{row.NAME}</TableCell>
                  <TableCell className="border">
                    <a
                      href={`mailto:${row.EMAIL}`}
                      className="text-blue-600 underline"
                    >
                      {row.EMAIL}
                    </a>
                  </TableCell>
                  <TableCell className="border">
                    {row.PHONE?.startsWith("0")
                      ? "+62" + row.PHONE.slice(1)
                      : row.PHONE}
                  </TableCell>
                  <TableCell className="border">{row.JOB_NAME}</TableCell>
                  <TableCell className="border">
                    <Button>
                      <a
                        href={
                          row.LINKEDIN?.startsWith("linkedin")
                            ? "https://www." + row.LINKEDIN
                            : row.LINKEDIN
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Profile
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
            
        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-4">
          <Button
            variant="link"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          >
            <ChevronLeftIcon />Previous
          </Button>
            
          <p className="text-sm">
            Page {currentPage} of {totalPages}
          </p>
            
          <Button
            variant="link"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          >
            Next<ChevronRightIcon />
          </Button>
        </div>
      </div>
    </Card>
  );
}
