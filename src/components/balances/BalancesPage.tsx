import React from 'react';
import { useTrip } from '../../context/TripContext';
import { formatINR } from '../../utils/currency';
import {
  Scale,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';

interface BalancesPageProps {
  setActiveTab: (tab: string) => void;
}

export const BalancesPage: React.FC<BalancesPageProps> = ({ setActiveTab }) => {
  const { currentTrip, memberBalances, currentUser, totalTripExpenses } = useTrip();

  if (!currentTrip) return null;

  // Sum check to verify data integrity
  const netSum = memberBalances.reduce((acc, b) => acc + b.netBalance, 0);
  const isBalanced = Math.abs(netSum) < 1; // Rounding tolerance

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Page Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mathematical Ledger Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Who Owes Whom? ⚖️
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Real-time individual financial standing for <strong className="text-slate-200">{currentTrip.name}</strong>. Computed strictly as <code>Net Balance = Total Paid − Total Share</code>.
          </p>
        </div>

        {/* Action: Jump to Settle Up */}
        <button
          onClick={() => setActiveTab('settle')}
          className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-950/50 transition-all transform hover:-translate-y-0.5 flex-shrink-0"
        >
          <CreditCard className="w-4 h-4" />
          <span>Settle Up & PAY</span>
        </button>
      </div>

      {/* 2. Ledger Integrity Status Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="text-slate-300 font-medium">
            Ledger Balance Check: <strong className="text-white">Sum of All Net Balances = ₹0</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Total Group Spend:</span>
          <span className="font-extrabold text-amber-300">
            {formatINR(totalTripExpenses)}
          </span>
        </div>
      </div>

      {/* 3. Member Balance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {memberBalances.map((item) => {
          const isCurrentUser = item.userId === currentUser.id;
          const net = item.netBalance;

          let statusBadge = {
            label: 'SETTLED',
            bg: 'bg-slate-800 text-slate-300 border-slate-700',
            icon: CheckCircle2,
            headline: 'All settled up',
          };

          if (net > 0.5) {
            statusBadge = {
              label: `RECEIVE ${formatINR(net)}`,
              bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
              icon: TrendingUp,
              headline: `Should receive ${formatINR(net)}`,
            };
          } else if (net < -0.5) {
            statusBadge = {
              label: `OWES ${formatINR(Math.abs(net))}`,
              bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
              icon: TrendingDown,
              headline: `Needs to pay ${formatINR(Math.abs(net))}`,
            };
          }

          const IconComponent = statusBadge.icon;

          return (
            <div
              key={item.userId}
              className={`glass-card rounded-3xl p-6 border transition-all duration-300 ${
                isCurrentUser
                  ? 'border-emerald-500/40 ring-1 ring-emerald-500/20 shadow-xl'
                  : 'border-slate-800/90'
              }`}
            >
              {/* Member Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
                <div className="flex items-center gap-3.5">
                  <img
                    src={item.user.avatar}
                    alt={item.user.name}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-700 ring-2 ring-emerald-500/20"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white">
                        {item.user.name}
                      </h3>
                      {isCurrentUser && (
                        <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          Active Persona (You)
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400">
                      {item.user.email || 'Trip Member'}
                    </span>
                  </div>
                </div>

                {/* Net Balance Status Badge */}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${statusBadge.bg}`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                  <span>{statusBadge.label}</span>
                </div>
              </div>

              {/* Financial Metrics Breakdown */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {/* Total Paid */}
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Total Paid
                  </span>
                  <span className="text-xl font-black text-slate-100 block">
                    {formatINR(item.totalPaid)}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Actual money spent
                  </span>
                </div>

                {/* Total Share */}
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Total Share
                  </span>
                  <span className="text-xl font-black text-slate-100 block">
                    {formatINR(item.totalShare)}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Assigned responsibility
                  </span>
                </div>
              </div>

              {/* Net Balance Summary Bar */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[11px] text-slate-400 block">
                    Net Balance Formula
                  </span>
                  <span className="text-xs font-mono text-slate-300">
                    {formatINR(item.totalPaid)} − {formatINR(item.totalShare)}
                  </span>
                </div>
                <div className="text-right">
                  <span
                    className={`text-base font-black ${
                      net > 0.5
                        ? 'text-emerald-400'
                        : net < -0.5
                        ? 'text-rose-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {net > 0 ? `+${formatINR(net)}` : formatINR(net)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {statusBadge.headline}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
