"use client"
import * as React from "react"
import { addMonths, subMonths, format, isSameDay, startOfDay } from "date-fns"
import { motion } from "framer-motion"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Tag as TagIcon,
  Clock,
  MapPin,
  Trash2,
  MoreHorizontal,
  CirclePlus,
} from "lucide-react"

// Types
interface CalendarEvent {
  id: string
  title: string
  date: string // ISO date (yyyy-MM-dd)
  time?: string // e.g. "14:00"
  location?: string
  tag?: string
  description?: string
  color?: "default" | "secondary" | "destructive" | "outline"
}

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

export default function CalendarPage() {
  const today = React.useMemo(() => startOfDay(new Date()), [])
  const [month, setMonth] = React.useState<Date>(today)
  const [selectedDate, setSelectedDate] = React.useState<Date>(today)
  const [events, setEvents] = React.useState<CalendarEvent[]>([
    {
      id: uid(),
      title: "Sprint Planning",
      date: format(today, "dd-MM-yyyy"),
      time: "10:00",
      location: "Zoom",
      tag: "Work",
      color: "default",
    },
    {
      id: uid(),
      title: "Coffee with Dina",
      date: format(addMonths(today, 0), "dd-MM-yyyy"),
      time: "15:30",
      location: "Kopi Kenangan",
      tag: "Personal",
      color: "secondary",
    },
    {
      id: uid(),
      title: "Product Demo",
      date: format(addMonths(today, 0), "dd-MM-yyyy"),
      time: "19:00",
      location: "Office",
      tag: "Client",
      color: "outline",
    },
  ])

  const eventsOnSelected = React.useMemo(
    () =>
      events
        .filter((e) => isSameDay(new Date(e.date), selectedDate))
        .sort((a, b) => (a.time || "").localeCompare(b.time || "")),
    [events, selectedDate]
  )

  // New event dialog state
  const [open, setOpen] = React.useState(false)
  const [form, setForm] = React.useState<Partial<CalendarEvent>>({
    date: format(selectedDate, "dd-MM-yyyy"),
    color: "default",
  })

  React.useEffect(() => {
    setForm((f) => ({ ...f, date: format(selectedDate, "dd-MM-yyyy") }))
  }, [selectedDate])

  function addEvent(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.date) return
    setEvents((prev) => [
      ...prev,
      {
        id: uid(),
        title: form.title!,
        date: form.date!,
        time: form.time,
        location: form.location,
        tag: form.tag,
        description: form.description,
        color: (form.color as CalendarEvent["color"]) || "default",
      },
    ])
    setOpen(false)
    setForm({ date: format(selectedDate, "dd-MM-yyyy"), color: "default" })
  }

  function deleteEvent(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }

  const DayContent = React.useCallback(
    (props: any) => {
      const date: Date = props.date
      const dayEvents = events.filter((e) => isSameDay(new Date(e.date), date))
      return (
        <div
          className={cn(
            "relative size-9 mx-auto grid place-items-center rounded-xl text-sm",
            isSameDay(date, today) && "ring-2 ring-primary/60",
            isSameDay(date, selectedDate) && "bg-primary text-primary-foreground"
          )}
        >
          <span>{format(date, "d")}</span>
          {dayEvents.length > 0 && (
            <div className="pointer-events-none absolute -bottom-1.5 flex gap-0.5">
              {dayEvents.slice(0, 3).map((ev) => (
                <span
                  key={ev.id}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    ev.color === "default" && "bg-primary",
                    ev.color === "secondary" && "bg-secondary-foreground",
                    ev.color === "destructive" && "bg-destructive",
                    ev.color === "outline" && "bg-muted-foreground"
                  )}
                />
              ))}
              {dayEvents.length > 3 && <span className="text-[10px] opacity-60">+{dayEvents.length - 3}</span>}
            </div>
          )}
        </div>
      )
    },
    [events, selectedDate, today]
  )

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <div className="mx-auto max-w-8xl p-2 sm:p-4">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-primary/10">
              <CalendarIcon className="size-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold leading-tight sm:text-2xl">Upcoming Activities</h1>
              <p className="text-sm text-muted-foreground">Plan, track, and manage your events.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-2xl">
                  <Plus className="mr-2 size-4" /> Add event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add event</DialogTitle>
                </DialogHeader>
                <form onSubmit={addEvent} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="e.g. Team sync" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  </div>
                  <div className="grid gap-2 sm:grid-cols-3 sm:gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="date">Date</Label>
                      <Input id="date" type="date" value={form.date || ""} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="time">Time</Label>
                      <Input id="time" type="time" value={form.time || ""} onChange={(e) => setForm({ ...form, time: e.target.value })} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="tag">Tag</Label>
                      <Input id="tag" placeholder="Work / Personal" value={form.tag || ""} onChange={(e) => setForm({ ...form, tag: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="Where is it?" value={form.location || ""} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Details, links, notes…" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Color</Label>
                    <div className="flex items-center gap-2">
                      {(["default", "secondary", "outline", "destructive"] as const).map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setForm({ ...form, color: v })}
                          className={cn(
                            "size-8 rounded-full border",
                            v === "default" && "bg-primary",
                            v === "secondary" && "bg-secondary-foreground",
                            v === "outline" && "bg-muted-foreground",
                            v === "destructive" && "bg-destructive",
                            form.color === v && "ring-2 ring-offset-2"
                          )}
                          aria-label={v}
                          title={v}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-2xl">
                      Cancel
                    </Button>
                    <Button type="submit" className="rounded-2xl">
                      Save event
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="grid gap-16 lg:grid-cols-3">
          {/* Calendar card */}
          <Card className="rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">
                  {format(month, "MMMM yyyy")}
                </CardTitle>
                <CardDescription>Click a date to view or add events.</CardDescription>
              </div>
              <div>
                <Button variant="outline" className="rounded-2xl" onClick={() => setMonth(today)}>
                  This Month
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-2xl border p-2 sm:p-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) => d && setSelectedDate(d)}
                  month={month}
                  onMonthChange={setMonth}
                  components={{ DayContent }}
                  className="rounded-xl"
                />
              </div>
            </CardContent>
          </Card>
          {/* Events list */}
          <Card className="rounded-2xl col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="size-4" /> {format(selectedDate, "EEEE, MMM d")}
              </CardTitle>
              <CardDescription>Events on this day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between pb-2">
                <div className="text-sm text-muted-foreground">
                  {eventsOnSelected.length} event{eventsOnSelected.length === 1 ? "" : "s"}
                </div>
                <Button size="sm" className="rounded-xl" onClick={() => setOpen(true)}>
                  <Plus className="mr-2 size-4" /> Add
                </Button>
              </div>
              <Separator />
              <ScrollArea className="mt-3 h-[360px] pr-2">
                {eventsOnSelected.length === 0 && (
                  <p className="py-12 text-center text-sm text-muted-foreground">No events yet. Add one!</p>
                )}
                <ul className="space-y-3">
                  {eventsOnSelected.map((ev) => (
                    <motion.li
                      key={ev.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group flex items-start gap-4 rounded-xl border p-3"
                    >
                      <div
                        className={cn(
                          "mt-1 size-2.5 shrink-0 rounded-full",
                          ev.color === "default" && "bg-primary",
                          ev.color === "secondary" && "bg-secondary-foreground",
                          ev.color === "destructive" && "bg-destructive",
                          ev.color === "outline" && "bg-muted-foreground"
                        )}
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium leading-tight">{ev.title}</p>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              {ev.time && (
                                <span className="inline-flex items-center gap-1">
                                  <Clock className="size-3" /> {ev.time}
                                </span>
                              )}
                              {ev.location && (
                                <span className="inline-flex items-center gap-1">
                                  <MapPin className="size-3" /> {ev.location}
                                </span>
                              )}
                              {ev.tag && (
                                <span className="inline-flex items-center gap-1">
                                  <TagIcon className="size-3" /> {ev.tag}
                                </span>
                              )}
                            </div>
                            <div className="py-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm">
                                    Details
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                                        <DialogDescription>
                                            This action cannot be undone. This will permanently delete your account
                                            and remove your data from our servers.
                                        </DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost" className="rounded-xl opacity-70 hover:opacity-100">
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => deleteEvent(ev.id)} className="text-destructive">
                                <Trash2 className="mr-2 size-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        {ev.description && (
                          <p className="line-clamp-3 text-xs text-muted-foreground">{ev.description}</p>
                        )}
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
