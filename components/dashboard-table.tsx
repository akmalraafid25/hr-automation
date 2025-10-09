"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Candidate {
  APPLICANT_ID?: string
  NAME?: string
  JOB_NAME?: string
  STATUS?: string
  SKILLS?: string
  SIMILARITY?: number
}

export function DashboardTable() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/query/candidates")
      .then(res => res.json())
      .then(data => {
        const candidateData = data?.rows?.slice(0, 5) || []
        setCandidates(candidateData)
      })
      .catch(err => console.error("Error fetching candidates:", err))
      .finally(() => setLoading(false))
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-orange-500 text-white"
      case "Reviewed": return "bg-blue-500 text-white"
      case "Interview": return "bg-purple-500 text-white"
      case "Assessment": return "bg-cyan-500 text-white"
      case "Offering": return "bg-amber-500 text-white"
      case "Hired": return "bg-green-500 text-white"
      case "Rejected": return "bg-red-500 text-white"
      default: return "bg-gray-500 text-white"
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-balance">Recent Applications</CardTitle>
        <CardDescription>Latest candidate applications and their status.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Job Position</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Similarity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates.map((candidate, index) => (
              <TableRow key={candidate.APPLICANT_ID || index}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {candidate.NAME?.split(' ').slice(0, 2).map((n: string) => n[0]).join('') || 'NA'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{candidate.NAME || 'Unknown'}</div>
                      <div className="text-sm text-muted-foreground">{candidate.SKILLS?.substring(0, 30)}...</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{candidate.JOB_NAME || 'N/A'}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(candidate.STATUS || 'Pending')}>
                    {candidate.STATUS || 'Pending'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {candidate.SIMILARITY ? `${Math.round(candidate.SIMILARITY)}%` : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
