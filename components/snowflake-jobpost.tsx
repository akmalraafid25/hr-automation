'use client'
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area"
import ReactMarkdown from "react-markdown";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button";

export default function SnowflakeTable() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // 👈 change as needed

  useEffect(() => {
  async function fetchData() {
    try {
      const res = await fetch("/api/query/posts");
      const d = await res.json();
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
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  fetchData(); // first load

  const interval = setInterval(fetchData, 5000); // 👈 refresh every 5 seconds
  return () => clearInterval(interval); // cleanup
    }, []);


  if (loading) return <p>Loading...</p>;

  // Pagination logic
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  return (
    <div className="p-6">
      {/* Table Container */}
      <div className="border border-gray-300 rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="border">No</TableHead>
              <TableHead className="border">Job Name</TableHead>
              <TableHead className="border">Start Date</TableHead>
              <TableHead className="border">End Date</TableHead>
              <TableHead className="border">Date Created</TableHead>
              <TableHead className="border">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="border">{startIndex + index + 1}</TableCell>
                <TableCell className="border">{row.JOB_NAME}</TableCell>
                <TableCell className="border">{row.START_DATE ?? "-"}</TableCell>
                <TableCell className="border">{row.END_DATE ?? "-"}</TableCell>
                <TableCell className="border">{row.DATE_CREATED ?? "-"}</TableCell>
                <TableCell className="border max-w-[250px] truncate">
                  <Dialog>
                    <DialogTrigger className="p-2 rounded-md bg-neutral-600 text-white">
                        See Details
                    </DialogTrigger>
                    <DialogContent className="w-max">
                      <DialogHeader>
                        <DialogTitle className="text-xl">{row.JOB_NAME}</DialogTitle>
                        <div>
                            <DialogDescription>
                                Created On: {row.DATE_CREATED ?? "-"} 
                            </DialogDescription>
                            <DialogDescription>
                                Start Date: {row.START_DATE ?? "-"}
                            </DialogDescription>
                            <DialogDescription>
                                End Date: {row.END_DATE ?? "-"}
                            </DialogDescription>
                        </div>
                      </DialogHeader>
                      <ScrollArea className="h-[480px] w-[460px] text-sm rounded-md border p-4">
                        <ReactMarkdown>{row.PROMPT}</ReactMarkdown>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        >
          Previous
        </Button>

        <p className="text-sm">
          Page {currentPage} of {totalPages}
        </p>

        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
