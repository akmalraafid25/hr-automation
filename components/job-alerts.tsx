"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Plus, X } from "lucide-react"
import { useToast } from "@/components/ui/toast"

export function JobAlerts() {
  const [alerts, setAlerts] = useState<string[]>([])
  const [newAlert, setNewAlert] = useState("")
  const { addToast } = useToast()

  const addAlert = () => {
    if (newAlert.trim()) {
      setAlerts([...alerts, newAlert.trim()])
      setNewAlert("")
      addToast({ title: "Alert Created", description: `Job alert for "${newAlert}" created`, variant: "success" })
    }
  }

  const removeAlert = (index: number) => {
    const removed = alerts[index]
    setAlerts(alerts.filter((_, i) => i !== index))
    addToast({ title: "Alert Removed", description: `Job alert for "${removed}" removed`, variant: "default" })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Job Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter job keywords"
            value={newAlert}
            onChange={(e) => setNewAlert(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addAlert()}
          />
          <Button onClick={addAlert} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm">{alert}</span>
              <Button variant="ghost" size="sm" onClick={() => removeAlert(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {alerts.length === 0 && (
            <p className="text-muted-foreground text-sm">No job alerts set</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}