"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { useEffect } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';
import SnowflakeTable from "@/components/snowflake-jobpost";

export default function ChatbotPage() {
  useEffect(() => {
		createChat({
			webhookUrl: 'https://hr-automationsone.app.n8n.cloud/webhook/a7fd14ea-2802-42e7-9115-53e211b7263e/chat',
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
              <div className="container mx-auto p-6 space-y-6">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-balance">Posts</h2>
                </div>
                <div className="">
                    <SnowflakeTable/>
                </div>
              </div>
            </main>
          </div>
        </div>
  )
}