import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle, AlertCircle, Building2 } from 'lucide-react';
import { useCreateJoinRequestMutation } from '../hooks/use-join-requests';

type SubmitState = 'idle' | 'success' | 'error';

const JoinOrgPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const createJoinRequestMutation = useCreateJoinRequestMutation();

  const [message, setMessage] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = useCallback(() => {
    if (!slug) return;

    createJoinRequestMutation
      .mutateAsync({ slug, message: message || undefined })
      .then(() => {
        setSubmitState('success');
      })
      .catch((err: unknown) => {
        const fallback = 'Unable to submit join request.';
        setSubmitState('error');
        setErrorMsg(err instanceof Error ? err.message : fallback);
      });
  }, [slug, message, createJoinRequestMutation]);

  if (!slug) {
    return (
      <div className="flex min-h-screen flex-col bg-bg-page">
        <div className="flex h-14 items-center border-b border-border px-4 sm:px-6">
          <Link
            to="/app"
            className="flex items-center gap-2 font-mono text-xs font-medium text-gray-500 hover:text-white"
          >
            <ArrowLeft size={14} />
            BACK TO DASHBOARD
          </Link>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <AlertCircle size={40} className="text-red-error" />
          <h2 className="font-display text-2xl font-bold text-white">
            INVALID JOIN LINK
          </h2>
          <p className="px-4 text-center font-mono text-sm text-gray-500">
            Join URL is missing organization slug.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg-page">
      {/* Top bar */}
      <div className="flex h-14 items-center border-b border-border px-4 sm:px-6">
        <Link
          to="/app"
          className="flex items-center gap-2 font-mono text-xs font-medium text-gray-500 hover:text-white"
        >
          <ArrowLeft size={14} />
          BACK TO DASHBOARD
        </Link>
      </div>

      {/* Content */}
      <div className="mx-auto flex w-full max-w-lg flex-col gap-6 p-4 pt-10 sm:gap-8 sm:p-6 sm:pt-14 lg:pt-16">
        {/* Org info */}
        <div className="flex flex-col gap-3 border border-border bg-bg-card p-6">
          <span className="font-mono text-[11px] font-medium uppercase tracking-[1px] text-gray-500">
            ORGANIZATION
          </span>
          <div className="flex items-center gap-3">
            <Building2 size={18} className="text-gray-500" />
            <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
              /{slug}
            </h1>
          </div>
          <p className="font-mono text-sm font-medium text-gray-500">
            Submit a request to join this organization. Owners will review it.
          </p>
        </div>

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

        {/* Form */}
        {submitState === 'idle' && (
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
              disabled={createJoinRequestMutation.isPending}
              className="flex items-center justify-center gap-2 bg-green-primary px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-wide text-black-on-accent hover:brightness-90 disabled:opacity-60 disabled:hover:brightness-100"
            >
              <Send size={14} />
              {createJoinRequestMutation.isPending ? 'SENDING...' : 'REQUEST TO JOIN'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinOrgPage;
