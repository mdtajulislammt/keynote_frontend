import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import notesReducer from './slices/notesSlice';
import uiReducer from './slices/uiSlice';

// Persist auth slice to maintain user session and token
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token', 'isAuthenticated'],
};

export const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  notes: notesReducer,
  ui: uiReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
