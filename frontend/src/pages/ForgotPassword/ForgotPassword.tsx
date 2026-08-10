import { ForgotPasswordForm } from "./forgot-password-form"
import { useForgotPassword } from "./useForgotPassword"
import logo from '@/src/assets/logo.svg'

export default function ForgotPasswordPage() {
  const { handleSubmit, error, isLoading } = useForgotPassword()

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center dark:bg-zinc-950">
      <div className="w-full max-w-md flex flex-col items-center justify-center gap-4 scale-85">
        <a href="#" className="flex items-center justify-center gap-2 font-semibold text-zinc-900 dark:text-zinc-50">
          <img src={logo} className="size-8" />
          Petur
        </a>
        <ForgotPasswordForm 
          className="w-sm" 
          onSubmit={handleSubmit}
          error={error}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
