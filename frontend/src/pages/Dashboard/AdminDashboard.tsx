import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  Layers,
  Sparkles,
  DollarSign,
  UserCheck,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/src/context/AuthContext';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const platformKpis = [
    {
      title: 'Total Platform Users',
      value: '2,840',
      description: '2,420 Students · 420 Instructors',
      icon: Users,
      trend: '+124 this week',
    },
    {
      title: 'Platform Volume (GMV)',
      value: '₦98,400,000',
      description: 'Paystack & Flutterwave combined',
      icon: DollarSign,
      trend: '+24.5% overall growth',
    },
    {
      title: 'Active Courses Catalog',
      value: '42 Courses',
      description: '38 Published · 4 Drafts',
      icon: Layers,
      trend: '100% database verified',
    },
    {
      title: 'Security & Auth Health',
      value: '99.9%',
      description: 'OAuth2 & JWT Token rotation active',
      icon: ShieldCheck,
      trend: 'Zero security breaches',
    },
  ];

  const recentUsers = [
    {
      id: 1,
      fullname: 'Samuel Adeyemi',
      email: 'samuel.a@example.com',
      role: 'INSTRUCTOR',
      status: 'VERIFIED',
      courses: 2,
    },
    {
      id: 2,
      fullname: 'Chidinma Nwosu',
      email: 'chidinma@techmail.com',
      role: 'USER',
      status: 'VERIFIED',
      courses: 4,
    },
    {
      id: 3,
      fullname: 'Tariq Al-Mansoor',
      email: 'tariq@cloudlabs.io',
      role: 'USER',
      status: 'PENDING_EMAIL',
      courses: 1,
    },
  ];

  const auditEvents = [
    {
      id: 1,
      event: 'Course Published: Mastering Python Web Development',
      actor: 'Engr. David Okon (Instructor)',
      time: '2 hours ago',
      level: 'INFO',
    },
    {
      id: 2,
      event: 'Paystack Webhook: ₦45,000 Payment Settled',
      actor: 'Gateway Ref PSTK_9823746192',
      time: '3 hours ago',
      level: 'SUCCESS',
    },
    {
      id: 3,
      event: 'Password Reset Request Sent',
      actor: 'Brevo API / Mailer',
      time: '5 hours ago',
      level: 'INFO',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Admin Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/15 via-primary/10 to-transparent p-6 sm:p-8 border border-blue-500/20 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <Sparkles className="size-3.5" />
              Platform Executive Administration
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Platform Overview, Admin {user?.fullname?.split(' ')[0] || 'Executive'}
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl">
              Monitor system integrity, user accounts, instructor course submissions, audit trails, and payment settlement records.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              className="shadow-md shadow-primary/20"
              onClick={() => navigate('/admin/students')}
            >
              <Users className="mr-1.5 size-4" />
              Manage All Users
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/admin/audit')}
            >
              <ShieldCheck className="mr-1.5 size-4" />
              Governance & Logs
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {platformKpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title} className="border-border/70 hover:border-border transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {kpi.title}
                </CardTitle>
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
                <p className="text-xs text-muted-foreground">{kpi.description}</p>
                <div className="mt-2 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  {kpi.trend}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* User Directory & Security Event Logs */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* User Directory Overview */}
        <Card className="lg:col-span-2 border-border/70 flex flex-col justify-between shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">User & Instructor Accounts</CardTitle>
              <CardDescription>Recent signups and verification status</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => navigate('/admin/students')}
            >
              Full User Directory
            </Button>
          </CardHeader>
          <CardContent className="space-y-3 pt-3">
            {recentUsers.map((u) => (
              <div
                key={u.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border/60 p-3.5 bg-muted/20 hover:border-primary/40 transition-all"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{u.fullname}</span>
                    <span
                      className={`rounded-md px-1.5 py-0.2 text-[10px] font-bold ${
                        u.role === 'INSTRUCTOR'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      {u.role}
                    </span>
                    {u.status === 'VERIFIED' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400">
                        <UserCheck className="size-3" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400">
                        <AlertTriangle className="size-3" /> Pending
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {u.courses} {u.role === 'INSTRUCTOR' ? 'authored' : 'enrolled'}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7"
                    onClick={() => navigate('/admin/students')}
                  >
                    View Account
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="border-t border-border/40 pt-4">
            <Button
              className="w-full text-xs gap-1.5"
              onClick={() => navigate('/courses')}
            >
              <FileCheck className="size-3.5" /> Review & Moderate Course Catalog
            </Button>
          </CardFooter>
        </Card>

        {/* Audit & Compliance Log */}
        <Card className="border-border/70 flex flex-col justify-between shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Security & Audit Trail</CardTitle>
            <CardDescription>Live system transaction stream</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {auditEvents.map((ev) => (
              <div
                key={ev.id}
                className="p-3 rounded-xl border border-border/60 bg-muted/20 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground line-clamp-1">{ev.event}</span>
                </div>
                <p className="text-[11px] text-muted-foreground">{ev.actor}</p>
                <span className="text-[10px] text-muted-foreground font-mono">{ev.time}</span>
              </div>
            ))}
          </CardContent>
          <CardFooter className="border-t border-border/40 pt-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => navigate('/admin/audit')}
            >
              <ShieldCheck className="mr-1.5 size-3.5" /> Full Audit Console
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
