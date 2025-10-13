"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, LogOut, FileText, Briefcase } from "lucide-react"

export function ApplicantNavbar() {
  const [user, setUser] = useState<{name?: string, email?: string, username?: string}>({});

  useEffect(() => {
    fetch('/api/Account/me')
      .then(res => res.json())
      .then(data => {
        if (data.ok && data.data) {
          setUser({
            name: data.data.NAME,
            email: data.data.EMAIL,
            username: data.data.USERNAME
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" })
    window.location.href = "/login"
  }

  const getInitials = (username?: string) => {
    return username ? username[0].toUpperCase() : 'U';
  };
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <a href="/jobs">
              <Image
                src="/softwareone-logo-blk.svg"
                width={100}
                height={40}
                alt="Company Logo"
              />
            </a>
            <div className="hidden md:flex space-x-6">
              <Link href="/jobs" className="flex items-center space-x-2 text-sm font-medium hover:text-primary">
                <span>Jobs</span>
              </Link>
              <Link href="/my-applications" className="flex items-center space-x-2 text-sm font-medium hover:text-primary">
                <span>My Applications</span>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
                    <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}