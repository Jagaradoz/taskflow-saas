import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Settings,
  Mail,
  Inbox,
  LogOut,
} from 'lucide-react';
import { getAuthState, mockLogout } from '../../mock/auth';

const NAV_ITEMS = [
  { to: '/', label: 'TASKS', icon: LayoutDashboard },
  { to: '/members', label: 'MEMBERS', icon: Users },
  { to: '/settings', label: 'SETTINGS', icon: Settings },
  { to: '/invites', label: 'INVITES', icon: Mail },
  { to: '/requests', label: 'REQUESTS', icon: Inbox },
] as const;

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const auth = getAuthState();

  const handleLogout = (): void => {
    mockLogout();
    navigate('/login');
  };

  const initials = auth?.user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '';

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col justify-between border-r border-border bg-bg-sidebar pt-6">
      {/* Top */}
      <div className="flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 pb-6">
          <div className="flex h-8 w-8 items-center justify-center bg-green-primary">
            <span className="font-display text-lg font-bold text-black-on-accent">T</span>
          </div>
          <span className="font-mono text-sm font-semibold tracking-[1px] text-white">
            TASKFLOW
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-0.5">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3 font-mono text-xs tracking-wide transition-colors ${
                  isActive
                    ? 'border-l-2 border-green-primary bg-green-tint-10 font-semibold text-white'
                    : 'border-l-2 border-transparent font-medium text-gray-500 hover:bg-green-tint-10/50 hover:text-white'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom */}
      <div className="flex flex-col">
        {/* System Status */}
        <div className="mx-0 flex flex-col gap-2.5 border-y border-r border-border bg-bg-card p-5">
          <span className="font-mono text-[11px] font-medium uppercase tracking-[1px] text-gray-500">
            SYSTEM STATUS
          </span>
          {[
            ['API', '[OK]'],
            ['DATABASE', '[OK]'],
            ['REDIS', '[OK]'],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-medium text-gray-500">
                {label}
              </span>
              <span className="font-mono text-[11px] font-semibold text-green-primary">
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* User Section */}
        <div className="flex items-center gap-3 border-t border-border px-5 py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-border-light bg-bg-subtle">
            <span className="font-mono text-[11px] font-semibold text-gray-500">
              {initials}
            </span>
          </div>
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="truncate font-mono text-[13px] font-medium text-white">
              {auth?.user.name}
            </span>
            <span className="font-mono text-[11px] font-medium text-green-primary">
              ONLINE
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="ml-auto text-gray-500 hover:text-red-error"
            title="Logout"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
};
