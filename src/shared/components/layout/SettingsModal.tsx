import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Bell, Shield, Palette, Eye, EyeOff, Check, Camera, Coins, ChevronLeft, Loader2 } from 'lucide-react';
import { useTheme } from '@/shared/hooks/use-theme';
import type { ThemeMode } from '@/shared/hooks/use-theme';
import { useAuthStore } from '@/features/auth';
import { uploadService } from '@/features/uploads/services/upload-service';

export type PanelId = 'profile' | 'notifications' | 'security' | 'appearance' | 'credits';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPanel?: PanelId;
}

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
  { id: 'credits',       icon: Coins,   label: 'Credits',       accent: 'border-yellow-500',  iconBg: 'bg-yellow-500',  iconColor: 'text-white' },
];

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none shadow-inner shrink-0 ${value ? 'bg-blue-600' : 'bg-gray-300'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${value ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  );
}

export function SettingsModal({ isOpen, onClose, initialPanel }: SettingsModalProps) {
  const [active, setActive] = useState<PanelId>(initialPanel ?? 'profile');
  const { user, setAvatarUrl, updateProfile } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  // Local blob preview shown immediately on file select, before upload completes
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  // Profile form state — controlled inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('');

  // Sync active panel whenever the modal opens with a new initialPanel
  useEffect(() => {
    if (isOpen) {
      setActive(initialPanel ?? 'profile');
    }
  }, [isOpen, initialPanel]);

  // Initialize profile fields from current user data whenever the modal opens or user changes
  useEffect(() => {
    if (isOpen) {
      const nameParts = (user?.name || '').split(' ');
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
      setEmail(user?.email || '');
      setJobTitle(user?.jobTitle || '');
    }
  }, [isOpen, user?.name, user?.email, user?.jobTitle]);

  // Load persisted notification preferences
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('admin_notif_prefs');
      if (saved) {
        try {
          const prefs = JSON.parse(saved);
          if (prefs.notifEmail !== undefined) setNotifEmail(prefs.notifEmail);
          if (prefs.notifPush !== undefined) setNotifPush(prefs.notifPush);
          if (prefs.notifSms !== undefined) setNotifSms(prefs.notifSms);
          if (prefs.alertNewNominations !== undefined) setAlertNewNominations(prefs.alertNewNominations);
          if (prefs.alertPaymentUpdates !== undefined) setAlertPaymentUpdates(prefs.alertPaymentUpdates);
          if (prefs.alertVotingMilestones !== undefined) setAlertVotingMilestones(prefs.alertVotingMilestones);
          if (prefs.alertSystemAlerts !== undefined) setAlertSystemAlerts(prefs.alertSystemAlerts);
        } catch { /* ignore corrupt data */ }
      }
    }
  }, [isOpen]);

  // Reset image error state when avatar URL changes
  useEffect(() => {
    setImgError(false);
    // Clear local preview once the store has the real URL
    if (user?.avatarUrl) setLocalPreview(null);
  }, [user?.avatarUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset input so the same file can be re-selected after an error
    e.target.value = '';
    setUploadError(null);

    const validation = uploadService.validateImage(file);
    if (!validation.valid) {
      setUploadError(validation.error ?? 'Invalid file');
      return;
    }

    // Show instant local preview while upload is in progress
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);
    setImgError(false);

    setUploading(true);
    try {
      const result = await uploadService.uploadImage(file, 'GENERAL');
      // Store the absolute URL as-is — the browser can load it directly from Railway.
      // Do NOT rewrite to /uploads/ because Vercel has no proxy for that path.
      setAvatarUrl(result.url);
      // Revoke the blob URL now that we have the real URL
      URL.revokeObjectURL(objectUrl);
      setLocalPreview(null);
    } catch {
      setUploadError('Upload failed. Please try again.');
      // Keep showing the local preview so the user sees what they selected
    } finally {
      setUploading(false);
    }
  };
  // On mobile, track whether we're showing the nav list or the panel content
  const [mobileView, setMobileView] = useState<'nav' | 'panel'>('nav');
  const [showPw, setShowPw] = useState(false);
  const { theme, setTheme } = useTheme();
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifSms, setNotifSms] = useState(false);
  const [alertNewNominations, setAlertNewNominations] = useState(true);
  const [alertPaymentUpdates, setAlertPaymentUpdates] = useState(true);
  const [alertVotingMilestones, setAlertVotingMilestones] = useState(true);
  const [alertSystemAlerts, setAlertSystemAlerts] = useState(true);
  const [saved, setSaved] = useState(false);
  const [freeVotePoints, setFreeVotePoints] = useState('10');
  const [premiumVotePoints, setPremiumVotePoints] = useState('50');
  const [basicPackagePrice, setBasicPackagePrice] = useState('9.99');
  const [premiumPackagePrice, setPremiumPackagePrice] = useState('29.99');

  if (!isOpen) return null;

  const handleSave = () => {
    if (active === 'profile') {
      updateProfile({ firstName, lastName, email, jobTitle });
    } else if (active === 'notifications') {
      localStorage.setItem('admin_notif_prefs', JSON.stringify({
        notifEmail, notifPush, notifSms,
        alertNewNominations, alertPaymentUpdates, alertVotingMilestones, alertSystemAlerts,
      }));
    }
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1500);
  };

  const handleNavSelect = (id: PanelId) => {
    setActive(id);
    setMobileView('panel');
  };

  const inp = 'w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-800 bg-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-400';

  const activeNav = NAV.find(n => n.id === active)!;
  const ActiveIcon = activeNav.icon;

  const panelDesc: Record<PanelId, string> = {
    profile: 'Update your personal information',
    notifications: 'Control how you receive alerts',
    security: 'Manage password and account security',
    appearance: 'Customize the look of your dashboard',
    credits: 'Configure credit points and package pricing',
  };

  const profilePanel = (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white">
        <div className="relative shrink-0">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center text-3xl font-black border-2 border-white/30 shadow-xl overflow-hidden">
            {(localPreview || (user?.avatarUrl && !imgError)) ? (
              <img
                src={localPreview ?? user!.avatarUrl}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={() => { setImgError(true); setLocalPreview(null); }}
              />
            ) : (
              user?.name?.charAt(0) || 'A'
            )}
          </div>
          {/* Camera button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            aria-label="Upload profile picture"
          >
            {uploading
              ? <Loader2 size={13} className="text-blue-700 animate-spin" />
              : <Camera size={13} className="text-blue-700" />
            }
          </button>
        </div>
        <div className="min-w-0 text-center sm:text-left">
          <p className="text-xl font-black tracking-tight">{user?.name || 'Commander'}</p>
          <p className="text-blue-200 text-sm mt-0.5">{user?.email || 'admin@awards.com'}</p>
          <span className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-bold border border-white/20">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            Active
          </span>
          {uploading && (
            <p className="mt-2 text-xs font-semibold text-blue-100 flex items-center gap-1.5">
              <Loader2 size={11} className="animate-spin" /> Uploading photo...
            </p>
          )}
          {uploadError && !uploading && (
            <p className="mt-2 text-xs font-semibold text-red-200 bg-red-500/30 rounded-lg px-2 py-1">
              {uploadError}
            </p>
          )}
          {!uploading && !uploadError && localPreview === null && user?.avatarUrl && (
            <p className="mt-2 text-xs font-semibold text-green-300 flex items-center gap-1">
              <Check size={11} /> Photo saved
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">First Name</label>
          <input className={inp} value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name" />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Last Name</label>
          <input className={inp} value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name" />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
        <input className={inp} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" />
      </div>
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Job Title</label>
        <input className={inp} value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="e.g. Awards Administrator" />
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
        <div key={item.label} className="flex items-center justify-between gap-3 p-4 rounded-2xl border-2 border-gray-100 bg-white hover:border-gray-200 transition-all">
          <div className="flex items-center gap-3 min-w-0">
            <span className={`w-2.5 h-2.5 rounded-full ${item.dot} shrink-0`} />
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-800 truncate">{item.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
            </div>
          </div>
          <Toggle value={item.value} onChange={item.set} />
        </div>
      ))}
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-6 mb-3">Alert Types</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {([
          { label: 'New nominations',   value: alertNewNominations,   set: () => setAlertNewNominations(v => !v) },
          { label: 'Payment updates',   value: alertPaymentUpdates,   set: () => setAlertPaymentUpdates(v => !v) },
          { label: 'Voting milestones', value: alertVotingMilestones, set: () => setAlertVotingMilestones(v => !v) },
          { label: 'System alerts',     value: alertSystemAlerts,     set: () => setAlertSystemAlerts(v => !v) },
        ] as const).map(item => (
          <label key={item.label} className="flex items-center gap-3 p-3.5 rounded-xl border-2 border-gray-100 bg-white hover:border-blue-200 hover:bg-blue-50/50 cursor-pointer transition-all group">
            <input
              type="checkbox"
              checked={item.value}
              onChange={item.set}
              className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500 shrink-0"
            />
            <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">{item.label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const securityPanel = (
    <div className="space-y-5">
      <div className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
          <Shield size={18} className="text-emerald-600" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-emerald-800">Account is secure</p>
          <p className="text-xs text-emerald-600 mt-0.5 break-words">Last login: Today at 09:41 AM · Chrome on Windows</p>
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
    </div>
  );

  const appearancePanel = (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Theme</p>
        <div className="grid grid-cols-3 gap-3">
          {([
            { value: 'light'  as ThemeMode, label: 'Light',  preview: 'bg-white',                                    border: 'border-gray-200' },
            { value: 'dark'   as ThemeMode, label: 'Dark',   preview: 'bg-gradient-to-br from-gray-800 to-gray-900', border: 'border-gray-400' },
            { value: 'system' as ThemeMode, label: 'System', preview: 'bg-gradient-to-br from-white to-gray-800',    border: 'border-gray-400' },
          ]).map(t => (
            <button key={t.value} onClick={() => setTheme(t.value)}
              className={`relative p-3 sm:p-4 rounded-2xl border-2 transition-all text-center ${theme === t.value ? 'border-blue-600 bg-blue-50 shadow-md shadow-blue-600/20' : `border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm`}`}>
              <div className={`w-full h-10 sm:h-12 rounded-xl border ${t.border} ${t.preview} mb-2 sm:mb-3 shadow-inner`} />
              <span className={`text-xs font-bold ${theme === t.value ? 'text-blue-700' : 'text-gray-600'}`}>{t.label}</span>
              {theme === t.value && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shadow-sm">
                  <Check size={11} className="text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Layout Density</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

  const creditsPanel = (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Credit Points Management</p>
        <div className="space-y-4">
          {[
            { label: 'Points per Free Vote', value: freeVotePoints, onChange: setFreeVotePoints, desc: 'Credits awarded for each free vote cast' },
            { label: 'Points per Premium Vote', value: premiumVotePoints, onChange: setPremiumVotePoints, desc: 'Credits awarded for each premium vote cast' },
          ].map(field => (
            <div key={field.label} className="flex items-center justify-between gap-3 p-4 rounded-2xl border-2 border-gray-100 bg-white">
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-800">{field.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{field.desc}</p>
              </div>
              <input
                type="number"
                min="0"
                value={field.value}
                onChange={e => field.onChange(e.target.value)}
                className="w-20 sm:w-24 px-3 py-2 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-800 text-right focus:outline-none focus:border-yellow-500 transition-colors shrink-0"
              />
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Price Management</p>
        <div className="space-y-4">
          {[
            { label: 'Basic Package Price (ETB)', value: basicPackagePrice, onChange: setBasicPackagePrice, desc: 'Price for the basic voting package' },
            { label: 'Premium Package Price (ETB)', value: premiumPackagePrice, onChange: setPremiumPackagePrice, desc: 'Price for the premium voting package' },
          ].map(field => (
            <div key={field.label} className="flex items-center justify-between gap-3 p-4 rounded-2xl border-2 border-gray-100 bg-white">
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-800">{field.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{field.desc}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-sm font-bold text-gray-500 hidden sm:inline">ETB</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={field.value}
                  onChange={e => field.onChange(e.target.value)}
                  className="w-20 sm:w-24 px-3 py-2 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-800 text-right focus:outline-none focus:border-yellow-500 transition-colors"
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
    credits: creditsPanel,
  };

  return createPortal(
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md" style={{ zIndex: 9998 }} onClick={onClose} />

      {/* Modal container — full screen on mobile, centered card on desktop */}
      <div className="fixed inset-0 flex items-end sm:items-center justify-center sm:px-4 sm:py-6" style={{ zIndex: 9999 }}>
        <div
          className="w-full sm:max-w-4xl bg-white sm:rounded-3xl shadow-2xl flex flex-col"
          style={{
            boxShadow: '0 32px 80px rgba(0,0,0,0.25)',
            maxHeight: '100dvh',
            height: '100dvh',
          }}
        >
          {/* ── Top header bar ── */}
          <div className="flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5 border-b border-gray-100 bg-white shrink-0 sm:rounded-t-3xl">
            {/* Mobile: back button when inside a panel */}
            <div className="flex items-center gap-3 min-w-0">
              {mobileView === 'panel' && (
                <button
                  onClick={() => setMobileView('nav')}
                  className="sm:hidden w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-all shrink-0 -ml-1"
                >
                  <ChevronLeft size={20} />
                </button>
              )}
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/40 shrink-0">
                <User size={18} className="text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-black text-gray-900 leading-none truncate">
                  {mobileView === 'panel' ? activeNav.label : 'Account Settings'}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5 truncate">
                  {mobileView === 'panel' ? panelDesc[active] : 'Manage your profile and preferences'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all shrink-0"
            >
              <X size={20} />
            </button>
          </div>

          {/* ── Body ── */}
          <div className="flex flex-1 overflow-hidden">

            {/* Left tab strip — always visible on sm+, hidden on mobile when panel is open */}
            <div className={`
              w-full sm:w-52 shrink-0 border-r border-gray-100 bg-gray-50/80 flex flex-col py-3 sm:py-4 px-3 gap-1 overflow-y-auto
              ${mobileView === 'panel' ? 'hidden sm:flex' : 'flex'}
            `}>
              {NAV.map(item => {
                const Icon = item.icon;
                const isActive = active === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavSelect(item.id)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all ${
                      isActive
                        ? 'bg-white shadow-md border border-gray-200 text-gray-900'
                        : 'text-gray-500 hover:bg-white/70 hover:text-gray-800'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isActive ? item.iconBg : 'bg-gray-200'}`}>
                      <Icon size={15} className={isActive ? item.iconColor : 'text-gray-500'} />
                    </div>
                    <span className={`text-sm font-bold flex-1 ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>{item.label}</span>
                    {/* On mobile show a chevron; on desktop show the accent bar */}
                    <span className="sm:hidden text-gray-400">›</span>
                    {isActive && <div className={`hidden sm:block ml-auto w-1.5 h-6 rounded-full ${item.accent.replace('border-', 'bg-')}`} />}
                  </button>
                );
              })}
            </div>

            {/* Right content panel — hidden on mobile when nav is showing */}
            <div className={`
              flex-1 overflow-y-auto
              ${mobileView === 'nav' ? 'hidden sm:block' : 'block'}
            `}>
              {/* Panel header */}
              <div className="px-5 sm:px-8 py-4 sm:py-5 border-b border-gray-100 flex items-center gap-3 sm:gap-4 bg-gradient-to-r from-white to-gray-50/50">
                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shadow-sm shrink-0 ${activeNav.iconBg}`}>
                  <ActiveIcon size={18} className={activeNav.iconColor} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-black text-gray-900 truncate">{activeNav.label}</h3>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{panelDesc[active]}</p>
                </div>
              </div>

              {/* Panel content */}
              <div className="px-5 sm:px-8 py-5 sm:py-6">
                {panels[active]}
              </div>
            </div>
          </div>

          {/* ── Footer — only show when panel content is visible ── */}
          <div className={`
            flex items-center justify-end gap-3 px-5 sm:px-8 py-4 sm:py-5 border-t border-gray-100 bg-gray-50/50 shrink-0 sm:rounded-b-3xl
            ${mobileView === 'nav' ? 'hidden sm:flex' : 'flex'}
          `}>
            <button
              onClick={onClose}
              className="px-5 sm:px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 sm:px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all flex items-center gap-2 shadow-lg"
              style={{
                backgroundColor: saved ? '#16a34a' : '#2563eb',
                boxShadow: saved ? '0 4px 14px rgba(22,163,74,0.4)' : '0 4px 14px rgba(37,99,235,0.4)',
              }}
            >
              {saved ? <><Check size={15} /> Saved!</> : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
