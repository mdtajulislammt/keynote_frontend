import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types/user.types';
import { AuthState } from '@/types/auth.types';
import { tokenStorage } from '@/utils/token';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      tokenStorage.set(action.payload.token);
    },
    updateCurrentUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      tokenStorage.remove();
    },
  },
});

export const {
  setCredentials,
  updateCurrentUser,
  setAuthLoading,
  setAuthError,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
