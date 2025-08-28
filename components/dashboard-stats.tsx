import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Users, DollarSign, ShoppingCart, Activity } from "lucide-react"

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Active Users",
    value: "2,350",
    change: "+180.1%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Sales",
    value: "12,234",
    change: "+19%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "Conversion Rate",
    value: "3.2%",
    change: "-4.3%",
    trend: "down",
    icon: Activity,
  },
]

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-balance">{stat.value}</div>
            <div className="flex items-center gap-1 text-xs">
              {stat.trend === "up" ? (
                <TrendingUp className="h-3 w-3 text-accent" />
              ) : (
                <TrendingDown className="h-3 w-3 text-destructive" />
              )}
              <span className={stat.trend === "up" ? "text-accent" : "text-destructive"}>{stat.change}</span>
              <span className="text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
