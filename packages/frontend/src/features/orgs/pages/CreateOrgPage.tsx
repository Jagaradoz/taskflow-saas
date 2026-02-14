import { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2 } from 'lucide-react';
import { ApiError } from '@/types/api';
import { useAuthQuery } from '@/features/auth/hooks/use-auth';
import { useCreateOrganizationMutation } from '../hooks/use-orgs';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);
}

const CreateOrgPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: auth } = useAuthQuery();
  const createOrgMutation = useCreateOrganizationMutation();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const baseSlug = useMemo(() => generateSlug(name.trim()), [name]);

  const existingOrgIds = new Set(auth?.user.memberships.map((m) => m.orgId) ?? []);
  const backToPath = auth?.user.memberships[0]
    ? `/app/${auth.user.memberships[0].orgId}`
    : '/no-org';

  const handleCreate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      const trimmedName = name.trim();
      if (!trimmedName) {
        setError('Organization name is required.');
        return;
      }

      if (!baseSlug) {
        setError('Please enter a valid organization name.');
        return;
      }

      setSaving(true);
      try {
        const result = await createOrgMutation.mutateAsync({
          name: trimmedName,
          description: description.trim() || undefined,
        });
        navigate(`/app/${result.organization.id}`, { replace: true });
      } catch (err) {
        const message = err instanceof ApiError ? err.message : 'Failed to create organization.';
        setError(message);
      } finally {
        setSaving(false);
      }
    },
    [baseSlug, createOrgMutation, description, name, navigate],
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-page px-4 py-10">
      <div className="flex w-full max-w-[560px] flex-col gap-6 border border-border bg-bg-card p-5 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to={backToPath}
            className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wide text-gray-500 hover:text-white"
          >
            <ArrowLeft size={14} />
            Back
          </Link>
          <div className="inline-flex items-center gap-2 text-gray-500">
            <Building2 size={16} />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wide">
              New Organization
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[30px] font-bold tracking-tight text-white sm:text-4xl">
            CREATE ORGANIZATION
          </h1>
          <p className="font-mono text-xs text-gray-500">
            Create a workspace and invite members to collaborate.
          </p>
        </div>

        <form onSubmit={handleCreate} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              NAME
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Acme Engineering"
              autoFocus
              className="h-11 w-full border border-border bg-bg-elevated px-3.5 font-mono text-[13px] font-medium text-white placeholder:text-gray-400 focus:border-green-primary focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              DESCRIPTION (OPTIONAL)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="What does your team work on?"
              className="w-full resize-none border border-border bg-bg-elevated px-3.5 py-3 font-mono text-[13px] font-medium text-white placeholder:text-gray-400 focus:border-green-primary focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              SLUG PREVIEW
            </label>
            <div className="flex h-11 items-center border border-border bg-bg-elevated px-3.5">
              <span className="font-mono text-[13px] font-medium text-gray-400">
                {baseSlug || 'organization-slug'}
              </span>
            </div>
          </div>

          {error && <p className="font-mono text-[11px] text-red-error">{error}</p>}

          <div className="flex flex-col justify-end gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate(backToPath)}
              className="flex h-10 w-full items-center justify-center border border-border px-5 font-mono text-[11px] font-bold uppercase tracking-wide text-white hover:border-border-light hover:bg-bg-subtle sm:w-auto"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="flex h-10 w-full items-center justify-center bg-green-primary px-5 font-mono text-[11px] font-bold uppercase tracking-wide text-black-on-accent hover:brightness-90 disabled:opacity-50 disabled:hover:brightness-100 sm:w-auto"
            >
              {saving ? 'CREATING...' : 'CREATE ORGANIZATION'}
            </button>
          </div>
        </form>

        {existingOrgIds.size > 0 && (
          <p className="font-mono text-[11px] text-gray-500">
            You can switch organizations anytime from the top bar switcher.
          </p>
        )}
      </div>
    </div>
  );
};

export default CreateOrgPage;
