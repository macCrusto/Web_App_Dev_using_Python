import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  PlayCircle,
  Lock,
  BookOpen,
  ChevronDown,
  ChevronUp,
  FileText,
  Code2,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { CourseHeader } from '@/src/components/courses/CourseHeader';
import { courseService } from '@/src/services/courseService';
import type { Course } from '@/src/types';
import certAxli from '@/src/assets/axli/course_certificate_axli.png';

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: false,
  });

  useEffect(() => {
    async function loadCourse() {
      const catalog = await courseService.getExploreCatalog();
      const current = catalog.find((c) => c.id === Number(courseId)) || catalog[0] || {
        id: 10,
        title: 'Master the Fundamentals of User Experience Design',
        slug: 'master-fundamentals-ux-design',
        instructor_name: 'Eichiro D. Lucky',
        category: 'Product Manager',
        price: '$00.00',
        original_price: '$69.00',
        currency: 'USD',
        duration: '8hr 39min',
        last_updated: '23 May,2023',
        description:
          'Delve into the art and science of creating intuitive, user-centered designs that not only engage but also enhance the overall digital experience.',
        thumbnail:
          'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
        status: 'PUBLISHED',
      };
      setCourse(current);
    }
    loadCourse();
  }, [courseId]);

  const modules = [
    {
      id: 1,
      title: 'Module 1: Fundamentals of User Research & Empathy Maps',
      description: 'Foundational principles of UX architecture, persona crafting, and behavioral research.',
      lessons: [
        {
          id: 1,
          title: 'Welcome & Interactive Design Blueprint',
          duration: '12 min',
          type: 'VIDEO',
          isFree: true,
        },
        {
          id: 2,
          title: 'Empathy Mapping & Qualitative User Interviews',
          duration: '18 min',
          type: 'DOCUMENT',
          isFree: true,
        },
        {
          id: 3,
          title: 'Interactive Journey Maps in Figma',
          duration: '25 min',
          type: 'CODE',
          isFree: true,
        },
      ],
    },
    {
      id: 2,
      title: 'Module 2: Information Architecture & Wireframing',
      description: 'Card sorting, site tree structure, low-fidelity wireframes, and user flows.',
      lessons: [
        {
          id: 4,
          title: 'Component Design Tokens & Grid Scalability',
          duration: '32 min',
          type: 'VIDEO',
          isFree: false,
        },
        {
          id: 5,
          title: 'High-Fidelity Wireframes & Responsive Breakpoints',
          duration: '22 min',
          type: 'CODE',
          isFree: false,
        },
      ],
    },
    {
      id: 3,
      title: 'Module 3: Usability Testing & Interactive Prototypes',
      description: 'Heatmaps, A/B validation, micro-interactions, and design handoff.',
      lessons: [
        {
          id: 6,
          title: 'Building Complex Micro-Interactions in Figma',
          duration: '28 min',
          type: 'VIDEO',
          isFree: false,
        },
        {
          id: 7,
          title: 'Handoff Guidelines & Developer Specs',
          duration: '20 min',
          type: 'DOCUMENT',
          isFree: false,
        },
      ],
    },
  ];

  const toggleModule = (id: number) => {
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEnroll = () => {
    toast.success('Redirecting to checkout payment gateway...');
    navigate('/payments');
  };

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full size-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-16 font-sans">
      {/* 1. Header Card Format matching mockup */}
      <CourseHeader course={course} onEnroll={handleEnroll} showBack={true} />

      {/* 2. Course Content Section Header & Modules */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200/60 dark:border-stone-800/80 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
            Course Content
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
            onClick={() => {
              const allExpanded = Object.values(expandedModules).every(Boolean);
              const nextState: Record<number, boolean> = {};
              modules.forEach((m) => (nextState[m.id] = !allExpanded));
              setExpandedModules(nextState);
            }}
          >
            Expand/Collapse All
          </Button>
        </div>

        {/* What You'll Learn Highlights with Axli Graduate */}
        <Card className="rounded-3xl border-stone-200/80 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-4 flex-1">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-stone-900 dark:text-stone-100">
                <Sparkles className="size-4 text-primary" />
                Key Learning Objectives & Certificate
              </CardTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  'Formulate data-backed user personas and quantitative user research surveys',
                  'Design modern responsive component layouts and scalable typography hierarchies',
                  'Build interactive clickable prototypes with state animations in Figma',
                  'Run remote usability tests, interpret user session logs, and optimize conversion',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-stone-700 dark:text-stone-300 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="shrink-0 flex items-center justify-center">
              <img
                src={certAxli}
                alt="Axli Certificate"
                className="w-28 sm:w-32 h-auto object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </Card>

        {/* Modules Accordion */}
        <div className="space-y-3 pt-2">
          {modules.map((module) => {
            const isExpanded = expandedModules[module.id];
            return (
              <Card
                key={module.id}
                className="border-stone-200/80 dark:border-stone-800 overflow-hidden bg-white dark:bg-stone-900"
              >
                <div
                  className="flex items-center justify-between p-4 sm:p-5 cursor-pointer hover:bg-stone-50/80 dark:hover:bg-stone-800/40 transition-all select-none"
                  onClick={() => toggleModule(module.id)}
                >
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
                      <BookOpen className="size-4 text-primary shrink-0" />
                      {module.title}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {module.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-stone-400 hidden sm:inline">
                      {module.lessons.length} lessons
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="size-4 text-stone-500" />
                    ) : (
                      <ChevronDown className="size-4 text-stone-500" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-stone-100 dark:border-stone-800 divide-y divide-stone-100 dark:divide-stone-800/60 bg-stone-50/30 dark:bg-stone-950/20">
                    {module.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between px-5 py-3 hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-all text-xs"
                      >
                        <div className="flex items-center gap-3">
                          {lesson.type === 'VIDEO' ? (
                            <PlayCircle className="size-4 text-primary shrink-0" />
                          ) : lesson.type === 'CODE' ? (
                            <Code2 className="size-4 text-amber-500 shrink-0" />
                          ) : (
                            <FileText className="size-4 text-blue-500 shrink-0" />
                          )}
                          <span className="font-medium text-stone-800 dark:text-stone-200">
                            {lesson.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-stone-400 text-[11px]">{lesson.duration}</span>
                          {lesson.isFree ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 px-2 text-[10px] text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                              onClick={() => navigate(`/courses/${course.id}/lessons/${lesson.id}`)}
                            >
                              Free Preview
                            </Button>
                          ) : (
                            <span className="flex items-center gap-1 text-[11px] text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
                              <Lock className="size-3" /> Locked
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
