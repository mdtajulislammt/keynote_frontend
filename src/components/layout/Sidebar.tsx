import React from 'react';
import { NavLink, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAppSelector } from '@/redux/hooks';
import { BrandLogo } from '@/components/common/BrandLogo';
import {
  FileText,
  Plus,
  Share2,
  Compass,
  Users,
  Files,
  Settings,
  UserCheck,
} from 'lucide-react';
import { cn } from '@/utils/cn';

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  const navLinkClasses = (path: string) => {
    const isActive = location.pathname === path || (path !== '/' && location.pathname.startsWith(path + '/'));
    return cn(
      'group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
      isActive
        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold'
        : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
    );
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  const content = (
    <aside className="w-64 flex flex-col h-full bg-background border-r border-border/70 p-4 justify-between select-none">
      <div className="space-y-6">
        {/* Mobile Header Brand */}
        <div className="lg:hidden flex items-center justify-between px-2 pt-1 pb-2 border-b border-border/60">
          <BrandLogo size="md" />
        </div>

        {/* Main Navigation */}
        <div className="space-y-1">
          <div className="px-3 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
            Workspace
          </div>

          {/* Unified Notes + New Note Action */}
          <div
            className={cn(
              'group flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150',
              location.pathname.startsWith('/notes')
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold'
                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
            )}
          >
            <NavLink
              to="/notes"
              onClick={onClose}
              className="flex items-center gap-2.5 flex-1 min-w-0"
            >
              <FileText className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span className="truncate">My Notes</span>
            </NavLink>

            {/* Quick New Note Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onClose) onClose();
                navigate('/notes/create');
              }}
              className="p-1 rounded-lg hover:bg-emerald-500/20 text-muted-foreground hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
              title="Create New Note"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Social Feed */}
          <NavLink to="/posts" onClick={onClose} className={navLinkClasses('/posts')}>
            <div className="flex items-center gap-2.5">
              <Share2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>Social Feed</span>
            </div>
          </NavLink>

          {/* Community Topics */}
          <NavLink to="/analytics/interests" onClick={onClose} className={navLinkClasses('/analytics/interests')}>
            <div className="flex items-center gap-2.5">
              <Compass className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>Topics & Explore</span>
            </div>
          </NavLink>
        </div>

        {/* Admin Section (Conditional on role) */}
        {isAdmin && (
          <div className="space-y-1 pt-2 border-t border-border/60">
            <div className="px-3 pb-1.5 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
              <span>Administration</span>
              <span className="text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded">
                Admin
              </span>
            </div>

            <NavLink to="/analytics/user-posts" onClick={onClose} className={navLinkClasses('/analytics/user-posts')}>
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>Member Activity</span>
              </div>
            </NavLink>

            <NavLink to="/admin/users" onClick={onClose} className={navLinkClasses('/admin/users')}>
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>Manage Members</span>
              </div>
            </NavLink>

            <NavLink to="/admin/notes" onClick={onClose} className={navLinkClasses('/admin/notes')}>
              <div className="flex items-center gap-2.5">
                <Files className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>All Notes</span>
              </div>
            </NavLink>
          </div>
        )}
      </div>

      {/* Modern Bottom Profile Bar */}
      <div className="pt-3 border-t border-border/70">
        <Link
          to="/profile"
          onClick={onClose}
          className="flex items-center justify-between p-2 rounded-xl hover:bg-muted/60 transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-xs shadow-2xs">
              {initials}
            </div>
            <div className="min-w-0 flex flex-col text-left">
              <span className="text-xs font-bold text-foreground truncate group-hover:text-emerald-600 transition-colors">
                {user?.name}
              </span>
              <span className="text-[11px] text-muted-foreground truncate">
                {user?.email}
              </span>
            </div>
          </div>

          <Settings className="w-4 h-4 text-muted-foreground group-hover:text-foreground shrink-0 transition-colors" />
        </Link>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <div className="hidden lg:block shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        {content}
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-background shadow-2xl animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};

