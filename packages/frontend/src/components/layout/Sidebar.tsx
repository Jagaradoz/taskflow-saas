import {
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  Settings,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

import { useAuthQuery, useLogoutMutation } from '@/features/auth/hooks/use-auth';

interface SidebarProps {
  currentOrgId: string;
  mobile?: boolean;
  onClose?: () => void;
  onNavigate?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentOrgId,
  mobile = false,
  onClose,
  onNavigate,
}) => {
  const navigate = useNavigate();
  const { data } = useAuthQuery();
  const logoutMutation = useLogoutMutation();
  const auth = data?.user;
  const dashboardBasePath = `/app/${currentOrgId}`;
  const organizationNavItems = [
    { to: dashboardBasePath, label: 'TASKS', icon: LayoutDashboard },
    { to: `${dashboardBasePath}/member`, label: 'MEMBERS', icon: Users },
    { to: `${dashboardBasePath}/settings`, label: 'SETTINGS', icon: Settings },
    { to: `${dashboardBasePath}/invites`, label: 'INVITES', icon: Mail },
    { to: `${dashboardBasePath}/requests`, label: 'REQUESTS', icon: Inbox },
  ] as const;
  const userNavItems = [
    { to: `${dashboardBasePath}/me/invites`, label: 'MY INVITES', icon: UserPlus },
  ] as const;

  const handleLogout = async (): Promise<void> => {
    await logoutMutation.mutateAsync();
    onNavigate?.();
    navigate('/');
  };

  const initials = auth?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '';

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col justify-between border-r border-border bg-bg-sidebar pt-6">
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
          {mobile && onClose && (
            <button
              onClick={onClose}
              className="ml-auto text-gray-500 hover:text-white"
              title="Close navigation"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-0.5">
          <span className="px-2 pb-1 font-mono text-[10px] font-medium tracking-[1px] text-gray-500">
            ORGANIZATIONS
          </span>
          {organizationNavItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === dashboardBasePath}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3 font-mono text-xs tracking-wide transition-colors ${isActive
                  ? 'border-l-2 border-green-primary bg-green-tint-10 font-semibold text-white'
                  : 'border-l-2 border-transparent font-medium text-gray-500 hover:bg-green-tint-10/50 hover:text-white'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}

          <div className="my-2 h-px w-full bg-border" />

          <span className="px-2 pb-1 font-mono text-[10px] font-medium tracking-[1px] text-gray-500">
            USERS
          </span>
          {userNavItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3 font-mono text-xs tracking-wide transition-colors ${isActive
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
        {/* User Section */}
        <div className="flex items-center gap-3 border-t border-border px-5 py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-border-light bg-bg-subtle">
            <span className="font-mono text-[11px] font-semibold text-gray-500">
              {initials}
            </span>
          </div>
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="truncate font-mono text-[13px] font-medium text-white">
              {auth?.name ?? 'User'}
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
