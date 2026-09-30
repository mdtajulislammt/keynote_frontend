import { apiClient } from '@/api/axios-client';
import { API_ENDPOINTS } from '@/api/endpoints';
import { LoginPayload, RegisterPayload, AuthResponseData } from '@/types/auth.types';
import { User } from '@/types/user.types';
import { StandardApiResponse } from '@/types/api.types';

export const authApi = {
  login: async (payload: LoginPayload): Promise<StandardApiResponse<AuthResponseData>> => {
    const res = await apiClient.post<StandardApiResponse<AuthResponseData>>(
      API_ENDPOINTS.AUTH.LOGIN,
      payload
    );
    return res.data;
  },

  register: async (payload: RegisterPayload): Promise<StandardApiResponse<AuthResponseData>> => {
    const res = await apiClient.post<StandardApiResponse<AuthResponseData>>(
      API_ENDPOINTS.AUTH.REGISTER,
      payload
    );
    return res.data;
  },

  getMe: async (): Promise<StandardApiResponse<User>> => {
    const res = await apiClient.get<StandardApiResponse<User>>(API_ENDPOINTS.AUTH.ME);
    return res.data;
  },
};
