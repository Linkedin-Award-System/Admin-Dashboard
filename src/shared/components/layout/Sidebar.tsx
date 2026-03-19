import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Users,
  Activity,
  Landmark,
  Coins,
  LogOut,
  User,
  UserCheck,
} from 'lucide-react';
import { useAuthStore } from '@/features/auth';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
}

const navItems: NavItem[] = [
  { name: 'Dashboard',  path: '/dashboard',  icon: LayoutDashboard },
  { name: 'Categories', path: '/categories', icon: Layers },
  { name: 'Nominees',   path: '/nominees',   icon: Users },
  { name: 'Voters',     path: '/voters',     icon: UserCheck },
  { name: 'Voting Hub', path: '/voting',     icon: Activity },
  { name: 'Financials', path: '/payments',   icon: Landmark },
  { name: 'Credits',    path: '/credits',    icon: Coins },
];

function HamburgerIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="2" y="4"  width="16" height="2" rx="1" fill="currentColor" />
      <rect x="2" y="9"  width="11" height="2" rx="1" fill="currentColor" />
      <rect x="2" y="14" width="16" height="2" rx="1" fill="currentColor" />
    </svg>
  );
}

interface SidebarProps {
  isOpen?: boolean;
  isCollapsed?: boolean;
  onClose?: () => void;
  onToggleCollapse?: () => void;
}

const W_COLLAPSED = 72;
const W_EXPANDED  = 260;

export function Sidebar({
  isOpen = true,
  isCollapsed = false,
  onClose,
  onToggleCollapse,
}: SidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const W = isCollapsed ? W_COLLAPSED : W_EXPANDED;

  return (
    <>
      <style>{`
        .sidebar-tooltip {
          position: absolute;
          left: calc(100% + 14px);
          top: 50%;
          transform: translateY(-50%);
          background: #1e293b;
          color: #f1f5f9;
          font-size: 12px;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 8px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.15s ease;
          box-shadow: 0 4px 16px rgba(0,0,0,0.45);
          border: 1px solid rgba(255,255,255,0.1);
          z-index: 9999;
        }
        .sidebar-tooltip::before {
          content: '';
          position: absolute;
          right: 100%;
          top: 50%;
          transform: translateY(-50%);
          border: 5px solid transparent;
          border-right-color: #1e293b;
        }
        .sidebar-nav-item:hover .sidebar-tooltip {
          opacity: 1;
        }
        .sidebar-hamburger-btn {
          display: none !important;
          align-items: center;
          justify-content: center;
        }
        @media (min-width: 1024px) {
          .sidebar-hamburger-btn {
            display: flex !important;
          }
        }
      `}</style>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
          }}
          className="lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        aria-label="Main navigation"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          zIndex: 50,
          height: '100vh',
          width: W,
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.28s cubic-bezier(0.4,0,0.2,1), transform 0.28s cubic-bezier(0.4,0,0.2,1)',
          background: 'linear-gradient(175deg, #0b1a35 0%, #0e2147 35%, #091529 100%)',
          boxShadow: '4px 0 32px rgba(0,0,0,0.4), inset -1px 0 0 rgba(255,255,255,0.04)',
          overflow: 'hidden',
        }}
        className={!isOpen ? '-translate-x-full lg:translate-x-0' : ''}
      >
        {/* Top accent gradient bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: 'linear-gradient(90deg, #1d4ed8 0%, #3b82f6 40%, #60a5fa 70%, #93c5fd 100%)',
          opacity: 0.9,
        }} />

        {/* Ambient glow top-right */}
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          height: 72,
          padding: isCollapsed ? '0 16px' : '0 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(37,99,235,0.55)',
          }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 17, fontStyle: 'italic' }}>L</span>
          </div>

          {!isCollapsed && (
            <div style={{ flex: 1, marginLeft: 12, overflow: 'hidden' }}>
              <div style={{ color: '#fff', fontWeight: 900, fontSize: 13, letterSpacing: '0.06em', lineHeight: 1 }}>CREATIVE</div>
              <div style={{ color: '#60a5fa', fontWeight: 700, fontSize: 8.5, letterSpacing: '0.24em', marginTop: 3, lineHeight: 1, textTransform: 'uppercase' }}>Awards Admin</div>
            </div>
          )}

          {!isCollapsed && (
            <button
              onClick={onToggleCollapse}
              title="Collapse sidebar"
              className="sidebar-hamburger-btn"
              style={{
                width: 34, height: 34, borderRadius: 9, border: 'none',
                background: 'rgba(255,255,255,0.07)',
                color: 'rgba(255,255,255,0.55)',
                cursor: 'pointer',
                transition: 'background 0.2s, color 0.2s',
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.13)';
                (e.currentTarget as HTMLButtonElement).style.color = '#fff';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)';
                (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.55)';
              }}
            >
              <HamburgerIcon />
            </button>
          )}
        </div>

        {/* Collapsed: hamburger below header */}
        {isCollapsed && (
          <button
            onClick={onToggleCollapse}
            title="Expand sidebar"
            className="sidebar-hamburger-btn"
            style={{
              margin: '10px auto 0',
              width: 40, height: 40, borderRadius: 10, border: 'none',
              background: 'rgba(255,255,255,0.07)',
              color: 'rgba(255,255,255,0.55)',
              cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s',
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.13)';
              (e.currentTarget as HTMLButtonElement).style.color = '#fff';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)';
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.55)';
            }}
          >
            <HamburgerIcon />
          </button>
        )}

        {/* Nav items */}
        <nav style={{
          flex: 1,
          padding: '12px 10px',
          overflowY: 'auto',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}>
          {!isCollapsed && (
            <div style={{
              color: 'rgba(255,255,255,0.22)',
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: '0.22em',
              padding: '4px 10px 10px',
              textTransform: 'uppercase',
            }}>
              Menu
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const isHovered = hoveredPath === item.path;

            return (
              <div
                key={item.path}
                className="sidebar-nav-item"
                style={{ position: 'relative' }}
                onMouseEnter={() => setHoveredPath(item.path)}
                onMouseLeave={() => setHoveredPath(null)}
              >
                <Link
                  to={item.path}
                  onClick={isOpen && !isCollapsed ? onClose : undefined}
                  aria-current={isActive ? 'page' : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: isCollapsed ? 0 : 12,
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    padding: isCollapsed ? '10px 0' : '10px 12px',
                    borderRadius: 12,
                    textDecoration: 'none',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'background 0.2s',
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(37,99,235,0.38) 0%, rgba(59,130,246,0.2) 100%)'
                      : isHovered
                        ? 'rgba(255,255,255,0.07)'
                        : 'transparent',
                    boxShadow: isActive
                      ? 'inset 0 0 0 1px rgba(96,165,250,0.28), 0 4px 12px rgba(37,99,235,0.12)'
                      : 'none',
                  }}
                >
                  {/* Left accent bar — active + expanded */}
                  {isActive && !isCollapsed && (
                    <div style={{
                      position: 'absolute',
                      left: 0, top: '50%',
                      transform: 'translateY(-50%)',
                      width: 3, height: '55%',
                      borderRadius: '0 3px 3px 0',
                      background: 'linear-gradient(180deg, #60a5fa, #2563eb)',
                      boxShadow: '0 0 10px rgba(96,165,250,0.8)',
                    }} />
                  )}

                  {/* Icon */}
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative',
                    background: isActive
                      ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
                      : isHovered
                        ? 'rgba(255,255,255,0.1)'
                        : 'rgba(255,255,255,0.05)',
                    boxShadow: isActive
                      ? '0 4px 14px rgba(37,99,235,0.55), 0 0 0 1px rgba(96,165,250,0.3)'
                      : 'none',
                    transition: 'background 0.2s, box-shadow 0.2s',
                  }}>
                    {isActive && (
                      <div style={{
                        position: 'absolute', inset: -3,
                        borderRadius: 13,
                        boxShadow: '0 0 14px rgba(59,130,246,0.5)',
                        pointerEvents: 'none',
                      }} />
                    )}
                    <Icon
                      size={17}
                      style={{
                        color: isActive ? '#fff' : isHovered ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.45)',
                        transition: 'color 0.2s',
                      }}
                    />
                  </div>

                  {/* Label */}
                  {!isCollapsed && (
                    <span style={{
                      fontSize: 13,
                      fontWeight: isActive ? 700 : 500,
                      letterSpacing: '0.02em',
                      color: isActive ? '#fff' : isHovered ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.5)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      transition: 'color 0.2s',
                      flex: 1,
                    }}>
                      {item.name}
                    </span>
                  )}

                  {/* Active dot — expanded */}
                  {isActive && !isCollapsed && (
                    <div style={{
                      width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                      background: '#60a5fa',
                      boxShadow: '0 0 8px rgba(96,165,250,0.9)',
                    }} />
                  )}

                  {/* Active dot — collapsed */}
                  {isActive && isCollapsed && (
                    <div style={{
                      position: 'absolute',
                      bottom: 4, left: '50%',
                      transform: 'translateX(-50%)',
                      width: 4, height: 4, borderRadius: '50%',
                      background: '#60a5fa',
                      boxShadow: '0 0 6px rgba(96,165,250,0.9)',
                    }} />
                  )}
                </Link>

                {/* Tooltip — collapsed only */}
                {isCollapsed && (
                  <div className="sidebar-tooltip">{item.name}</div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{
          padding: '10px 10px 14px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          {/* User card */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: isCollapsed ? 0 : 10,
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            padding: isCollapsed ? '8px 0' : '9px 10px',
            borderRadius: 12,
            background: 'rgba(255,255,255,0.05)',
            marginBottom: 6,
          }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 9,
                background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(37,99,235,0.4)',
              }}>
                <User size={16} style={{ color: '#fff' }} />
              </div>
              <div style={{
                position: 'absolute', bottom: -1, right: -1,
                width: 9, height: 9, borderRadius: '50%',
                background: '#22c55e',
                border: '2px solid #091529',
              }} />
            </div>

            {!isCollapsed && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  color: '#fff', fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.03em', lineHeight: 1,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {user?.name || 'Platform Admin'}
                </div>
                <div style={{
                  color: 'rgba(255,255,255,0.35)', fontSize: 9, fontWeight: 600,
                  marginTop: 3, letterSpacing: '0.12em', textTransform: 'uppercase',
                }}>
                  {user?.role === 'admin' ? 'Administrator' : 'Agent'}
                </div>
              </div>
            )}
          </div>

          {/* Sign out */}
          <button
            onClick={() => logout()}
            title="Sign out"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: isCollapsed ? 0 : 9,
              padding: isCollapsed ? '9px 0' : '8px 10px',
              borderRadius: 10,
              border: 'none',
              background: 'transparent',
              color: 'rgba(248,113,113,0.65)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.12)';
              (e.currentTarget as HTMLButtonElement).style.color = '#f87171';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(248,113,113,0.65)';
            }}
          >
            <LogOut size={15} />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
