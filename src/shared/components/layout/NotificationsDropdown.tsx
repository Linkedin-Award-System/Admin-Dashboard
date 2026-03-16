import { useState, useRef, useEffect } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Nominee Submission',
    message: 'John Doe submitted a nomination for Content Creation category',
    time: '5 minutes ago',
    read: false,
  },
  {
    id: '2',
    title: 'Payment Received',
    message: 'Payment of $50 received from Jane Smith',
    time: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    title: 'Voting Period Started',
    message: 'Public voting is now open for all categories',
    time: '2 hours ago',
    read: true,
  },
];

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsDropdown({ isOpen, onClose }: NotificationsDropdownProps) {
  const [notifications, setNotifications] = useState(mockNotifications);
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

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-border-light z-50 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border-light">
        <div className="flex items-center gap-2">
          <Bell size={20} className="text-primary-600" />
          <h3 className="font-black text-text-primary">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-primary-600 text-white text-xs font-bold rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-bg-tertiary rounded-lg transition-colors"
        >
          <X size={18} className="text-text-tertiary" />
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell size={40} className="mx-auto text-text-quaternary mb-2" />
            <p className="text-text-tertiary text-sm">No notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-border-light">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "p-4 hover:bg-bg-tertiary transition-colors cursor-pointer",
                  !notification.read && "bg-primary-50/30"
                )}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-text-primary mb-1">
                      {notification.title}
                    </h4>
                    <p className="text-xs text-text-tertiary mb-2">
                      {notification.message}
                    </p>
                    <span className="text-[10px] text-text-quaternary font-medium">
                      {notification.time}
                    </span>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-1" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && unreadCount > 0 && (
        <div className="p-3 border-t border-border-light">
          <button
            onClick={markAllAsRead}
            className="w-full py-2 text-xs font-bold text-primary-600 hover:bg-primary-50 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Check size={14} />
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
}
