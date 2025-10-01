"use client"

import { useEffect, useState } from 'react'
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"
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
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    fetch('/api/calendly/events')
      .then(res => res.json())
      .then(data => {
        setEvents(data.events || [])
      })
      .catch(err => {
        console.error('Error fetching Calendly events:', err)
        setEvents([])
      })
      .finally(() => setLoading(false))
  }, [])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    
    return days
  }

  const getEventsForDate = (dateStr: string) => {
    return events.filter(event => {
      const eventDate = new Date(event.start_time).toDateString()
      const selectedDateObj = new Date(dateStr).toDateString()
      return eventDate === selectedDateObj
    })
  }

  const hasEventsOnDate = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return getEventsForDate(dateStr).length > 0
  }

  const handleDateClick = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    setSelectedDate(dateStr)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const days = getDaysInMonth(currentMonth)
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : []

  if (loading) return <div className="p-8">Loading events...</div>

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader pageName="Calendar" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar */}
            <div>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Calendar/>
                    <CardTitle>
                      {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="h-10 flex items-center justify-center text-sm font-semibold text-muted-foreground">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {days.map((day, index) => (
                      <div key={index} className="h-10 flex items-center justify-center">
                        {day && (
                          <Button
                            variant={selectedDate === `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => handleDateClick(day)}
                            className={`h-10 w-10 p-0 font-normal relative ${
                              hasEventsOnDate(day) ? 'ring-2 ring-sky-400 ring-offset-1' : ''
                            }`}
                          >
                            {day}
                            {hasEventsOnDate(day) && (
                              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-sky-500 rounded-full" />
                            )}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>  
            </div>      
            {/* Events for selected date */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedDate 
                    ? `Events for ${new Date(selectedDate).toLocaleDateString()}`
                    : 'Select a date to view events'
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  selectedDateEvents.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No events on this date</p>
                  ) : (
                    <div className="space-y-3">
                      {selectedDateEvents.map((event) => (
                        <Card key={event.uri} className="shadow-sm">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">{event.name}</CardTitle>
                              <Badge variant={event.status === 'active' ? 'default' : 'secondary'}>
                                {event.status}
                              </Badge>
                            </div>
                            <CardDescription className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {event.invitees?.[0]?.email || 'No invitee email'}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                              <Clock className="h-4 w-4" />
                              <span>
                                {new Date(event.start_time).toLocaleTimeString()} - {new Date(event.end_time).toLocaleTimeString()}
                              </span>
                            </div>
                            {event.location?.join_url && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.open(event.location?.join_url, '_blank')}
                                className="w-full"
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Join Meeting
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )
                ) : (
                  <p className="text-muted-foreground text-center py-8">Click on a date to view events</p>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}