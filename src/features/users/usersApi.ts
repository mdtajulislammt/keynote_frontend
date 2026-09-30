import { apiClient } from '@/api/axios-client';
import { API_ENDPOINTS } from '@/api/endpoints';
import { User, CreateUserPayload, UpdateUserPayload, UserFilterQuery } from '@/types/user.types';
import { StandardApiResponse } from '@/types/api.types';

export const usersApi = {
  getUsers: async (query?: UserFilterQuery): Promise<StandardApiResponse<User[]>> => {
    const res = await apiClient.get<StandardApiResponse<User[]>>(API_ENDPOINTS.ADMIN_USERS.BASE, {
      params: {
        page: query?.page || 1,
        limit: query?.limit || 10,
        ...(query?.role ? { role: query.role } : {}),
      },
    });
    return res.data;
  },

  getUserById: async (id: string): Promise<StandardApiResponse<User>> => {
    const res = await apiClient.get<StandardApiResponse<User>>(API_ENDPOINTS.ADMIN_USERS.BY_ID(id));
    return res.data;
  },

  createUser: async (payload: CreateUserPayload): Promise<StandardApiResponse<User>> => {
    const res = await apiClient.post<StandardApiResponse<User>>(
      API_ENDPOINTS.ADMIN_USERS.BASE,
      payload
    );
    return res.data;
  },

  updateUser: async (id: string, payload: UpdateUserPayload): Promise<StandardApiResponse<User>> => {
    const res = await apiClient.put<StandardApiResponse<User>>(
      API_ENDPOINTS.ADMIN_USERS.BY_ID(id),
      payload
    );
    return res.data;
  },

  deleteUser: async (id: string): Promise<StandardApiResponse<{ deleted: boolean; id: string }>> => {
    const res = await apiClient.delete<StandardApiResponse<{ deleted: boolean; id: string }>>(
      API_ENDPOINTS.ADMIN_USERS.BY_ID(id)
    );
    return res.data;
  },
};
