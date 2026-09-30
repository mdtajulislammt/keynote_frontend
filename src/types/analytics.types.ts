export interface GroupedInterestUser {
  _id: string;
  name: string;
  email: string;
}

export interface GroupedInterestItem {
  interest: string;
  totalUsers: number;
  users: GroupedInterestUser[];
}

export interface UserLookupPostItem {
  _id: string;
  title: string;
  body: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserWithPostsResult {
  _id: string;
  name: string;
  email: string;
  role: string;
  interests: string[];
  createdAt: string;
  updatedAt: string;
  posts: UserLookupPostItem[];
}
