import type { Education } from '../../types/pages/education';
import { apiClient } from '../api/client';
import { endpoints } from '../api/endpoints';
import type { ListParams, PaginatedResponse } from '../../types/api/responses';
import type {
  CreateEducationDto,
  UpdateEducationDto,
  PatchEducationDto,
} from './types';

export const educationService = {
  getAll: async (
    params?: ListParams,
    signal?: AbortSignal
  ): Promise<PaginatedResponse<Education>> => {
    return apiClient.get<PaginatedResponse<Education>>(
      endpoints.education.list(params),
      signal
    );
  },

  getById: async (id: number, signal?: AbortSignal): Promise<Education> => {
    return apiClient.get<Education>(endpoints.education.get(id), signal);
  },

  create: async (
    data: CreateEducationDto,
    signal?: AbortSignal
  ): Promise<Education> => {
    return apiClient.post<Education>(
      endpoints.education.create(),
      data,
      signal
    );
  },

  update: async (
    id: number,
    data: UpdateEducationDto,
    signal?: AbortSignal
  ): Promise<Education> => {
    return apiClient.put<Education>(
      endpoints.education.update(id),
      data,
      signal
    );
  },

  patch: async (
    id: number,
    data: PatchEducationDto,
    signal?: AbortSignal
  ): Promise<Education> => {
    return apiClient.patch<Education>(
      endpoints.education.patch(id),
      data,
      signal
    );
  },

  delete: async (id: number, signal?: AbortSignal): Promise<void> => {
    return apiClient.delete<void>(endpoints.education.delete(id), signal);
  },
};
