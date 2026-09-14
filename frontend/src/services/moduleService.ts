import { apiClient } from './apiClient';
import type { ApiResponse, Module } from '@/src/types';

export interface CreateModulePayload {
  title: string;
  description?: string;
  position: number;
}

export interface UpdateModulePayload {
  title?: string;
  description?: string;
  position?: number;
}

export const moduleService = {
  /**
   * Create a module in a course
   * POST /api/courses/<course_id>/modules
   */
  async createModule(courseId: number | string, payload: CreateModulePayload): Promise<ApiResponse<Module>> {
    return apiClient.post<ApiResponse<Module>>(`/api/courses/${courseId}/modules`, payload);
  },

  /**
   * Get all modules for a course with access control & lessons
   * GET /api/courses/<course_id>/modules
   */
  async getCourseModules(courseId: number | string): Promise<ApiResponse<Module[]>> {
    return apiClient.get<ApiResponse<Module[]>>(`/api/courses/${courseId}/modules`);
  },

  /**
   * Get a single module by course ID and module ID
   * GET /api/courses/<course_id>/modules/<module_id>
   */
  async getCourseModule(courseId: number | string, moduleId: number | string): Promise<ApiResponse<Module>> {
    return apiClient.get<ApiResponse<Module>>(`/api/courses/${courseId}/modules/${moduleId}`);
  },

  /**
   * Update module details
   * PUT /api/courses/modules/<module_id>
   */
  async updateModule(moduleId: number | string, payload: UpdateModulePayload): Promise<ApiResponse<Module>> {
    return apiClient.put<ApiResponse<Module>>(`/api/courses/modules/${moduleId}`, payload);
  },

  /**
   * Delete a module
   * DELETE /api/courses/course/module/<module_id>
   */
  async deleteModule(moduleId: number | string): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(`/api/courses/course/module/${moduleId}`);
  },
};
