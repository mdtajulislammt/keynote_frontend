import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Note, NotesState } from '@/types/note.types';
import { PaginationMeta } from '@/types/api.types';

const initialState: NotesState = {
  notes: [],
  activeNote: null,
  meta: null,
  isLoading: false,
  error: null,
};

export const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    setNotes: (
      state,
      action: PayloadAction<{ data: Note[]; meta: PaginationMeta }>
    ) => {
      state.notes = action.payload.data;
      state.meta = action.payload.meta;
      state.isLoading = false;
      state.error = null;
    },
    setActiveNote: (state, action: PayloadAction<Note | null>) => {
      state.activeNote = action.payload;
    },
    addNote: (state, action: PayloadAction<Note>) => {
      state.notes.unshift(action.payload);
      if (state.meta) {
        state.meta.total += 1;
      }
    },
    updateNoteInList: (state, action: PayloadAction<Note>) => {
      const index = state.notes.findIndex((n) => n._id === action.payload._id);
      if (index !== -1) {
        state.notes[index] = action.payload;
      }
      if (state.activeNote?._id === action.payload._id) {
        state.activeNote = action.payload;
      }
    },
    removeNoteFromList: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter((n) => n._id !== action.payload);
      if (state.meta) {
        state.meta.total = Math.max(0, state.meta.total - 1);
      }
      if (state.activeNote?._id === action.payload) {
        state.activeNote = null;
      }
    },
    setNotesLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setNotesError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setNotes,
  setActiveNote,
  addNote,
  updateNoteInList,
  removeNoteFromList,
  setNotesLoading,
  setNotesError,
} = notesSlice.actions;

export default notesSlice.reducer;
