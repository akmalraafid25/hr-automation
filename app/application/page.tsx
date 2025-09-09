import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardStats } from "@/components/dashboard-stats"
import { DashboardCharts } from "@/components/dashboard-charts"
import { DashboardTable } from "@/components/dashboard-table"
import DataTableWithResizableColumns from "@/components/candidates-table"
import SnowflakeTable from "@/components/snowflake-candidate"
import SnowflakeAnalysis from "@/components/snowflake-analysis"


export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-balance">Application</h2>
            </div>
            <div className="grid grid-row-1 gap-8">
                <SnowflakeTable/>
                <SnowflakeAnalysis/>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
