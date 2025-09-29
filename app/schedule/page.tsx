"use client"

import { useEffect, useState } from 'react'
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CalendlyEvent {
  uri: string
  name: string
  start_time: string
  end_time: string
  status: string
  invitees: Array<{
    name: string
    email: string
  }>
  location?: {
    join_url?: string
  }
}

export default function SchedulePage() {
  const [events, setEvents] = useState<CalendlyEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/calendly/events')
      .then(res => res.json())
      .then(data => {
        console.log('Calendly API response:', data)
        if (data.error) {
          console.error('Calendly API error:', data.error)
        }
        setEvents(data.events || [])
      })
      .catch(err => {
        console.error('Error fetching Calendly events:', err)
        setEvents([])
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8">Loading events...</div>

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader pageName="Scheduled Events" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold">Scheduled Events</h1>
              <p className="text-muted-foreground mt-2">Your upcoming Calendly appointments</p>
            </div>
            
            {events.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No events scheduled</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Events will appear here when appointments are booked through Calendly
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {events.map((event) => (
                  <Card key={event.uri}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5" />
                          {event.name}
                        </CardTitle>
                        <Badge variant={event.status === 'active' ? 'default' : 'secondary'}>
                          {event.status}
                        </Badge>
                      </div>
                      <CardDescription>
                        {event.invitees?.[0]?.email || 'No invitee email'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {new Date(event.start_time).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {new Date(event.start_time).toLocaleTimeString()} - {new Date(event.end_time).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      {event.location?.join_url && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(event.location?.join_url, '_blank')}
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Join Meeting
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}