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
import { ChevronLeftIcon, ChevronRightIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SnowflakeTable() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
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

  // Filter data based on search term
  const filteredData = data.filter(row => 
    row.JOB_NAME?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.START_DATE?.includes(searchTerm) ||
    row.END_DATE?.includes(searchTerm) ||
    row.DATE_CREATED?.includes(searchTerm)
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <div>
      {/* Table Container */}
      <div className="border border-gray-300 rounded-xl overflow-hidden shadow-sm">
        <Card className="p-6">
            <CardHeader>
              <CardTitle className="text-balance">Recent Posts</CardTitle>
              <CardDescription>Recent Post Created.</CardDescription>
            </CardHeader>
            {/* Search Bar */}
            <div className="relative mb-4 px-6">
              <Search className="absolute left-9 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by job name or dates..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page when searching
                }}
                className="pl-10"
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Job Name</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Date Created</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{startIndex + index + 1}</TableCell>
                    <TableCell>{row.JOB_NAME}</TableCell>
                    <TableCell>{row.START_DATE ?? "-"}</TableCell>
                    <TableCell>{row.END_DATE ?? "-"}</TableCell>
                    <TableCell>{row.DATE_CREATED ?? "-"}</TableCell>
                    <TableCell className="max-w-[250px] truncate">
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
