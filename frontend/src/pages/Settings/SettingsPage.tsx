import * as React from "react"
import { Lock, Shield, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function SettingsPage() {
  const [passwords, setPasswords] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match!")
      return
    }
    toast.success("Password updated successfully!")
    setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" })
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Account & Security Settings</h1>
        <p className="text-sm text-muted-foreground">
          Update security credentials, manage password change records, and session cookies.
        </p>
      </div>

      {/* Security & Password */}
      <Card className="border-border/70">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="size-4 text-primary" />
            <CardTitle className="text-base font-semibold">Change Password</CardTitle>
          </div>
          <CardDescription>
            Enforce strong passwords for course creation and administrative privileges.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handlePasswordChange}>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="current">Current Password</Label>
              <Input
                id="current"
                type="password"
                required
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="new">New Password</Label>
                <Input
                  id="new"
                  type="password"
                  required
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm">Confirm New Password</Label>
                <Input
                  id="confirm"
                  type="password"
                  required
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center border-t border-border/40 pt-4">
            <span className="text-[11px] text-muted-foreground">
              Last changed: 14 July 2026
            </span>
            <Button type="submit" size="sm">
              Update Password
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Verification & Two-Factor Notice */}
      <Card className="border-border/70">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-primary" />
            <CardTitle className="text-base font-semibold">Security Safeguards</CardTitle>
          </div>
          <CardDescription>Email verification and session state</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/20">
            <div>
              <p className="text-xs font-semibold text-foreground">Email Verification Status</p>
              <p className="text-[11px] text-muted-foreground">Your account email is verified via Brevo Mailer</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-3" /> Active
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
