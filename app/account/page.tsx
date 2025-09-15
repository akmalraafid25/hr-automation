import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import SnowflakeAccount from "@/components/snowflake-account";

export default function AccountPage() {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1">
        <DashboardHeader/>
        <div className="p-8">
          <SnowflakeAccount/>
        </div>
      </main>
    </div>
  );
}