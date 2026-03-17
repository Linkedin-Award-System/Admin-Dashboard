import { useRef, useEffect } from 'react';
import { User, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '@/features/auth';
import { useNavigate } from 'react-router-dom';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
}

export function ProfileDropdown({ isOpen, onClose, onOpenSettings }: ProfileDropdownProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose();
  };

  const handleOpenSettings = () => {
    onClose();
    onOpenSettings();
  };

  if (!isOpen) return null;

  const menuItems = [
    { icon: User, label: 'My Profile', action: handleOpenSettings },
    { icon: Settings, label: 'Account Settings', action: handleOpenSettings },
  ];

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-border-light z-50 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      {/* User Info */}
      <div className="p-4 border-b border-border-light">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-black text-lg">
            {user?.name?.charAt(0) || 'L'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-sm text-text-primary truncate">
              {user?.name || 'Commander'}
            </p>
            <p className="text-xs text-text-tertiary truncate">
              {user?.email || 'admin@awards.com'}
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={() => item.action()}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-bg-tertiary transition-colors text-left"
            >
              <Icon size={18} className="text-text-tertiary" />
              <span className="text-sm font-medium text-text-primary">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Logout */}
      <div className="p-2 border-t border-border-light">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors text-left group"
        >
          <LogOut size={18} className="text-text-tertiary group-hover:text-red-600" />
          <span className="text-sm font-medium text-text-primary group-hover:text-red-600">
            Sign Out
          </span>
        </button>
      </div>
    </div>
  );
}
