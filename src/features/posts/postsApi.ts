import { apiClient } from '@/api/axios-client';
import { API_ENDPOINTS } from '@/api/endpoints';
import { Post, CreatePostPayload, PostQueryFilter } from '@/types/post.types';
import { StandardApiResponse } from '@/types/api.types';

export const postsApi = {
  getPosts: async (params?: PostQueryFilter): Promise<StandardApiResponse<Post[]>> => {
    const res = await apiClient.get<StandardApiResponse<Post[]>>(API_ENDPOINTS.POSTS.BASE, {
      params: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        ...(params?.userId ? { userId: params.userId } : {}),
      },
    });
    return res.data;
  },

  getPostById: async (id: string): Promise<StandardApiResponse<Post>> => {
    const res = await apiClient.get<StandardApiResponse<Post>>(API_ENDPOINTS.POSTS.BY_ID(id));
    return res.data;
  },

  createPost: async (payload: CreatePostPayload): Promise<StandardApiResponse<Post>> => {
    const res = await apiClient.post<StandardApiResponse<Post>>(API_ENDPOINTS.POSTS.BASE, payload);
    return res.data;
  },
};
