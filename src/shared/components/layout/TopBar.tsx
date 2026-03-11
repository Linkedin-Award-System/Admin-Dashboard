import { Menu } from 'lucide-react';
import { useAuthStore } from '@/features/auth';
import { Button } from '@/shared/components/ui/button';

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Open navigation menu"
          aria-expanded="false"
        >
          <Menu className="w-6 h-6" aria-hidden="true" />
        </button>

        {/* Spacer for desktop */}
        <div className="hidden lg:block" />

        {/* User info and logout */}
        <div className="flex items-center gap-4">
          <div className="text-right" aria-label="User information">
            <p className="text-sm font-medium text-gray-900">
              {user?.name || 'Admin User'}
            </p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            aria-label="Logout from admin dashboard"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
