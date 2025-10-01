import { apiClient } from '../api/client';
import { endpoints } from '../api/endpoints';
import type { Skill } from '../../types/pages/skills';
import type { ListParams, PaginatedResponse } from '../../types/api/responses';
import type { CreateSkillDto, UpdateSkillDto, PatchSkillDto } from './types';

export const skillService = {
  getAll: async (
    params?: ListParams,
    signal?: AbortSignal
  ): Promise<PaginatedResponse<Skill>> => {
    return apiClient.get<PaginatedResponse<Skill>>(
      endpoints.skills.list(params),
      signal
    );
  },

  getById: async (id: number, signal?: AbortSignal): Promise<Skill> => {
    return apiClient.get<Skill>(endpoints.skills.get(id), signal);
  },

  create: async (
    data: CreateSkillDto,
    signal?: AbortSignal
  ): Promise<Skill> => {
    return apiClient.post<Skill>(endpoints.skills.create(), data, signal);
  },

  update: async (
    id: number,
    data: UpdateSkillDto,
    signal?: AbortSignal
  ): Promise<Skill> => {
    return apiClient.put<Skill>(endpoints.skills.update(id), data, signal);
  },

  patch: async (
    id: number,
    data: PatchSkillDto,
    signal?: AbortSignal
  ): Promise<Skill> => {
    return apiClient.patch<Skill>(endpoints.skills.patch(id), data, signal);
  },

  delete: async (id: number, signal?: AbortSignal): Promise<void> => {
    return apiClient.delete<void>(endpoints.skills.delete(id), signal);
  },
};
