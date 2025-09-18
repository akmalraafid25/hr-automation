export const dynamic = "force-dynamic";

import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className=" bg-cover flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
}
