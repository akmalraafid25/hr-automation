"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function DashboardTable() {
  const [candidates, setCandidates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/query/analysis")
      .then(res => res.json())
      .then(data => {
        const candidateData = data?.rows?.slice(0, 5) || []
        setCandidates(candidateData)
      })
      .catch(err => console.error("Error fetching candidates:", err))
      .finally(() => setLoading(false))
  }, [])

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Hired": return "default"
      case "Interview": return "secondary"
      case "Under Review": return "outline"
      case "Rejected": return "destructive"
      default: return "outline"
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
                  <Badge variant={getStatusVariant(candidate.STATUS)}>
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
