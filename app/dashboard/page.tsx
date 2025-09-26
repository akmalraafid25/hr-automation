import dynamic from "next/dynamic"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardStats } from "@/components/dashboard-stats"

const DashboardCharts = dynamic(() => import("@/components/dashboard-charts").then(mod => ({ default: mod.DashboardCharts })), {
  loading: () => <div className="h-64 bg-muted animate-pulse rounded-lg" />
})

const DashboardTable = dynamic(() => import("@/components/dashboard-table").then(mod => ({ default: mod.DashboardTable })), {
  loading: () => <div className="h-32 bg-muted animate-pulse rounded-lg" />
})

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-8 py-4 space-y-6">
            <DashboardStats />
            <DashboardCharts />
            <DashboardTable />
          </div>
        </main>
      </div>
    </div>
  )
}
