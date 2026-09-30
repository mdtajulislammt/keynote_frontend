export type UserRole = 'user' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  interests: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  interests?: string[];
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  interests?: string[];
}

export interface UserFilterQuery {
  page?: number;
  limit?: number;
  role?: UserRole;
}
