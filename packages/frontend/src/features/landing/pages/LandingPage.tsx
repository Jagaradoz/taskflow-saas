import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-bg-page">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-6 lg:px-10">
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

        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="flex items-center justify-center border border-border-light px-5 py-2.5 font-mono text-[11px] font-semibold tracking-[0.5px] text-white hover:bg-bg-subtle"
          >
            LOGIN
          </Link>
          <Link
            to="/register"
            className="flex items-center justify-center bg-green-primary px-5 py-2.5 font-mono text-[11px] font-bold tracking-[0.5px] text-black-on-accent hover:brightness-90"
          >
            REGISTER
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col items-center gap-8 px-6 pb-16 pt-14 sm:gap-10 sm:px-10 sm:pt-20 lg:px-[140px] lg:pb-[100px] lg:pt-[120px]">
        {/* Badge */}
        <div className="flex items-center gap-2 border border-green-tint-40 bg-green-tint-10 px-3 py-1.5">
          <div className="h-1.5 w-1.5 rounded-sm bg-green-primary" />
          <span className="font-mono text-[10px] font-bold tracking-[1px] text-green-primary">
            NOW IN PUBLIC BETA
          </span>
        </div>

        {/* Headline */}
        <h1 className="max-w-[1100px] text-center font-display text-[40px] font-bold leading-[1.1] tracking-[-1px] text-white sm:text-[52px] sm:tracking-[-1.5px] lg:text-[64px] lg:tracking-[-2px]">
          Ship faster. Stay organized.
          <br />
          Lead your team with clarity.
        </h1>

        {/* Subline */}
        <p className="max-w-[820px] text-center font-mono text-[14px] font-normal leading-[1.6] text-gray-500 sm:text-[15px]">
          TaskFlow is the multi-tenant task management platform built for
          engineering teams. Organize, delegate, and track work across your
          entire organization.
        </p>

        {/* CTAs */}
        <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
          <Link
            to="/register"
            className="flex items-center justify-center gap-2.5 bg-green-primary px-7 py-3.5 font-mono text-[13px] font-bold tracking-[0.5px] text-black-on-accent hover:brightness-90"
          >
            <ArrowRight size={16} />
            CREATE A NEW ACCOUNT
          </Link>
          <Link
            to="/login"
            className="flex items-center justify-center gap-2.5 border border-border-light px-7 py-3.5 font-mono text-[13px] font-semibold tracking-[0.5px] text-white hover:bg-bg-subtle"
          >
            LOGIN
          </Link>
        </div>

        {/* Trust line */}
        <span className="text-center font-mono text-[11px] font-medium tracking-[1px] text-gray-400">
          TRUSTED BY 500+ ENGINEERING TEAMS WORLDWIDE
        </span>
      </section>
    </div>
  );
};

export default LandingPage;
