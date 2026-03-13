import { X, User, Bell, Lock, Palette, Globe } from 'lucide-react';
import { Button } from '../ui/button';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  if (!isOpen) return null;

  const settingsSections = [
    {
      icon: User,
      title: 'Profile Settings',
      description: 'Manage your account information and preferences',
      action: 'Edit Profile',
    },
    {
      icon: Bell,
      title: 'Notification Preferences',
      description: 'Control how and when you receive notifications',
      action: 'Configure',
    },
    {
      icon: Lock,
      title: 'Security & Privacy',
      description: 'Update password and manage security settings',
      action: 'Manage',
    },
    {
      icon: Palette,
      title: 'Appearance',
      description: 'Customize the look and feel of your dashboard',
      action: 'Customize',
    },
    {
      icon: Globe,
      title: 'Language & Region',
      description: 'Set your preferred language and regional settings',
      action: 'Change',
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border-light">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-50 rounded-xl">
                <User size={24} className="text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-black text-text-primary">Settings</h2>
                <p className="text-xs text-text-tertiary mt-0.5">Manage your account and preferences</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-bg-tertiary rounded-xl transition-colors"
            >
              <X size={24} className="text-text-tertiary" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="space-y-4">
              {settingsSections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-bg-tertiary/30 rounded-2xl border border-border-light hover:border-primary-500/50 hover:bg-primary-50/30 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-xl border border-border-light group-hover:border-primary-500/50 transition-colors">
                        <Icon size={20} className="text-text-tertiary group-hover:text-primary-600 transition-colors" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-text-primary mb-1">
                          {section.title}
                        </h3>
                        <p className="text-xs text-text-tertiary">
                          {section.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                      onClick={() => console.log(`${section.title} clicked`)}
                    >
                      {section.action}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-border-light bg-bg-tertiary/20">
            <Button variant="outline" onClick={onClose} style={{ backgroundColor: '#ffffff', color: '#085299', border: '2px solid #085299' }} className="rounded-xl hover:bg-primary-50 transition-all duration-200">
              Close
            </Button>
            <Button variant="default" onClick={onClose} style={{ backgroundColor: '#085299', color: '#ffffff' }} className="rounded-xl">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
