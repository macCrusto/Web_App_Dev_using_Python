import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Users,
  Plus,
  ArrowRight,
  Sparkles,
  DollarSign,
  TrendingUp,
  Edit,
  Video,
  PlayCircle,
  Eye,
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

export default function InstructorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const kpis = [
    {
      title: 'Total Enrolled Students',
      value: '710',
      description: 'Across all your courses',
      icon: Users,
      trend: '+48 new this month',
    },
    {
      title: 'Gross Revenue',
      value: '₦24,550,000',
      description: 'Paystack / Flutterwave verified',
      icon: DollarSign,
      trend: '+18.4% vs last month',
    },
    {
      title: 'Published Courses',
      value: '3 Courses',
      description: '1 Draft in progress',
      icon: Layers,
      trend: '48 total lessons live',
    },
    {
      title: 'Course Rating',
      value: '4.9 ★',
      description: 'Based on 320 reviews',
      icon: TrendingUp,
      trend: 'Top 5% instructor',
    },
  ];

  const instructorCourses = [
    {
      id: 1,
      title: 'Mastering Python Web Development with Flask & React',
      status: 'PUBLISHED',
      students: 420,
      revenue: '₦18,900,000',
      modulesCount: 5,
      lessonsCount: 26,
    },
    {
      id: 2,
      title: 'Fullstack OAuth2 & Google Authentication Masterclass',
      status: 'PUBLISHED',
      students: 290,
      revenue: '₦5,650,000',
      modulesCount: 2,
      lessonsCount: 9,
    },
    {
      id: 4,
      title: 'FastAPI Microservices with Docker & Redis Queue',
      status: 'DRAFT',
      students: 0,
      revenue: '₦0',
      modulesCount: 3,
      lessonsCount: 11,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Instructor Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/15 via-primary/10 to-transparent p-6 sm:p-8 border border-amber-500/20 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <Sparkles className="size-3.5" />
              Instructor Studio Console
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Welcome back, Professor {user?.fullname?.split(' ')[0] || 'Instructor'}!
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl">
              Manage your course curriculums, upload video lessons, track student enrollments, and publish new content.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              className="shadow-md shadow-primary/20"
              onClick={() => navigate('/instructor/courses/new')}
            >
              <Plus className="mr-1.5 size-4" />
              Create New Course
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/instructor/courses/1/curriculum')}
            >
              <Edit className="mr-1.5 size-4" />
              Curriculum Builder
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
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

      {/* Course Studio Management & Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Course Studio List */}
        <Card className="lg:col-span-2 border-border/70 flex flex-col justify-between shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Your Authored Courses</CardTitle>
              <CardDescription>Curriculum status, student count, and revenue</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => navigate('/instructor/courses')}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-3 pt-3">
            {instructorCourses.map((c) => (
              <div
                key={c.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border/60 p-4 bg-muted/20 hover:border-primary/40 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${
                        c.status === 'PUBLISHED'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {c.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {c.modulesCount} Modules · {c.lessonsCount} Lessons
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground">{c.title}</h4>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-0.5">
                    <span>Students: <strong className="text-foreground">{c.students}</strong></span>
                    <span>Revenue: <strong className="text-emerald-600 dark:text-emerald-400">{c.revenue}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 sm:pt-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-8 gap-1.5"
                    onClick={() => navigate(`/instructor/courses/${c.id}/curriculum`)}
                  >
                    <Edit className="size-3.5" /> Manage Curriculum
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="size-8 p-0"
                    onClick={() => navigate(`/courses/${c.id}`)}
                  >
                    <Eye className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="border-t border-border/40 pt-4">
            <Button
              className="w-full text-xs gap-1.5"
              onClick={() => navigate('/instructor/courses/new')}
            >
              <Plus className="size-3.5" /> Create & Publish New Course Curriculum
            </Button>
          </CardFooter>
        </Card>

        {/* Quick Instructor Tools */}
        <Card className="border-border/70 flex flex-col justify-between shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Curriculum Shortcuts</CardTitle>
            <CardDescription>Direct actions for rapid authoring</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div
              className="p-3.5 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 cursor-pointer transition-all space-y-1"
              onClick={() => navigate('/instructor/courses/1/curriculum')}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-2">
                  <Video className="size-4 text-primary" />
                  Upload Lesson Video
                </span>
                <ArrowRight className="size-3.5 text-muted-foreground" />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Upload MP4 / WebM files directly to your lessons via Cloudinary backend.
              </p>
            </div>

            <div
              className="p-3.5 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 cursor-pointer transition-all space-y-1"
              onClick={() => navigate('/instructor/courses/1/curriculum')}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-2">
                  <Layers className="size-4 text-amber-500" />
                  Module Structure
                </span>
                <ArrowRight className="size-3.5 text-muted-foreground" />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Reorder modules, set free preview count, and organize learning paths.
              </p>
            </div>

            <div
              className="p-3.5 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 cursor-pointer transition-all space-y-1"
              onClick={() => navigate('/instructor/analytics')}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-2">
                  <TrendingUp className="size-4 text-emerald-500" />
                  Sales Breakdown
                </span>
                <ArrowRight className="size-3.5 text-muted-foreground" />
              </div>
              <p className="text-[11px] text-muted-foreground">
                View student retention rate and transaction payout logs.
              </p>
            </div>
          </CardContent>
          <CardFooter className="border-t border-border/40 pt-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => navigate('/courses')}
            >
              <PlayCircle className="mr-1.5 size-3.5" />
              View Student Catalog
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
