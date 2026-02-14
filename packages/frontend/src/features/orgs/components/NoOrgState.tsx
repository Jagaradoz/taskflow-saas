import { useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';

export const NoOrgState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-bg-page px-4">
      <Building2 size={48} className="text-gray-500" />
      <h2 className="font-display text-2xl font-bold text-white">
        NO ORGANIZATION
      </h2>
      <p className="max-w-md text-center font-mono text-xs font-medium text-gray-500">
        You are not a member of any organization yet. Create one or ask to join an
        existing team.
      </p>
      <div className="flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row">
        <button
          onClick={() => navigate('/join')}
          className="flex h-11 w-full items-center justify-center border border-border px-6 font-mono text-[11px] font-bold uppercase tracking-wide text-white hover:border-border-light hover:bg-bg-subtle"
        >
          JOIN ORGANIZATION
        </button>
        <button
          onClick={() => navigate('/orgs/new')}
          className="flex h-11 w-full items-center justify-center bg-green-primary px-6 font-mono text-[11px] font-bold uppercase tracking-wide text-black-on-accent hover:brightness-90"
        >
          CREATE ORGANIZATION
        </button>
      </div>
    </div>
  );
};
