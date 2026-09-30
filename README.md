# Keynote - Secure Note-Taking & Social Post Platform (Client Application)

A production-ready, clean, modular, and minimalist single-page client application built with **React 18**, **TypeScript**, **Vite**, **Redux Toolkit**, **redux-persist**, and **Tailwind CSS**.

---

## 1. Technical Stack & Core Architecture

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | React 18 + Vite | Fast HMR, ESM bundling, and optimized production chunking |
| **Language** | TypeScript (Strict) | Strict static typing across all models, DTOs, and state slices |
| **Styling** | Tailwind CSS + Radix-style UI | Minimalist, functional design tokens (light/dark mode, accessible focus states) |
| **State Management** | Redux Toolkit (`@reduxjs/toolkit`) | Domain slices for `auth`, `notes`, and `ui` modals/theme |
| **Persistence** | `redux-persist` | Whitelisted session persistence across browser reloads |
| **Data Fetching** | Axios Client | JWT injection, 401 unauthenticated interceptors, and fallback mock adapter |
| **Forms & Validation** | React Hook Form + Zod | Schema-first client validation matching backend DTO constraints |
| **Icons & Notifications** | `lucide-react` & `sonner` | Clean icons and rich toast notifications |

---

## 2. Directory Structure

```text
src/
├── api/
│   ├── axios-client.ts       # Axios instance with JWT injection & 401 handling
│   ├── endpoints.ts          # Centralized REST API endpoints
│   └── mock-adapter.ts       # Offline/demo mock adapter emulator
├── components/
│   ├── common/
│   │   ├── ConfirmDialog.tsx # Destructive action confirmation dialogs
│   │   ├── EmptyState.tsx    # Empty state indicator with actionable buttons
│   │   ├── Loader.tsx        # Inline and fullscreen spinners
│   │   ├── NotFoundPage.tsx  # 404 client route fallback
│   │   ├── PaginationControl.tsx # Dynamic paginator with per-page selector
│   │   └── SearchBar.tsx     # Debounced/instant query filter input
│   ├── layout/
│   │   ├── AdminRoute.tsx    # RBAC route guard (restricts to role === 'admin')
│   │   ├── AppLayout.tsx     # Application shell (Navbar, Sidebar, Outlet, Footer)
│   │   ├── Navbar.tsx        # Top header with status, theme toggle, and demo pill
│   │   ├── ProtectedRoute.tsx# Auth guard redirecting to /login
│   │   └── Sidebar.tsx       # Responsive domain navigation sidebar
│   └── ui/
│       ├── Badge.tsx         # Tag and role status badges (admin/user)
│       ├── Button.tsx        # Minimalist button primitive with variants & loading
│       ├── Card.tsx          # Card container primitives
│       ├── Input.tsx         # Form input with error labels and helper text
│       ├── Modal.tsx         # Portal modal with ESC and backdrop dismissal
│       └── Table.tsx         # Responsive table primitives
├── features/
│   ├── analytics/
│   │   ├── analyticsApi.ts   # Client methods for Scenario 1 & 2 aggregations
│   │   ├── InterestGroupCard.tsx # Scenario 1 item card
│   │   ├── InterestsView.tsx # Scenario 1 ($unwind + $group) page
│   │   └── UserPostsLookupView.tsx # Scenario 2 ($match + $lookup) page
│   ├── auth/
│   │   ├── authApi.ts        # Login, register, and profile API calls
│   │   ├── authThunks.ts     # Redux async thunks with toast feedback
│   │   ├── LoginForm.tsx     # Login form with one-click test accounts
│   │   ├── ProfilePage.tsx   # Authenticated user account overview
│   │   └── RegisterForm.tsx  # Registration form with interests input
│   ├── notes/
│   │   ├── NoteCard.tsx      # Note preview card with edit/delete actions
│   │   ├── NoteEditorPage.tsx# Dedicated editor for /notes/create and /notes/edit/:id
│   │   ├── NoteFormModal.tsx # Quick modal note creation/editing
│   │   ├── NoteList.tsx      # Paginated personal notes grid & search
│   │   ├── notesApi.ts       # Notes REST API client
│   │   └── notesThunks.ts    # Notes Redux thunks
│   ├── posts/
│   │   ├── CreatePostModal.tsx # Social post creation modal
│   │   ├── PostCard.tsx      # Social post feed card with author links
│   │   ├── PostFeed.tsx      # Public social feed with pagination
│   │   └── postsApi.ts       # Posts REST API client
│   └── users/
│       ├── UserFormModal.tsx # Admin user create/update modal
│       ├── UserTable.tsx     # Admin user management table with role filters
│       └── usersApi.ts       # Admin users REST API client
├── redux/
│   ├── hooks.ts              # Typed useAppDispatch and useAppSelector
│   ├── rootReducer.ts        # Combines reducers with redux-persist config
│   ├── store.ts              # Configured Redux store with 401 callback
│   └── slices/
│       ├── authSlice.ts      # Auth credentials, token, and user state
│       ├── notesSlice.ts     # Notes list, pagination metadata, active note
│       └── uiSlice.ts        # Global modal states and color theme
├── routes/
│   └── index.tsx             # Route definitions with ProtectedRoute & AdminRoute
├── types/                    # Shared TypeScript interfaces matching backend models
│   ├── analytics.types.ts
│   ├── api.types.ts
│   ├── auth.types.ts
│   ├── note.types.ts
│   ├── post.types.ts
│   └── user.types.ts
├── utils/
│   ├── cn.ts                 # Classnames merger (clsx + tailwind-merge)
│   ├── formatters.ts         # Date and text string formatters
│   └── token.ts              # LocalStorage token accessor
├── App.tsx                   # App root with BrowserRouter and Sonner Toaster
└── main.tsx                  # React root with Redux Provider & PersistGate
```

---

## 3. RBAC & Client Route Protection

Route guards inspect the Redux `auth` state and user role:

| Route | Access Tier | Guard | Description |
| :--- | :--- | :--- | :--- |
| `/login` | Public | PublicAuthRoute | Redirects to `/notes` if already authenticated |
| `/register` | Public | PublicAuthRoute | Redirects to `/notes` if already authenticated |
| `/posts` | Public | None | Public social feed viewable by all visitors |
| `/notes` | Protected | `<ProtectedRoute>` | Paginated personal notes list |
| `/notes/create` | Protected | `<ProtectedRoute>` | Note creator page |
| `/notes/edit/:id` | Protected | `<ProtectedRoute>` | Note editor page |
| `/profile` | Protected | `<ProtectedRoute>` | Authenticated account details |
| `/analytics/interests` | Protected | `<ProtectedRoute>` | **Scenario 1:** Users grouped by interests ($unwind + $group) |
| `/analytics/user-posts` | Protected | `<ProtectedRoute>` | **Scenario 2:** User posts via relational $lookup |
| `/admin/users` | Admin Only | `<AdminRoute>` | User CRUD management table |
| `/admin/notes` | Admin Only | `<AdminRoute>` | Global notes feed across all users |

---

## 4. Backend Endpoints Integrated

- **Authentication:**
  - `POST /api/v1/auth/register`
  - `POST /api/v1/auth/login`
  - `GET /api/v1/auth/me`
- **Notes:**
  - `GET /api/v1/notes?page=1&limit=10`
  - `POST /api/v1/notes`
  - `GET /api/v1/notes/:id`
  - `PUT /api/v1/notes/:id`
  - `DELETE /api/v1/notes/:id`
  - `GET /api/v1/admin/notes?page=1&limit=10` (Admin only)
- **Posts:**
  - `GET /api/v1/posts?page=1&limit=10`
  - `POST /api/v1/posts`
  - `GET /api/v1/posts/:id`
- **Admin Users:**
  - `GET /api/v1/admin/users?page=1&limit=10`
  - `POST /api/v1/admin/users`
  - `PUT /api/v1/admin/users/:id`
  - `DELETE /api/v1/admin/users/:id`
- **Analytics:**
  - `GET /api/v1/analytics/interests`
  - `GET /api/v1/analytics/users/:userId/posts`

---

## 5. Running the Application

### Development Server:
```bash
npm start
# or
npm run dev
```
Accessible at: `http://localhost:3000`

### Production Build:
```bash
npm run build
npm run preview
```

### Backend Connection & Demo Mode:
- **Live Mode:** Connects directly to `http://localhost:5000/api/v1` (configured via `VITE_API_URL`).
- **Demo Mode Pill:** Click the top-right pill ("Live API Mode" / "Mock Data Active") to toggle local offline emulation for testing without running MongoDB or backend services.
# keynote_frontend
