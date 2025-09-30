import { apiClient } from '../api/client';
import { endpoints } from '../api/endpoints';
import type { Experience } from '../../types/pages/experiences';
import type { ListParams, PaginatedResponse } from '../../types/api/responses';
import type {
  CreateExperienceDto,
  UpdateExperienceDto,
  PatchExperienceDto,
} from './types';

export const experienceService = {
  /**
   * Récupère la liste paginée des expériences avec options de recherche et tri
   */
  getAll: async (
    params?: ListParams,
    signal?: AbortSignal
  ): Promise<PaginatedResponse<Experience>> => {
    return apiClient.get<PaginatedResponse<Experience>>(
      endpoints.experiences.list(params),
      signal
    );
  },

  /**
   * Récupère une expérience par son ID
   */
  getById: async (id: number, signal?: AbortSignal): Promise<Experience> => {
    return apiClient.get<Experience>(endpoints.experiences.get(id), signal);
  },

  /**
   * Crée une nouvelle expérience
   */
  create: async (
    data: CreateExperienceDto,
    signal?: AbortSignal
  ): Promise<Experience> => {
    return apiClient.post<Experience>(
      endpoints.experiences.create(),
      data,
      signal
    );
  },

  /**
   * Met à jour complètement une expérience (PUT)
   */
  update: async (
    id: number,
    data: UpdateExperienceDto,
    signal?: AbortSignal
  ): Promise<Experience> => {
    return apiClient.put<Experience>(
      endpoints.experiences.update(id),
      data,
      signal
    );
  },

  /**
   * Met à jour partiellement une expérience (PATCH)
   */
  patch: async (
    id: number,
    data: PatchExperienceDto,
    signal?: AbortSignal
  ): Promise<Experience> => {
    return apiClient.patch<Experience>(
      endpoints.experiences.patch(id),
      data,
      signal
    );
  },

  /**
   * Supprime une expérience
   */
  delete: async (id: number, signal?: AbortSignal): Promise<void> => {
    return apiClient.delete<void>(endpoints.experiences.delete(id), signal);
  },
};
