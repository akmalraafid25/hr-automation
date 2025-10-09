'use client'
import { useEffect, useState, useMemo } from "react";
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
import { Button } from "./ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
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
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SnowflakeTable() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const rowsPerPage = 5; // 👈 change this number as needed
  const { addToast } = useToast();

  const moveToShortlist = async (applicantId: string, jobId: string) => {
    try {
      const response = await fetch("/api/shortlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicantId, jobId }),
      });
      
      if (response.ok) {
        console.log("Shortlist success, dispatching event");
        window.dispatchEvent(new CustomEvent('shortlistUpdated'));
        addToast({ title: "Success", description: "Candidate moved to shortlist successfully!", variant: "success" });
      } else {
        addToast({ title: "Error", description: "Failed to move candidate to shortlist", variant: "destructive" });
      }
    } catch (error) {
      console.error("Failed to shortlist candidate:", error);
      addToast({ title: "Error", description: "Error occurred while shortlisting candidate", variant: "destructive" });
    }
  };

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

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortField) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      if (sortDirection === 'asc') {
        return aVal.toString().localeCompare(bVal.toString());
      } else {
        return bVal.toString().localeCompare(aVal.toString());
      }
    });
  }, [data, sortField, sortDirection]);

  if (loading) return <p>Loading...</p>;

<<<<<<< Updated upstream
  // Filter data based on search term
  const filteredData = sortedData.filter(row => 
    row.NAME?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.EMAIL?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.JOB_NAME?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.PHONE?.includes(searchTerm)
  );

=======
<<<<<<< HEAD
>>>>>>> Stashed changes
  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
<<<<<<< Updated upstream
  const currentData = filteredData.slice(startIndex, endIndex);

=======
  const currentData = filteredAndSortedData.slice(startIndex, endIndex);
=======
  // Filter data based on search term
  const filteredData = sortedData.filter(row => 
    row.NAME?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.EMAIL?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.JOB_NAME?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.PHONE?.includes(searchTerm)
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);
>>>>>>> 362ee52f2e67fca7082a3fef7a9dbf29ea527a6f
>>>>>>> Stashed changes

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-balance">Candidates</CardTitle>
        <CardDescription>Candidates Information.</CardDescription>
      </CardHeader>
      <div className="p-6">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name, email, job, or phone..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
            className="pl-10"
          />        </div>
        {/* Table Container */}
        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead className="cursor-pointer hover:bg-muted" onClick={() => handleSort('NAME')}>Name {sortField === 'NAME' && (sortDirection === 'asc' ? '↑' : '↓')}</TableHead>
                <TableHead className="cursor-pointer hover:bg-muted" onClick={() => handleSort('EMAIL')}>Email {sortField === 'EMAIL' && (sortDirection === 'asc' ? '↑' : '↓')}</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="cursor-pointer hover:bg-muted" onClick={() => handleSort('JOB_NAME')}>Job Applied {sortField === 'JOB_NAME' && (sortDirection === 'asc' ? '↑' : '↓')}</TableHead>
                <TableHead>LinkedIn</TableHead>
                <TableHead>CV</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{startIndex + index + 1}</TableCell>
                  <TableCell>{row.NAME}</TableCell>
                  <TableCell>
                    <a
                      href={`mailto:${row.EMAIL}`}
                      className="text-blue-600 underline"
                    >
                      {row.EMAIL}
                    </a>
                  </TableCell>
                  <TableCell>
                    {row.PHONE?.startsWith("0")
                      ? "+62" + row.PHONE.slice(1)
                      : row.PHONE}
                  </TableCell>
                  <TableCell>{row.JOB_NAME}</TableCell>
                  <TableCell>
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
                  <TableCell className="space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            View CV
                          </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-xl">{row.NAME} - CV</DialogTitle>
                          <DialogDescription>
                              Job Applied: {row.JOB_NAME ?? "-"} 
                          </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="h-[400px] w-full text-sm rounded-md border p-4">
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
                        <div className="flex justify-end pt-4">
                          <Button 
                            variant="outline" 
                            onClick={async () => {
                              try {
                                const res = await fetch(`/api/cv/${row.CV_URL}`);
                                const data = await res.json();
                                if (data.url) {
                                  window.open(data.url, '_blank');
                                }
                              } catch (error) {
                                console.error('Error fetching CV:', error);
                              }
                            }}
                          >
                            PDF File
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button 
                      size="sm"
                      variant="ghost"
                      className="text-green-600 hover:text-green-800 hover:bg-green-50"
                      onClick={() => moveToShortlist(row.APPLICANT_ID, row.JOB_ID)}
                    >
                      Shortlist
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
