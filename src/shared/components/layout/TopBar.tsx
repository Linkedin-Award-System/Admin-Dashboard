import { Menu, Search, Bell, Settings } from 'lucide-react';
import { useAuthStore } from '@/features/auth';
import { useState } from 'react';
import { NotificationsDropdown } from './NotificationsDropdown';
import { SettingsModal } from './SettingsModal';
import { ProfileDropdown } from './ProfileDropdown';

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { user } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-24 bg-bg-secondary/60 backdrop-blur-xl border-b border-white/40 px-4 sm:px-6 lg:px-8 shadow-soft">
      <div className="flex items-center justify-between h-full max-w-7xl mx-auto">
        {/* Left Section: Menu Toggle & Search */}
        <div className="flex items-center gap-6 flex-1">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-3 rounded-2xl text-text-secondary hover:bg-white hover:text-primary-600 hover:shadow-soft transition-all active:scale-95"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          <div className="hidden md:flex items-center gap-4 px-5 py-3 bg-white/50 rounded-2xl border border-white/60 w-full max-w-md group focus-within:ring-4 focus-within:ring-primary-500/10 focus-within:border-primary-500/50 focus-within:bg-white transition-all duration-300">
            <Search size={18} className="text-text-tertiary group-focus-within:text-primary-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Query Intelligence Engine..." 
              className="bg-transparent border-none outline-none text-xs font-bold w-full placeholder:text-text-disabled text-text-primary tracking-wide uppercase"
            />
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border border-border-light bg-bg-secondary text-[10px] font-black text-text-tertiary shadow-inner">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Section: Actions & User */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-3 rounded-2xl text-text-tertiary hover:bg-white hover:text-primary-600 hover:shadow-soft transition-all relative group active:scale-95"
                aria-label="View notifications"
              >
                <Bell size={20} className="transition-transform group-hover:rotate-12" />
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
              </button>
              <NotificationsDropdown 
                isOpen={showNotifications} 
                onClose={() => setShowNotifications(false)} 
              />
            </div>
            
            <button 
              onClick={() => setShowSettings(true)}
              className="p-3 rounded-2xl text-text-tertiary hover:bg-white hover:text-primary-600 hover:shadow-soft transition-all active:scale-95"
              aria-label="Open settings"
            >
              <Settings size={20} />
            </button>
          </div>

          <div className="h-10 w-px bg-gradient-to-b from-transparent via-border-light to-transparent mx-1 sm:mx-2" />

          <div className="relative">
            <button 
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-4 pl-2 group/user cursor-pointer"
              aria-label="View profile"
            >
              <div className="hidden sm:block text-right">
                <p className="text-xs font-black text-text-primary uppercase tracking-tighter leading-none group-hover/user:text-primary-600 transition-colors">
                  {user?.name || 'Commander'}
                </p>
                <p className="text-[10px] text-primary-500 font-bold tracking-widest uppercase mt-1 leading-none opacity-80">
                  Level 9 Auth Cloud
                </p>
              </div>
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 p-[2px] shadow-lg shadow-primary-500/20 group-hover/user:scale-110 transition-transform duration-300">
                  <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-primary-600 font-black text-lg italic overflow-hidden">
                    {user?.name?.charAt(0) || 'L'}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white" />
              </div>
            </button>
            <ProfileDropdown 
              isOpen={showProfile} 
              onClose={() => setShowProfile(false)}
              onOpenSettings={() => { setShowProfile(false); setShowSettings(true); }}
            />
          </div>
        </div>
      </div>

    </header>

      {/* Settings Modal — rendered outside header to avoid clipping */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
  );
}
