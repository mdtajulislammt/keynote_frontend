export interface PostAuthor {
  _id: string;
  name: string;
  email: string;
  role?: string;
}

export interface Post {
  _id: string;
  title: string;
  body: string;
  userId: PostAuthor | string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostPayload {
  title: string;
  body: string;
}

export interface PostQueryFilter {
  page?: number;
  limit?: number;
  userId?: string;
}
