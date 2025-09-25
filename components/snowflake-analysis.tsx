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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  const fetchData = () => {
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
  };

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

  const removeFromShortlist = async (shortlistId: string) => {
    try {
      const response = await fetch("/api/shortlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shortlistId }),
      });
      
      if (response.ok) {
        setData(prev => prev.filter(item => item.SHORTLIST_ID !== shortlistId));
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
    fetchData();
  }, []);

  // Listen for shortlist updates
  useEffect(() => {
    const handleShortlistUpdate = () => {
      fetchData();
    };
    window.addEventListener('shortlistUpdated', handleShortlistUpdate);
    return () => window.removeEventListener('shortlistUpdated', handleShortlistUpdate);
  }, []);

  if (loading) return <p>Loading...</p>;

  // Filter data to show only candidates with match >= 80%
  const filteredData = data.filter(row => {
    const similarity = parseInt(row.SIMILARITY);
    return similarity >= 80;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

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
                <TableHead>Status</TableHead>
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
                  <TableCell>
                    <Select
                      value={row.STATUS || ""}
                      onValueChange={(value) => updateStatus(row.APPLICANT_ID, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Reviewed">Reviewed</SelectItem>
                        <SelectItem value="Interview">Interview</SelectItem>
                        <SelectItem value="Assessment">Assessment</SelectItem>
                        <SelectItem value="Offering">Offering</SelectItem>
                        <SelectItem value="Hired">Hired</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="max-w-[250px] truncate">
                      <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                              Details
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <Dialog>
                            <DialogTrigger asChild>
                                <Button className="absolute top-4 right-4 bg-black hover:bg-gray-800 text-white text-xs px-2 py-1">
                                  View CV
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader className="text-center">
                                <DialogTitle className="text-xl">{row.NAME} - CV</DialogTitle>
                                <DialogDescription>
                                    Job Applied: {row.JOB_NAME ?? "-"} 
                                </DialogDescription>
                              </DialogHeader>
                              <ScrollArea className="h-[450px] w-full text-sm rounded-md border p-4">
                                <div className="space-y-4">
                                  <div>
                                    <h3 className="font-bold text-base mb-2">Skills</h3>
                                    <p>{row.SKILLS || "Not specified"}</p>
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-base mb-2">Work Experience</h3>
                                    <p className="whitespace-pre-wrap">{row.WORK_EXPERIENCE || "Not specified"}</p>
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-base mb-2">Education</h3>
                                    <p className="whitespace-pre-wrap">{row.EDUCATION || "Not specified"}</p>
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-base mb-2">Certifications</h3>
                                    <ReactMarkdown>{row.CERTIFICATION || "Not specified"}</ReactMarkdown>
                                  </div>
                                </div>
                              </ScrollArea>
                            </DialogContent>
                          </Dialog>
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
                          <ScrollArea className="h-[400px] w-full text-sm rounded-md border p-4">
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
                        onClick={() => removeFromShortlist(row.SHORTLIST_ID)}
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
