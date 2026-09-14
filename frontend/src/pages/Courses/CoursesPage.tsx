import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Clock,
  BookOpen,
  ArrowRight,
  BarChart2,
} from 'lucide-react';
import { courseService } from '@/src/services/courseService';
import type { Course } from '@/src/types';
import exploreAxli from '@/src/assets/axli/explore_hero_axli.png';
import emptyAxli from '@/src/assets/axli/empty_courses_axli.png';
import { toast } from 'sonner';

export default function CoursesPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpandedDescription, setIsExpandedDescription] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await courseService.getExploreCatalog();
        setCourses(data);
      } catch (err) {
        console.error('Failed to load courses:', err);
      }
    }
    loadCourses();
  }, []);

  // Keyboard shortcut: Cmd/Ctrl + F to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const topCourses = courses.slice(0, 4);
  const allCourses = courses.slice(4);

  // Filter courses based on search term
  const filterCourseList = (list: Course[]) => {
    if (!searchTerm.trim()) return list;
    const term = searchTerm.toLowerCase();
    return list.filter(
      (c) =>
        c.title.toLowerCase().includes(term) ||
        (c.description && c.description.toLowerCase().includes(term)) ||
        (c.instructor_name && c.instructor_name.toLowerCase().includes(term)) ||
        (c.category && c.category.toLowerCase().includes(term))
    );
  };

  const filteredTop = filterCourseList(topCourses);
  const filteredAll = filterCourseList(allCourses);

  const handleEnroll = (e: React.MouseEvent, course: Course) => {
    e.stopPropagation();
    toast.success(`Enrolling in "${course.title}"...`);
    navigate(`/courses/${course.id}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16 font-sans">
      {/* Top Bar: Pill Search Bar & Join Bootcamp CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Rounded Pill Search Bar */}
        <div className="relative w-full sm:w-80 md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Press ⌘ + F to search"
            className="w-full h-11 pl-10 pr-4 rounded-full bg-stone-100/90 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 text-xs sm:text-sm text-foreground placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400/40 dark:focus:ring-stone-600 transition-all shadow-2xs"
          />
        </div>

        {/* Join Bootcamp Button with 20% off Badge */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => {
              toast.info('Bootcamp enrollment special applied! 20% discount activated.');
              navigate('/payments');
            }}
            className="group relative inline-flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white text-xs sm:text-sm font-medium transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            <span>Join Bootcamp</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 font-bold text-[11px] tracking-tight group-hover:scale-105 transition-transform">
              20% offf
            </span>
          </button>
        </div>
      </div>

      {/* Hero Banner: Explore our Courses */}
      <div className="rounded-3xl border border-stone-200/80 dark:border-stone-800/80 bg-white dark:bg-stone-900/90 p-6 sm:p-8 lg:p-10 shadow-xs relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 transition-all">
        <div className="max-w-xl space-y-3 z-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50">
            Explore our Courses
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
            Master Essential Skills: An Extensive and Exhaustive Guide to Developing, Refining, and
            Perfecting the Crucial Competencies Essential for Achieving Expertise and Excellence in
            Modern Practice{' '}
            <button
              onClick={() => setIsExpandedDescription(!isExpandedDescription)}
              className="font-bold text-stone-900 dark:text-stone-100 underline hover:opacity-80 transition-opacity ml-1 cursor-pointer"
            >
              {isExpandedDescription ? 'Read less' : 'Read more'}
            </button>
          </p>

          {isExpandedDescription && (
            <div className="pt-2 text-xs text-stone-500 dark:text-stone-400 animate-in fade-in slide-in-from-top-2 duration-200 leading-relaxed">
              Explore step-by-step masterclasses led by industry practitioners. From fullstack web
              engineering and database design to modern UI/UX design thinking, each track provides
              interactive labs, verified credentials, and free preview access.
            </div>
          )}
        </div>

        {/* Axli Mascot Illustration */}
        <div className="w-full max-w-[200px] sm:max-w-[240px] md:max-w-[260px] shrink-0 flex items-center justify-center pt-2 md:pt-0">
          <img
            src={exploreAxli}
            alt="Axli - Learning Explorer"
            className="w-full h-auto max-h-[220px] object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Zero Search State if no courses match */}
      {filteredTop.length === 0 && filteredAll.length === 0 && (
        <div className="p-8 sm:p-12 rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 text-center space-y-4 max-w-md mx-auto">
          <img src={emptyAxli} alt="Axli Searching" className="size-32 mx-auto object-contain" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">No courses found</h3>
            <p className="text-xs text-muted-foreground">
              Axli couldn't find any courses matching "{searchTerm}". Try searching for another topic or reset the search.
            </p>
          </div>
          <button
            onClick={() => setSearchTerm('')}
            className="px-4 py-2 rounded-full bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Section 1: Top course */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
            Top course
          </h2>
          <button
            onClick={() => setSearchTerm('')}
            className="text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            See all <ArrowRight className="size-3.5" />
          </button>
        </div>

        {/* Top Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredTop.map((course) => (
            <div
              key={course.id}
              onClick={() => navigate(`/courses/${course.id}`)}
              className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-3 flex flex-col justify-between hover:shadow-md transition-all duration-200 cursor-pointer group hover:-translate-y-0.5"
            >
              <div>
                {/* Thumbnail Image Container with Badge */}
                <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800">
                  <img
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {course.thumbnail_badge && (
                    <div className="absolute top-2.5 left-2.5 bg-amber-300/95 text-stone-950 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-2xs backdrop-blur-xs">
                      {course.thumbnail_badge}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="pt-3 space-y-1.5">
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                  <p className="text-[11px] text-stone-600 dark:text-stone-300 font-medium pt-0.5">
                    By {course.instructor_name || 'Luis Mark'}
                  </p>

                  {/* Level indicator */}
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400 pt-0.5">
                    <BarChart2 className="size-3 text-stone-400" />
                    <span>
                      Level : <strong className="text-stone-800 dark:text-stone-200 font-semibold">{course.level || 'Beginner'}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer: Price & Badges */}
              <div className="pt-3 mt-2 border-t border-stone-100 dark:border-stone-800/80 space-y-2.5">
                {/* Price */}
                <div className="flex items-center gap-1.5">
                  <span className="line-through text-xs font-semibold text-stone-400 dark:text-stone-500">
                    {course.original_price || '$69.00'}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-amber-500 dark:text-amber-400">
                    {course.price || '$00.00'}
                  </span>
                </div>

                {/* Bottom Tag Badges */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {(course.tags || ['FREE', 'EVENT', 'BEGINNER']).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 text-stone-700 dark:text-stone-300 text-[9px] font-bold uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: All Course */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
            All Course
          </h2>
          <button
            onClick={() => setSearchTerm('')}
            className="text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            See all <ArrowRight className="size-3.5" />
          </button>
        </div>

        {/* All Courses Grid (4 columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredAll.map((course) => (
            <div
              key={course.id}
              onClick={() => navigate(`/courses/${course.id}`)}
              className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-3 flex flex-col justify-between hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <div>
                {/* Thumbnail Image Container */}
                <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800">
                  <img
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&auto=format&fit=crop&q=80'}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {course.thumbnail_badge && (
                    <div className="absolute top-2.5 left-2.5 bg-stone-950/70 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-xs">
                      {course.thumbnail_badge}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="pt-3 space-y-1.5">
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>

                  {/* Instructor with Avatar */}
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <img
                      src={
                        course.instructor_avatar ||
                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
                      }
                      alt={course.instructor_name || 'Instructor'}
                      className="size-4.5 rounded-full object-cover border border-stone-200 dark:border-stone-700"
                    />
                    <span className="text-[11px] text-stone-600 dark:text-stone-300 font-medium">
                      by {course.instructor_name || 'Eichiro D. Lucky'}
                    </span>
                  </div>

                  {/* Metadata: Duration & Classes Count */}
                  <div className="flex items-center gap-3 text-[11px] text-stone-400 dark:text-stone-500 pt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {course.duration || '8hr 39min'}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="size-3" />
                      {course.classes_count || 18} classes
                    </span>
                  </div>
                </div>
              </div>

              {/* Price Row & Enroll Action */}
              <div className="pt-3 mt-2 border-t border-stone-100 dark:border-stone-800/80 space-y-2.5">
                {/* Price and discount badge */}
                <div className="flex items-center gap-2">
                  <span className="line-through text-[11px] font-semibold text-stone-400 dark:text-stone-500">
                    {course.original_price || '$62.4'}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                    {course.price || '$52'}
                  </span>
                  {course.discount_percent && (
                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded">
                      {course.discount_percent}
                    </span>
                  )}
                </div>

                {/* Enroll Button */}
                <button
                  onClick={(e) => handleEnroll(e, course)}
                  className="w-full py-2 rounded-lg bg-stone-100 hover:bg-stone-900 hover:text-white dark:bg-stone-800 dark:hover:bg-stone-100 dark:hover:text-stone-900 text-stone-800 dark:text-stone-200 text-xs font-semibold transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer text-center"
                >
                  Enroll
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
