import { Clock, Calendar, ArrowLeft } from 'lucide-react';
import type { Course } from '@/src/types';
import { useNavigate } from 'react-router-dom';

interface CourseHeaderProps {
  course: Course;
  onEnroll?: () => void;
  showBack?: boolean;
}

export function CourseHeader({ course, onEnroll, showBack = true }: CourseHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 font-sans">
      {showBack && (
        <button
          onClick={() => navigate('/courses')}
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Explore Courses</span>
        </button>
      )}

      {/* Main Course Header Card */}
      <div className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8 shadow-xs relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 transition-all">
        {/* Left Column: Details & CTA */}
        <div className="flex-1 space-y-4 max-w-2xl">
          {/* Breadcrumb / Category Pill */}
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 font-medium">
            <span>Course/</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-semibold text-[11px]">
              {course.category || 'Product Manager'}
            </span>
          </div>

          {/* Course Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50 leading-tight">
            {course.title}
          </h1>

          {/* Course Description */}
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
            {course.description ||
              'Delve into the art and science of creating intuitive, user-centered designs that not only engage but also enhance the overall digital experience.'}
          </p>

          {/* Metadata Row: Duration & Last Updated */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 dark:text-stone-400 pt-1">
            <div className="flex items-center gap-1.5">
              <Clock className="size-3.5 text-stone-400" />
              <span>{course.duration || '8hr 39min'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="size-3.5 text-stone-400" />
              <span>Last updated on {course.last_updated || '23 May,2023'}</span>
            </div>
          </div>

          {/* Price Line */}
          <div className="flex items-center gap-2 pt-1">
            <span className="line-through text-xs sm:text-sm font-semibold text-stone-400 dark:text-stone-500">
              {course.original_price || '$69.00'}
            </span>
            <span className="text-sm sm:text-base font-bold text-amber-500 dark:text-amber-400">
              {course.price || '$00.00'}
            </span>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={onEnroll}
              className="px-7 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white text-xs sm:text-sm font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer"
            >
              Enroll Now
            </button>
          </div>
        </div>

        {/* Right Column: Large Course Thumbnail */}
        <div className="w-full lg:w-[45%] shrink-0">
          <div className="relative aspect-16/10 rounded-2xl overflow-hidden shadow-xs border border-stone-100 dark:border-stone-800 bg-stone-100 dark:bg-stone-800">
            <img
              src={
                course.thumbnail ||
                'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80'
              }
              alt={course.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
            {course.thumbnail_badge && (
              <div className="absolute top-3 left-3 bg-amber-400 text-stone-950 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
                {course.thumbnail_badge}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
