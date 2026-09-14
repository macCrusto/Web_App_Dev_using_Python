import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  Clock,
  ArrowRight,
  PlayCircle,
  BookOpen,
  Award,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/src/context/AuthContext';

import welcomeAxli from '@/src/assets/axli/dashboard_welcome_axli.png';
import certAxli from '@/src/assets/axli/course_certificate_axli.png';

function CircularProgress({
  percentage,
  color = 'text-emerald-500',
}: {
  percentage: number;
  color?: string;
}) {
  const radius = 7;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-1.5">
      <div className="relative size-5 flex items-center justify-center">
        <svg className="size-5 -rotate-90" viewBox="0 0 18 18">
          <circle
            cx="9"
            cy="9"
            r={radius}
            className="stroke-stone-200 dark:stroke-stone-800 fill-none"
            strokeWidth="2"
          />
          <circle
            cx="9"
            cy="9"
            r={radius}
            className={`fill-none ${color} transition-all duration-500`}
            strokeWidth="2"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span className="text-xs font-bold text-stone-700 dark:text-stone-300">{percentage}%</span>
    </div>
  );
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const stats = [
    {
      title: 'Active Enrollments',
      value: '3 Courses',
      description: '2 Full Access · 1 Preview',
      icon: GraduationCap,
      trend: '+1 this week',
    },
    {
      title: 'Lessons Completed',
      value: '24 / 43',
      description: '56% average completion',
      icon: PlayCircle,
      trend: '3 completed today',
    },
    {
      title: 'Learning Hours',
      value: '14.2 hrs',
      description: 'Total video & lab time',
      icon: Clock,
      trend: '5-day active streak 🔥',
    },
    {
      title: 'Certificates Earned',
      value: '1 Ready',
      description: 'Python Basics verified',
      icon: Award,
      trend: 'Download available',
      axliBadge: certAxli,
    },
  ];

  // Continue learning lessons matching user image
  const continueLearningItems = [
    {
      id: 1,
      courseId: 1,
      lessonId: 3,
      category: 'DDJ-FLX2 Beginner course',
      lessonTitle: '3. Interactive lesson: Are you ready?',
      lessonsCount: 52,
      duration: '9 hours',
      progress: 1,
      progressColor: 'stroke-amber-500 text-amber-500',
      thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      courseId: 2,
      lessonId: 7,
      category: 'Djay Beginner course',
      lessonTitle: '7. How to access music from streaming platforms',
      lessonsCount: 48,
      duration: '7 hours',
      progress: 4,
      progressColor: 'stroke-amber-500 text-amber-500',
      thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      courseId: 3,
      lessonId: 5,
      category: 'How to DJ with a laptop',
      lessonTitle: '5. Using beat sync for seamless mixing',
      lessonsCount: 9,
      duration: '4 hours',
      progress: 60,
      progressColor: 'stroke-emerald-500 text-emerald-500',
      thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    },
  ];

  // Featured courses section matching mockup footer
  const featuredCourses = [
    {
      id: 1,
      title: 'Mastering interaction design: From principles to micro-interactions',
      category: 'Product Design',
      instructor: 'Luis Mark',
      duration: '6hr 20min',
      price: '$00.00',
      originalPrice: '$69.00',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      badge: 'SUMMER EVENTS',
    },
    {
      id: 5,
      title: 'Become a UX designer in 2024 (Beginner to Professional)',
      category: 'Product Manager',
      instructor: 'Eichiro D. Lucky',
      duration: '8hr 39min',
      price: '$52.00',
      originalPrice: '$62.40',
      thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&auto=format&fit=crop&q=80',
      badge: 'Free course',
    },
    {
      id: 10,
      title: 'Master the Fundamentals of User Experience Design',
      category: 'Product Manager',
      instructor: 'Eichiro D. Lucky',
      duration: '8hr 39min',
      price: '$52.00',
      originalPrice: '$62.40',
      thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
      badge: 'POPULAR',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-16 font-sans">
      {/* Welcome Banner with Axli Mascot */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-stone-900 p-6 sm:p-8 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative z-10 space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" />
            Student Learning Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Welcome back, {user?.fullname?.split(' ')[0] || 'Learner'}!
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Axli is here to guide your learning streak. Continue where you left off or jump into new interactive modules today.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              className="rounded-full shadow-xs"
              onClick={() => navigate('/courses')}
            >
              <BookOpen className="mr-2 size-4" />
              Explore Catalog
            </Button>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => navigate('/my-courses')}
            >
              <GraduationCap className="mr-2 size-4" />
              My Enrolled Courses
            </Button>
          </div>
        </div>

        {/* Waving Axli Mascot */}
        <div className="shrink-0 flex items-center justify-center">
          <img
            src={welcomeAxli}
            alt="Axli Waving"
            className="w-36 sm:w-44 h-auto object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="rounded-2xl border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 transition-all hover:shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {stat.title}
                </CardTitle>
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
                <div className="mt-2 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  {stat.trend}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* SECTION: Continue learning (Matching image mockup) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
              Continue learning
            </h2>
            <p className="text-xs text-muted-foreground">
              Keep progressing through your lessons
            </p>
          </div>
          <button
            onClick={() => navigate('/my-courses')}
            className="text-xs font-semibold text-amber-500 dark:text-amber-400 hover:underline cursor-pointer flex items-center gap-1"
          >
            View all 12
          </button>
        </div>

        {/* Continue Learning Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {continueLearningItems.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/courses/${item.courseId}/lessons/${item.lessonId}`)}
              className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 space-y-3.5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group hover:-translate-y-0.5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Thumbnail with overlay pill badges */}
                <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-stone-950">
                  <img
                    src={item.thumbnail}
                    alt={item.lessonTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                    loading="lazy"
                  />

                  {/* Overlaid Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 text-stone-950 text-[10px] font-bold shadow-xs backdrop-blur-xs">
                      <FileText className="size-3" />
                      {item.lessonsCount} lessons
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 text-stone-950 text-[10px] font-bold shadow-xs backdrop-blur-xs">
                      <Clock className="size-3" />
                      {item.duration}
                    </span>
                  </div>
                </div>

                {/* Course Category / Series (Orange/Amber text) */}
                <div>
                  <p className="text-xs font-semibold text-amber-500 dark:text-amber-400">
                    {item.category}
                  </p>
                  <h3 className="text-sm sm:text-base font-bold text-foreground line-clamp-2 mt-0.5 leading-snug group-hover:text-primary transition-colors">
                    {item.lessonTitle}
                  </h3>
                </div>
              </div>

              {/* Bottom Progress Row */}
              <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800/80 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-stone-500 dark:text-stone-400 font-medium">Progress:</span>
                  <CircularProgress
                    percentage={item.progress}
                    color={item.progressColor}
                  />
                </div>
                <ChevronRight className="size-4 text-stone-400 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION: Featured courses (Matching image mockup footer) */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
              Featured courses
            </h2>
            <p className="text-xs text-muted-foreground">
              Highlighted courses handpicked for you to explore and enjoy!
            </p>
          </div>
          <button
            onClick={() => navigate('/courses')}
            className="text-xs font-semibold text-amber-500 dark:text-amber-400 hover:underline cursor-pointer flex items-center gap-1"
          >
            View all courses
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredCourses.map((fc) => (
            <div
              key={fc.id}
              onClick={() => navigate(`/courses/${fc.id}`)}
              className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-3.5 space-y-3 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group hover:-translate-y-0.5"
            >
              <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800">
                <img
                  src={fc.thumbnail}
                  alt={fc.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {fc.badge && (
                  <span className="absolute top-2.5 left-2.5 bg-amber-400 text-stone-950 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-2xs">
                    {fc.badge}
                  </span>
                )}
              </div>

              <div>
                <span className="text-[11px] font-semibold text-stone-400">{fc.category}</span>
                <h3 className="text-xs sm:text-sm font-bold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                  {fc.title}
                </h3>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                  By {fc.instructor} · {fc.duration}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800/80">
                <div className="flex items-center gap-1.5">
                  <span className="line-through text-xs text-stone-400">{fc.originalPrice}</span>
                  <span className="text-xs sm:text-sm font-bold text-amber-500 dark:text-amber-400">{fc.price}</span>
                </div>
                <span className="text-xs font-semibold text-primary group-hover:underline flex items-center gap-0.5">
                  Details <ArrowRight className="size-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
