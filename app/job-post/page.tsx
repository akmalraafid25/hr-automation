"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { useEffect } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

export default function ChatbotPage() {
  useEffect(() => {
		createChat({
			webhookUrl: 'https://hr-automationsone.app.n8n.cloud/webhook/4cbd001a-f192-4867-b9e9-79f3742b7420/chat',
      initialMessages:['👋 Hello! I’m Hira', 'I’m here to help you craft clear, professional, and engaging job postings that attract the right candidates. Just tell me the role you’re hiring for, along with any key details (skills, experience, location, etc.), and I’ll generate a tailored job post for you'
      ],
		});
	}, []);
  return (
    <div className="flex h-screen bg-white">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 p-6"></main>
      </div>
    </div>
  )
}