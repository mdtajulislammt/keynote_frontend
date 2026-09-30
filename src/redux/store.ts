import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { rootReducer, RootState } from './rootReducer';
import { setOnUnauthorizedCallback } from '@/api/axios-client';
import { logout } from './slices/authSlice';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Configure 401 automatic session purge
setOnUnauthorizedCallback(() => {
  store.dispatch(logout());
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type { RootState };
