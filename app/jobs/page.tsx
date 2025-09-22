"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ApplicantNavbar } from "@/components/applicant-navbar"
import ReactMarkdown from "react-markdown"
import { Search, Filter } from "lucide-react"

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [filteredJobs, setFilteredJobs] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/query/posts")
      .then((res) => res.json())
      .then((data) => {
        const jobData = data?.rows || []
        setJobs(jobData)
        setFilteredJobs(jobData)
      })
      .catch((err) => console.error("Error fetching jobs:", err))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let filtered = jobs.filter(job => 
      job.JOB_NAME.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    if (dateFilter === "recent") {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      filtered = filtered.filter(job => new Date(job.DATE_CREATED) >= oneWeekAgo)
    } else if (dateFilter === "closing") {
      const oneWeekFromNow = new Date()
      oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7)
      filtered = filtered.filter(job => new Date(job.END_DATE) <= oneWeekFromNow)
    }
    
    setFilteredJobs(filtered)
  }, [searchTerm, dateFilter, jobs])

  if (loading) return <div className="p-8">Loading jobs...</div>

  return (
    <div className="min-h-screen bg-background">
      <ApplicantNavbar />
      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Open Positions</h1>
          <p className="text-muted-foreground mt-2">Find your next career opportunity</p>
          
          <div className="flex gap-4 mt-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
          
          {showFilters && (
            <div className="bg-muted/50 p-4 rounded-lg mt-4">
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Filter by Date</label>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select date filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Jobs</SelectItem>
                      <SelectItem value="recent">Posted This Week</SelectItem>
                      <SelectItem value="closing">Closing Soon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" onClick={() => { setDateFilter("all"); setSearchTerm(""); }}>
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{job.JOB_NAME}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary">
                    {new Date(job.START_DATE).toLocaleDateString()}
                  </Badge>
                  <Badge variant="outline">
                    Ends: {new Date(job.END_DATE).toLocaleDateString()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Posted: {new Date(job.DATE_CREATED).toLocaleDateString()}
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">View Details & Apply</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{job.JOB_NAME}</DialogTitle>
                      <DialogDescription>
                        Application Period: {new Date(job.START_DATE).toLocaleDateString()} - {new Date(job.END_DATE).toLocaleDateString()}
                      </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-96 w-full rounded-md border p-4">
                      <ReactMarkdown>{job.PROMPT}</ReactMarkdown>
                    </ScrollArea>
                    <div className="flex gap-2 pt-4">
                      <Button className="flex-1">Apply Now</Button>
                      <Button variant="outline">Save Job</Button>
                      <Button variant="outline" size="sm">
                        Share
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && jobs.length > 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No jobs match your search criteria.</p>
          </div>
        )}
        
        {jobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No open positions available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}