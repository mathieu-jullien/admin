import type { ListParams } from '../../types/api/responses';

const buildQueryString = (params: ListParams = {}): string => {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.append('page', params.page.toString());
  }
  if (params.limit !== undefined) {
    searchParams.append('limit', params.limit.toString());
  }
  if (params.search) {
    searchParams.append('search', params.search);
  }
  if (params.sortBy) {
    searchParams.append('sortBy', params.sortBy);
  }
  if (params.sortOrder) {
    searchParams.append('sortOrder', params.sortOrder);
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

export const endpoints = {
  auth: {
    login: () => `/auth`,
  },
  experiences: {
    list: (params?: ListParams) => `/experiences${buildQueryString(params)}`,
    get: (id: number) => `/experiences/${id}`,
    create: () => '/experiences',
    update: (id: number) => `/experiences/${id}`,
    patch: (id: number) => `/experiences/${id}`,
    delete: (id: number) => `/experiences/${id}`,
  },
  skills: {
    list: (params?: ListParams) => `/skills${buildQueryString(params)}`,
    get: (id: number) => `/skills/${id}`,
    create: () => '/skills',
    update: (id: number) => `/skills/${id}`,
    patch: (id: number) => `/skills/${id}`,
    delete: (id: number) => `/skills/${id}`,
  },
  education: {
    list: (params?: ListParams) => `/education${buildQueryString(params)}`,
    get: (id: number) => `/education/${id}`,
    create: () => '/education',
    update: (id: number) => `/education/${id}`,
    patch: (id: number) => `/education/${id}`,
    delete: (id: number) => `/education/${id}`,
  },
};
