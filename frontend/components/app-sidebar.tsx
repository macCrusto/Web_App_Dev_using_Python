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
  Sparkles,
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
import logo from '@/src/assets/logo.png'
import { useAuth } from '@/src/context/AuthContext'
import type { UserRole } from '@/src/types'

export interface NavItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  description?: string
}

export interface NavSection {
  label: string
  items: NavItem[]
}

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, role, logout, switchRole } = useAuth()

  const currentUser = {
    name: user?.fullname || "Alex Johnson",
    email: user?.email || "alex.johnson@example.com",
    role: role,
    avatar: user?.avatar || "",
    isVerified: user?.is_verified ?? true,
  }

  // Define strictly role-segmented navigation structures
  const getNavigationForRole = (currentRole: UserRole): NavSection[] => {
    switch (currentRole) {
      case "USER":
        return [
          {
            label: "Student Learning",
            items: [
              {
                title: "Dashboard",
                url: "/dashboard",
                icon: LayoutDashboard,
                description: "Learning streak & resume lesson",
              },
              {
                title: "Explore Courses",
                url: "/courses",
                icon: Compass,
                badge: "Catalog",
                description: "Browse published course library",
              },
              {
                title: "My Enrolled Courses",
                url: "/my-courses",
                icon: GraduationCap,
                badge: "3 active",
                description: "Active lessons and preview access",
              },
            ],
          },
          {
            label: "Billing",
            items: [
              {
                title: "Payments & Receipts",
                url: "/payments",
                icon: CreditCard,
                description: "Paystack invoices & transaction receipts",
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
                description: "Personal details & certificates",
              },
              {
                title: "Settings",
                url: "/settings",
                icon: Settings,
                description: "Password & preferences",
              },
              {
                title: "Help & FAQ",
                url: "/help",
                icon: HelpCircle,
                description: "Student support guides",
              },
            ],
          },
        ]

      case "INSTRUCTOR":
        return [
          {
            label: "Instructor Studio",
            items: [
              {
                title: "Instructor Dashboard",
                url: "/dashboard",
                icon: LayoutDashboard,
                description: "Teaching KPIs & enrollment metrics",
              },
              {
                title: "Course Studio",
                url: "/instructor/courses",
                icon: Layers,
                badge: "Curriculum",
                description: "Manage courses, modules & lessons",
              },
              {
                title: "Create New Course",
                url: "/instructor/courses/new",
                icon: FolderPlus,
                description: "Publish course with price & free count",
              },
              {
                title: "Analytics & Revenue",
                url: "/instructor/analytics",
                icon: BarChart3,
                description: "Sales breakdown & student retention",
              },
            ],
          },
          {
            label: "Explore & Community",
            items: [
              {
                title: "Public Course Catalog",
                url: "/courses",
                icon: Compass,
                description: "Browse platform course offerings",
              },
            ],
          },
          {
            label: "Account & Support",
            items: [
              {
                title: "Instructor Profile",
                url: "/profile",
                icon: User,
                description: "Public bio & credentials",
              },
              {
                title: "Settings",
                url: "/settings",
                icon: Settings,
                description: "Security & notification preferences",
              },
              {
                title: "Help & Docs",
                url: "/help",
                icon: HelpCircle,
                description: "Instructor authoring documentation",
              },
            ],
          },
        ]

      case "ADMIN":
        return [
          {
            label: "Platform Administration",
            items: [
              {
                title: "Admin Dashboard",
                url: "/dashboard",
                icon: LayoutDashboard,
                description: "System health & financial volume",
              },
              {
                title: "Student Management",
                url: "/admin/students",
                icon: Users,
                badge: "2.8k users",
                description: "User progress & verification records",
              },
              {
                title: "Security & Governance",
                url: "/admin/audit",
                icon: ShieldCheck,
                description: "OAuth audit logs & session security",
              },
            ],
          },
          {
            label: "Platform Catalog & Billing",
            items: [
              {
                title: "Course Management",
                url: "/courses",
                icon: Layers,
                description: "Review & moderate platform courses",
              },
              {
                title: "All Transactions",
                url: "/payments",
                icon: CreditCard,
                description: "Gateway payment settlements",
              },
            ],
          },
          {
            label: "Account & System",
            items: [
              {
                title: "Admin Profile",
                url: "/profile",
                icon: User,
                description: "Executive account details",
              },
              {
                title: "System Settings",
                url: "/settings",
                icon: Settings,
                description: "Global security parameters",
              },
            ],
          },
        ]

      default:
        return []
    }
  }

  const navSections = getNavigationForRole(currentUser.role)

  const handleLogout = () => {
    logout()
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
          <img src={logo} className='size-8' alt="Platform Logo" />
          <div className="flex flex-col truncate leading-tight group-data-[collapsible=icon]:hidden">
            <span className="font-bold tracking-tight text-foreground flex items-center gap-1.5 text-sm">
              Axli
              <span className="inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary capitalize">
                {currentUser.role.toLowerCase()}
              </span>
            </span>
            <span className="text-[11px] text-muted-foreground truncate">
              {currentUser.role === 'INSTRUCTOR' ? 'Authoring Console' : currentUser.role === 'ADMIN' ? 'Executive Console' : 'Learning Portal'}
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* Main Nav Content strictly filtered by Role */}
      <SidebarContent className="gap-4 py-3">
        {navSections.map((section) => (
          <SidebarGroup key={section.label} className="py-0">
            <SidebarGroupLabel className="text-[11px] tracking-wider text-muted-foreground/80 font-semibold px-2">
              {section.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
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
        ))}
      </SidebarContent>

      <SidebarSeparator className="my-1 bg-sidebar-border/60" />

      {/* User Footer Profile & Role Switcher */}
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
                className="w-64 rounded-xl p-1.5 shadow-xl border border-border"
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
                      <div className="flex items-center gap-1 mt-1">
                        <span className="inline-flex items-center rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary uppercase">
                          {currentUser.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {/* Quick Role Switcher Submenu */}
                <div className="p-1.5 text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                  <Sparkles className="size-3 text-primary" /> Switch Role Perspective:
                </div>
                <div className="grid grid-cols-3 gap-1 px-1 pb-1">
                  <button
                    type="button"
                    onClick={() => switchRole("USER")}
                    className={`px-1.5 py-1 text-[10px] rounded-md font-semibold transition-all ${
                      currentUser.role === "USER"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => switchRole("INSTRUCTOR")}
                    className={`px-1.5 py-1 text-[10px] rounded-md font-semibold transition-all ${
                      currentUser.role === "INSTRUCTOR"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Instructor
                  </button>
                  <button
                    type="button"
                    onClick={() => switchRole("ADMIN")}
                    className={`px-1.5 py-1 text-[10px] rounded-md font-semibold transition-all ${
                      currentUser.role === "ADMIN"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Admin
                  </button>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => navigate("/profile")}
                    className="cursor-pointer gap-2 py-2 text-xs"
                  >
                    <User className="size-4 text-muted-foreground" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/settings")}
                    className="cursor-pointer gap-2 py-2 text-xs"
                  >
                    <Settings className="size-4 text-muted-foreground" />
                    <span>Account Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/payments")}
                    className="cursor-pointer gap-2 py-2 text-xs"
                  >
                    <CreditCard className="size-4 text-muted-foreground" />
                    <span>Billing & Payments</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer gap-2 py-2 text-xs text-destructive focus:bg-destructive/10 focus:text-destructive"
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

export default AppSidebar
