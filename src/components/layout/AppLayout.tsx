import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useAppSelector } from '@/redux/hooks';
import { ShieldCheck } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { theme } = useAppSelector((state) => state.ui);

  // Sync dark class on document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors selection:bg-emerald-600 selection:text-white">
      {/* Top emerald gradient accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-800 via-emerald-500 to-emerald-400" />

      {/* Top Navbar */}
      <Navbar
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        isMobileSidebarOpen={isMobileSidebarOpen}
      />

      <div className="flex-1 flex w-full">
        {/* Sidebar only shown when authenticated */}
        {isAuthenticated && (
          <Sidebar
            isOpen={isMobileSidebarOpen}
            onClose={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 p-5 sm:p-7 lg:p-9">
          <div className="max-w-6xl w-full mx-auto flex-1">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Minimalist Footer */}
      <footer className="border-t border-border/80 bg-background/95 py-5 text-center text-sm text-muted-foreground">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-emerald-600 dark:text-emerald-400">Keynote</span>
            <span>• Secure Note-Taking & Social Post Platform</span>
          </div>
          <span className="font-mono text-xs px-2.5 py-1 rounded bg-muted/40 text-muted-foreground">
            API: http://localhost:5000/api/v1
          </span>
        </div>
      </footer>
    </div>
  );
};
