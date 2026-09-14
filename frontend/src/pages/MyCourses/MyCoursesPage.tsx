import * as React from "react"
import { useNavigate } from "react-router-dom"
import { PlayCircle, BookOpen, Clock, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

import emptyAxli from "@/src/assets/axli/empty_courses_axli.png"

export default function MyCoursesPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = React.useState<"ALL" | "FULL" | "PREVIEW">("ALL")

  const myEnrollments = [
    {
      id: 1,
      courseId: 1,
      lessonId: 2,
      title: "Mastering Python Web Development with Flask & React",
      accessType: "FULL",
      status: "ACTIVE",
      progress: 68,
      completedLessons: 18,
      totalLessons: 26,
      duration: "14 hours",
      lastLesson: "Lesson 4: Secure Refresh Token Rotation",
      instructor: "Engr. David Okon",
      enrolledAt: "12 Aug 2026",
      thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: 2,
      courseId: 2,
      lessonId: 5,
      title: "Relational Database Design with MySQL & Transactions",
      accessType: "FULL",
      status: "ACTIVE",
      progress: 35,
      completedLessons: 6,
      totalLessons: 17,
      duration: "8 hours",
      lastLesson: "Module 2: Secondary Indexes & Performance",
      instructor: "Amina Bello",
      enrolledAt: "18 Aug 2026",
      thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: 3,
      courseId: 3,
      lessonId: 1,
      title: "Fullstack OAuth2 & Google Authentication Masterclass",
      accessType: "PREVIEW",
      status: "ACTIVE",
      progress: 100,
      completedLessons: 1,
      totalLessons: 1,
      duration: "6 hours",
      lastLesson: "Free Preview: Google OpenID Connect Architecture",
      instructor: "Alex Johnson",
      enrolledAt: "20 Aug 2026",
      thumbnail: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80",
    },
  ]

  const filtered = myEnrollments.filter((c) => {
    if (activeTab === "ALL") return true
    return c.accessType === activeTab
  })

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">My Enrolled Courses</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Track your ongoing lessons, certificates, and preview enrollments.
          </p>
        </div>
        <Button size="sm" className="rounded-full shadow-xs" onClick={() => navigate("/courses")}>
          <BookOpen className="mr-2 size-4" /> Explore More Courses
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-stone-200/70 dark:border-stone-800 pb-3">
        {(["ALL", "FULL", "PREVIEW"] as const).map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab)}
            className="text-xs rounded-full"
          >
            {tab === "ALL" ? "All Courses (3)" : tab === "FULL" ? "Full Access (2)" : "Preview Access (1)"}
          </Button>
        ))}
      </div>

      {/* Zero State if empty */}
      {filtered.length === 0 ? (
        <div className="p-8 sm:p-12 rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 text-center space-y-4 max-w-md mx-auto">
          <img src={emptyAxli} alt="Axli Studious" className="size-36 mx-auto object-contain" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">No enrolled courses here yet</h3>
            <p className="text-xs text-muted-foreground">
              Axli is ready to learn with you! Explore our curated tracks and start your first lesson.
            </p>
          </div>
          <Button
            onClick={() => navigate("/courses")}
            className="rounded-full px-6"
            size="sm"
          >
            Explore Courses
          </Button>
        </div>
      ) : (
        /* Courses List */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 flex flex-col justify-between hover:shadow-md transition-all duration-200 group cursor-pointer hover:-translate-y-0.5 space-y-4"
              onClick={() => navigate(`/courses/${item.courseId}/lessons/${item.lessonId}`)}
            >
              <div className="space-y-3">
                {/* Thumbnail Container */}
                <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-stone-950">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 text-stone-950 text-[10px] font-bold shadow-xs backdrop-blur-xs">
                      <FileText className="size-3" />
                      {item.totalLessons} lessons
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 text-stone-950 text-[10px] font-bold shadow-xs backdrop-blur-xs">
                      <Clock className="size-3" />
                      {item.duration}
                    </span>
                  </div>
                </div>

                {/* Status and title */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        item.accessType === "FULL"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {item.accessType === "FULL" ? "Full Enrollment" : "Preview Access"}
                    </span>
                    <span className="text-[10px] text-stone-400">Enrolled: {item.enrolledAt}</span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-foreground line-clamp-2 pt-0.5 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">By {item.instructor}</p>
                </div>

                {/* Current Lesson snippet */}
                <div className="rounded-xl bg-stone-50 dark:bg-stone-800/50 p-2.5 border border-stone-100 dark:border-stone-800 space-y-0.5">
                  <p className="text-[10px] text-stone-400 font-medium">Next Lesson:</p>
                  <p className="text-xs font-semibold text-foreground line-clamp-1">{item.lastLesson}</p>
                </div>
              </div>

              {/* Progress & CTA */}
              <div className="space-y-3 pt-3 border-t border-stone-100 dark:border-stone-800/80">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-400 text-[11px]">
                      {item.completedLessons} of {item.totalLessons} completed
                    </span>
                    <span className="font-bold text-foreground text-xs">{item.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
                    <div
                      className="h-full bg-purple-600 rounded-full transition-all duration-500"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>

                <button className="w-full py-2 rounded-xl bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-2xs">
                  <PlayCircle className="size-3.5" /> Continue Learning
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
