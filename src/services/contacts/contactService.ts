import { apiClient } from '../api/client';
import { endpoints } from '../api/endpoints';
import type { Contact, ContactStats } from '../../types/pages/contacts';
import type { ListParams, PaginatedResponse } from '../../types/api/responses';
import type { UpdateContactDto } from './types';

export const contactService = {
  /**
   * Récupère la liste paginée des contacts
   */
  getAll: async (
    params?: ListParams,
    signal?: AbortSignal
  ): Promise<PaginatedResponse<Contact>> => {
    return apiClient.get<PaginatedResponse<Contact>>(
      endpoints.contacts.list(params),
      signal
    );
  },

  /**
   * Récupère un contact par son ID
   */
  getById: async (id: number, signal?: AbortSignal): Promise<Contact> => {
    return apiClient.get<Contact>(endpoints.contacts.get(id), signal);
  },

  /**
   * Récupère les statistiques hebdomadaires des contacts
   */
  getWeeklyStats: async (signal?: AbortSignal): Promise<ContactStats> => {
    return apiClient.get<ContactStats>(endpoints.contacts.stats(), signal);
  },

  /**
   * Met à jour le statut d'un contact (PATCH)
   */
  updateStatus: async (
    id: number,
    data: UpdateContactDto,
    signal?: AbortSignal
  ): Promise<Contact> => {
    return apiClient.patch<Contact>(endpoints.contacts.patch(id), data, signal);
  },
};
