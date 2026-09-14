import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  Video,
  FileText,
  Code2,
  Eye,
  Sparkles,
  Upload,
  Lock,
  Layers,
  Save,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LessonFileUploadModal } from '@/src/components/lessons/LessonFileUploadModal';
import type { Lesson, LessonContentType, Module } from '@/src/types';
import { toast } from 'sonner';

export default function CurriculumBuilderPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [modules, setModules] = useState<Module[]>([
    {
      id: 1,
      course_id: Number(courseId) || 1,
      title: 'Module 1: Foundation & Flask Architecture',
      description: 'Environment setup, blueprints, and clean factory pattern.',
      position: 1,
      lessons: [
        {
          id: 1,
          module_id: 1,
          title: 'Welcome & Curriculum Overview',
          content_type: 'VIDEO',
          is_free: true,
          lesson_position: 1,
          duration_seconds: 720,
          content_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        },
        {
          id: 2,
          module_id: 1,
          title: 'Flask App Factory & Blueprint Setup',
          content_type: 'CODE',
          is_free: true,
          lesson_position: 2,
          duration_seconds: 1080,
          content_body: `from flask import Flask\nfrom extension import bcrypt, jwt\n\ndef create_app():\n    app = Flask(__name__)\n    return app`,
        },
        {
          id: 3,
          module_id: 1,
          title: 'Clean Architecture & REST Guidelines',
          content_type: 'DOCUMENT',
          is_free: true,
          lesson_position: 3,
          duration_seconds: 1500,
          content_body: `### RESTful APIs in Flask\nAlways structure endpoints with semantic HTTP verbs.`,
        },
      ],
    },
    {
      id: 2,
      course_id: Number(courseId) || 1,
      title: 'Module 2: Database Schema & MySQL Transactions',
      description: 'Designing MySQL schemas, foreign keys, and indexes.',
      position: 2,
      lessons: [
        {
          id: 4,
          module_id: 2,
          title: 'Relational Schema Design & Foreign Keys',
          content_type: 'VIDEO',
          is_free: false,
          lesson_position: 1,
          duration_seconds: 1920,
        },
        {
          id: 5,
          module_id: 2,
          title: 'Writing Safe ACID Transactions in PyMySQL',
          content_type: 'CODE',
          is_free: false,
          lesson_position: 2,
          duration_seconds: 1320,
        },
      ],
    },
  ]);

  // Modal State for Video/File Upload
  const [activeUploadLesson, setActiveUploadLesson] = useState<Lesson | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // New Module Modal / Input State
  const [showNewModuleInput, setShowNewModuleInput] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleDescription, setNewModuleDescription] = useState('');

  // New Lesson State
  const [activeModuleForLesson, setActiveModuleForLesson] = useState<number | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonType, setNewLessonType] = useState<LessonContentType>('VIDEO');
  const [newLessonIsFree, setNewLessonIsFree] = useState(false);

  // Inline editing module state
  const [editingModuleId, setEditingModuleId] = useState<number | null>(null);
  const [editModuleTitle, setEditModuleTitle] = useState('');

  // Add Module
  const handleAddModule = () => {
    if (!newModuleTitle.trim()) {
      toast.error('Module title is required');
      return;
    }

    const newMod: Module = {
      id: Date.now(),
      course_id: Number(courseId) || 1,
      title: newModuleTitle.trim(),
      description: newModuleDescription.trim() || undefined,
      position: modules.length + 1,
      lessons: [],
    };

    setModules([...modules, newMod]);
    setNewModuleTitle('');
    setNewModuleDescription('');
    setShowNewModuleInput(false);
    toast.success('New module created successfully!');
  };

  // Delete Module
  const handleDeleteModule = (moduleId: number) => {
    setModules(modules.filter((m) => m.id !== moduleId));
    toast.success('Module deleted');
  };

  // Save Inline Edit Module
  const handleSaveModuleTitle = (moduleId: number) => {
    if (!editModuleTitle.trim()) return;
    setModules(
      modules.map((m) => (m.id === moduleId ? { ...m, title: editModuleTitle.trim() } : m))
    );
    setEditingModuleId(null);
    toast.success('Module renamed');
  };

  // Add Lesson
  const handleAddLesson = (moduleId: number) => {
    if (!newLessonTitle.trim()) {
      toast.error('Lesson title is required');
      return;
    }

    const targetMod = modules.find((m) => m.id === moduleId);
    const nextPos = (targetMod?.lessons?.length || 0) + 1;

    const newLes: Lesson = {
      id: Date.now(),
      module_id: moduleId,
      title: newLessonTitle.trim(),
      content_type: newLessonType,
      is_free: newLessonIsFree,
      lesson_position: nextPos,
      position: nextPos,
    };

    setModules(
      modules.map((m) => {
        if (m.id === moduleId) {
          return { ...m, lessons: [...(m.lessons || []), newLes] };
        }
        return m;
      })
    );

    setNewLessonTitle('');
    setActiveModuleForLesson(null);
    toast.success('Lesson added to curriculum!');
  };

  // Delete Lesson
  const handleDeleteLesson = (moduleId: number, lessonId: number) => {
    setModules(
      modules.map((m) => {
        if (m.id === moduleId) {
          return { ...m, lessons: (m.lessons || []).filter((l) => l.id !== lessonId) };
        }
        return m;
      })
    );
    toast.success('Lesson removed');
  };

  // Trigger Video/File Upload Modal
  const openUploadModal = (lesson: Lesson) => {
    setActiveUploadLesson(lesson);
    setIsUploadModalOpen(true);
  };

  // Upload Complete callback
  const handleUploadSuccess = (updatedData: Partial<Lesson>) => {
    if (!activeUploadLesson) return;
    setModules(
      modules.map((m) => ({
        ...m,
        lessons: (m.lessons || []).map((l) =>
          l.id === activeUploadLesson.id ? { ...l, ...updatedData } : l
        ),
      }))
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/instructor/courses')}
            className="text-xs text-muted-foreground hover:text-foreground pl-0"
          >
            <ArrowLeft className="mr-1.5 size-3.5" /> Back to Studio
          </Button>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
            <Layers className="size-6 text-primary" />
            Curriculum Builder Studio
          </h1>
          <p className="text-xs text-muted-foreground">
            Author modules, organize lessons, upload high-definition video files, and set free preview access.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/courses/${courseId || 1}`)}
            className="text-xs gap-1.5"
          >
            <Eye className="size-3.5" /> Student Preview
          </Button>
          <Button
            size="sm"
            onClick={() => setShowNewModuleInput(true)}
            className="text-xs gap-1.5 shadow-xs"
          >
            <Plus className="size-3.5" /> Add Module
          </Button>
        </div>
      </div>

      {/* Add New Module Input Card */}
      {showNewModuleInput && (
        <Card className="border-primary/40 bg-primary/5 animate-in fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Sparkles className="size-4 text-primary" /> Create New Module
            </CardTitle>
            <CardDescription className="text-xs">
              Define the module topic title and learning objective description.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="m-title" className="text-xs font-semibold">
                Module Title
              </Label>
              <Input
                id="m-title"
                placeholder="e.g. Module 3: Authentication, JWT & OAuth2 Flow"
                value={newModuleTitle}
                onChange={(e) => setNewModuleTitle(e.target.value)}
                className="bg-background text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="m-desc" className="text-xs font-semibold">
                Short Description (Optional)
              </Label>
              <Input
                id="m-desc"
                placeholder="Key concepts covered in this module..."
                value={newModuleDescription}
                onChange={(e) => setNewModuleDescription(e.target.value)}
                className="bg-background text-xs"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setShowNewModuleInput(false)}
              >
                Cancel
              </Button>
              <Button size="sm" className="text-xs" onClick={handleAddModule}>
                Save Module
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modules & Lessons Curriculum Tree */}
      <div className="space-y-4">
        {modules.map((mod, index) => (
          <Card key={mod.id} className="border-border/80 overflow-hidden shadow-xs">
            {/* Module Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-muted/20 border-b border-border/60">
              <div className="flex items-center gap-2.5 flex-1">
                <span className="size-6 rounded-md bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                  {index + 1}
                </span>

                {editingModuleId === mod.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={editModuleTitle}
                      onChange={(e) => setEditModuleTitle(e.target.value)}
                      className="h-8 text-xs bg-background"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => handleSaveModuleTitle(mod.id)}
                    >
                      <Save className="size-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-xs"
                      onClick={() => setEditingModuleId(null)}
                    >
                      <X className="size-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                      {mod.title}
                    </h3>
                    {mod.description && (
                      <p className="text-[11px] text-muted-foreground">{mod.description}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs gap-1"
                  onClick={() => {
                    setEditingModuleId(mod.id);
                    setEditModuleTitle(mod.title || '');
                  }}
                >
                  <Edit2 className="size-3" /> Rename
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs text-destructive hover:bg-destructive/10"
                  onClick={() => handleDeleteModule(mod.id)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-7 text-xs gap-1"
                  onClick={() => setActiveModuleForLesson(mod.id)}
                >
                  <Plus className="size-3.5" /> Add Lesson
                </Button>
              </div>
            </div>

            {/* Lessons List in Module */}
            <div className="divide-y divide-border/40">
              {mod.lessons && mod.lessons.length > 0 ? (
                mod.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 hover:bg-muted/30 transition-all text-xs"
                  >
                    <div className="flex items-center gap-3">
                      {lesson.content_type === 'VIDEO' ? (
                        <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <Video className="size-3.5" />
                        </div>
                      ) : lesson.content_type === 'CODE' ? (
                        <div className="size-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                          <Code2 className="size-3.5" />
                        </div>
                      ) : (
                        <div className="size-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                          <FileText className="size-3.5" />
                        </div>
                      )}

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{lesson.title}</span>
                          {lesson.is_free ? (
                            <span className="rounded-full bg-emerald-500/10 px-2 py-0.2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                              Free Preview
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.2 rounded">
                              <Lock className="size-2.5" /> Paid
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          Type: {lesson.content_type} · {lesson.content_url ? 'Attached / Uploaded' : 'Pending media'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs gap-1.5 border-primary/40 hover:bg-primary/10 text-primary"
                        onClick={() => openUploadModal(lesson)}
                      >
                        <Upload className="size-3" /> Upload / Edit Media
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="size-7 p-0 text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteLesson(mod.id, lesson.id)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-muted-foreground space-y-2">
                  <p>No lessons added to this module yet.</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7"
                    onClick={() => setActiveModuleForLesson(mod.id)}
                  >
                    <Plus className="mr-1 size-3" /> Add First Lesson
                  </Button>
                </div>
              )}
            </div>

            {/* Quick Add Lesson Inline Form */}
            {activeModuleForLesson === mod.id && (
              <div className="p-4 bg-muted/40 border-t border-border/60 space-y-3 animate-in fade-in">
                <div className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                  <Plus className="size-3.5 text-primary" /> Add New Lesson to {mod.title}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <Label htmlFor="les-title" className="text-[11px] font-semibold">
                      Lesson Title
                    </Label>
                    <Input
                      id="les-title"
                      placeholder="e.g. Setting Up Redis Cache & Celery Workers"
                      value={newLessonTitle}
                      onChange={(e) => setNewLessonTitle(e.target.value)}
                      className="h-8 text-xs bg-background"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="les-type" className="text-[11px] font-semibold">
                      Content Format
                    </Label>
                    <select
                      id="les-type"
                      value={newLessonType}
                      onChange={(e) => setNewLessonType(e.target.value as LessonContentType)}
                      className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs"
                    >
                      <option value="VIDEO">VIDEO (Upload MP4)</option>
                      <option value="CODE">CODE (Interactive Lab)</option>
                      <option value="DOCUMENT">DOCUMENT (Notes)</option>
                      <option value="LINK">LINK (Resource)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={newLessonIsFree}
                      onChange={(e) => setNewLessonIsFree(e.target.checked)}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span className="text-foreground">Allow Free Preview without Enrollment</span>
                  </label>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setActiveModuleForLesson(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => handleAddLesson(mod.id)}
                    >
                      Save Lesson
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Lesson File Upload & Video Manager Modal */}
      <LessonFileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        lesson={activeUploadLesson}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
}
