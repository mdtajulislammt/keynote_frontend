import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { AdminRoute } from '@/components/layout/AdminRoute';
import { useAppSelector } from '@/redux/hooks';

// Features / Views
import { LoginForm } from '@/features/auth/LoginForm';
import { RegisterForm } from '@/features/auth/RegisterForm';
import { ProfilePage } from '@/features/auth/ProfilePage';
import { PostFeed } from '@/features/posts/PostFeed';
import { NoteList } from '@/features/notes/NoteList';
import { NoteEditorPage } from '@/features/notes/NoteEditorPage';
import { UserTable } from '@/features/users/UserTable';
import { InterestsView } from '@/features/analytics/InterestsView';
import { UserPostsLookupView } from '@/features/analytics/UserPostsLookupView';
import { NotFoundPage } from '@/components/common/NotFoundPage';

// Helper to redirect authenticated users away from /login & /register
const PublicAuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);
  if (isAuthenticated || token) {
    return <Navigate to="/notes" replace />;
  }
  return <>{children}</>;
};

// Root index redirector
const RootRedirect: React.FC = () => {
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);
  return <Navigate to={isAuthenticated || token ? '/notes' : '/posts'} replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Root Redirect */}
        <Route path="/" element={<RootRedirect />} />

        {/* ========================================== */}
        {/* 1. PUBLIC ROUTES                           */}
        {/* ========================================== */}
        <Route
          path="/login"
          element={
            <PublicAuthRoute>
              <LoginForm />
            </PublicAuthRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicAuthRoute>
              <RegisterForm />
            </PublicAuthRoute>
          }
        />
        <Route path="/posts" element={<PostFeed />} />

        {/* ========================================== */}
        {/* 2. PROTECTED ROUTES (User & Admin)         */}
        {/* ========================================== */}
        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <NoteList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/create"
          element={
            <ProtectedRoute>
              <NoteEditorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/edit/:id"
          element={
            <ProtectedRoute>
              <NoteEditorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics/interests"
          element={
            <ProtectedRoute>
              <InterestsView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics/user-posts"
          element={
            <AdminRoute>
              <UserPostsLookupView />
            </AdminRoute>
          }
        />

        {/* ========================================== */}
        {/* 3. ADMIN ONLY ROUTES (role === 'admin')     */}
        {/* ========================================== */}
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <UserTable />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/notes"
          element={
            <AdminRoute>
              <NoteList isAdminView={true} />
            </AdminRoute>
          }
        />

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
