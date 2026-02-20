import { LoginForm } from "@/components/loginForm"

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 text-lg">
        <b>
          TalentSYNC - Recruitment Solutions
        </b>
        <LoginForm />
      </div>
    </div>
  )
}
