import { apiClient } from '@/api/axios-client';
import { API_ENDPOINTS } from '@/api/endpoints';
import { Note, CreateNotePayload, UpdateNotePayload } from '@/types/note.types';
import { StandardApiResponse } from '@/types/api.types';

export const notesApi = {
  getNotes: async (page: number = 1, limit: number = 10): Promise<StandardApiResponse<Note[]>> => {
    const res = await apiClient.get<StandardApiResponse<Note[]>>(API_ENDPOINTS.NOTES.BASE, {
      params: { page, limit },
    });
    return res.data;
  },

  getAdminNotes: async (page: number = 1, limit: number = 10): Promise<StandardApiResponse<Note[]>> => {
    const res = await apiClient.get<StandardApiResponse<Note[]>>(API_ENDPOINTS.NOTES.ADMIN_LIST, {
      params: { page, limit },
    });
    return res.data;
  },

  getNoteById: async (id: string): Promise<StandardApiResponse<Note>> => {
    const res = await apiClient.get<StandardApiResponse<Note>>(API_ENDPOINTS.NOTES.BY_ID(id));
    return res.data;
  },

  createNote: async (payload: CreateNotePayload): Promise<StandardApiResponse<Note>> => {
    const res = await apiClient.post<StandardApiResponse<Note>>(API_ENDPOINTS.NOTES.BASE, payload);
    return res.data;
  },

  updateNote: async (id: string, payload: UpdateNotePayload): Promise<StandardApiResponse<Note>> => {
    const res = await apiClient.put<StandardApiResponse<Note>>(API_ENDPOINTS.NOTES.BY_ID(id), payload);
    return res.data;
  },

  deleteNote: async (id: string): Promise<StandardApiResponse<{ deleted: boolean; id: string }>> => {
    const res = await apiClient.delete<StandardApiResponse<{ deleted: boolean; id: string }>>(
      API_ENDPOINTS.NOTES.BY_ID(id)
    );
    return res.data;
  },
};
