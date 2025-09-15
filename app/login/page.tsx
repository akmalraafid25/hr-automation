import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="bg-[url(https://www.softwareone.com/_next/image?url=%2F-%2Fmedia%2Fimages%2Fdata-centric%2Fabstract-waves-getty-1255349939-cta-banner.jpg%3Fh%3D570%26iar%3D0%26w%3D1920%26hash%3D837039C4DEE8E365C64A6436AD1BD118&w=1920&q=90)] bg-cover flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm/>
      </div>
    </div>
  )
}
