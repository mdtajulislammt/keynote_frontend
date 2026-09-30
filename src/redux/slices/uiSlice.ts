import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  actionType?: string;
  targetId?: string;
}

interface UiState {
  theme: 'light' | 'dark';
  noteModal: {
    isOpen: boolean;
    editId: string | null;
  };
  postModal: {
    isOpen: boolean;
  };
  userModal: {
    isOpen: boolean;
    editId: string | null;
  };
  confirmDialog: ConfirmDialogState;
}

const initialState: UiState = {
  theme: 'light',
  noteModal: {
    isOpen: false,
    editId: null,
  },
  postModal: {
    isOpen: false,
  },
  userModal: {
    isOpen: false,
    editId: null,
  },
  confirmDialog: {
    isOpen: false,
    title: '',
    description: '',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    isDestructive: false,
  },
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    openNoteModal: (state, action: PayloadAction<{ editId?: string | null } | undefined>) => {
      state.noteModal = {
        isOpen: true,
        editId: action?.payload?.editId || null,
      };
    },
    closeNoteModal: (state) => {
      state.noteModal = {
        isOpen: false,
        editId: null,
      };
    },
    openPostModal: (state) => {
      state.postModal.isOpen = true;
    },
    closePostModal: (state) => {
      state.postModal.isOpen = false;
    },
    openUserModal: (state, action: PayloadAction<{ editId?: string | null } | undefined>) => {
      state.userModal = {
        isOpen: true,
        editId: action?.payload?.editId || null,
      };
    },
    closeUserModal: (state) => {
      state.userModal = {
        isOpen: false,
        editId: null,
      };
    },
    openConfirmDialog: (state, action: PayloadAction<Omit<ConfirmDialogState, 'isOpen'>>) => {
      state.confirmDialog = {
        ...action.payload,
        isOpen: true,
      };
    },
    closeConfirmDialog: (state) => {
      state.confirmDialog.isOpen = false;
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  openNoteModal,
  closeNoteModal,
  openPostModal,
  closePostModal,
  openUserModal,
  closeUserModal,
  openConfirmDialog,
  closeConfirmDialog,
} = uiSlice.actions;

export default uiSlice.reducer;
