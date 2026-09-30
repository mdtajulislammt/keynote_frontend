const TOKEN_KEY = 'secure_auth_token';

/**
 * Direct localStorage token accessor helpers
 */
export const tokenStorage = {
  get: (): string | null => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set: (token: string): void => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (err) {
      console.error('Failed to save token to localStorage', err);
    }
  },
  remove: (): void => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (err) {
      console.error('Failed to remove token from localStorage', err);
    }
  },
};
