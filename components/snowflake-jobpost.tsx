'use client'
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export default function SnowflakeTable() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // 👈 change as needed

    useEffect(() => {
        fetch("/api/query/posts")
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
    <div>
      {/* Table Container */}
      <div className="border border-gray-300 rounded-xl overflow-hidden shadow-sm">
        <Card className="p-6">
            <CardHeader>
              <CardTitle className="text-balance">Recent Posts</CardTitle>
              <CardDescription>Recent Post Created.</CardDescription>
            </CardHeader>
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
                        <DialogTrigger asChild>
                            <Button>
                              See Details
                            </Button>
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
        </Card>
      </div>

    </div>
  );
}
