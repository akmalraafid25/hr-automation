export const dynamic = "force-dynamic";

import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="bg-cover bg-[url(https://images.unsplash.com/photo-1756806983725-977bb2308d4e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
}
