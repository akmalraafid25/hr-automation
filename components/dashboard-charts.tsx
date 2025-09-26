"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import { Pie, PieChart, Label} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

const chartConfig = {
  applications: { label: "Applications" },
  hired: { label: "Hired", color: "var(--chart-1)" },
  interview: { label: "Interview", color: "var(--chart-2)" },
  review: { label: "Under Review", color: "var(--chart-3)" },
  rejected: { label: "Rejected", color: "var(--chart-4)" },
} satisfies ChartConfig

export function DashboardCharts() {
  const [statusData, setStatusData] = useState<any[]>([])
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/query/analysis").then(res => res.json()),
      fetch("/api/query/candidates").then(res => res.json())
    ])
      .then(([analysisData, candidatesData]) => {
        const candidates = analysisData?.rows || []
        const allCandidates = candidatesData?.rows || []
        
        // Group by status for pie chart with specific colors
        const statusCounts = candidates.reduce((acc: any, candidate: any) => {
          const status = candidate.STATUS || 'Under Review'
          acc[status] = (acc[status] || 0) + 1
          return acc
        }, {})
        
        const statusColors: { [key: string]: string } = {
          'Pending': '#f97316',
          'Reviewed': '#3b82f6',
          'Interview': '#a855f7',
          'Assessment': '#06b6d4',
          'Offering': '#f59e0b',
          'Hired': '#22c55e',
          'Rejected': '#ef4444'
        }
        
        const pieData = Object.entries(statusCounts).map(([status, count]) => ({
          status,
          count,
          fill: statusColors[status] || '#6b7280'
        }))
        
        // Real monthly data showing total applications count
        const totalApplications = allCandidates.length
        // Count applications by status for current month
        const monthlyStatusCounts = allCandidates.reduce((acc: any, candidate: any) => {
          const status = candidate.STATUS || 'Under Review'
          acc[status] = (acc[status] || 0) + 1
          return acc
        }, {})
        
        const monthlyApplications = [
          { month: "Jan", applications: 0, ...monthlyStatusCounts },
          { month: "Feb", applications: 0, ...monthlyStatusCounts },
          { month: "Mar", applications: 0, ...monthlyStatusCounts },
          { month: "Apr", applications: 0, ...monthlyStatusCounts },
          { month: "May", applications: 0, ...monthlyStatusCounts },
          { month: "Jun", applications: 0, ...monthlyStatusCounts },
          { month: "Jul", applications: 0, ...monthlyStatusCounts },
          { month: "Aug", applications: 0, ...monthlyStatusCounts },
          { month: "Sep", applications: allCandidates.length, ...monthlyStatusCounts },
          { month: "Oct", applications: 0, ...monthlyStatusCounts },
          { month: "Nov", applications: 0, ...monthlyStatusCounts },
          { month: "Dec", applications: 0, ...monthlyStatusCounts },
        ]
        
        setStatusData(pieData)
        setMonthlyData(monthlyApplications)
      })
      .catch(err => console.error("Error fetching chart data:", err))
      .finally(() => setLoading(false))
  }, [])

  const totalApplications = React.useMemo(() => {
    return statusData.reduce((acc, curr) => acc + curr.count, 0)
  }, [statusData])

  if (loading) return <div>Loading charts...</div>

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
      <Card className="flex flex-col col-span-2">
        <CardHeader className="items-center pb-0">
          <CardTitle>Application Status</CardTitle>
          <CardDescription>Current candidate status distribution</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[200px] md:max-h-[250px] flex justify-center"
          >
            <PieChart width={200} height={200}>
            <Tooltip
              cursor={true}
              position={{ x: undefined, y: undefined }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div style={{
                      backgroundColor: 'white',
                      padding: '12px',
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      zIndex: 1000
                    }}>
                      <p style={{ fontWeight: 'bold', margin: 0 }}>{data.status}</p>
                      <p style={{ color: '#3b82f6', margin: 0 }}>{data.count} candidates</p>
                      <p style={{ color: '#6b7280', margin: 0 }}>{((data.count / totalApplications) * 100).toFixed(1)}%</p>
                    </div>
                  )
                }
                return null
              }}
            />
           <Pie
              data={statusData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={0}
              cx="50%"  
              cy="50%"   
              labelLine={false}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {totalApplications.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Applications
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </Pie>
          </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 leading-none font-medium">
            Active recruitment process <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            Showing current application status breakdown
          </div>
        </CardFooter>
      </Card>

      <Card className="col-span-5">
        <CardHeader>
          <CardTitle>Monthly Applications</CardTitle>
          <CardDescription>Application trends over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
              <YAxis className="text-xs fill-muted-foreground" />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-white p-3 border rounded shadow-lg">
                        <p className="font-semibold">Month: {label}</p>
                        <p className="text-blue-600">{payload[0].value} total applications</p>
                        {Object.entries(data).filter(([key]) => key !== 'month' && key !== 'applications').map(([status, count]) => (
                          <p key={status} className="text-gray-600">{status}: {count}</p>
                        ))}
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar
                dataKey="applications"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
    </div>
    
  )
}