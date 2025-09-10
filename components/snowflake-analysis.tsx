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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "./ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

export default function SnowflakeAnalysis() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // 👈 change this number as needed

  useEffect(() => {
    fetch("/api/query/analysis")
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
    <Card>
      <CardHeader>
        <CardTitle className="text-balance">Candidate Analysis</CardTitle>
        <CardDescription>Analysis based on resume.</CardDescription>
      </CardHeader>
      <div className="p-6">
        {/* Table Container */}
        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Job Applied</TableHead>
                <TableHead>Match</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Certification</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{startIndex + index + 1}</TableCell>
                  <TableCell>{row.NAME}</TableCell>
                  <TableCell>{row.JOB_NAME}</TableCell>
                  <TableCell>{row.SIMILARITY ? row.SIMILARITY +"%" : "-" }</TableCell>
                  <TableCell className="max-w-[250px] truncate">
                      <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                              Details
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="w-max">
                          <DialogHeader>
                            <DialogTitle className="text-xl">{row.NAME}</DialogTitle>
                            <div>
                                <DialogDescription>
                                    Job Applied: {row.JOB_NAME ?? "-"} 
                                </DialogDescription>
                                <DialogDescription>
                                    Certifications: {row.CERTIFICATION ?? "-"} 
                                </DialogDescription>
                                <DialogDescription>
                                    Match: {row.SIMILARITY ? row.SIMILARITY +"%" : "-" }
                                </DialogDescription>
                            </div>
                          </DialogHeader>
                          <ScrollArea className="h-[200px] w-[460px] text-sm rounded-md border p-4">
                            <h1 className="font-bold">Analysis:</h1><ReactMarkdown>{row.ANALYSIS}</ReactMarkdown>
                            <br/>
                            <h1 className="font-bold">Pros:</h1>{row.PROS ?? "-"}
                            <br/>
                            <br/>
                            <h1 className="font-bold">Cons:</h1>{row.CONS ?? "-"}
                          </ScrollArea>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                              Details
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="w-max">
                          <DialogHeader>
                            <DialogTitle className="text-xl">{row.JOB_NAME}</DialogTitle>
                            <div>
                                <DialogDescription>
                                    Job Applied: {row.JOB_NAME ?? "-"} 
                                </DialogDescription>
                                <DialogDescription>
                                    Match: {row.SIMILARITY ? row.SIMILARITY +"%" : "-" }
                                </DialogDescription>
                            </div>
                          </DialogHeader>
                          <ScrollArea className="h-[400px] w-[460px] text-sm rounded-md border p-4">
                            <h1 className="font-bold">Analysis:</h1><ReactMarkdown>{row.ANALYSIS}</ReactMarkdown>
                            <br/>
                            <h1 className="font-bold">Pros:</h1>{row.PROS ?? "-"}
                            <br/>
                            <br/>
                            <h1 className="font-bold">Cons:</h1>{row.CONS ?? "-"}
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
