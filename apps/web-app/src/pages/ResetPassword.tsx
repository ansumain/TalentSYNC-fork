import { GalleryVerticalEnd } from "lucide-react"
import { ResetPassword } from "@/components/resetPassword"
import { AUTH } from "@/constants/auth"

export default function ResetPasswordPage() {
  return (
    <div className="bg-red flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          {AUTH.RESET_PASSWORD.HEADING}
        </a>
        <ResetPassword />
      </div>
    </div>
  )
}
