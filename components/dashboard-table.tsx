import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const recentSales = [
  {
    id: "1",
    customer: "Olivia Martin",
    email: "olivia.martin@email.com",
    amount: "+$1,999.00",
    status: "completed",
    avatar: "/diverse-woman-avatar.png",
    initials: "OM",
  },
  {
    id: "2",
    customer: "Jackson Lee",
    email: "jackson.lee@email.com",
    amount: "+$39.00",
    status: "pending",
    avatar: "/man-avatar.png",
    initials: "JL",
  },
  {
    id: "3",
    customer: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    amount: "+$299.00",
    status: "completed",
    avatar: "/asian-woman-avatar.png",
    initials: "IN",
  },
  {
    id: "4",
    customer: "William Kim",
    email: "will@email.com",
    amount: "+$99.00",
    status: "failed",
    avatar: "/asian-man-avatar.png",
    initials: "WK",
  },
  {
    id: "5",
    customer: "Sofia Davis",
    email: "sofia.davis@email.com",
    amount: "+$39.00",
    status: "completed",
    avatar: "/diverse-woman-avatar.png",
    initials: "SD",
  },
]

export function DashboardTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-balance">Recent Sales</CardTitle>
        <CardDescription>You made 265 sales this month.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentSales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={sale.avatar || "/placeholder.svg"} alt={sale.customer} />
                      <AvatarFallback>{sale.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{sale.customer}</div>
                      <div className="text-sm text-muted-foreground">{sale.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      sale.status === "completed" ? "default" : sale.status === "pending" ? "secondary" : "destructive"
                    }
                  >
                    {sale.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">{sale.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
