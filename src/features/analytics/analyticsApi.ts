import { apiClient } from '@/api/axios-client';
import { API_ENDPOINTS } from '@/api/endpoints';
import { GroupedInterestItem, UserWithPostsResult } from '@/types/analytics.types';
import { StandardApiResponse } from '@/types/api.types';

export const analyticsApi = {
  /**
   * Scenario 1: Group by Interests
   * Strictly integrates with GET /api/v1/analytics/interests ($unwind & $group pipeline)
   */
  getUsersByInterests: async (): Promise<StandardApiResponse<GroupedInterestItem[]>> => {
    const res = await apiClient.get<StandardApiResponse<GroupedInterestItem[]>>(
      API_ENDPOINTS.ANALYTICS.INTERESTS
    );
    return res.data;
  },

  /**
   * Scenario 2: User Posts ($lookup)
   * Strictly integrates with GET /api/v1/analytics/users/:userId/posts ($match & $lookup pipeline)
   */
  getUserPostsLookup: async (userId: string): Promise<StandardApiResponse<UserWithPostsResult>> => {
    const res = await apiClient.get<StandardApiResponse<UserWithPostsResult>>(
      API_ENDPOINTS.ANALYTICS.USER_POSTS(userId)
    );
    return res.data;
  },
};
