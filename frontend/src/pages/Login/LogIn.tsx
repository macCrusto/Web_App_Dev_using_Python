import { LoginForm } from "./login-form"
import { useLogin } from "./useLogin"
import logo from '@/src/assets/logo.svg'

export default function LogInPage() {
  const { handleSubmit, error, isLoading } = useLogin()

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center dark:bg-zinc-950">
      <div className="w-full max-w-md flex flex-col items-center justify-center gap-4 scale-85">
        <a href="#" className="flex items-center justify-center gap-2 font-semibold text-zinc-900 dark:text-zinc-50">
          <img src={logo} className="size-8" />
          Petur
        </a>
        <LoginForm 
          className="w-sm" 
          onSubmit={handleSubmit}
          error={error}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}