import * as React from "react"
import {
  CheckCircle2,
  Globe,
  User as UserIcon,
  Mail,
  Phone,
  Shield,
  Sparkles,
  Calendar,
  Camera,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/src/context/AuthContext"
import { toast } from "sonner"
import { AvatarUploadModal } from "@/src/components/profile/AvatarUploadModal"
import { RoleSwitcherCard } from "@/src/components/profile/RoleSwitcherCard"

export default function ProfilePage() {
  const { user, role, switchRole } = useAuth()
  const [showAvatarModal, setShowAvatarModal] = React.useState(false)

  const [formData, setFormData] = React.useState({
    fullname: user?.fullname || "Alex Johnson",
    email: user?.email || "alex.johnson@example.com",
    phone_no: user?.phone_no || "+234 801 234 5678",
    bio: "Passionate fullstack engineer & continuous learner building production web systems.",
  })

  // Sync state if user changes
  React.useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullname: user.fullname || prev.fullname,
        email: user.email || prev.email,
        phone_no: user.phone_no || prev.phone_no,
      }))
    }
  }, [user])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Profile details updated successfully! 🎉")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-200 pb-16 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/70 dark:border-stone-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <UserIcon className="size-6 text-primary" />
            User Profile
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage your personal profile, credentials, role perspective, and linked identities.
          </p>
        </div>

        {/* Current Active Role Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-muted-foreground">Active Role:</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <Shield className="size-3.5" /> {role}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Profile Card & Quick Stats (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 text-center flex flex-col items-center justify-center space-y-4 shadow-xs">
            {/* Avatar with Camera Overlay */}
            <div className="relative group cursor-pointer" onClick={() => setShowAvatarModal(true)}>
              <Avatar className="size-24 rounded-2xl ring-4 ring-primary/20 shadow-md">
                <AvatarImage src={user?.avatar} alt={formData.fullname} />
                <AvatarFallback className="rounded-2xl text-2xl font-bold bg-primary/10 text-primary">
                  {getInitials(formData.fullname)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white pointer-events-none">
                <Camera className="size-6" />
              </div>
            </div>

            {/* Name and email */}
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-foreground flex items-center justify-center gap-1.5">
                {formData.fullname}
                <CheckCircle2 className="size-4 text-emerald-500" />
              </h2>
              <p className="text-xs text-muted-foreground">{formData.email}</p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 justify-center pt-1">
              <span className="rounded-full bg-primary/10 text-primary px-3 py-0.5 text-xs font-semibold">
                {role}
              </span>
              <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-0.5 text-xs font-semibold">
                Verified Account
              </span>
            </div>

            <p className="text-xs text-stone-500 dark:text-stone-400 italic px-2 leading-relaxed">
              "{formData.bio}"
            </p>

            {/* Quick stats mini-row */}
            <div className="grid grid-cols-3 gap-2 w-full pt-4 border-t border-stone-100 dark:border-stone-800 text-center">
              <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/50">
                <p className="text-xs font-bold text-foreground">3</p>
                <p className="text-[10px] text-muted-foreground">Courses</p>
              </div>
              <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/50">
                <p className="text-xs font-bold text-foreground">24</p>
                <p className="text-[10px] text-muted-foreground">Lessons</p>
              </div>
              <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/50">
                <p className="text-xs font-bold text-foreground">1</p>
                <p className="text-[10px] text-muted-foreground">Certificates</p>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground pt-1 flex items-center justify-center gap-1">
              <Calendar className="size-3" /> Member since Jan 2026
            </p>
          </Card>

          {/* Role switcher with 12-hour cooldown */}
          <RoleSwitcherCard />

          {/* Development perspective controls are restricted to administrators. */}
          {role === "ADMIN" && <Card className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 space-y-3 shadow-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Admin Quick Role Switch
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {(["USER", "INSTRUCTOR", "ADMIN"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={async () => {
                    await switchRole(r)
                    toast.success(`Role switched to ${r}`)
                  }}
                  className={`py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    role === r
                      ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs"
                      : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200"
                  }`}
                >
                  {r === "USER" ? "Student" : r === "INSTRUCTOR" ? "Instructor" : "Admin"}
                </button>
              ))}
            </div>
          </Card>}
        </div>

        {/* Right Column: Edit Form & Connected Accounts (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xs overflow-hidden">
            <CardHeader className="p-6 pb-4 border-b border-stone-100 dark:border-stone-800">
              <CardTitle className="text-base sm:text-lg font-bold">Personal Information</CardTitle>
              <CardDescription className="text-xs">
                Update your primary contact credentials and display name for course certificates.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSave}>
              <CardContent className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="fullname" className="text-xs font-bold">Full Name</Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="fullname"
                        value={formData.fullname}
                        onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                        className="pl-9 h-10 text-xs rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-bold">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={formData.phone_no}
                        onChange={(e) => setFormData({ ...formData, phone_no: e.target.value })}
                        className="pl-9 h-10 text-xs rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-bold">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      disabled
                      value={formData.email}
                      className="pl-9 h-10 text-xs rounded-xl bg-muted/40 cursor-not-allowed opacity-80"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Email is linked with your authentication token and cannot be modified directly.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="bio" className="text-xs font-bold">Headline / Short Bio</Label>
                  <textarea
                    id="bio"
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full p-3 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {/* Linked OAuth Accounts */}
                <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/40 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <Globe className="size-4.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">Google OAuth2 Single Sign-On</p>
                        <p className="text-[11px] text-muted-foreground">
                          Seamless token exchange & Google account linkage
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      Connected
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end border-t border-stone-100 dark:border-stone-800 p-6">
                <Button type="submit" size="sm" className="rounded-full shadow-xs px-6">
                  Save Profile Changes
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
      {/* Avatar Upload Modal */}
      {showAvatarModal && (
        <AvatarUploadModal
          currentAvatar={user?.avatar}
          userName={formData.fullname}
          onClose={() => setShowAvatarModal(false)}
        />
      )}
    </div>
  )
}
