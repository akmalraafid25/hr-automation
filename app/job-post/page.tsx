"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardStats } from "@/components/dashboard-stats"

import { DashboardTable } from "@/components/dashboard-table"
import { RecentJobPosts } from "@/components/recent-job-posts"
import { HiringPipeline } from "@/components/hiring-pipeline"
import { useEffect } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';
import SnowflakeTable from "@/components/snowflake-jobpost";

export default function ChatbotPage() {
  useEffect(() => {
		createChat({
			webhookUrl: 'https://hr-automationv2sone.app.n8n.cloud/webhook/a7fd14ea-2802-42e7-9115-53e211b7263e/chat',
      initialMessages:['👋 Hello! I’m Hira', 'I’m here to help you craft clear, professional, and engaging job postings that attract the right candidates. Just tell me the role you’re hiring for, along with any key details (skills, experience, location, etc.), and I’ll generate a tailored job post for you'
      ],
		});
	}, []);
  return (
    <div className="flex h-screen bg-background">
          <DashboardSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <DashboardHeader />
            <main className="flex-1 overflow-y-auto">
              <div className="container mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
                <div>
                  <h2 className="text-xl md:text-3xl font-bold tracking-tight text-balance">Job Post Dashboard</h2>
                  <p className="text-sm md:text-base text-muted-foreground">Manage job postings and track recruitment metrics</p>
                </div>
                <DashboardStats />
                <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
                  <RecentJobPosts />
                  <HiringPipeline />
                </div>
                <SnowflakeTable/>
                <DashboardTable />
              </div>
            </main>
          </div>
        </div>
  )
}