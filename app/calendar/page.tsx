"use client"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import CalendarPage from "@/components/calendar"

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <DashboardSidebar />
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <DashboardHeader title="Calendar" />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Card className="p-4">
            <CalendarPage/>
          </Card>
        </main>
      </div>
    </div>
  )
}
