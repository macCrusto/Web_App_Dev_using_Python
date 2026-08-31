import { Outlet, useLocation } from "react-router-dom"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Search, ChevronRight } from "lucide-react"

const pathTitles: Record<string, { title: string; category: string }> = {
  "/dashboard": { title: "Dashboard Overview", category: "Learning" },
  "/courses": { title: "Course Catalog", category: "Explore" },
  "/my-courses": { title: "My Enrolled Courses", category: "Learning" },
  "/instructor/courses": { title: "Course Studio", category: "Teaching" },
  "/instructor/courses/new": { title: "Create Course", category: "Teaching" },
  "/instructor/analytics": { title: "Analytics & Revenue", category: "Teaching" },
  "/payments": { title: "Payments & Invoices", category: "Billing" },
  "/admin/students": { title: "Student Management", category: "Admin" },
  "/admin/audit": { title: "Governance & Security", category: "Admin" },
  "/profile": { title: "User Profile", category: "Account" },
  "/settings": { title: "Account & Security Settings", category: "Account" },
  "/help": { title: "Help & FAQ", category: "Support" },
}

export function DashboardLayout() {
  const location = useLocation()
  const currentInfo = pathTitles[location.pathname] || {
    title: "Platform Console",
    category: "App",
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="flex flex-col min-h-screen bg-background">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border/70 bg-background/80 px-4 sm:px-6 backdrop-blur-md transition-all">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-1 h-5 bg-border/60" />
            
            {/* Breadcrumb Info */}
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="hidden sm:inline font-medium text-muted-foreground/70">
                {currentInfo.category}
              </span>
              <ChevronRight className="hidden sm:inline size-3.5 text-muted-foreground/50" />
              <span className="font-semibold text-foreground text-sm tracking-tight">
                {currentInfo.title}
              </span>
            </nav>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Search */}
            <div className="relative hidden md:block w-56 lg:w-72">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search courses, lessons, topics..."
                className="h-9 pl-9 pr-3 rounded-lg text-xs bg-muted/40 focus:bg-background border-border/80"
              />
            </div>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative size-9 rounded-lg text-muted-foreground hover:text-foreground"
              aria-label="Notifications"
            >
              <Bell className="size-4" />
              <span className="absolute top-2 right-2 size-2 rounded-full bg-primary" />
            </Button>

            {/* Dark / Light Mode Switcher */}
            <ModeToggle />
          </div>
        </header>

        {/* Page Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout
