'use client'
import { useEffect, useState } from "react";
import Image from "next/image";
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

interface JobPost {
  JOB_ID: string
  JOB_NAME: string
  START_DATE: string
  END_DATE: string
  DATE_CREATED: string
  PROMPT: string
}

interface Applicant {
  JOB_ID: string
  NAME: string
  EMAIL: string
  SKILLS: string
}

export default function SnowflakeTable() {
  const [data, setData] = useState<JobPost[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const rowsPerPage = 5; // 👈 change as needed

    useEffect(() => {
        Promise.all([
          fetch("/api/query/posts").then(res => {
            if (!res.ok) throw new Error(`Posts API failed: ${res.status}`);
            return res.json();
          }),
          fetch("/api/query/candidates").then(res => {
            if (!res.ok) throw new Error(`Candidates API failed: ${res.status}`);
            return res.json();
          })
        ])
          .then(([postsData, candidatesData]) => {
            console.log("Posts data:", postsData);
            console.log("Candidates data:", candidatesData);
            
            let parsed;
            if (typeof postsData === "string") {
              try {
                parsed = JSON.parse(postsData);
              } catch {
                parsed = [];
              }
            } else if (Array.isArray(postsData)) {
              parsed = postsData;
            } else if (postsData?.rows) {
              parsed = postsData.rows;
            } else {
              parsed = [];
            }
            setData(parsed);
            setApplicants(candidatesData?.rows || []);
          })
          .catch((err) => {
            console.error("❌ Fetch error:", err);
            setData([]);
            setApplicants([]);
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
                  <TableHead>Applicants</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Date Created</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((row, index) => {
                  const jobApplicants = applicants.filter(app => app.JOB_ID === row.JOB_ID)
                  return (
                  <TableRow key={index}>
                    <TableCell>{startIndex + index + 1}</TableCell>
                    <TableCell>{row.JOB_NAME}</TableCell>
                    <TableCell>{jobApplicants.length}</TableCell>
                    <TableCell>{row.START_DATE ?? "-"}</TableCell>
                    <TableCell>{row.END_DATE ?? "-"}</TableCell>
                    <TableCell>{row.DATE_CREATED ?? "-"}</TableCell>
                    <TableCell className="max-w-[250px] truncate">
                      <div className="relative">
                        <Button onClick={() => {
                          const modal = document.getElementById(`modal-${row.JOB_ID}`)
                          if (modal) {
                            modal.classList.remove('hidden')
                            document.body.style.overflow = 'hidden'
                          }
                        }}>See Details</Button>
                        <div id={`modal-${row.JOB_ID}`} className="hidden fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={(e) => {
                          if (e.target === e.currentTarget) {
                            const modal = document.getElementById(`modal-${row.JOB_ID}`)
                            if (modal) {
                              modal.classList.add('hidden')
                              document.body.style.overflow = 'auto'
                            }
                          }
                        }}>
                          <div className="bg-white rounded-xl w-[95vw] max-h-[90vh] overflow-y-auto shadow-2xl border" onClick={(e) => e.stopPropagation()}>
                            <div className="bg-black text-white p-8 relative">
                              <Button variant="ghost" size="sm" className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full" onClick={() => {
                                const modal = document.getElementById(`modal-${row.JOB_ID}`)
                                if (modal) {
                                  modal.classList.add('hidden')
                                  document.body.style.overflow = 'auto'
                                }
                              }}>×</Button>
                              <div className="flex items-center gap-4 mb-4">
                                <div className="w-24 h-16 bg-white rounded-lg flex items-center justify-center">
                                  <span className="text-2xl font-bold text-slate-900">
                                                <Image
                                                  src="/softwareone-logo-blk.svg"
                                                  width={60}
                                                  height={40}
                                                  alt="Company Logo"
                                                />
                                  </span>
                                </div>
                                <h1 className="text-3xl font-bold">{row.JOB_NAME}</h1>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div className="bg-white/10 rounded-lg p-3">
                                  <div className="text-gray-300">Created</div>
                                  <div className="font-semibold">{new Date(row.DATE_CREATED).toLocaleDateString()}</div>
                                </div>
                                <div className="bg-white/10 rounded-lg p-3">
                                  <div className="text-gray-300">Start Date</div>
                                  <div className="font-semibold">{new Date(row.START_DATE).toLocaleDateString()}</div>
                                </div>
                                <div className="bg-white/10 rounded-lg p-3">
                                  <div className="text-gray-300">End Date</div>
                                  <div className="font-semibold">{new Date(row.END_DATE).toLocaleDateString()}</div>
                                </div>
                                <div className="bg-white/10 rounded-lg p-3">
                                  <div className="text-gray-300">Applicants</div>
                                  <div className="font-semibold text-xl">{jobApplicants.length}</div>
                                </div>
                              </div>
                            </div>
                            <div className="p-8 flex flex-col gap-8">
                              <div>
                                <div className="mb-4">
                                  <h2 className="text-xl font-bold text-gray-800 mb-2">Job Description</h2>
                                  <div className="w-12 h-1 bg-slate-900 rounded"></div>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-6 h-64 overflow-y-auto border w-full overflow-x-hidden">
                                  <div className="w-full whitespace-pre-wrap break-all">
                                    <ReactMarkdown>{row.PROMPT}</ReactMarkdown>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <div className="mb-4">
                                  <h2 className="text-xl font-bold text-gray-800 mb-2">Applicants</h2>
                                  <div className="w-12 h-1 bg-slate-900 rounded"></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-64 overflow-y-auto">
                                  {jobApplicants.length > 0 ? jobApplicants.map((applicant, idx) => (
                                    <div key={idx} className="bg-white border-2 border-gray-100 rounded-xl p-4 hover:border-slate-300 transition-colors">
                                      <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                          {applicant.NAME?.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <h3 className="font-semibold text-gray-900 truncate">{applicant.NAME}</h3>
                                          <p className="text-sm text-gray-500 mb-2">{applicant.EMAIL}</p>
                                          <div className="bg-gray-50 rounded-lg p-2">
                                            <p className="text-xs text-gray-600 line-clamp-2">{applicant.SKILLS?.substring(0, 100)}...</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )) : (
                                    <div className="col-span-full text-center py-12">
                                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl">👤</span>
                                      </div>
                                      <p className="text-gray-500">No applicants yet</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                  )
                })}
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
