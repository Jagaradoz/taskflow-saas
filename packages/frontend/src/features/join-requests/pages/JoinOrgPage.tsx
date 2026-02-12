import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { getAuthState } from '../../../mock/auth';
import { createJoinRequest } from '../../../mock/membership-requests';
import { load } from '../../../mock/store';

type SubmitState = 'idle' | 'success' | 'error';

const JoinOrgPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const auth = getAuthState()!;

  const store = load();
  const org = store.organizations.find((o) => o.slug === slug);
  const isAlreadyMember = org
    ? store.memberships.some(
        (m) => m.orgId === org.id && m.userId === auth.user.id,
      )
    : false;

  const [message, setMessage] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = useCallback(() => {
    if (!slug) return;

    const result = createJoinRequest(slug, auth.user.id, message || undefined);
    if (result) {
      setSubmitState('success');
    } else {
      setSubmitState('error');
      setErrorMsg('Organization not found.');
    }
  }, [slug, auth.user.id, message]);

  // Org not found
  if (!org) {
    return (
      <div className="flex min-h-screen flex-col bg-bg-page">
        <div className="flex h-14 items-center border-b border-border px-6">
          <Link
            to="/"
            className="flex items-center gap-2 font-mono text-xs font-medium text-gray-500 hover:text-white"
          >
            <ArrowLeft size={14} />
            BACK TO DASHBOARD
          </Link>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <AlertCircle size={40} className="text-red-error" />
          <h2 className="font-display text-2xl font-bold text-white">
            ORGANIZATION NOT FOUND
          </h2>
          <p className="font-mono text-sm text-gray-500">
            No organization with slug "{slug}" exists.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg-page">
      {/* Top bar */}
      <div className="flex h-14 items-center border-b border-border px-6">
        <Link
          to="/"
          className="flex items-center gap-2 font-mono text-xs font-medium text-gray-500 hover:text-white"
        >
          <ArrowLeft size={14} />
          BACK TO DASHBOARD
        </Link>
      </div>

      {/* Content */}
      <div className="mx-auto flex w-full max-w-lg flex-col gap-8 p-8 pt-16">
        {/* Org info */}
        <div className="flex flex-col gap-3 border border-border bg-bg-card p-6">
          <span className="font-mono text-[11px] font-medium uppercase tracking-[1px] text-gray-500">
            ORGANIZATION
          </span>
          <h1 className="font-display text-3xl font-bold text-white">
            {org.name}
          </h1>
          {org.description && (
            <p className="font-mono text-sm font-medium text-gray-500">
              {org.description}
            </p>
          )}
          <span className="font-mono text-[11px] font-medium text-gray-400">
            /{org.slug}
          </span>
        </div>

        {/* Already a member */}
        {isAlreadyMember && (
          <div className="flex items-center gap-3 border border-green-primary/20 bg-green-primary/5 p-4">
            <CheckCircle size={18} className="shrink-0 text-green-primary" />
            <span className="font-mono text-sm font-medium text-green-primary">
              You are already a member of this organization.
            </span>
          </div>
        )}

        {/* Success state */}
        {submitState === 'success' && (
          <div className="flex flex-col items-center gap-4 border border-green-primary/20 bg-green-primary/5 p-8">
            <CheckCircle size={32} className="text-green-primary" />
            <p className="font-mono text-sm font-medium text-green-primary">
              Request sent! An owner will review it shortly.
            </p>
            <Link
              to="/me/requests"
              className="font-mono text-[11px] font-bold uppercase tracking-wide text-green-primary hover:underline"
            >
              VIEW MY REQUESTS
            </Link>
          </div>
        )}

        {/* Error state */}
        {submitState === 'error' && (
          <div className="flex items-center gap-3 border border-red-error/20 bg-red-error/5 p-4">
            <AlertCircle size={18} className="shrink-0 text-red-error" />
            <span className="font-mono text-sm font-medium text-red-error">
              {errorMsg}
            </span>
          </div>
        )}

        {/* Form — only show when idle and not already a member */}
        {submitState === 'idle' && !isAlreadyMember && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[11px] font-medium uppercase tracking-[1px] text-gray-500">
                MESSAGE (OPTIONAL)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Why do you want to join this organization?"
                rows={3}
                className="w-full border border-border bg-bg-card px-4 py-3 font-mono text-[13px] font-medium text-white placeholder:text-gray-400 focus:border-green-primary focus:outline-none"
              />
            </div>
            <button
              onClick={handleSubmit}
              className="flex items-center justify-center gap-2 bg-green-primary px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-wide text-black-on-accent hover:brightness-90"
            >
              <Send size={14} />
              REQUEST TO JOIN
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinOrgPage;
