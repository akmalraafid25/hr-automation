'use client'
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/toast";
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
  const { addToast } = useToast();

  const updateStatus = async (applicantId: string, status: string) => {
    try {
      const response = await fetch("/api/query/analysis", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicantId, status }),
      });
      
      if (response.ok) {
        setData(prev => prev.map(item => 
          item.APPLICANT_ID === applicantId ? { ...item, STATUS: status } : item
        ));
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const removeFromShortlist = async (applicantId: string) => {
    try {
      const response = await fetch("/api/shortlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicantId }),
      });
      
      if (response.ok) {
        setData(prev => prev.filter(item => item.APPLICANT_ID !== applicantId));
        addToast({ title: "Success", description: "Candidate removed from shortlist successfully!", variant: "success" });
      } else {
        addToast({ title: "Error", description: "Failed to remove candidate from shortlist", variant: "destructive" });
      }
    } catch (error) {
      console.error("Failed to remove candidate:", error);
      addToast({ title: "Error", description: "Error occurred while removing candidate", variant: "destructive" });
    }
  };

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
        <CardTitle className="text-balance">Shortlisted Candidate</CardTitle>
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
                <TableHead>CV</TableHead>
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
                    <TableCell className="space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">
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
                                    Match: {row.SIMILARITY ? row.SIMILARITY +"%" : "-" }
                                </DialogDescription>
                            </div>
                          </DialogHeader>
                          <ScrollArea className="h-[200px] w-[460px] text-sm rounded-md border p-4">
                            <h1 className="font-bold">Certification:</h1><ReactMarkdown>{row.CERTIFICATION}</ReactMarkdown>
                          </ScrollArea>
                        </DialogContent>
                      </Dialog>
                      <Button 
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        onClick={() => removeFromShortlist(row.APPLICANT_ID)}
                      >
                        Remove
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
