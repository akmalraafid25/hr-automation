"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Briefcase,
  LineChart,
  User,
  LogOut,
  FileText,
  Home,
  Settings,
  Users,
  TrendingUp,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Bot,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"


const sidebarItems = [
  { icon: Home, label: "Home", href: "/dashboard", active: true },
  { icon: Users, label: "Application", href: "/application" },
  { icon: TrendingUp, label: "Sales", href: "/sales" },
  { icon: FileText, label: "Job Post", href: "/job-post" },
  { icon: User, label: "Account", href: "/account" },
  { icon: Calendar, label: "Calendly", href: "https://calendly.com/app/scheduling/meeting_types/user/me" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "relative flex flex-col border-r bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-42",
      )}
    >
      <div className="flex h-16 items-center justify-center border-b">
        {!collapsed && 
          <div className="px-8">
            <a href="/">
              <Image
                src="/softwareone-logo-blk.svg"
                width={60}
                height={40}
                alt="Company Logo"
              />
            </a>
          </div>}
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 space-y-2 p-2">
        {sidebarItems.map((item) => (
          <Link key={item.label} href={item.href}>
            <Button
              variant={pathname === item.href ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3",
                collapsed && "justify-center",
                pathname === item.href && "bg-gray-400/20 text-gray-900 hover:bg-gray-400/20 text-black",
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="text-xs">{item.label}</span>}
            </Button>
          </Link>
        ))}
      </nav>
    </div>
  )
}