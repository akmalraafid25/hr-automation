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
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <span className="text-blue-600 underline cursor-pointer hover:text-blue-800">
                          {row.NAME}
                        </span>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto p-0">
                        <DialogHeader className="sr-only">
                          <DialogTitle>{row.NAME} - Details</DialogTitle>
                        </DialogHeader>
                        <div className="bg-black text-white p-8 relative">
                          <div className="flex items-center gap-6 mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-white to-gray-200 rounded-xl flex items-center justify-center shadow-lg">
                              <span className="text-3xl font-bold text-slate-900">{row.NAME?.charAt(0)}</span>
                            </div>
                            <div>
                              <h1 className="text-3xl font-bold mb-2">{row.NAME}</h1>
                              <div className="flex items-center gap-2">
                                {row.SIMILARITY && (
                                  <>
                                    <div className={`w-3 h-3 rounded-full ${
                                      parseInt(row.SIMILARITY) >= 90 ? 'bg-green-400' :
                                      parseInt(row.SIMILARITY) >= 80 ? 'bg-yellow-400' : 'bg-red-400'
                                    }`}></div>
                                    <span className="text-lg font-medium">{row.SIMILARITY}% Match</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="bg-white/15 backdrop-blur rounded-xl p-4 border border-white/20 col-span-2">
                              <div className="text-white text-xs uppercase tracking-wide">Position</div>
                              <div className="font-semibold text-base mt-1">{row.JOB_NAME}</div>
                            </div>
                            <div className="bg-white/15 backdrop-blur rounded-xl p-4 border border-white/20">
                              <div className="text-white text-xs uppercase tracking-wide">Status</div>
                              <div className="font-semibold text-base mt-1">{row.STATUS || 'Pending'}</div>
                            </div>
                          </div>
                        </div>
                        <div className="p-8 flex flex-col gap-8">
                          {row.ANALYSIS && (
                            <div>
                              <div className="mb-6">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">📊</span>
                                  </div>
                                  <h2 className="text-2xl font-bold text-gray-800">AI Analysis</h2>
                                </div>
                                <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                              </div>
                              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 shadow-sm">
                                <div className="max-h-64 overflow-y-auto">
                                  <div className="whitespace-pre-wrap break-words">
                                    <ReactMarkdown>{row.ANALYSIS}</ReactMarkdown>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="flex flex-col gap-8">
                            {row.PROS && (
                              <div>
                                <div className="mb-6">
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                                      <span className="text-white text-sm font-bold">✓</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">Strengths</h2>
                                  </div>
                                  <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                                </div>
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 shadow-sm w-full">
                                  <div className="overflow-y-auto w-full">
                                    <div className="w-full" style={{wordBreak: 'break-word', whiteSpace: 'pre-wrap'}}>
                                      {row.PROS}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {row.CONS && (
                              <div>
                                <div className="mb-6">
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                                      <span className="text-white text-sm font-bold">⚠</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">Areas for Growth</h2>
                                  </div>
                                  <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-rose-500 rounded-full"></div>
                                </div>
                                <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-6 border border-red-200 shadow-sm w-full">
                                  <div className="max-h-64 overflow-y-auto w-full">
                                    <div className="w-full" style={{wordBreak: 'break-word', whiteSpace: 'pre-wrap'}}>
                                      {row.CONS}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="mb-4">
                              <h2 className="text-xl font-bold text-gray-800 mb-2">Candidate Profile</h2>
                              <div className="w-12 h-1 bg-slate-900 rounded"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="bg-gray-50 rounded-xl p-6 border overflow-hidden">
                                <h3 className="font-semibold mb-3">Skills</h3>
                                <p className="text-gray-700 break-all whitespace-pre-wrap">{row.SKILLS || 'Not specified'}</p>
                              </div>
                              <div className="bg-gray-50 rounded-xl p-6 border overflow-hidden">
                                <h3 className="font-semibold mb-3">Education</h3>
                                <p className="text-gray-700 whitespace-pre-wrap break-words">{row.EDUCATION || 'Not specified'}</p>
                              </div>
                              <div className="bg-gray-50 rounded-xl p-6 border md:col-span-2 overflow-hidden">
                                <h3 className="font-semibold mb-3">Work Experience</h3>
                                <p className="text-gray-700 whitespace-pre-wrap break-words">{row.WORK_EXPERIENCE || 'Not specified'}</p>
                              </div>
                              <div className="bg-gray-50 rounded-xl p-6 border md:col-span-2 overflow-hidden">
                                <h3 className="font-semibold mb-3">Certifications</h3>
                                <div className="text-gray-700 break-words whitespace-pre-wrap">
                                  <ReactMarkdown>{row.CERTIFICATION || 'Not specified'}</ReactMarkdown>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
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
