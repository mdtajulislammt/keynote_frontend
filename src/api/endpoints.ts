/**
 * Centralized REST API endpoints configuration
 */
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
  },
  NOTES: {
    BASE: '/notes',
    BY_ID: (id: string) => `/notes/${id}`,
    ADMIN_LIST: '/admin/notes',
  },
  POSTS: {
    BASE: '/posts',
    BY_ID: (id: string) => `/posts/${id}`,
  },
  ADMIN_USERS: {
    BASE: '/admin/users',
    BY_ID: (id: string) => `/admin/users/${id}`,
  },
  ANALYTICS: {
    INTERESTS: '/analytics/interests',
    USER_POSTS: (userId: string) => `/analytics/users/${userId}/posts`,
  },
} as const;
