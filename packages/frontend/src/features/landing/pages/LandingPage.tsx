import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-bg-page">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-10 py-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center bg-green-primary">
            <span className="font-display text-base font-bold text-black-on-accent">
              T
            </span>
          </div>
          <span className="font-mono text-sm font-semibold tracking-[1px] text-white">
            TASKFLOW
          </span>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-8">
          <span className="font-mono text-[11px] font-medium tracking-[0.5px] text-gray-500">
            FEATURES
          </span>
          <span className="font-mono text-[11px] font-medium tracking-[0.5px] text-gray-500">
            PRICING
          </span>
          <span className="font-mono text-[11px] font-medium tracking-[0.5px] text-gray-500">
            DOCS
          </span>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-1 flex-col items-center gap-10 px-[120px] pb-[100px] pt-[120px]">
        {/* Badge */}
        <div className="flex items-center gap-2 border border-green-tint-40 bg-green-tint-10 px-3 py-1.5">
          <div className="h-1.5 w-1.5 rounded-sm bg-green-primary" />
          <span className="font-mono text-[10px] font-bold tracking-[1px] text-green-primary">
            NOW IN PUBLIC BETA
          </span>
        </div>

        {/* Headline */}
        <h1 className="max-w-[900px] text-center font-display text-[64px] font-bold leading-[1.1] tracking-[-2px] text-white">
          Ship faster. Stay organized.
          <br />
          Lead your team with clarity.
        </h1>

        {/* Subline */}
        <p className="max-w-[700px] text-center font-mono text-[15px] font-normal leading-[1.6] text-gray-500">
          TaskFlow is the multi-tenant task management platform built for
          engineering teams. Organize, delegate, and track work across your
          entire organization.
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-4">
          <Link
            to="/register"
            className="flex items-center gap-2.5 bg-green-primary px-7 py-3.5 font-mono text-[13px] font-bold tracking-[0.5px] text-black-on-accent hover:brightness-90"
          >
            <ArrowRight size={16} />
            CREATE A NEW ACCOUNT
          </Link>
          <Link
            to="/login"
            className="flex items-center gap-2.5 border border-border-light px-7 py-3.5 font-mono text-[13px] font-semibold tracking-[0.5px] text-white hover:bg-bg-subtle"
          >
            LOGIN
          </Link>
        </div>

        {/* Trust line */}
        <span className="font-mono text-[11px] font-medium tracking-[1px] text-gray-400">
          TRUSTED BY 500+ ENGINEERING TEAMS WORLDWIDE
        </span>
      </section>
    </div>
  );
};

export default LandingPage;
