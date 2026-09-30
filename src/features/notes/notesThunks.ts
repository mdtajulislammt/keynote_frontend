import { createAsyncThunk } from '@reduxjs/toolkit';
import { notesApi } from './notesApi';
import { Note, CreateNotePayload, UpdateNotePayload } from '@/types/note.types';
import {
  setNotes,
  setActiveNote,
  addNote,
  updateNoteInList,
  removeNoteFromList,
  setNotesLoading,
  setNotesError,
} from '@/redux/slices/notesSlice';
import { toast } from 'sonner';

export const fetchNotesThunk = createAsyncThunk<
  { data: Note[]; meta: any },
  { page?: number; limit?: number; isAdmin?: boolean } | undefined,
  { rejectValue: string }
>('notes/fetchNotes', async (params, { dispatch, rejectWithValue }) => {
  try {
    dispatch(setNotesLoading(true));
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const response = params?.isAdmin
      ? await notesApi.getAdminNotes(page, limit)
      : await notesApi.getNotes(page, limit);

    dispatch(setNotes({ data: response.data, meta: response.meta! }));
    return { data: response.data, meta: response.meta };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch notes';
    dispatch(setNotesError(message));
    toast.error(message);
    return rejectWithValue(message);
  } finally {
    dispatch(setNotesLoading(false));
  }
});

export const fetchNoteByIdThunk = createAsyncThunk<
  Note,
  string,
  { rejectValue: string }
>('notes/fetchNoteById', async (id, { dispatch, rejectWithValue }) => {
  try {
    dispatch(setNotesLoading(true));
    const response = await notesApi.getNoteById(id);
    dispatch(setActiveNote(response.data));
    return response.data;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch note';
    toast.error(message);
    return rejectWithValue(message);
  } finally {
    dispatch(setNotesLoading(false));
  }
});

export const createNoteThunk = createAsyncThunk<
  Note,
  CreateNotePayload,
  { rejectValue: string }
>('notes/createNote', async (payload, { dispatch, rejectWithValue }) => {
  try {
    dispatch(setNotesLoading(true));
    const response = await notesApi.createNote(payload);
    dispatch(addNote(response.data));
    toast.success(response.message || 'Note created successfully');
    return response.data;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create note';
    toast.error(message);
    return rejectWithValue(message);
  } finally {
    dispatch(setNotesLoading(false));
  }
});

export const updateNoteThunk = createAsyncThunk<
  Note,
  { id: string; payload: UpdateNotePayload },
  { rejectValue: string }
>('notes/updateNote', async ({ id, payload }, { dispatch, rejectWithValue }) => {
  try {
    dispatch(setNotesLoading(true));
    const response = await notesApi.updateNote(id, payload);
    dispatch(updateNoteInList(response.data));
    toast.success(response.message || 'Note updated successfully');
    return response.data;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update note';
    toast.error(message);
    return rejectWithValue(message);
  } finally {
    dispatch(setNotesLoading(false));
  }
});

export const deleteNoteThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('notes/deleteNote', async (id, { dispatch, rejectWithValue }) => {
  try {
    const response = await notesApi.deleteNote(id);
    dispatch(removeNoteFromList(id));
    toast.success(response.message || 'Note deleted successfully');
    return id;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete note';
    toast.error(message);
    return rejectWithValue(message);
  }
});
