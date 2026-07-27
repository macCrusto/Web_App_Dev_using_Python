import { SignupForm } from "@/components/signup-form"

export default function SignupPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center dark:bg-zinc-950">
      <div className="w-full max-w-md flex flex-col items-center justify-center gap-4 scale-85">
        <a href="#" className="flex items-center justify-center gap-2 font-semibold text-zinc-900 dark:text-zinc-50">
          <img src="src/assets/logo.svg" className="size-8" />
          Petur
        </a>
        <SignupForm className="w-sm" />
      </div>
    </div>
  )
}
