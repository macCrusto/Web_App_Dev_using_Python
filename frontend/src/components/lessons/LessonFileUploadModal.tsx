import React, { useState, useRef } from 'react';
import {
  Upload,
  Video,
  FileText,
  Code2,
  Link2,
  CheckCircle2,
  X,
  Play,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { lessonService } from '@/src/services/lessonService';
import type { Lesson, LessonContentType } from '@/src/types';
import { toast } from 'sonner';

interface LessonFileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: Lesson | null;
  onUploadSuccess: (updatedLesson: Partial<Lesson>) => void;
}

export const LessonFileUploadModal: React.FC<LessonFileUploadModalProps> = ({
  isOpen,
  onClose,
  lesson,
  onUploadSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<LessonContentType>(
    lesson?.content_type || 'VIDEO'
  );
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(lesson?.content_url || '');
  const [contentBody, setContentBody] = useState<string>(lesson?.content_body || '');
  const [externalUrl, setExternalUrl] = useState<string>(lesson?.content_url || '');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !lesson) return null;

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    if (activeTab === 'VIDEO' && !file.type.startsWith('video/')) {
      toast.error('Please select a valid video file (MP4, WebM, MOV)');
      return;
    }
    if (activeTab === 'DOCUMENT' && !/\.(pdf|doc|docx|ppt|pptx|xls|xlsx|txt|md|csv|zip|png|jpg|jpeg|webp|gif)$/i.test(file.name)) {
      toast.error('Please select a permitted document or image file.');
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUploadFile = async () => {
    if (!selectedFile) {
      toast.error(`Please select a ${activeTab === 'VIDEO' ? 'video' : 'document'} file to upload.`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => (prev < 90 ? prev + 15 : prev));
    }, 300);

    try {
      const response = activeTab === 'VIDEO'
        ? await lessonService.uploadLessonVideo(lesson.id, selectedFile)
        : await lessonService.uploadLessonResource(lesson.id, selectedFile);
      clearInterval(progressInterval);
      setUploadProgress(100);

      const uploadedUrl = response.video_url || response.file_url || response.resource?.file_url;
      toast.success(`${activeTab === 'VIDEO' ? 'Video' : 'Document'} uploaded successfully!`);
      
      onUploadSuccess({
        content_type: activeTab,
        content_url: uploadedUrl,
        resources: response.resource ? [response.resource] : lesson.resources,
      });

      setTimeout(() => {
        setIsUploading(false);
        onClose();
      }, 500);
    } catch (err) {
      clearInterval(progressInterval);
      setIsUploading(false);
      toast.error(`Failed to upload ${activeTab === 'VIDEO' ? 'video' : 'document'}. Please try again.`);
    }
  };

  const handleSaveTextOrCode = async () => {
    try {
      setIsUploading(true);
      await lessonService.updateLesson(lesson.id, {
        content_type: activeTab,
        content_body: contentBody,
        content_url: activeTab === 'LINK' ? externalUrl : undefined,
      });
      toast.success('Lesson content saved successfully!');
      onUploadSuccess({
        content_type: activeTab,
        content_body: contentBody,
        content_url: activeTab === 'LINK' ? externalUrl : undefined,
      });
      setIsUploading(false);
      onClose();
    } catch (err) {
      setIsUploading(false);
      toast.error('Failed to save lesson content');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80 bg-muted/20">
          <div className="space-y-0.5">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Upload className="size-4 text-primary" />
              Lesson File & Media Manager
            </h2>
            <p className="text-xs text-muted-foreground truncate max-w-md">
              Lesson: <span className="font-semibold text-foreground">{lesson.title}</span>
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-lg"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Content Type Selector Tabs */}
        <div className="px-6 pt-4 border-b border-border/60 bg-muted/10">
          <div className="flex gap-2 overflow-x-auto pb-3">
            {[
              { type: 'VIDEO' as const, label: 'Video Upload', icon: Video },
              { type: 'DOCUMENT' as const, label: 'Document / Markdown', icon: FileText },
              { type: 'CODE' as const, label: 'Code Lab Snippet', icon: Code2 },
              { type: 'LINK' as const, label: 'External Resource', icon: Link2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.type;
              return (
                <button
                  key={tab.type}
                  type="button"
                  onClick={() => setActiveTab(tab.type)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="size-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'VIDEO' && (
            <div className="space-y-4">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-primary bg-primary/10 scale-[0.99]'
                    : 'border-border/80 hover:border-primary/50 bg-muted/15'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelected(e.target.files[0]);
                    }
                  }}
                />
                <div className="flex flex-col items-center gap-3">
                  <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-xs">
                    <Video className="size-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {selectedFile ? selectedFile.name : 'Click to select or drag & drop video'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Supports MP4, WebM, MOV up to 500MB
                    </p>
                  </div>
                  {selectedFile && (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="size-3" />
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB Ready
                    </span>
                  )}
                </div>
              </div>

              {/* Video Preview Player */}
              {previewUrl && (
                <div className="rounded-xl border border-border/70 overflow-hidden bg-black/90 p-2 space-y-2">
                  <div className="flex items-center justify-between text-xs text-zinc-300 px-1">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Play className="size-3 text-primary" /> Video Preview
                    </span>
                    <span className="text-[11px] text-zinc-500">Live Player</span>
                  </div>
                  <video
                    src={previewUrl}
                    controls
                    className="w-full max-h-56 rounded-lg object-contain bg-black"
                  />
                </div>
              )}

              {/* Progress Bar */}
              {isUploading && (
                <div className="space-y-1.5 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Loader2 className="size-3 animate-spin text-primary" /> Uploading to server...
                    </span>
                    <span className="text-foreground">{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all duration-300 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'DOCUMENT' && (
            <div className="space-y-3">
              <div className="rounded-xl border border-dashed border-border p-4 space-y-2">
                <Label htmlFor="lesson-document" className="text-xs font-semibold">Attach a document resource</Label>
                <input
                  id="lesson-document"
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.md,.csv,.zip,.png,.jpg,.jpeg,.webp,.gif"
                  onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
                  className="block w-full text-xs text-muted-foreground"
                />
                {selectedFile && <p className="text-xs text-foreground">Ready: {selectedFile.name}</p>}
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="doc-body" className="text-xs font-semibold">
                  Lesson Article / Markdown Notes
                </Label>
                <span className="text-[11px] text-muted-foreground">Supports Markdown & HTML</span>
              </div>
              <textarea
                id="doc-body"
                rows={10}
                value={contentBody}
                onChange={(e) => setContentBody(e.target.value)}
                placeholder="Write comprehensive lecture notes, key takeaways, diagrams, and formulas..."
                className="w-full rounded-xl border border-input bg-transparent p-3 text-sm font-mono placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          )}

          {activeTab === 'CODE' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="code-body" className="text-xs font-semibold">
                  Code Snippet & Exercise Script
                </Label>
                <span className="text-[11px] text-muted-foreground">Python / TypeScript / SQL</span>
              </div>
              <textarea
                id="code-body"
                rows={10}
                value={contentBody}
                onChange={(e) => setContentBody(e.target.value)}
                placeholder={`# Python Solution Example\ndef solve_problem(data):\n    # TODO: Write clean logic\n    return [x.strip() for x in data]\n`}
                className="w-full rounded-xl border border-input bg-zinc-950 text-zinc-100 p-3 text-xs font-mono placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
          )}

          {activeTab === 'LINK' && (
            <div className="space-y-3">
              <Label htmlFor="ext-url" className="text-xs font-semibold">
                Resource URL / Embed Link
              </Label>
              <Input
                id="ext-url"
                type="url"
                placeholder="https://github.com/repository or https://docs.python.org/..."
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                className="rounded-lg"
              />
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Sparkles className="size-3 text-primary" /> Students will be provided with a quick resource card to open or clone this link.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/80 bg-muted/20">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>

          {activeTab === 'VIDEO' || (activeTab === 'DOCUMENT' && selectedFile) ? (
            <Button
              size="sm"
              onClick={handleUploadFile}
              disabled={isUploading || !selectedFile}
              className="gap-1.5 shadow-md shadow-primary/20"
            >
              {isUploading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" /> Uploading File...
                </>
              ) : (
                <>
                  <Upload className="size-3.5" /> Save & Upload File
                </>
              )}
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleSaveTextOrCode}
              disabled={isUploading}
              className="gap-1.5"
            >
              {isUploading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="size-3.5" />
              )}
              Save Lesson Content
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonFileUploadModal;
