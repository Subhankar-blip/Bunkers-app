import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { SettlementRecommendation } from '../../types';
import { PaymentModal } from './PaymentModal';
import { formatINR, formatDate, formatRelativeTime } from '../../utils/currency';
import {
  CreditCard,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  History,
  ShieldCheck,
  Check,
  PartyPopper,
  ArrowUpRight,
  TrendingDown,
} from 'lucide-react';

export const SettlementPage: React.FC = () => {
  const {
    currentTrip,
    currentUser,
    settlementRecommendations,
    settlementTransactions,
  } = useTrip();

  const [selectedSettlement, setSelectedSettlement] =
    useState<SettlementRecommendation | null>(null);

  if (!currentTrip) return null;

  // Payments that the active current user specifically needs to make
  const myPendingPayments = settlementRecommendations.filter(
    (s) => s.fromUserId === currentUser.id
  );

  // Payments coming TO the active current user
  const paymentsToMe = settlementRecommendations.filter(
    (s) => s.toUserId === currentUser.id
  );

  const allSettled = settlementRecommendations.length === 0;

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Page Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Min-Cash-Flow Smart Settlement Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Settle Up & PAY 💳
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Optimized minimal transactions calculated to balance all trip debts. Settle instantly with simulated payments.
          </p>
        </div>

        {allSettled && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Trip is 100% Settled! 🎉</span>
          </div>
        )}
      </div>

      {/* 2. PROMINENT "PAY" SECTION (Strict Product Requirement) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              PROMINENT PAY PORTAL
            </h2>
            <p className="text-xs text-slate-400">
              Personalized action cards for <strong className="text-slate-200">{currentUser.name}</strong>
            </p>
          </div>
          <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/30">
            {myPendingPayments.length} Action{myPendingPayments.length === 1 ? '' : 's'} Required
          </span>
        </div>

        {myPendingPayments.length === 0 ? (
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">
              You don't owe any money!
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {paymentsToMe.length > 0
                ? `You are a creditor! Friends owe you a total of ${formatINR(
                    paymentsToMe.reduce((acc, p) => acc + p.amount, 0)
                  )}.`
                : 'All your trip shares are completely balanced.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myPendingPayments.map((item, idx) => (
              <div
                key={idx}
                className="glass-card rounded-3xl p-6 border border-emerald-500/40 hover:border-emerald-400 shadow-xl shadow-emerald-950/20 flex flex-col justify-between space-y-5 relative overflow-hidden group"
              >
                {/* Glow Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      PAY {item.toUserName.toUpperCase()}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      Direct Settle
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={item.toUserAvatar}
                      alt={item.toUserName}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500/50 shadow-md"
                    />
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">
                        You owe {item.toUserName}
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-white block mt-0.5">
                        {formatINR(item.amount)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedSettlement(item)}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>PAY {formatINR(item.amount)}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. GROUP SMART SETTLEMENT RECOMMENDATIONS */}
      <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-800 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Simplified Group Settlements
            </h3>
            <p className="text-xs text-slate-400">
              Minimum transaction graph calculated to settle the entire trip with zero redundant transfers
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {settlementRecommendations.length} transfer{settlementRecommendations.length === 1 ? '' : 's'} remaining
          </span>
        </div>

        {allSettled ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <PartyPopper className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-black text-white">
              Everyone is fully settled! 🎉
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              All member balances are at ₹0. Every shared expense and debt for this trip has been satisfied.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {settlementRecommendations.map((rec, idx) => {
              const isMeDebtor = rec.fromUserId === currentUser.id;
              const isMeCreditor = rec.toUserId === currentUser.id;

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl bg-slate-900/80 border transition-all ${
                    isMeDebtor
                      ? 'border-emerald-500/40 bg-slate-900 ring-1 ring-emerald-500/20'
                      : 'border-slate-800'
                  } flex items-center justify-between gap-4`}
                >
                  {/* Sender */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={rec.fromUserAvatar}
                      alt={rec.fromUserName}
                      className="w-8 h-8 rounded-full object-cover border border-slate-700"
                    />
                    <div className="truncate">
                      <span className="text-xs font-bold text-slate-200 block truncate">
                        {rec.fromUserName}{' '}
                        {isMeDebtor && (
                          <span className="text-emerald-400">(You)</span>
                        )}
                      </span>
                      <span className="text-[10px] text-rose-400 font-semibold">
                        Pays
                      </span>
                    </div>
                  </div>

                  {/* Transfer Amount Pill */}
                  <div className="flex flex-col items-center flex-shrink-0 px-3">
                    <span className="text-xs font-black text-emerald-400">
                      {formatINR(rec.amount)}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                  </div>

                  {/* Receiver & Action */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="text-right truncate">
                      <span className="text-xs font-bold text-slate-200 block truncate">
                        {rec.toUserName}{' '}
                        {isMeCreditor && (
                          <span className="text-emerald-400">(You)</span>
                        )}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        Receives
                      </span>
                    </div>
                    <img
                      src={rec.toUserAvatar}
                      alt={rec.toUserName}
                      className="w-8 h-8 rounded-full object-cover border border-slate-700"
                    />
                    {isMeDebtor && (
                      <button
                        onClick={() => setSelectedSettlement(rec)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-all ml-1 flex-shrink-0"
                      >
                        Pay
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. PAYMENT HISTORY AUDIT LOG */}
      <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-800 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-teal-400" />
              Payment & Settlement History
            </h3>
            <p className="text-xs text-slate-400">
              Verified ledger of all completed direct payouts with reference codes
            </p>
          </div>
          <span className="text-xs text-slate-400 font-semibold">
            {settlementTransactions.length} Record{settlementTransactions.length === 1 ? '' : 's'}
          </span>
        </div>

        {settlementTransactions.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-8">
            No payments have been recorded yet.
          </p>
        ) : (
          <div className="space-y-3">
            {settlementTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:bg-slate-900 transition-colors text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center -space-x-2">
                    <img
                      src={tx.payerAvatar}
                      alt={tx.payerName}
                      className="w-7 h-7 rounded-full object-cover border border-slate-700"
                      title={`Payer: ${tx.payerName}`}
                    />
                    <img
                      src={tx.receiverAvatar}
                      alt={tx.receiverName}
                      className="w-7 h-7 rounded-full object-cover border border-slate-700"
                      title={`Receiver: ${tx.receiverName}`}
                    />
                  </div>

                  <div>
                    <p className="font-bold text-slate-200">
                      {tx.payerName} paid {tx.receiverName}{' '}
                      <span className="text-emerald-400 font-extrabold">
                        {formatINR(tx.amount)}
                      </span>
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span>Method: {tx.paymentMethod}</span>
                      <span>•</span>
                      <span className="font-mono text-slate-500">
                        {tx.transactionReference}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-400">
                    {formatRelativeTime(tx.createdAt)}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                    Completed
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Processing Modal */}
      {selectedSettlement && (
        <PaymentModal
          isOpen={!!selectedSettlement}
          onClose={() => setSelectedSettlement(null)}
          receiverId={selectedSettlement.toUserId}
          receiverName={selectedSettlement.toUserName}
          receiverAvatar={selectedSettlement.toUserAvatar}
          amount={selectedSettlement.amount}
        />
      )}
    </div>
  );
};
