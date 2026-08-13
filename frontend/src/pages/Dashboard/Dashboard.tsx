import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("access_expiry")
    localStorage.removeItem("refresh_expiry")
    navigate("/")
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center dark:bg-zinc-950">
      <div className="w-full max-w-md flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Dashboard</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Welcome to your dashboard!</p>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </div>
  )
}
