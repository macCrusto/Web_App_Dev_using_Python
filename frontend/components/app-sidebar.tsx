import * as React from "react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import {
  LayoutDashboard,
  Compass,
  GraduationCap,
  FolderPlus,
  Layers,
  BarChart3,
  CreditCard,
  Users,
  ShieldCheck,
  User,
  Settings,
  LogOut,
  ChevronsUpDown,
  HelpCircle,
  CheckCircle2,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import logo from '@/src/assets/logo.svg'

export interface NavItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  description?: string
  roles?: ("USER" | "INSTRUCTOR" | "ADMIN")[]
}

export interface NavSection {
  label: string
  items: NavItem[]
  roles?: ("USER" | "INSTRUCTOR" | "ADMIN")[]
}

// Navigation structure matching database schema & roles
export const sidebarNavigation: NavSection[] = [
  {
    label: "Main Learning",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        description: "Overview & learning streak",
      },
      {
        title: "Explore Courses",
        url: "/courses",
        icon: Compass,
        badge: "New",
        description: "Browse published course catalog",
      },
      {
        title: "My Enrolled Courses",
        url: "/my-courses",
        icon: GraduationCap,
        badge: "3 active",
        description: "Active courses and preview lessons",
      },
    ],
  },
  {
    label: "Instructor Studio",
    roles: ["INSTRUCTOR", "ADMIN"],
    items: [
      {
        title: "Course Management",
        url: "/instructor/courses",
        icon: Layers,
        badge: "Drafts",
        description: "Manage courses, modules & lessons",
      },
      {
        title: "Create New Course",
        url: "/instructor/courses/new",
        icon: FolderPlus,
        description: "Publish course with price & preview count",
      },
      {
        title: "Analytics & Revenue",
        url: "/instructor/analytics",
        icon: BarChart3,
        description: "Enrollment metrics & sales breakdown",
      },
    ],
  },
  {
    label: "Billing & Administration",
    items: [
      {
        title: "Payments & Invoices",
        url: "/payments",
        icon: CreditCard,
        description: "Paystack / Flutterwave transaction records",
      },
      {
        title: "Student Enrollments",
        url: "/admin/students",
        icon: Users,
        roles: ["ADMIN"],
        description: "User progress & course access records",
      },
      {
        title: "Admin Governance",
        url: "/admin/audit",
        icon: ShieldCheck,
        roles: ["ADMIN"],
        description: "User roles, OAuth links & security",
      },
    ],
  },
  {
    label: "Account & Support",
    items: [
      {
        title: "My Profile",
        url: "/profile",
        icon: User,
        description: "Personal details & linked OAuth account",
      },
      {
        title: "Account Settings",
        url: "/settings",
        icon: Settings,
        description: "Security, password & preferences",
      },
      {
        title: "Help & Docs",
        url: "/help",
        icon: HelpCircle,
        description: "Platform guides and FAQ",
      },
    ],
  },
]

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  // Mocked/stored authenticated user data (can be fed from auth state/JWT)
  const [currentUser] = React.useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    role: "INSTRUCTOR" as "USER" | "INSTRUCTOR" | "ADMIN",
    avatar: "",
    isVerified: true,
  })

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("access_expiry")
    localStorage.removeItem("refresh_expiry")
    navigate("/login")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border/80 bg-sidebar">
      {/* Brand Header */}
      <SidebarHeader className="border-b border-sidebar-border/60 pb-3">
        <div className="flex items-center gap-3 px-1 py-1">
          <img src={logo} className='size-8' />
          <div className="flex flex-col truncate leading-tight group-data-[collapsible=icon]:hidden">
            <span className="font-bold tracking-tight text-foreground flex items-center gap-1.5 text-sm">
              Petur
              <span className="inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                v2.0
              </span>
            </span>
            <span className="text-[11px] text-muted-foreground truncate">
              Modern Learning Management
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* Main Nav Content */}
      <SidebarContent className="gap-4 py-3">
        {sidebarNavigation.map((section) => {
          // Filter section if role-restricted
          if (
            section.roles &&
            !section.roles.includes(currentUser.role) &&
            currentUser.role !== "ADMIN"
          ) {
            return null
          }

          return (
            <SidebarGroup key={section.label} className="py-0">
              <SidebarGroupLabel className="text-[11px] tracking-wider text-muted-foreground/80 font-semibold px-2">
                {section.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => {
                    // Check item-level role restriction
                    if (
                      item.roles &&
                      !item.roles.includes(currentUser.role) &&
                      currentUser.role !== "ADMIN"
                    ) {
                      return null
                    }

                    const isActive =
                      location.pathname === item.url ||
                      (item.url !== "/dashboard" && location.pathname.startsWith(item.url))

                    const Icon = item.icon

                    return (
                      <SidebarMenuItem key={item.url}>
                        <SidebarMenuButton
                          render={<Link to={item.url} className="flex items-center gap-2.5" />}
                          isActive={isActive}
                          tooltip={item.title}
                          className={`transition-all duration-150 ${
                            isActive
                              ? "bg-primary/10 text-primary font-medium dark:bg-primary/20"
                              : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-foreground"
                          }`}
                        >
                          <Icon className={`size-4 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                          <span className="truncate">{item.title}</span>
                          {item.badge && (
                            <SidebarMenuBadge className={isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}>
                              {item.badge}
                            </SidebarMenuBadge>
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )
        })}
      </SidebarContent>

      <SidebarSeparator className="my-1 bg-sidebar-border/60" />

      {/* User Footer Profile */}
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground rounded-xl border border-transparent hover:border-sidebar-border transition-all"
                  >
                    <Avatar className="size-8 rounded-lg">
                      <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                      <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-semibold text-xs">
                        {getInitials(currentUser.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-xs leading-tight group-data-[collapsible=icon]:hidden">
                      <div className="flex items-center gap-1">
                        <span className="truncate font-semibold text-foreground">
                          {currentUser.name}
                        </span>
                        {currentUser.isVerified && (
                          <CheckCircle2 className="size-3 text-emerald-500 shrink-0" />
                        )}
                      </div>
                      <span className="truncate text-[11px] text-muted-foreground">
                        {currentUser.email}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4 shrink-0 text-muted-foreground group-data-[collapsible=icon]:hidden" />
                  </SidebarMenuButton>
                }
              />
              <DropdownMenuContent
                className="w-60 rounded-xl p-1.5 shadow-xl border border-border"
                side="right"
                align="end"
                sideOffset={8}
              >
                <DropdownMenuLabel className="p-2 font-normal">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="size-9 rounded-lg">
                      <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                      <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold text-xs">
                        {getInitials(currentUser.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-0.5 leading-none overflow-hidden">
                      <p className="font-semibold text-sm text-foreground truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {currentUser.email}
                      </p>
                      <span className="mt-1 inline-flex items-center w-fit rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary capitalize">
                        {currentUser.role.toLowerCase()}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => navigate("/profile")}
                    className="cursor-pointer gap-2 py-2"
                  >
                    <User className="size-4 text-muted-foreground" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/settings")}
                    className="cursor-pointer gap-2 py-2"
                  >
                    <Settings className="size-4 text-muted-foreground" />
                    <span>Account Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/payments")}
                    className="cursor-pointer gap-2 py-2"
                  >
                    <CreditCard className="size-4 text-muted-foreground" />
                    <span>Billing & Payments</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  variant="destructive"
                  className="cursor-pointer gap-2 py-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <LogOut className="size-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
