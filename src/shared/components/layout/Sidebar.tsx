import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Layers,
  Users,
  Activity,
  Landmark,
  Globe,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
} from 'lucide-react';
import { useAuthStore } from '@/features/auth';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Categories', path: '/categories', icon: Layers },
  { name: 'Nominees', path: '/nominees', icon: Users },
  { name: 'Voting Hub', path: '/voting', icon: Activity },
  { name: 'Financials', path: '/payments', icon: Landmark },
  { name: 'Content Management', path: '/content', icon: Globe },
];

interface SidebarProps {
  isOpen?: boolean;
  isCollapsed?: boolean;
  onClose?: () => void;
  onToggleCollapse?: () => void;
}

export function Sidebar({ 
  isOpen = true, 
  isCollapsed = false, 
  onClose,
  onToggleCollapse
}: SidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen transition-all duration-300 ease-in-out border-r border-border-light bg-bg-secondary flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          isCollapsed ? 'w-20' : 'w-64'
        )}
        aria-label="Main navigation"
      >
        {/* Header/Logo Section */}
        <div className="flex items-center justify-between h-24 px-6">
          {!isCollapsed && (
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-primary-600 flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/30">
                <span className="text-white font-black text-xl italic">L</span>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg tracking-tight text-text-primary whitespace-nowrap leading-none">
                  CREATIVE
                </span>
                <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.2em] mt-1 leading-none">
                  Awards Admin
                </span>
              </div>
            </div>
          )}
          
          {isCollapsed && (
            <div className="w-10 h-10 rounded-2xl bg-primary-600 flex items-center justify-center mx-auto shadow-lg shadow-primary-500/30">
              <span className="text-white font-black text-xl italic">L</span>
            </div>
          )}

          {/* Collapse Toggle Button (Desktop Only) */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex absolute -right-3 top-24 w-6 h-6 rounded-full border border-border-light bg-bg-secondary items-center justify-center hover:bg-bg-tertiary transition-all shadow-sm z-[60] hover:scale-110 active:scale-90"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight size={14} className="text-text-secondary" />
            ) : (
              <ChevronLeft size={14} className="text-text-secondary" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  'group relative flex items-center gap-4 px-4 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300',
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute left-0 top-4 bottom-4 w-1 bg-blue-600 rounded-r-full shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                )}

                <Icon 
                  className={cn(
                    "w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110",
                    isActive ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"
                  )} 
                />
                
                {!isCollapsed && (
                  <span className="transition-opacity duration-200 truncate">
                    {item.name}
                  </span>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-text-primary text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-[100] whitespace-nowrap">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile / Footer Section */}
        <div className="p-6 border-t border-border-light">
          <div className={cn(
            "flex items-center gap-4 p-3 rounded-2xl bg-bg-tertiary group/profile cursor-pointer hover:bg-primary-50 transition-all duration-300",
            isCollapsed && "justify-center px-0"
          )}>
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center shrink-0 border border-primary-200 shadow-sm transition-transform duration-300 group-hover/profile:scale-110">
                <User className="w-7 h-7 text-primary-600" />
              </div>
              <div className="absolute -right-1 -bottom-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white" />
            </div>
            
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-text-primary truncate uppercase tracking-tighter">
                  {user?.name || 'Commander'}
                </p>
                <p className="text-[10px] text-text-tertiary truncate leading-none mt-1 font-bold">
                  {user?.role === 'admin' ? 'Fleet Admiral' : 'Special Agent'}
                </p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={() => logout()}
              className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-error hover:bg-error-bg rounded-xl transition-all duration-300 border border-transparent hover:border-error/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <LogOut size={16} />
              <span>Detach Link</span>
            </button>
          )}
          
          {isCollapsed && (
            <button
              onClick={() => logout()}
              className="mt-6 w-full flex items-center justify-center p-3 text-error hover:bg-error-bg rounded-xl transition-all duration-300 border border-transparent hover:border-error/20"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
