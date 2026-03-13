import { useState } from 'react';
import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { SkipNavigation } from '../SkipNavigation';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleCollapse = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-bg-primary font-sans">
      <SkipNavigation />
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={closeSidebar} 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleCollapse}
      />

      {/* Main content area */}
      <div 
        className={cn(
          "transition-all duration-300 ease-in-out min-h-screen flex flex-col",
          isSidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        )}
      >
        <TopBar onMenuClick={toggleSidebar} />

        <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8" tabIndex={-1}>
          {children}
        </main>
        
        <footer className="py-6 px-4 bg-bg-secondary border-t border-border-light text-center">
          <p className="text-xs text-text-tertiary">
            © {new Date().getFullYear()} LinkedIn Creative Awards. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
