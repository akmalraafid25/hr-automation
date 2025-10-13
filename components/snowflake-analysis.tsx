'use client'
import { useEffect, useState, useCallback } from "react";
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
import { ChevronLeftIcon, ChevronRightIcon, Search } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "@/components/ui/input";

export default function SnowflakeAnalysis() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const rowsPerPage = 5; // 👈 change this number as needed
  const { addToast } = useToast();

  const fetchData = useCallback(() => {
    console.log("Fetching shortlist data...");
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
        console.log("Shortlist data received:", parsed.length, "items");
        setData(parsed);
      })
      .catch((err) => {
        console.error("❌ Fetch error:", err);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, []);

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
      console.log("Shortlist update event received, refetching data");
      fetchData();
    };
    window.addEventListener('shortlistUpdated', handleShortlistUpdate);
    return () => window.removeEventListener('shortlistUpdated', handleShortlistUpdate);
  }, [fetchData]);

  if (loading) return <p>Loading...</p>;

  // Filter data to show only candidates with match >= 80% and search term
  const filteredData = data.filter(row => {
    const similarity = parseInt(row.SIMILARITY);
    const matchesSearch = !searchTerm || 
      row.NAME?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.JOB_NAME?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.STATUS?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.SIMILARITY?.toString().includes(searchTerm);
    return similarity > 0 && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField] || '';
    const bVal = b[sortField] || '';
    if (sortField === 'SIMILARITY') {
      return sortDirection === 'asc' ? parseInt(aVal) - parseInt(bVal) : parseInt(bVal) - parseInt(aVal);
    }
    if (sortDirection === 'asc') {
      return aVal.toString().localeCompare(bVal.toString());
    } else {
      return bVal.toString().localeCompare(aVal.toString());
    }
  });

  const currentData = sortedData.slice(startIndex, endIndex);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-balance">Shortlisted Candidate</CardTitle>
        <CardDescription>Analysis based on resume.</CardDescription>
      </CardHeader>
      <div className="p-6">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name, job, status, or match percentage..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
            className="pl-10"
          />
        </div>
        {/* Table Container */}
        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead className="cursor-pointer hover:bg-muted" onClick={() => handleSort('NAME')}>Name {sortField === 'NAME' && (sortDirection === 'asc' ? '↑' : '↓')}</TableHead>
                <TableHead className="cursor-pointer hover:bg-muted" onClick={() => handleSort('JOB_NAME')}>Job Applied {sortField === 'JOB_NAME' && (sortDirection === 'asc' ? '↑' : '↓')}</TableHead>
                <TableHead className="cursor-pointer hover:bg-muted" onClick={() => handleSort('SIMILARITY')}>Match {sortField === 'SIMILARITY' && (sortDirection === 'asc' ? '↑' : '↓')}</TableHead>
                <TableHead className="cursor-pointer hover:bg-muted" onClick={() => handleSort('STATUS')}>Status {sortField === 'STATUS' && (sortDirection === 'asc' ? '↑' : '↓')}</TableHead>
                <TableHead>Details</TableHead>
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
                  <TableCell className="max-w-[250px] grid grid-cols-2 truncate">
                      <div className="relative">
                        <Button onClick={() => {
                          const modal = document.getElementById(`candidate-modal-${row.APPLICANT_ID}`)
                          if (modal) {
                            modal.classList.remove('hidden')
                            document.body.style.overflow = 'hidden'
                          }
                        }}>Details</Button>
                        <div id={`candidate-modal-${row.APPLICANT_ID}`} className="hidden fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={(e) => {
                          if (e.target === e.currentTarget) {
                            const modal = document.getElementById(`candidate-modal-${row.APPLICANT_ID}`)
                            if (modal) {
                              modal.classList.add('hidden')
                              document.body.style.overflow = 'auto'
                            }
                          }
                        }}>
                          <div className="bg-white rounded-xl w-[95vw] max-h-[90vh] overflow-y-auto shadow-2xl border" onClick={(e) => e.stopPropagation()}>
                            <div className="bg-black text-white p-8 relative">
                              <Button variant="ghost" size="sm" className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full" onClick={() => {
                                const modal = document.getElementById(`candidate-modal-${row.APPLICANT_ID}`)
                                if (modal) {
                                  modal.classList.add('hidden')
                                  document.body.style.overflow = 'auto'
                                }
                              }}>×</Button>
                              <div className="flex items-center gap-6 mb-6">
                                <div className="w-20 h-20 bg-gradient-to-br from-white to-gray-200 rounded-xl flex items-center justify-center shadow-lg">
                                  <span className="text-3xl font-bold text-slate-900">{row.NAME?.charAt(0)}</span>
                                </div>
                                <div>
                                  <h1 className="text-4xl font-bold mb-2">{row.NAME}</h1>
                                  <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${
                                      row.SIMILARITY >= 90 ? 'bg-green-400' :
                                      row.SIMILARITY >= 80 ? 'bg-yellow-400' : 'bg-red-400'
                                    }`}></div>
                                    <span className="text-lg font-medium">{row.SIMILARITY}% Match</span>
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
                              <div className="flex flex-col gap-8">
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
                                      <div className="w-full" style={{width: '100%', wordBreak: 'break-word', whiteSpace: 'pre-wrap'}}>
                                        {row.PROS || 'Not specified'}
                                      </div>
                                    </div>
                                  </div>
                                </div>
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
                                    <div className="max-h-64 overflow-y-auto w-full" style={{width: '100%', maxWidth: '100%'}}>
                                      <div className="w-full" style={{width: '100%', wordBreak: 'break-word', whiteSpace: 'pre-wrap'}}>
                                        {row.CONS || 'Not specified'}
                                      </div>
                                    </div>
                                  </div>
                                </div>
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
                                  <div className="bg-gray-50 h-32 rounded-xl p-6 border md:col-span-2 overflow-hidden">
                                    <h3 className="font-semibold mb-3">Certifications</h3>
                                    <div className="text-gray-700 break-words whitespace-pre-wrap">
                                      <ReactMarkdown>{row.CERTIFICATION || 'Not specified'}</ReactMarkdown>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
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
