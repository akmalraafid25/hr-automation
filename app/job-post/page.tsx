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
			webhookUrl: 'https://hr-automation.duckdns.org/webhook/a7fd14ea-2802-42e7-9115-53e211b7263e/chat',
      initialMessages:['👋 Hello! I’m Hira', 'I’m here to help you craft clear, professional, and engaging job postings that attract the right candidates. Just tell me the role you’re hiring for, along with any key details (skills, experience, location, etc.), and I’ll generate a tailored job post for you'
      ],
		});
		
		return () => {
			const chatContainer = document.querySelector('#n8n-chat');
			if (chatContainer) {
				chatContainer.remove();
			}
		};
	}, []);
  return (
    <div className="flex h-screen bg-background">
          <DashboardSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <DashboardHeader pageName="Job Posts" />
            <main className="flex-1 overflow-y-auto">
              <div className="container mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
                <DashboardStats />
                <SnowflakeTable/>
                <HiringPipeline />
                <DashboardTable />
              </div>
            </main>
          </div>
        </div>
  )
}