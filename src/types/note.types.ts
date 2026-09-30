import { PaginationMeta } from './api.types';
import { User } from './user.types';

export interface Note {
  _id: string;
  title: string;
  content: string;
  userId: string | Pick<User, '_id' | 'name' | 'email'>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotePayload {
  title: string;
  content: string;
}

export interface UpdateNotePayload {
  title?: string;
  content?: string;
}

export interface NotesState {
  notes: Note[];
  activeNote: Note | null;
  meta: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
}
