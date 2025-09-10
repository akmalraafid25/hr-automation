import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const recentSales = [
  {
    id: "1",
    customer: "Olivia Martin",
    email: "olivia.martin@email.com",
    description: "Moved to the next recruitment step",
    status: "completed",
    initials: "OM",
  },
  {
    id: "2",
    customer: "Jackson Lee",
    email: "jackson.lee@email.com",
    description: "Meeting via Gmeet",
    status: "on progress",
    initials: "JL",
  },
  {
    id: "3",
    customer: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    description: "Candidate ineligible",
    status: "completed",
    initials: "IN",
  },
  {
    id: "4",
    customer: "William Kim",
    email: "will@email.com",
    description: "+$99.00",
    status: "canceled",
    initials: "WK",
  },
  {
    id: "5",
    customer: "Sofia Davis",
    email: "sofia.davis@email.com",
    description: "+$39.00",
    status: "completed",
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
              <TableHead>Candidate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentSales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
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
                      sale.status === "completed" ? "default" : sale.status === "on progress" ? "secondary" : "destructive"
                    }
                  >
                    {sale.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">{sale.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
