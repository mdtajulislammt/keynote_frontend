import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/redux/hooks';
import { BrandLogo } from '@/components/common/BrandLogo';
import {
  FileText,
  PlusCircle,
  Share2,
  PieChart,
  Network,
  Users,
  Files,
  UserCheck,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/utils/cn';

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const isAdmin = user?.role === 'admin';

  const navLinkClasses = (path: string) => {
    const isActive = location.pathname === path || (path !== '/' && location.pathname.startsWith(path + '/'));
    return cn(
      'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
      isActive
        ? 'bg-emerald-600/10 text-emerald-800 dark:text-emerald-300 font-bold shadow-2xs border-l-3 border-emerald-600 pl-3'
        : 'text-muted-foreground hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 hover:text-emerald-700 dark:hover:text-emerald-400'
    );
  };

  const content = (
    <aside className="w-64 flex flex-col h-full bg-background border-r border-border/80 p-5 space-y-6">
      {/* Brand & Active Workspace */}
      <div className="p-3.5 rounded-xl border border-emerald-500/25 bg-emerald-500/5 backdrop-blur-xs space-y-2">
        <BrandLogo size="sm" asLink={false} />
        <div className="pt-2 border-t border-emerald-500/15">
          <div className="flex items-center gap-1.5 mb-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              User Session
            </span>
          </div>
          <p className="text-sm font-bold truncate text-foreground">{user?.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
        </div>
      </div>

      {/* Main Feature Navigation */}
      <div className="space-y-1">
        <div className="px-3 pb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Encrypted Notes & Feed
        </div>
        <NavLink to="/notes" onClick={onClose} className={navLinkClasses('/notes')}>
          <FileText className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>My Notes</span>
        </NavLink>
        <NavLink to="/notes/create" onClick={onClose} className={navLinkClasses('/notes/create')}>
          <PlusCircle className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>New Note</span>
        </NavLink>
        <NavLink to="/posts" onClick={onClose} className={navLinkClasses('/posts')}>
          <Share2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>Social Feed</span>
        </NavLink>
      </div>

      {/* Analytics Pipelines */}
      <div className="space-y-1">
        <div className="px-3 pb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Aggregation Analytics
        </div>
        <NavLink to="/analytics/interests" onClick={onClose} className={navLinkClasses('/analytics/interests')}>
          <PieChart className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>Interests Grouping</span>
        </NavLink>
        <NavLink to="/analytics/user-posts" onClick={onClose} className={navLinkClasses('/analytics/user-posts')}>
          <Network className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>User Posts ($lookup)</span>
        </NavLink>
      </div>

      {/* Admin Section (Conditional on role) */}
      {isAdmin && (
        <div className="space-y-1 border-t border-border/80 pt-4">
          <div className="px-3 pb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            <span>Admin Controls</span>
            <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded">
              RBAC
            </span>
          </div>
          <NavLink to="/admin/users" onClick={onClose} className={navLinkClasses('/admin/users')}>
            <Users className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>User Management</span>
          </NavLink>
          <NavLink to="/admin/notes" onClick={onClose} className={navLinkClasses('/admin/notes')}>
            <Files className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>Global Notes Feed</span>
          </NavLink>
        </div>
      )}

      {/* Account Section */}
      <div className="space-y-1 border-t border-border/80 pt-4 mt-auto">
        <div className="px-3 pb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Account
        </div>
        <NavLink to="/profile" onClick={onClose} className={navLinkClasses('/profile')}>
          <UserCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>Profile & Settings</span>
        </NavLink>
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
