import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logout } from '@/redux/slices/authSlice';
import { toggleTheme } from '@/redux/slices/uiSlice';
import { BrandLogo } from '@/components/common/BrandLogo';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  FileText,
  Share2,
  BarChart3,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';

export interface NavbarProps {
  onToggleMobileSidebar?: () => void;
  isMobileSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileSidebar,
  isMobileSidebarOpen,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { theme } = useAppSelector((state) => state.ui);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const isActiveLink = (path: string) => {
    return location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  };

  const linkClass = (path: string) =>
    `px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
      isActiveLink(path)
        ? 'bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/30 shadow-2xs'
        : 'text-muted-foreground hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur-md transition-colors">
      <div className="w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 sm:gap-6">
          {isAuthenticated && (
            <button
              type="button"
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-lg text-muted-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          {/* Project-Specific Brand Logo */}
          <BrandLogo size="md" />

          {/* Header Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 ml-2">
            <Link to="/posts" className={linkClass('/posts')}>
              <Share2 className="w-4 h-4" />
              <span>Social Feed</span>
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/notes" className={linkClass('/notes')}>
                  <FileText className="w-4 h-4" />
                  <span>My Notes</span>
                </Link>
                <Link to="/analytics/interests" className={linkClass('/analytics')}>
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics</span>
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin/users" className={linkClass('/admin')}>
                    <Users className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(toggleTheme())}
            aria-label="Toggle color theme"
            className="w-9 h-9 text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </Button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-border/80">
              <Link
                to="/profile"
                className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors group cursor-pointer"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white text-xs font-bold shadow-xs">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="hidden lg:flex flex-col text-left text-xs leading-none">
                  <span className="font-bold text-foreground text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {user?.name}
                  </span>
                  <div className="mt-1">
                    <Badge variant={user?.role === 'admin' ? 'admin' : 'secondary'} className="text-[10px] px-1.5 py-0">
                      {user?.role}
                    </Badge>
                  </div>
                </div>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title="Log out"
                aria-label="Log out"
                className="w-9 h-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="font-semibold hover:text-emerald-600 dark:hover:text-emerald-400">
                  Sign in
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="font-bold shadow-sm shadow-emerald-700/20">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
