import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Bell, Shield, Palette, Globe, Eye, EyeOff, Check, Camera, Coins } from 'lucide-react';
import { useTheme } from '@/shared/hooks/use-theme';
import type { ThemeMode } from '@/shared/hooks/use-theme';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PanelId = 'profile' | 'notifications' | 'security' | 'appearance' | 'language' | 'credits';

interface NavItem {
  id: PanelId;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  accent: string;
  iconBg: string;
  iconColor: string;
}

const NAV: NavItem[] = [
  { id: 'profile',       icon: User,    label: 'Profile',       accent: 'border-blue-500',    iconBg: 'bg-blue-600',    iconColor: 'text-white' },
  { id: 'notifications', icon: Bell,    label: 'Notifications', accent: 'border-amber-500',   iconBg: 'bg-amber-500',   iconColor: 'text-white' },
  { id: 'security',      icon: Shield,  label: 'Security',      accent: 'border-red-500',     iconBg: 'bg-red-500',     iconColor: 'text-white' },
  { id: 'appearance',    icon: Palette, label: 'Appearance',    accent: 'border-purple-500',  iconBg: 'bg-purple-600',  iconColor: 'text-white' },
  { id: 'language',      icon: Globe,   label: 'Language',      accent: 'border-emerald-500', iconBg: 'bg-emerald-600', iconColor: 'text-white' },
  { id: 'credits',       icon: Coins,   label: 'Credits',       accent: 'border-yellow-500',  iconBg: 'bg-yellow-500',  iconColor: 'text-white' },
];

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none shadow-inner ${value ? 'bg-blue-600' : 'bg-gray-300'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${value ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  );
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [active, setActive] = useState<PanelId>('profile');
  const [showPw, setShowPw] = useState(false);
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC');
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifSms, setNotifSms] = useState(false);
  const [saved, setSaved] = useState(false);
  // Credits state
  const [freeVotePoints, setFreeVotePoints] = useState('10');
  const [premiumVotePoints, setPremiumVotePoints] = useState('50');
  const [basicPackagePrice, setBasicPackagePrice] = useState('9.99');
  const [premiumPackagePrice, setPremiumPackagePrice] = useState('29.99');

  if (!isOpen) return null;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1500);
  };

  const inp = 'w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-800 bg-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-400';

  const activeNav = NAV.find(n => n.id === active)!;
  const ActiveIcon = activeNav.icon;

  const panelDesc: Record<PanelId, string> = {
    profile: 'Update your personal information',
    notifications: 'Control how you receive alerts',
    security: 'Manage password and account security',
    appearance: 'Customize the look of your dashboard',
    language: 'Set your language and regional preferences',
    credits: 'Configure credit points and package pricing',
  };

  const profilePanel = (
    <div className="space-y-5">
      <div className="flex items-center gap-5 p-6 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white">
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center text-3xl font-black border-2 border-white/30 shadow-xl">C</div>
          <button className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
            <Camera size={13} className="text-blue-700" />
          </button>
        </div>
        <div className="min-w-0">
          <p className="text-xl font-black tracking-tight">Commander</p>
          <p className="text-blue-200 text-sm mt-0.5">admin@awards.com</p>
          <span className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-bold border border-white/20">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            Active
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">First Name</label>
          <input className={inp} defaultValue="Commander" />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Last Name</label>
          <input className={inp} placeholder="Last name" />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
        <input className={inp} type="email" defaultValue="admin@awards.com" />
      </div>
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Job Title</label>
        <input className={inp} placeholder="e.g. Awards Administrator" />
      </div>
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Bio</label>
        <textarea className={`${inp} min-h-[80px] resize-none`} placeholder="A short bio about yourself..." />
      </div>
    </div>
  );

  const notificationsPanel = (
    <div className="space-y-4">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Notification Channels</p>
      {[
        { label: 'Email Notifications', desc: 'Updates and alerts via email', dot: 'bg-blue-500', value: notifEmail, set: () => setNotifEmail(v => !v) },
        { label: 'Push Notifications',  desc: 'Browser push alerts',          dot: 'bg-amber-500', value: notifPush, set: () => setNotifPush(v => !v) },
        { label: 'SMS Notifications',   desc: 'Critical alerts via SMS',      dot: 'bg-red-500',   value: notifSms,  set: () => setNotifSms(v => !v) },
      ].map(item => (
        <div key={item.label} className="flex items-center justify-between p-4 rounded-2xl border-2 border-gray-100 bg-white hover:border-gray-200 transition-all">
          <div className="flex items-center gap-3">
            <span className={`w-2.5 h-2.5 rounded-full ${item.dot} shrink-0`} />
            <div>
              <p className="text-sm font-bold text-gray-800">{item.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
            </div>
          </div>
          <Toggle value={item.value} onChange={item.set} />
        </div>
      ))}
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-6 mb-3">Alert Types</p>
      <div className="grid grid-cols-2 gap-3">
        {['New nominations', 'Payment updates', 'Voting milestones', 'System alerts'].map(item => (
          <label key={item} className="flex items-center gap-3 p-3.5 rounded-xl border-2 border-gray-100 bg-white hover:border-blue-200 hover:bg-blue-50/50 cursor-pointer transition-all group">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500" />
            <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">{item}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const securityPanel = (
    <div className="space-y-5">
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
          <Shield size={18} className="text-emerald-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-emerald-800">Account is secure</p>
          <p className="text-xs text-emerald-600 mt-0.5">Last login: Today at 09:41 AM · Chrome on Windows</p>
        </div>
      </div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Change Password</p>
      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Current Password</label>
          <div className="relative">
            <input type={showPw ? 'text' : 'password'} className={inp} placeholder="Enter current password" />
            <button onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">New Password</label>
          <input type="password" className={inp} placeholder="Min. 8 characters" />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Confirm New Password</label>
          <input type="password" className={inp} placeholder="Repeat new password" />
        </div>
      </div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Two-Factor Authentication</p>
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border-2 border-gray-100">
        <div className="w-9 h-9 rounded-xl bg-gray-200 flex items-center justify-center shrink-0">
          <Shield size={16} className="text-gray-500" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-700">Two-Factor Authentication</p>
          <p className="text-xs text-gray-400 mt-0.5">Contact your system administrator to enable 2FA</p>
        </div>
      </div>
    </div>
  );

  const appearancePanel = (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Theme</p>
        <div className="grid grid-cols-3 gap-3">
          {([
            { value: 'light'  as ThemeMode, label: 'Light',  preview: 'bg-white',                          border: 'border-gray-200' },
            { value: 'dark'   as ThemeMode, label: 'Dark',   preview: 'bg-gradient-to-br from-gray-800 to-gray-900', border: 'border-gray-400' },
            { value: 'system' as ThemeMode, label: 'System', preview: 'bg-gradient-to-br from-white to-gray-800',    border: 'border-gray-400' },
          ]).map(t => (
            <button key={t.value} onClick={() => setTheme(t.value)}
              className={`relative p-4 rounded-2xl border-2 transition-all text-center ${theme === t.value ? 'border-blue-600 bg-blue-50 shadow-md shadow-blue-600/20' : `border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm`}`}>
              <div className={`w-full h-12 rounded-xl border ${t.border} ${t.preview} mb-3 shadow-inner`} />
              <span className={`text-xs font-bold ${theme === t.value ? 'text-blue-700' : 'text-gray-600'}`}>{t.label}</span>
              {theme === t.value && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shadow-sm">
                  <Check size={11} className="text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Layout Density</p>
        <div className="grid grid-cols-2 gap-3">
          {([
            { value: 'comfortable', label: 'Comfortable', desc: 'More breathing room' },
            { value: 'compact',     label: 'Compact',     desc: 'Denser information' },
          ] as const).map(d => (
            <button key={d.value}
              className="p-4 rounded-2xl border-2 border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 text-left transition-all">
              <p className="text-sm font-bold text-gray-800">{d.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{d.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const languagePanel = (
    <div className="space-y-5">
      {[
        {
          label: 'Display Language', id: 'lang', value: language, onChange: setLanguage,
          options: [
            { value: 'en',    label: 'English (US)' },
            { value: 'en-gb', label: 'English (UK)' },
            { value: 'fr',    label: 'Français' },
            { value: 'de',    label: 'Deutsch' },
            { value: 'es',    label: 'Español' },
            { value: 'ar',    label: 'العربية' },
            { value: 'zh',    label: '中文' },
          ],
        },
        {
          label: 'Timezone', id: 'tz', value: timezone, onChange: setTimezone,
          options: [
            { value: 'UTC',              label: 'UTC — Coordinated Universal Time' },
            { value: 'America/New_York', label: 'Eastern Time (ET) — UTC-5' },
            { value: 'America/Chicago',  label: 'Central Time (CT) — UTC-6' },
            { value: 'America/Los_Angeles', label: 'Pacific Time (PT) — UTC-8' },
            { value: 'Europe/London',    label: 'London (GMT) — UTC+0' },
            { value: 'Europe/Paris',     label: 'Paris (CET) — UTC+1' },
            { value: 'Asia/Dubai',       label: 'Dubai (GST) — UTC+4' },
            { value: 'Asia/Riyadh',      label: 'Riyadh (AST) — UTC+3' },
            { value: 'Asia/Tokyo',       label: 'Tokyo (JST) — UTC+9' },
          ],
        },
      ].map(field => (
        <div key={field.id} className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">{field.label}</label>
          <select value={field.value} onChange={e => field.onChange(e.target.value)} className={inp}>
            {field.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      ))}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Date Format</label>
        <select className={inp} defaultValue="MM/DD/YYYY">
          <option>MM/DD/YYYY</option>
          <option>DD/MM/YYYY</option>
          <option>YYYY-MM-DD</option>
        </select>
      </div>
    </div>
  );

  const creditsPanel = (
    <div className="space-y-8">
      {/* Credit Points Management */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Credit Points Management</p>
        <div className="space-y-4">
          {[
            { label: 'Points per Free Vote', value: freeVotePoints, onChange: setFreeVotePoints, desc: 'Credits awarded for each free vote cast' },
            { label: 'Points per Premium Vote', value: premiumVotePoints, onChange: setPremiumVotePoints, desc: 'Credits awarded for each premium vote cast' },
          ].map(field => (
            <div key={field.label} className="flex items-center justify-between p-4 rounded-2xl border-2 border-gray-100 bg-white">
              <div>
                <p className="text-sm font-bold text-gray-800">{field.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{field.desc}</p>
              </div>
              <input
                type="number"
                min="0"
                value={field.value}
                onChange={e => field.onChange(e.target.value)}
                className="w-24 px-3 py-2 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-800 text-right focus:outline-none focus:border-yellow-500 transition-colors"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Price Management */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Price Management</p>
        <div className="space-y-4">
          {[
            { label: 'Basic Package Price (ETB)', value: basicPackagePrice, onChange: setBasicPackagePrice, desc: 'Price for the basic voting package' },
            { label: 'Premium Package Price (ETB)', value: premiumPackagePrice, onChange: setPremiumPackagePrice, desc: 'Price for the premium voting package' },
          ].map(field => (
            <div key={field.label} className="flex items-center justify-between p-4 rounded-2xl border-2 border-gray-100 bg-white">
              <div>
                <p className="text-sm font-bold text-gray-800">{field.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{field.desc}</p>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-gray-500">ETB</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={field.value}
                  onChange={e => field.onChange(e.target.value)}
                  className="w-24 px-3 py-2 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-800 text-right focus:outline-none focus:border-yellow-500 transition-colors"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const panels: Record<PanelId, React.ReactNode> = {
    profile: profilePanel,
    notifications: notificationsPanel,
    security: securityPanel,
    appearance: appearancePanel,
    language: languagePanel,
    credits: creditsPanel,
  };

  return createPortal(
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md" style={{ zIndex: 9998 }} onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 flex items-start justify-center px-6 pt-28 pb-8" style={{ zIndex: 9999, overflowY: 'auto' }}>
        <div
          className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.25)' }}
        >
          {/* Top header bar */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/40">
                <User size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900 leading-none">Account Settings</h2>
                <p className="text-xs text-gray-400 mt-0.5">Manage your profile and preferences</p>
              </div>
            </div>
            <button onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all">
              <X size={20} />
            </button>
          </div>

          {/* Body: left tabs + right content */}
          <div className="flex flex-1 overflow-hidden">

            {/* Left tab strip */}
            <div className="w-52 shrink-0 border-r border-gray-100 bg-gray-50/80 flex flex-col py-4 px-3 gap-1 overflow-y-auto">
              {NAV.map(item => {
                const Icon = item.icon;
                const isActive = active === item.id;
                return (
                  <button key={item.id} onClick={() => setActive(item.id)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all ${
                      isActive
                        ? 'bg-white shadow-md border border-gray-200 text-gray-900'
                        : 'text-gray-500 hover:bg-white/70 hover:text-gray-800'
                    }`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isActive ? item.iconBg : 'bg-gray-200'}`}>
                      <Icon size={15} className={isActive ? item.iconColor : 'text-gray-500'} />
                    </div>
                    <span className={`text-sm font-bold ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>{item.label}</span>
                    {isActive && <div className={`ml-auto w-1.5 h-6 rounded-full ${item.accent.replace('border-', 'bg-')}`} />}
                  </button>
                );
              })}
            </div>

            {/* Right content panel */}
            <div className="flex-1 overflow-y-auto">
              {/* Panel header */}
              <div className="px-8 py-5 border-b border-gray-100 flex items-center gap-4 bg-gradient-to-r from-white to-gray-50/50">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm ${activeNav.iconBg}`}>
                  <ActiveIcon size={20} className={activeNav.iconColor} />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">{activeNav.label}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{panelDesc[active]}</p>
                </div>
              </div>

              {/* Panel content */}
              <div className="px-8 py-6">
                {panels[active]}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-gray-100 bg-gray-50/50 shrink-0">
            <button onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all">
              Cancel
            </button>
            <button onClick={handleSave}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all flex items-center gap-2 shadow-lg"
              style={{
                backgroundColor: saved ? '#16a34a' : '#2563eb',
                boxShadow: saved ? '0 4px 14px rgba(22,163,74,0.4)' : '0 4px 14px rgba(37,99,235,0.4)',
              }}>
              {saved ? <><Check size={15} /> Saved!</> : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
