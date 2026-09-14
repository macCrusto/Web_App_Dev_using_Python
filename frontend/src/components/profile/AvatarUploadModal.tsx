import * as React from 'react';
import { X, Upload, Camera, CheckCircle2, AlertCircle, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/src/services/apiClient';
import { useAuth } from '@/src/context/AuthContext';

interface AvatarUploadModalProps {
  currentAvatar?: string;
  userName: string;
  onClose: () => void;
}

const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

function getInitials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function AvatarUploadModal({ currentAvatar, userName, onClose }: AvatarUploadModalProps) {
  const { updateUser } = useAuth();
  const [preview, setPreview] = React.useState<string | null>(currentAvatar || null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [validationError, setValidationError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Close on Escape
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const validateAndSetFile = (file: File) => {
    setValidationError(null);
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setValidationError('Only JPEG, PNG, WebP, or GIF files are accepted.');
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setValidationError(`File too large. Maximum size is ${MAX_SIZE_MB} MB.`);
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', selectedFile);
      const result = await apiClient.uploadFile<{ success: boolean; avatar_url: string }>(
        '/api/auth/avatar',
        formData
      );
      if (result.success && result.avatar_url) {
        updateUser({ avatar: result.avatar_url });
        toast.success('Profile picture updated! 🎉');
        onClose();
      } else {
        throw new Error('Upload failed');
      }
    } catch {
      toast.error('Failed to upload avatar. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const hasNewFile = !!selectedFile;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal Panel */}
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Camera className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Update Profile Photo</h2>
              <p className="text-[11px] text-muted-foreground">JPG, PNG, WebP or GIF · Max {MAX_SIZE_MB} MB</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Current Preview */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative group">
              {preview ? (
                <img
                  src={preview}
                  alt="Avatar preview"
                  className="size-28 rounded-2xl object-cover ring-4 ring-primary/20 shadow-md"
                />
              ) : (
                <div className="size-28 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold ring-4 ring-primary/20 shadow-md">
                  {getInitials(userName)}
                </div>
              )}
              {/* Camera overlay on preview */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
              >
                <Camera className="size-6" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              {hasNewFile ? (
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="size-3.5" /> New photo ready to upload
                </span>
              ) : 'Hover image to change · or use the drop zone below'}
            </p>
          </div>

          {/* Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
              isDragging
                ? 'border-primary bg-primary/5 scale-[1.01]'
                : 'border-stone-200 dark:border-stone-700 hover:border-primary/60 hover:bg-stone-50 dark:hover:bg-stone-800/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_TYPES.join(',')}
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="flex flex-col items-center gap-2">
              <div className={`size-10 rounded-xl flex items-center justify-center transition-colors ${isDragging ? 'bg-primary/20 text-primary' : 'bg-stone-100 dark:bg-stone-800 text-stone-400'}`}>
                {isDragging ? <Upload className="size-5" /> : <ImageIcon className="size-5" />}
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-700 dark:text-stone-200">
                  {isDragging ? 'Drop your image here' : 'Drag & drop or click to browse'}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Supports JPEG, PNG, WebP, GIF
                </p>
              </div>
            </div>
          </div>

          {/* Validation Error */}
          {validationError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs">
              <AlertCircle className="size-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3 p-6 pt-0">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!hasNewFile || isUploading}
            className="flex-1 py-2.5 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-sm shadow-primary/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            {isUploading ? (
              <>
                <span className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <Upload className="size-3.5" />
                Save Photo
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
