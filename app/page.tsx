import dynamic from "next/dynamic"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentJobPosts } from "@/components/recent-job-posts"
import { HiringPipeline } from "@/components/hiring-pipeline"

const DashboardCharts = dynamic(() => import("@/components/dashboard-charts").then(mod => ({ default: mod.DashboardCharts })), {
  loading: () => <div className="h-64 bg-muted animate-pulse rounded-lg" />
})

const DashboardTable = dynamic(() => import("@/components/dashboard-table").then(mod => ({ default: mod.DashboardTable })), {
  loading: () => <div className="h-32 bg-muted animate-pulse rounded-lg" />
})

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-background">
      <div className="hidden md:block">
        <DashboardSidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader pageName="Dashboard" />

        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
            <div>
              <h2 className="text-xl md:text-3xl font-bold tracking-tight text-balance">Dashboard Overview</h2>
              <p className="text-sm md:text-base text-muted-foreground">Welcome back! Here's what's happening with your business today.</p>
            </div>
            <DashboardStats />
            <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <DashboardCharts />
              </div>
              <div className="space-y-4">
                <RecentJobPosts />
                <HiringPipeline />
              </div>
            </div>
            <DashboardTable />
          </div>
        </main>
      </div>
    </div>
  )
}
