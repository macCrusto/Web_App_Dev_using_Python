import { apiClient } from './apiClient';
import { CONFIG } from '@/src/config/env';
import type { ApiResponse, Lesson, LessonContentType, LessonResource } from '@/src/types';

export interface CreateLessonPayload {
  title: string;
  content_type: LessonContentType;
  content_url?: string;
  content_body?: string;
  is_free?: boolean;
}

export interface UpdateLessonPayload {
  title?: string;
  description?: string;
  content_type?: LessonContentType;
  content_url?: string;
  content_body?: string;
  is_free?: boolean;
}

export interface LessonMediaUploadResponse extends ApiResponse {
  file_url: string;
  video_url?: string;
  resource: LessonResource;
}

export const lessonService = {
  /**
   * Create a lesson in a module
   * POST /api/courses/course/<module_id>/lesson
   */
  async createLesson(moduleId: number | string, payload: CreateLessonPayload): Promise<ApiResponse<Lesson>> {
    return apiClient.post<ApiResponse<Lesson>>(`/api/courses/course/${moduleId}/lesson`, payload);
  },

  /**
   * Get all lessons in a module (Instructor view)
   * GET /api/courses/modules/<module_id>/lessons
   */
  async getModuleLessons(moduleId: number | string): Promise<ApiResponse<Lesson[]>> {
    return apiClient.get<ApiResponse<Lesson[]>>(`/api/courses/modules/${moduleId}/lessons`);
  },

  /**
   * Update lesson details
   * PUT /api/courses/lessons/<lesson_id>
   */
  async updateLesson(lessonId: number | string, payload: UpdateLessonPayload): Promise<ApiResponse<Lesson>> {
    return apiClient.put<ApiResponse<Lesson>>(`/api/courses/lessons/${lessonId}`, payload);
  },

  /**
   * Delete a lesson
   * DELETE /api/courses/lessons/<lesson_id>
   */
  async deleteLesson(lessonId: number | string): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(`/api/courses/lessons/${lessonId}`);
  },

  /**
   * Upload video file for a lesson
   * POST /api/courses/lessons/<lesson_id>/video
   */
  async uploadLessonVideo(lessonId: number | string, videoFile: File): Promise<LessonMediaUploadResponse> {
    const formData = new FormData();
    formData.append('video', videoFile);
    return apiClient.uploadFile<LessonMediaUploadResponse>(
      `/api/courses/lessons/${lessonId}/media`, formData
    );
  },

  /** Upload a permitted lesson document and persist its resource metadata. */
  async uploadLessonResource(
    lessonId: number | string,
    file: File,
    metadata?: { title?: string; description?: string },
  ): Promise<LessonMediaUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata?.title) formData.append('title', metadata.title);
    if (metadata?.description) formData.append('description', metadata.description);
    return apiClient.uploadFile<LessonMediaUploadResponse>(
      `/api/courses/lessons/${lessonId}/media`, formData
    );
  },

  /** Return the authenticated download endpoint for a lesson resource. */
  getResourceDownloadUrl(lessonId: number | string, resourceId: number | string): string {
    return `${CONFIG.API_URL}/api/courses/lessons/${lessonId}/resources/${resourceId}/download`;
  },

  /**
   * Get full lesson detail including resources
  * GET /api/courses/lessons/<lesson_id>
   */
  async getLessonDetail(lessonId: number | string): Promise<ApiResponse<Lesson & { resources: LessonResource[] }>> {
    return apiClient.get<ApiResponse<Lesson & { resources: LessonResource[] }>>(
      `/api/courses/lessons/${lessonId}`
    );
  },
};
