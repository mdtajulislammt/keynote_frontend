import { createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from './authApi';
import { LoginPayload, RegisterPayload, AuthResponseData } from '@/types/auth.types';
import { setCredentials, updateCurrentUser, setAuthLoading, setAuthError } from '@/redux/slices/authSlice';
import { toast } from 'sonner';

export const loginThunk = createAsyncThunk<
  AuthResponseData,
  LoginPayload,
  { rejectValue: string }
>('auth/login', async (payload, { dispatch, rejectWithValue }) => {
  try {
    dispatch(setAuthLoading(true));
    const response = await authApi.login(payload);
    dispatch(setCredentials(response.data));
    toast.success(response.message || 'Logged in successfully');
    return response.data;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Login failed';
    dispatch(setAuthError(message));
    toast.error(message);
    return rejectWithValue(message);
  } finally {
    dispatch(setAuthLoading(false));
  }
});

export const registerThunk = createAsyncThunk<
  AuthResponseData,
  RegisterPayload,
  { rejectValue: string }
>('auth/register', async (payload, { dispatch, rejectWithValue }) => {
  try {
    dispatch(setAuthLoading(true));
    const response = await authApi.register(payload);
    dispatch(setCredentials(response.data));
    toast.success(response.message || 'Registration successful');
    return response.data;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    dispatch(setAuthError(message));
    toast.error(message);
    return rejectWithValue(message);
  } finally {
    dispatch(setAuthLoading(false));
  }
});

export const fetchMeThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>('auth/fetchMe', async (_, { dispatch, rejectWithValue }) => {
  try {
    const response = await authApi.getMe();
    dispatch(updateCurrentUser(response.data));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Could not fetch user profile';
    return rejectWithValue(message);
  }
});
