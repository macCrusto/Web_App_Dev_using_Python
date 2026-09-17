export type UserRole = 'USER' | 'INSTRUCTOR' | 'ADMIN';

export interface User {
  id: number | string;
  fullname: string;
  email: string;
  role: UserRole;
  phone_no?: string;
  is_verified?: boolean;
  avatar?: string;
  last_role_switch?: string | null;
}

export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Course {
  id: number;
  instructor_id?: number | string;
  instructor?: string | number;
  instructor_name?: string;
  instructor_avatar?: string;
  title: string;
  slug: string;
  description?: string;
  category?: string;
  thumbnail?: string;
  thumbnail_url?: string;
  thumbnail_badge?: string;
  price: number | string;
  original_price?: number | string;
  discount_percent?: number | string;
  currency: string;
  status: CourseStatus;
  free_count?: number;
  modules_count?: number;
  lessons_count?: number;
  classes_count?: number;
  students_count?: number;
  rating?: number;
  level?: string;
  tags?: string[];
  duration?: string;
  last_updated?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Module {
  id: number;
  course_id: number;
  title?: string;
  description?: string;
  position?: number;
  module_position?: number;
  created_at?: string;
  updated_at?: string;
  lessons?: Lesson[];
  access_level?: 'full' | 'preview';
  message?: string;
}

export type LessonContentType = 'VIDEO' | 'DOCUMENT' | 'PDF' | 'LINK' | 'CODE';

export type ResourceFileType = 'VIDEO' | 'PDF' | 'DOC' | 'DOCX' | 'PPT' | 'PPTX' | 'XLS' | 'XLSX' | 'TXT' | 'MD' | 'CSV' | 'ZIP' | 'LINK' | 'CODE' | 'IMAGE' | 'OTHER';

export interface LessonResource {
  id: number;
  lesson_id: number;
  title: string;
  file_url: string;
  file_type: ResourceFileType;
  file_size_kb?: number;
  description?: string;
}

export interface Lesson {
  id: number;
  module_id?: number;
  title: string;
  description?: string;
  content_type: LessonContentType;
  content_url?: string | null;
  content_body?: string | null;
  lesson_position?: number;
  position?: number;
  is_free: boolean;
  duration_seconds?: number | null;
  is_published?: boolean;
  access_restricted?: boolean;
  message?: string;
  created_at?: string;
  updated_at?: string;
  resources?: LessonResource[];
}

export interface Enrollment {
  id: number;
  user_id: number | string;
  course_id: number;
  access_type: 'PREVIEW' | 'FULL';
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELED';
  enrolled_at: string;
  course?: Course;
  progress?: number;
  completed_lessons?: number;
  total_lessons?: number;
  last_lesson?: string;
}

export interface PaymentTransaction {
  id: number;
  user_id: number | string;
  course_id: number;
  course_title?: string;
  reference: string;
  provider: 'PAYSTACK' | 'FLUTTERWAVE';
  amount: number | string;
  currency: string;
  status: 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED';
  paid_at?: string;
  created_at: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
  course?: Course;
  courses?: Course[];
  module?: Module;
  modules?: Module[];
  lesson?: Lesson;
  lessons?: Lesson[];
  access_token?: string;
  user?: User;
  video_url?: string;
}
