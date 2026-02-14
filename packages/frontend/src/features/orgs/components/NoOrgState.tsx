import { Building2, LogOut, Plus, Search, Users } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useLogoutMutation } from '@/features/auth/hooks/use-auth';

import { useListOrganizationsQuery } from '../hooks/use-orgs';

export const NoOrgState: React.FC = () => {
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation();
  const [search, setSearch] = useState('');
  const { data: organizations, isLoading } = useListOrganizationsQuery(
    search || undefined,
  );

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => navigate('/login', { replace: true }),
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-bg-page px-4 py-12 sm:py-20">
      {/* Header */}
      <div className="flex w-full max-w-lg flex-col items-center gap-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center border border-border bg-bg-elevated">
          <Building2 size={28} className="text-green-primary" />
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
          NO ORGANIZATION
        </h1>
        <p className="max-w-sm font-mono text-xs leading-relaxed text-gray-500">
          You are not a member of any organization yet. Create a new one or
          join an existing team below.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex w-full max-w-lg flex-col gap-3 sm:flex-row">
        <button
          onClick={() => navigate('/orgs/new')}
          className="flex h-11 items-center justify-center gap-2 bg-green-primary px-6 font-mono text-[11px] font-bold uppercase tracking-wide text-black-on-accent hover:brightness-90 sm:flex-1"
        >
          <Plus size={14} />
          CREATE ORGANIZATION
        </button>
        <button
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="flex h-11 items-center justify-center gap-2 border border-border px-6 font-mono text-[11px] font-bold uppercase tracking-wide text-gray-500 hover:border-border-light hover:bg-bg-subtle hover:text-white sm:w-auto"
        >
          <LogOut size={14} />
          {logoutMutation.isPending ? 'LOGGING OUT...' : 'LOG OUT'}
        </button>
      </div>

      {/* Org Discovery Section */}
      <div className="mt-10 flex w-full max-w-lg flex-col gap-4">
        <div className="flex items-center gap-2">
          <Users size={14} className="text-gray-500" />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            Available Organizations
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search organizations..."
            className="h-11 w-full border border-border bg-bg-elevated pl-10 pr-3.5 font-mono text-[13px] font-medium text-white placeholder:text-gray-400 focus:border-green-primary focus:outline-none"
          />
        </div>

        {/* Org List */}
        <div className="flex flex-col border border-border">
          {isLoading && (
            <div className="flex h-24 items-center justify-center">
              <span className="font-mono text-[11px] text-gray-500">
                Loading...
              </span>
            </div>
          )}

          {!isLoading && (!organizations || organizations.length === 0) && (
            <div className="flex h-24 items-center justify-center">
              <span className="font-mono text-[11px] text-gray-500">
                {search ? 'No organizations found.' : 'No organizations available yet.'}
              </span>
            </div>
          )}

          {!isLoading &&
            organizations?.map((org, index) => (
              <div
                key={org.id}
                className={`flex items-center justify-between gap-4 px-4 py-3 ${index > 0 ? 'border-t border-border' : ''
                  }`}
              >
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate font-mono text-[13px] font-semibold text-white">
                    {org.name}
                  </span>
                  {org.description && (
                    <span className="truncate font-mono text-[11px] text-gray-500">
                      {org.description}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => navigate(`/join/${org.slug}`)}
                  className="shrink-0 border border-border px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wide text-white hover:border-green-primary hover:text-green-primary"
                >
                  JOIN
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
