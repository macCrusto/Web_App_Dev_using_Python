import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Home,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Star,
  Users,
  Clock,
  Calendar,
  Globe,
  MoreVertical,
  Share2,
  Bookmark,
  Download,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Play,
  Check,
  BookOpen,
  Video,
  FileText,
  HelpCircle,
  GraduationCap,
  Link as LinkIcon,
  Info,
  Award,
  Smartphone,
  Subtitles,
  Heart,
  Lock,
  ExternalLink,
  Code2,
  ImageIcon,
  File,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import celebrateAxli from '@/src/assets/axli/celebration_modal_axli.png';
import paywallAxli from '@/src/assets/axli/paywall_locked_axli.png';
import type { LessonResource } from '@/src/types';

interface LessonItem {
  id: number;
  number: string;
  title: string;
  duration: string;
  isCompleted?: boolean;
  isFree?: boolean;
  videoUrl?: string;
  poster?: string;
  content_type?: 'VIDEO' | 'DOCUMENT' | 'PDF' | 'LINK' | 'CODE';
  content_url?: string;
  content_body?: string;
  resources?: LessonResource[];
}

interface ModuleSection {
  id: number;
  title: string;
  subtitle: string;
  lessons: LessonItem[];
}

interface InstructorInfo {
  id: number;
  name: string;
  title: string;
  awards: string;
  avatar: string;
}

export default function LessonPlayerPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();

  // Active tab under the video player
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'quiz' | 'resources' | 'announcements' | 'reviews' | 'next-steps'>('overview');

  // Active view in right sidebar: 'content' (Course Content) or 'info' (Course Information)
  const [sidebarView, setSidebarView] = useState<'content' | 'info'>('content');

  // Sidebar accordions state
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
    4: false,
    5: false,
  });

  // User interactions
  const [likesCount, setLikesCount] = useState(198);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [notesList, setNotesList] = useState<string[]>([
    'Key takeaway at 04:12: Start with active listening rather than rehearsing your response.',
    'Remember the 3-second pause technique before answering tricky questions.',
  ]);
  const [currentNote, setCurrentNote] = useState('');
  const [completedLessonIds, setCompletedLessonIds] = useState<number[]>([1]);
  const [showProgressMenu, setShowProgressMenu] = useState(false);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Dynamic modules and lessons matching Image 1
  const modules: ModuleSection[] = [
    {
      id: 1,
      title: 'Course Intro',
      subtitle: '2/18 · 60min Total',
      lessons: [
        {
          id: 1,
          number: '01',
          title: 'Learn The Alphabets',
          duration: 'Completed',
          isCompleted: true,
          isFree: true,
          content_type: 'VIDEO',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          poster: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&auto=format&fit=crop&q=80',
          resources: [
            { id: 1, lesson_id: 1, title: 'Alphabet Reference Chart.pdf', file_url: '#', file_type: 'PDF', file_size_kb: 1240, description: 'Printable A-Z reference sheet' },
            { id: 2, lesson_id: 1, title: 'Practice Worksheet.docx', file_url: '#', file_type: 'DOC', file_size_kb: 320 },
          ],
        },
        {
          id: 2,
          number: '02',
          title: 'Touch The Grass',
          duration: '23 Minutes',
          isCompleted: false,
          isFree: true,
          content_type: 'VIDEO',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          poster: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80',
          resources: [
            { id: 3, lesson_id: 2, title: 'Field Guide Link', file_url: 'https://example.com', file_type: 'LINK', description: 'External reading on nature mindfulness' },
          ],
        },
        {
          id: 3,
          number: '03',
          title: 'Practice, Practice, Practice',
          duration: '112 Minutes',
          isCompleted: false,
          isFree: true,
          content_type: 'DOCUMENT',
          content_url: 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF1',
          content_body: `# Practice Guide\n\nThis lesson contains your full written practice guide.\n\n## Section 1: Fundamentals\n\nStart with the core exercises listed below and work through each one systematically. Consistency is key — aim for at least 20 minutes daily.\n\n## Section 2: Advanced Drills\n\nOnce you've mastered the basics, move on to the timed challenges in the attached worksheets.`,
          resources: [
            { id: 4, lesson_id: 3, title: 'Practice Drills.pdf', file_url: '#', file_type: 'PDF', file_size_kb: 890 },
            { id: 5, lesson_id: 3, title: 'Sample Code.py', file_url: '#', file_type: 'CODE', file_size_kb: 12 },
          ],
        },
        {
          id: 4,
          number: '04',
          title: 'Just Do It',
          duration: '99 Minutes',
          isCompleted: false,
          isFree: false,
          content_type: 'VIDEO',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          poster: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
          resources: [],
        },
      ],
    },
    {
      id: 2,
      title: 'History of Cringe',
      subtitle: '3/22 · 112 Minutes Total',
      lessons: [
        {
          id: 5,
          number: '05',
          title: 'The Psychology of Awkward Silence',
          duration: '34 Minutes',
          isCompleted: false,
          isFree: false,
          content_type: 'VIDEO',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        },
        {
          id: 6,
          number: '06',
          title: 'Body Language Micro-Signals',
          duration: '45 Minutes',
          isCompleted: false,
          isFree: false,
          content_type: 'LINK',
          content_url: 'https://example.com/body-language-guide',
        },
      ],
    },
    {
      id: 3,
      title: 'Role Of Technology',
      subtitle: '8/747 · 987 Minutes Total',
      lessons: [
        {
          id: 7,
          number: '07',
          title: 'Digital Charisma & Remote Communication',
          duration: '52 Minutes',
          isCompleted: false,
          isFree: false,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        },
      ],
    },
    {
      id: 4,
      title: 'Age OF AI/ML',
      subtitle: '2/8 · 60min Total',
      lessons: [
        {
          id: 8,
          number: '08',
          title: 'AI Assisted Scripting & Speech Coaching',
          duration: '28 Minutes',
          isCompleted: false,
          isFree: false,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        },
      ],
    },
    {
      id: 5,
      title: 'Final Quiz & Transformation',
      subtitle: '12/77 · 12 Questions Total',
      lessons: [
        {
          id: 9,
          number: '09',
          title: 'Final Real-World Communication Assessment',
          duration: '15 Questions',
          isCompleted: false,
          isFree: false,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        },
      ],
    },
  ];

  // Instructors list matching Image 2
  const instructors: InstructorInfo[] = [
    {
      id: 1,
      name: 'Dr. Azunyan U. Wu',
      title: 'Behavioral Psychology Lead',
      awards: '88 Awards',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      name: 'Dr. Oarack Babama',
      title: 'Senior Rhetoric & Public Speaking',
      awards: '88 Awards',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      name: 'Dr. Taylor Swift',
      title: 'Creative Narrative & Storytelling',
      awards: '88 Awards',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 4,
      name: 'Dr. Gerard White',
      title: 'Executive Presence Coach',
      awards: '88 Awards',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
  ];

  const allLessons = modules.flatMap((m) => m.lessons);
  const currentLessonIdNum = Number(lessonId) || 1;
  const currentLesson = allLessons.find((l) => l.id === currentLessonIdNum) || allLessons[0];

  const toggleModule = (id: number) => {
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLessonSelect = (lesson: LessonItem) => {
    if (lesson.isFree === false) {
      setShowPaywallModal(true);
      return;
    }
    navigate(`/courses/${courseId || 1}/lessons/${lesson.id}`);
  };

  const toggleComplete = (id: number) => {
    if (completedLessonIds.includes(id)) {
      setCompletedLessonIds((prev) => prev.filter((item) => item !== id));
      toast.info('Marked as uncompleted');
    } else {
      setCompletedLessonIds((prev) => [...prev, id]);
      setShowCelebrationModal(true);
      toast.success('Lesson marked as completed! 🎉');
    }
  };

  const handleLike = () => {
    if (hasLiked) {
      setHasLiked(false);
      setLikesCount((c) => c - 1);
    } else {
      setHasLiked(true);
      setLikesCount((c) => c + 1);
      if (hasDisliked) setHasDisliked(false);
      toast.success('Liked lesson!');
    }
  };

  const handleDislike = () => {
    if (hasDisliked) {
      setHasDisliked(false);
    } else {
      setHasDisliked(true);
      if (hasLiked) {
        setHasLiked(false);
        setLikesCount((c) => c - 1);
      }
      toast.info('Feedback received');
    }
  };

  const handleSaveNote = () => {
    if (!currentNote.trim()) {
      toast.error('Please enter a note before saving');
      return;
    }
    setNotesList((prev) => [currentNote.trim(), ...prev]);
    setCurrentNote('');
    toast.success('Note saved to this lesson!');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Lesson link copied to clipboard!');
  };

  const handlePlayToggle = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const progressPercentage = Math.round((completedLessonIds.length / allLessons.length) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-16 font-sans">
      {/* Top Header Row: Breadcrumbs on Left, My Progress & Actions on Right */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/70 dark:border-stone-800 pb-3">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-stone-500 dark:text-stone-400">
          <button
            onClick={() => navigate('/dashboard')}
            className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          >
            <Home className="size-4" />
          </button>
          <ChevronRight className="size-3.5 text-stone-400" />
          <button
            onClick={() => navigate('/dashboard')}
            className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          >
            Overview
          </button>
          <ChevronRight className="size-3.5 text-stone-400" />
          <button
            onClick={() => navigate('/courses')}
            className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          >
            Courses
          </button>
          <ChevronRight className="size-3.5 text-stone-400" />
          <span className="font-semibold text-purple-600 dark:text-purple-400">
            Communication
          </span>
        </nav>

        {/* Top-Right Tools */}
        <div className="flex items-center gap-3 self-end sm:self-auto relative">
          {/* My Progress Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProgressMenu(!showProgressMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200/70 dark:hover:bg-stone-700/70 transition-all cursor-pointer"
            >
              <span>My Progress</span>
              <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-1.5 py-0.5 rounded-full">
                {progressPercentage}%
              </span>
              <ChevronDown className="size-3.5 text-stone-400" />
            </button>

            {showProgressMenu && (
              <div className="absolute right-0 top-9 w-64 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xl z-50 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-900 dark:text-stone-100">Course Progress</span>
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    {completedLessonIds.length} of {allLessons.length} Completed
                  </span>
                </div>
                <div className="h-2 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <button
                  onClick={() => {
                    toggleComplete(currentLesson.id);
                    setShowProgressMenu(false);
                  }}
                  className="w-full py-1.5 rounded-lg text-xs font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 transition-colors"
                >
                  {completedLessonIds.includes(currentLesson.id)
                    ? 'Mark Current Lesson Incomplete'
                    : 'Mark Current Lesson Complete'}
                </button>
              </div>
            )}
          </div>

          {/* More options */}
          <button
            onClick={() => toast.info('Lesson settings & captions menu')}
            className="size-8 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <MoreVertical className="size-4" />
          </button>

          {/* Share icon */}
          <button
            onClick={handleShare}
            className="size-8 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <Share2 className="size-4" />
          </button>

          {/* User Avatar with Green status dot */}
          <div className="relative size-8 rounded-full overflow-hidden border border-stone-200 dark:border-stone-700 cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
              alt="User"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-0 right-0 size-2 bg-emerald-500 border-2 border-white dark:border-stone-900 rounded-full" />
          </div>
        </div>
      </div>

      {/* Main Grid: Left Video & Details (70%) | Right Sidebar Curriculum & Info (30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Lesson Title & High-level Metrics Row */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50">
              How To Speak To Anyone Without Being Cringe
            </h1>

            {/* Metrics Pills matching Image 1 */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-stone-600 dark:text-stone-400 pt-1">
              {/* Rating */}
              <div className="flex items-center gap-1.5">
                <Star className="size-4 text-amber-400 fill-amber-400" />
                <div>
                  <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">4.5</span>
                  <span className="text-[11px] text-stone-400 block">14,115 Ratings</span>
                </div>
              </div>

              {/* Students Enrolled */}
              <div className="flex items-center gap-1.5">
                <GraduationCap className="size-4 text-stone-400" />
                <div>
                  <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">321,195</span>
                  <span className="text-[11px] text-stone-400 block">Students Enrolled</span>
                </div>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-1.5">
                <Clock className="size-4 text-stone-400" />
                <div>
                  <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">1.2h</span>
                  <span className="text-[11px] text-stone-400 block">Total Duration</span>
                </div>
              </div>

              {/* Last Updated */}
              <div className="flex items-center gap-1.5">
                <Calendar className="size-4 text-stone-400" />
                <div>
                  <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">3d ago</span>
                  <span className="text-[11px] text-stone-400 block">Last Updated</span>
                </div>
              </div>

              {/* Languages */}
              <div className="flex items-center gap-1.5">
                <Globe className="size-4 text-stone-400" />
                <div>
                  <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">8+</span>
                  <span className="text-[11px] text-stone-400 block">Languages</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Player Card — adapts to content_type */}
          <div className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-xs">
            {/* ── VIDEO LESSON ── */}
            {(!currentLesson.content_type || currentLesson.content_type === 'VIDEO') && (
              <div className="relative aspect-16/9 bg-stone-950 overflow-hidden group">
                <video
                  ref={videoRef}
                  key={currentLesson.videoUrl}
                  src={currentLesson.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
                  poster={currentLesson.poster || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&auto=format&fit=crop&q=80'}
                  controls
                  className="w-full h-full object-cover"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                {!isPlaying && (
                  <button
                    onClick={handlePlayToggle}
                    className="absolute inset-0 m-auto size-16 sm:size-20 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white transition-all transform hover:scale-110 shadow-2xl z-20 cursor-pointer"
                    aria-label="Play video"
                  >
                    <Play className="size-7 sm:size-8 fill-white translate-x-0.5" />
                  </button>
                )}
              </div>
            )}

            {/* ── DOCUMENT / PDF LESSON ── */}
            {(currentLesson.content_type === 'DOCUMENT' || currentLesson.content_type === 'PDF') && (
              <div className="flex flex-col">
                {/* Header Banner */}
                <div className="relative flex flex-col items-center justify-center gap-4 py-14 px-6 text-center bg-gradient-to-br from-purple-900/30 via-stone-900/60 to-stone-950 border-b border-stone-800">
                  <div className="size-16 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                    <FileText className="size-8 text-purple-400" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white">{currentLesson.title}</h3>
                    <p className="text-xs text-stone-400">Reading Material — scroll through below or download</p>
                  </div>
                  {currentLesson.content_url && (
                    <a
                      href={currentLesson.content_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all"
                    >
                      <Download className="size-3.5" />
                      Open / Download Document
                    </a>
                  )}
                </div>
                {/* Content body rendered as formatted text */}
                {currentLesson.content_body && (
                  <div className="p-6 text-xs text-stone-300 leading-7 whitespace-pre-wrap font-mono bg-stone-950/30 max-h-80 overflow-y-auto">
                    {currentLesson.content_body}
                  </div>
                )}
                {!currentLesson.content_body && !currentLesson.content_url && (
                  <div className="flex flex-col items-center gap-2 py-10 text-stone-500">
                    <AlertCircle className="size-6" />
                    <p className="text-xs">No document content available yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* ── LINK LESSON ── */}
            {currentLesson.content_type === 'LINK' && (
              <div className="flex flex-col items-center justify-center gap-5 py-16 px-8 text-center bg-gradient-to-br from-blue-900/20 via-stone-900/60 to-stone-950">
                <div className="size-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                  <ExternalLink className="size-8 text-blue-400" />
                </div>
                <div className="space-y-1 max-w-sm">
                  <h3 className="text-base font-bold text-white">{currentLesson.title}</h3>
                  <p className="text-xs text-stone-400">This lesson links to an external resource. Click below to open it in a new tab.</p>
                </div>
                {currentLesson.content_url ? (
                  <a
                    href={currentLesson.content_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all"
                  >
                    <ExternalLink className="size-3.5" />
                    Open External Resource
                  </a>
                ) : (
                  <p className="text-xs text-stone-500">No link provided yet.</p>
                )}
              </div>
            )}

            {/* ── CODE LESSON ── */}
            {currentLesson.content_type === 'CODE' && (
              <div className="flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 bg-stone-900 border-b border-stone-800">
                  <div className="flex items-center gap-2">
                    <Code2 className="size-4 text-emerald-400" />
                    <span className="text-xs font-bold text-stone-200">{currentLesson.title}</span>
                  </div>
                  <button
                    onClick={() => { navigator.clipboard.writeText(currentLesson.content_body || ''); toast.success('Code copied!'); }}
                    className="text-[11px] text-stone-400 hover:text-stone-100 px-2 py-1 rounded-md hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
                <pre className="p-5 text-[11px] text-emerald-300 leading-relaxed font-mono bg-stone-950 overflow-x-auto max-h-96 whitespace-pre-wrap">
                  {currentLesson.content_body || '// No code provided yet'}
                </pre>
              </div>
            )}

            {/* Video Action Toolbar matching image */}
            <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border-t border-stone-100 dark:border-stone-800">
              {/* Left Buttons: Save Note & Download */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => {
                    setIsSaved(!isSaved);
                    setActiveTab('notes');
                    toast.success('Note notebook opened!');
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 transition-all cursor-pointer"
                >
                  <Bookmark className={`size-3.5 ${isSaved ? 'fill-purple-600 text-purple-600' : ''}`} />
                  <span>Save Note</span>
                </button>

                <button
                  onClick={() => toast.success('Lesson offline materials download initiated')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 transition-all cursor-pointer"
                >
                  <Download className="size-3.5" />
                  <span>Download</span>
                </button>
              </div>

              {/* Right Buttons: Share, Like, Dislike, Flag */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-all cursor-pointer"
                >
                  <Share2 className="size-3.5" />
                  <span>Share</span>
                </button>

                <button
                  onClick={handleLike}
                  className={`size-9 rounded-full border border-stone-200 dark:border-stone-700 flex items-center justify-center transition-all cursor-pointer ${
                    hasLiked
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100'
                  }`}
                  title="Like"
                >
                  <ThumbsUp className="size-3.5" />
                </button>

                <button
                  onClick={handleDislike}
                  className={`size-9 rounded-full border border-stone-200 dark:border-stone-700 flex items-center justify-center transition-all cursor-pointer ${
                    hasDisliked
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100'
                  }`}
                  title="Dislike"
                >
                  <ThumbsDown className="size-3.5" />
                </button>

                <button
                  onClick={() => toast.info('Flag report submitted for review')}
                  className="size-9 rounded-full border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-500 hover:text-rose-500 flex items-center justify-center transition-colors cursor-pointer"
                  title="Report"
                >
                  <Flag className="size-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Instructor Card & Social Proof (Matching Image 2) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-full overflow-hidden border border-stone-200 dark:border-stone-700">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                  alt="Instructor"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">X_AE_A-13b</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">Professional Professor</p>
              </div>
            </div>

            {/* Stats Badges */}
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                <Star className="size-3 fill-amber-400 text-amber-400" /> 4.5
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                <GraduationCap className="size-3 text-stone-400" /> 2.5K
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                <Heart className="size-3 text-rose-500 fill-rose-500" /> 22
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                <ThumbsUp className="size-3 text-purple-600" /> {likesCount}
              </span>
            </div>
          </div>

          {/* Tab Navigation Below Video Player */}
          <div className="space-y-6">
            <div className="flex items-center gap-6 border-b border-stone-200 dark:border-stone-800 overflow-x-auto text-xs sm:text-sm font-medium">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'quiz', label: 'Quiz' },
                { id: 'notes', label: 'Notes' },
                { id: 'resources', label: 'Resources' },
                { id: 'announcements', label: 'Announcements' },
                { id: 'reviews', label: 'Reviews' },
                { id: 'next-steps', label: 'Next Steps', badge: '12' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3.5 relative transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? 'text-purple-600 dark:text-purple-400 font-bold'
                      : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 font-semibold">
                      {tab.badge}
                    </span>
                  )}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab 1: Overview & Summary Grid */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Summary Section */}
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">Summary</h3>

                  {/* 2-Column Summary Grid matching Image 1 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-8 text-xs sm:text-sm text-stone-600 dark:text-stone-300">
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="size-4 text-stone-400" />
                      <span>Skill Level: <strong className="text-stone-900 dark:text-stone-100 font-semibold">All Levels</strong></span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Video className="size-4 text-stone-400" />
                      <span>Lectures: <strong className="text-stone-900 dark:text-stone-100 font-semibold">25</strong></span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Users className="size-4 text-stone-400" />
                      <span>Students: <strong className="text-stone-900 dark:text-stone-100 font-semibold">215,118</strong></span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Clock className="size-4 text-stone-400" />
                      <span>Duration: <strong className="text-stone-900 dark:text-stone-100 font-semibold">6h</strong></span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Globe className="size-4 text-stone-400" />
                      <span>Languages: <strong className="text-stone-900 dark:text-stone-100 font-semibold">EN, JP</strong></span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Award className="size-4 text-stone-400" />
                      <span>Certification: <strong className="text-stone-900 dark:text-stone-100 font-semibold">Yes</strong></span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Subtitles className="size-4 text-stone-400" />
                      <span>Captions: <strong className="text-stone-900 dark:text-stone-100 font-semibold">Yes</strong></span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Smartphone className="size-4 text-stone-400" />
                      <span>App Support: <strong className="text-stone-900 dark:text-stone-100 font-semibold">Yes</strong></span>
                    </div>
                  </div>
                </div>

                {/* Course Description Section (matching Image 2) */}
                <div className="space-y-3 pt-4 border-t border-stone-200/70 dark:border-stone-800">
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    Course Description
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Interactive Notes */}
            {activeTab === 'notes' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-800 dark:text-stone-200">
                    Add Note at Current Timestamp
                  </label>
                  <textarea
                    value={currentNote}
                    onChange={(e) => setCurrentNote(e.target.value)}
                    placeholder="Write down key takeaways or thoughts..."
                    className="w-full h-24 p-3 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  />
                  <button
                    onClick={handleSaveNote}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
                  >
                    Save Note
                  </button>
                </div>

                <div className="space-y-2.5 pt-4">
                  <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Your Saved Notes ({notesList.length})
                  </h4>
                  {notesList.map((note, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/60 text-xs text-stone-700 dark:text-stone-300 leading-relaxed flex items-start gap-2"
                    >
                      <Bookmark className="size-3.5 text-purple-600 shrink-0 mt-0.5" />
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Quiz */}
            {activeTab === 'quiz' && (
              <div className="p-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-4 text-xs">
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Quick Knowledge Check
                </h3>
                <p className="text-stone-500">
                  Test what you learned in <strong>{currentLesson.title}</strong> before moving on!
                </p>
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => toast.success('Correct answer! 🎉')}
                    className="w-full text-left p-3 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all cursor-pointer"
                  >
                    A. Listening actively and holding eye contact comfortably
                  </button>
                  <button
                    onClick={() => toast.error('Try again!')}
                    className="w-full text-left p-3 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all cursor-pointer"
                  >
                    B. Staring without blinking while speaking rapid jargon
                  </button>
                </div>
              </div>
            )}

            {/* Tab 4: Resources — reads from lesson payload */}
            {activeTab === 'resources' && (
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">Lesson Resources</h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Downloadable files and links attached to this lesson
                    </p>
                  </div>
                  {(currentLesson.resources?.length ?? 0) > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 text-[10px] font-bold">
                      {currentLesson.resources!.length} file{currentLesson.resources!.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {/* Resource Cards */}
                {(currentLesson.resources?.length ?? 0) > 0 ? (
                  <div className="space-y-2">
                    {currentLesson.resources!.map((res) => {
                      const iconMap: Record<string, { icon: typeof FileText; color: string; bg: string }> = {
                        PDF:   { icon: FileText, color: 'text-rose-500',    bg: 'bg-rose-50 dark:bg-rose-950/40' },
                        DOC:   { icon: FileText, color: 'text-blue-500',    bg: 'bg-blue-50 dark:bg-blue-950/40' },
                        LINK:  { icon: LinkIcon, color: 'text-purple-500',  bg: 'bg-purple-50 dark:bg-purple-950/40' },
                        CODE:  { icon: Code2,    color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
                        IMAGE: { icon: ImageIcon,color: 'text-amber-500',   bg: 'bg-amber-50 dark:bg-amber-950/40' },
                        OTHER: { icon: File,     color: 'text-stone-500',   bg: 'bg-stone-100 dark:bg-stone-800' },
                      };
                      const { icon: Icon, color, bg } = iconMap[res.file_type] ?? iconMap.OTHER;
                      const sizeLabel = res.file_size_kb
                        ? res.file_size_kb >= 1024
                          ? `${(res.file_size_kb / 1024).toFixed(1)} MB`
                          : `${res.file_size_kb} KB`
                        : null;

                      return (
                        <div
                          key={res.id}
                          className="flex items-center justify-between p-3.5 rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 hover:shadow-sm transition-shadow group"
                        >
                          {/* Icon + Info */}
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                              <Icon className={`size-5 ${color}`} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                                {res.title}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className={`text-[10px] font-semibold uppercase ${color}`}>{res.file_type}</span>
                                {sizeLabel && (
                                  <>
                                    <span className="text-stone-300 dark:text-stone-700 text-[10px]">·</span>
                                    <span className="text-[10px] text-stone-500">{sizeLabel}</span>
                                  </>
                                )}
                              </div>
                              {res.description && (
                                <p className="text-[11px] text-stone-400 mt-0.5 truncate">{res.description}</p>
                              )}
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="shrink-0 ml-3">
                            {res.file_type === 'LINK' ? (
                              <a
                                href={res.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-purple-100 dark:bg-stone-800 dark:hover:bg-purple-950/40 text-stone-700 dark:text-stone-200 hover:text-purple-700 dark:hover:text-purple-300 text-[10px] font-semibold transition-all cursor-pointer"
                              >
                                <ExternalLink className="size-3" />
                                Open
                              </a>
                            ) : (
                              <a
                                href={res.file_url}
                                download
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-purple-100 dark:bg-stone-800 dark:hover:bg-purple-950/40 text-stone-700 dark:text-stone-200 hover:text-purple-700 dark:hover:text-purple-300 text-[10px] font-semibold transition-all cursor-pointer"
                              >
                                <Download className="size-3" />
                                Download
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Empty state */
                  <div className="flex flex-col items-center gap-3 py-10 text-center">
                    <div className="size-12 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                      <FileText className="size-6 text-stone-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-stone-600 dark:text-stone-300">No resources yet</p>
                      <p className="text-[11px] text-stone-400 max-w-xs">
                        The instructor hasn't attached any downloadable files or links to this lesson.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN SIDEBAR (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-5 sticky top-20">
          {/* Top Switcher between Course Content and Course Information */}
          <div className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs space-y-4">
            {/* Header with Switcher Options */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSidebarView('content')}
                  className={`text-sm font-bold transition-colors cursor-pointer ${
                    sidebarView === 'content'
                      ? 'text-stone-900 dark:text-stone-50'
                      : 'text-stone-400 hover:text-stone-700'
                  }`}
                >
                  Course Content
                </button>
                <span className="text-stone-300 dark:text-stone-700">|</span>
                <button
                  onClick={() => setSidebarView('info')}
                  className={`text-sm font-bold transition-colors cursor-pointer ${
                    sidebarView === 'info'
                      ? 'text-stone-900 dark:text-stone-50'
                      : 'text-stone-400 hover:text-stone-700'
                  }`}
                >
                  Course Information
                </button>
              </div>

              <button
                onClick={() => setSidebarView(sidebarView === 'content' ? 'info' : 'content')}
                className="size-7 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                title="Toggle Sidebar View"
              >
                <MoreVertical className="size-4" />
              </button>
            </div>

            {/* SIDEBAR VIEW A: Course Content (Curriculum Accordion matching Image 1) */}
            {sidebarView === 'content' && (
              <div className="space-y-4 max-h-[calc(100vh-14rem)] overflow-y-auto pr-1">
                {modules.map((module) => {
                  const isExpanded = expandedModules[module.id];
                  return (
                    <div
                      key={module.id}
                      className="rounded-2xl border border-stone-100 dark:border-stone-800/80 overflow-hidden bg-stone-50/40 dark:bg-stone-950/40"
                    >
                      {/* Module Accordion Header */}
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full p-3.5 flex items-center justify-between text-left hover:bg-stone-100/60 dark:hover:bg-stone-800/60 transition-all cursor-pointer select-none"
                      >
                        <div className="space-y-0.5">
                          <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                            {module.title}
                          </h3>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400">
                            {module.subtitle}
                          </p>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="size-4 text-stone-400" />
                        ) : (
                          <ChevronDown className="size-4 text-stone-400" />
                        )}
                      </button>

                      {/* Module Lessons List */}
                      {isExpanded && (
                        <div className="divide-y divide-stone-100 dark:divide-stone-800/60 border-t border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900">
                          {module.lessons.map((lesson) => {
                            const isSelected = lesson.id === currentLesson.id;
                            const isCompleted = completedLessonIds.includes(lesson.id);

                            return (
                              <div
                                key={lesson.id}
                                onClick={() => handleLessonSelect(lesson)}
                                className={`p-3.5 flex items-center justify-between gap-3 text-xs transition-all cursor-pointer group select-none ${
                                  isSelected
                                    ? 'bg-purple-50/80 dark:bg-purple-950/40 border-l-4 border-purple-600 text-purple-950 dark:text-purple-100 font-semibold'
                                    : 'hover:bg-stone-50 dark:hover:bg-stone-800/40 text-stone-700 dark:text-stone-300'
                                }`}
                              >
                                <div className="space-y-0.5 truncate">
                                  <p className="font-semibold text-stone-900 dark:text-stone-100 truncate flex items-center gap-1.5">
                                    <span>{lesson.number}: {lesson.title}</span>
                                  </p>
                                  <p className="text-[11px] text-stone-400">
                                    {isCompleted ? 'Completed' : lesson.duration}
                                  </p>
                                </div>

                                {/* Right Checkmark Badge, Lock Badge, or Play Icon */}
                                <div className="shrink-0 flex items-center">
                                  {isCompleted ? (
                                    <span className="size-5 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-xs">
                                      <Check className="size-3 stroke-[3]" />
                                    </span>
                                  ) : lesson.isFree === false ? (
                                    <span className="size-5 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center text-stone-400 group-hover:text-amber-500 group-hover:border-amber-500 transition-colors" title="Pro Lesson (Locked)">
                                      <Lock className="size-2.5" />
                                    </span>
                                  ) : (
                                    <span className="size-5 rounded-full border border-stone-300 dark:border-stone-600 flex items-center justify-center text-stone-400 group-hover:text-purple-600 group-hover:border-purple-600 transition-colors">
                                      <Play className="size-2.5 fill-current ml-0.5" />
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* SIDEBAR VIEW B: Course Information (Instructors, Resources, Topics matching Image 2) */}
            {sidebarView === 'info' && (
              <div className="space-y-6 max-h-[calc(100vh-14rem)] overflow-y-auto pr-1">
                {/* Instructors Section */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider">
                    Instructors
                  </h4>
                  <div className="space-y-2.5">
                    {instructors.map((inst) => (
                      <div
                        key={inst.id}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800/60 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={inst.avatar}
                            alt={inst.name}
                            className="size-8 rounded-full object-cover border border-stone-200 dark:border-stone-700"
                          />
                          <div>
                            <p className="text-xs font-bold text-stone-900 dark:text-stone-100">
                              {inst.name}
                            </p>
                            <p className="text-[10px] text-stone-500">{inst.awards}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => toast.info(`Viewing ${inst.name} credentials`)}
                          className="text-stone-400 hover:text-purple-600 p-1"
                        >
                          <LinkIcon className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => toast.info('All certified course faculty')}
                    className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline pt-1 block"
                  >
                    See All Instructors
                  </button>
                </div>

                {/* Resource Types Section */}
                <div className="space-y-3 pt-3 border-t border-stone-100 dark:border-stone-800">
                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider">
                    Resource Types
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-xl border border-stone-100 dark:border-stone-800/80 bg-stone-50/50 dark:bg-stone-950/40">
                      <div className="flex items-center gap-2.5">
                        <Video className="size-4 text-purple-600" />
                        <div>
                          <p className="font-semibold text-stone-900 dark:text-stone-100">
                            Demonstration Videos
                          </p>
                          <p className="text-[10px] text-stone-500">60 - 80 min</p>
                        </div>
                      </div>
                      <Info className="size-3.5 text-stone-400" />
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl border border-stone-100 dark:border-stone-800/80 bg-stone-50/50 dark:bg-stone-950/40">
                      <div className="flex items-center gap-2.5">
                        <HelpCircle className="size-4 text-purple-600" />
                        <div>
                          <p className="font-semibold text-stone-900 dark:text-stone-100">
                            Problem Sets
                          </p>
                          <p className="text-[10px] text-stone-500">10 - 20 questions</p>
                        </div>
                      </div>
                      <Info className="size-3.5 text-stone-400" />
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl border border-stone-100 dark:border-stone-800/80 bg-stone-50/50 dark:bg-stone-950/40">
                      <div className="flex items-center gap-2.5">
                        <GraduationCap className="size-4 text-purple-600" />
                        <div>
                          <p className="font-semibold text-stone-900 dark:text-stone-100">
                            Lecture Notes
                          </p>
                          <p className="text-[10px] text-stone-500">60 - 80 pages</p>
                        </div>
                      </div>
                      <Info className="size-3.5 text-stone-400" />
                    </div>
                  </div>
                </div>

                {/* Topics Tags Section */}
                <div className="space-y-2 pt-3 border-t border-stone-100 dark:border-stone-800">
                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider">
                    Topics
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {['#Communication', '#Confidence', '#PublicSpeaking', '#Psychology', '#Charisma'].map(
                      (topic) => (
                        <span
                          key={topic}
                          className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[10px] font-medium"
                        >
                          {topic}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Axli Lesson Completed Celebration Modal Overlay */}
      {showCelebrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="relative size-36 mx-auto flex items-center justify-center">
              <img
                src={celebrateAxli}
                alt="Axli Celebrating"
                className="w-full h-full object-contain animate-bounce duration-1000"
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground">
                Lesson Completed! 🎉
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Axli is proud of your progress! Keep that momentum going into the next module.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setShowCelebrationModal(false)}
                className="w-full py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
              >
                Continue Learning
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Axli Locked Lesson Paywall Modal Overlay */}
      {showPaywallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="relative size-36 mx-auto flex items-center justify-center">
              <img
                src={paywallAxli}
                alt="Axli Locked"
                className="w-full h-full object-contain drop-shadow-xl"
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground">
                Unlock Full Masterclass 🔒
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This lesson is part of the full curriculum. Enroll today to access all modules, downloadable resources, and your verified certificate.
              </p>
            </div>
            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  setShowPaywallModal(false);
                  navigate('/payments');
                }}
                className="w-full py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
              >
                Unlock Course Access
              </button>
              <button
                onClick={() => setShowPaywallModal(false)}
                className="w-full py-2 rounded-full text-xs font-medium text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
