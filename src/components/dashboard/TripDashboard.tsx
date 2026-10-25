import React from 'react';
import { useTrip } from '../../context/TripContext';
import {
  Camera,
  Receipt,
  Scale,
  CreditCard,
  Plus,
  Users,
  Calendar,
  MapPin,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { formatINR, formatBalanceINR, formatDateRange, calculateDays, formatRelativeTime } from '../../utils/currency';
import { CATEGORY_METADATA } from '../../utils/calculations';

interface TripDashboardProps {
  setActiveTab: (tab: string) => void;
  onOpenUploadModal: () => void;
  onOpenAddExpenseModal: () => void;
}

export const TripDashboard: React.FC<TripDashboardProps> = ({
  setActiveTab,
  onOpenUploadModal,
  onOpenAddExpenseModal,
}) => {
  const {
    currentTrip,
    members,
    currentUser,
    photos,
    expenses,
    activities,
    memberBalances,
    currentUserBalance,
    totalTripExpenses,
    totalPhotosCount,
    settlementRecommendations,
  } = useTrip();

  if (!currentTrip) return null;

  const durationDays = calculateDays(currentTrip.startDate, currentTrip.endDate);
  const userNetBalance = currentUserBalance ? currentUserBalance.netBalance : 0;

  // Group photos by uploader for stats
  const photosByUploader = members.map((member) => ({
    member,
    count: photos.filter((p) => p.uploaderId === member.id).length,
  }));

  // Group expenses by category
  const expensesByCategory = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Trip Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl">
        {/* Cover Photo Backdrop */}
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src={currentTrip.coverImage}
            alt={currentTrip.name}
            className="w-full h-full object-cover filter blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/60" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                <MapPin className="w-3.5 h-3.5" />
                {currentTrip.destination}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {formatDateRange(currentTrip.startDate, currentTrip.endDate)}
              </span>
              <span className="text-xs text-slate-400 font-semibold px-2 py-0.5 rounded-full bg-slate-800/60">
                {members.length} friends • {durationDays} days
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              {currentTrip.name}
            </h1>

            <p className="text-sm text-slate-300 max-w-2xl line-clamp-2">
              {currentTrip.description}
            </p>
          </div>

          {/* Members Avatar Stack & Quick View */}
          <div className="flex flex-col sm:items-end gap-3">
            <div className="flex items-center -space-x-2.5">
              {members.map((m) => (
                <div key={m.id} className="relative group">
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover ring-1 ring-emerald-500/30 hover:scale-110 transition-transform"
                    title={`${m.name} (${m.role})`}
                  />
                  {m.id === currentUser.id && (
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900" />
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => setActiveTab('crew')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
            >
              <span>Manage Crew ({members.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Dashboard Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Stat 1: Memories */}
        <div
          onClick={() => setActiveTab('memories')}
          className="glass-card glass-card-hover p-5 rounded-2xl cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              📸 Memories
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Camera className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mb-1">
            {totalPhotosCount} Photos
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1">
            Organized across <strong className="text-slate-200">{members.length} member albums</strong>
          </p>
        </div>

        {/* Stat 2: Total Expenses */}
        <div
          onClick={() => setActiveTab('expenses')}
          className="glass-card glass-card-hover p-5 rounded-2xl cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              💰 Total Expenses
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-300 mb-1">
            {formatINR(totalTripExpenses)}
          </div>
          <p className="text-xs text-slate-400">
            {expenses.length} total shared bills logged
          </p>
        </div>

        {/* Stat 3: Members */}
        <div
          onClick={() => setActiveTab('crew')}
          className="glass-card glass-card-hover p-5 rounded-2xl cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              👥 Members
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mb-1">
            {members.length} Friends
          </div>
          <p className="text-xs text-slate-400">
            Avg: <strong className="text-slate-200">{formatINR(members.length ? totalTripExpenses / members.length : 0)}</strong> / person
          </p>
        </div>

        {/* Stat 4: Dynamic User Balance */}
        <div
          onClick={() => setActiveTab(userNetBalance < 0 ? 'settle' : 'balances')}
          className={`glass-card glass-card-hover p-5 rounded-2xl cursor-pointer group relative overflow-hidden ${
            userNetBalance > 0
              ? 'border-emerald-500/30'
              : userNetBalance < 0
              ? 'border-rose-500/30'
              : 'border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5" />
              ⚖️ Your Balance ({currentUser.name})
            </span>
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${
                userNetBalance > 0
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : userNetBalance < 0
                  ? 'bg-rose-500/10 text-rose-400'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              <CreditCard className="w-4 h-4" />
            </div>
          </div>

          <div
            className={`text-3xl font-extrabold mb-1 ${
              userNetBalance > 0
                ? 'text-emerald-400'
                : userNetBalance < 0
                ? 'text-rose-400'
                : 'text-slate-300'
            }`}
          >
            {userNetBalance > 0
              ? `+${formatINR(userNetBalance)}`
              : userNetBalance < 0
              ? `-${formatINR(Math.abs(userNetBalance))}`
              : '₹0'}
          </div>

          <p className="text-xs font-medium">
            {userNetBalance > 0 ? (
              <span className="text-emerald-400 font-semibold">You should RECEIVE {formatINR(userNetBalance)}</span>
            ) : userNetBalance < 0 ? (
              <span className="text-rose-400 font-semibold">You owe {formatINR(Math.abs(userNetBalance))}</span>
            ) : (
              <span className="text-slate-400">All settled up! 🎉</span>
            )}
          </p>
        </div>
      </div>

      {/* 3. Dashboard Quick Action Buttons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Quick Action 1: Upload Photos */}
        <button
          onClick={onOpenUploadModal}
          className="flex items-center gap-3.5 p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800/80 border border-slate-700/80 hover:border-emerald-500/50 text-left transition-all group hover:shadow-lg hover:shadow-emerald-950/30"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <span className="text-sm font-bold text-white block group-hover:text-emerald-300 transition-colors">
              📸 Upload Photos
            </span>
            <span className="text-xs text-slate-400">Add to your album</span>
          </div>
        </button>

        {/* Quick Action 2: Add Expense */}
        <button
          onClick={onOpenAddExpenseModal}
          className="flex items-center gap-3.5 p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800/80 border border-slate-700/80 hover:border-amber-500/50 text-left transition-all group hover:shadow-lg hover:shadow-amber-950/30"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <span className="text-sm font-bold text-white block group-hover:text-amber-300 transition-colors">
              💰 Add Expense
            </span>
            <span className="text-xs text-slate-400">Split a new bill</span>
          </div>
        </button>

        {/* Quick Action 3: Manage Members */}
        <button
          onClick={() => setActiveTab('crew')}
          className="flex items-center gap-3.5 p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800/80 border border-slate-700/80 hover:border-blue-500/50 text-left transition-all group hover:shadow-lg hover:shadow-blue-950/30"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-sm font-bold text-white block group-hover:text-blue-300 transition-colors">
              👥 Trip Crew
            </span>
            <span className="text-xs text-slate-400">Invite & view stats</span>
          </div>
        </button>

        {/* Quick Action 4: Settle Up / PAY */}
        <button
          onClick={() => setActiveTab('settle')}
          className="flex items-center gap-3.5 p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/40 hover:border-emerald-400 text-left transition-all group hover:shadow-lg hover:shadow-emerald-950/50"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0 shadow-md">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <span className="text-sm font-bold text-white block group-hover:text-emerald-300 transition-colors">
              💳 Settle Up & PAY
            </span>
            <span className="text-xs text-emerald-400 font-semibold">
              {settlementRecommendations.length} pending settlement{settlementRecommendations.length === 1 ? '' : 's'}
            </span>
          </div>
        </button>
      </div>

      {/* 4. Visual Highlights & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Recent Organized Photos & Spending Matrix */}
        <div className="lg:col-span-2 space-y-8">
          {/* Photo Highlights by Member */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Camera className="w-5 h-5 text-emerald-400" />
                  Memories by Uploader
                </h3>
                <p className="text-xs text-slate-400">
                  Every member's uploads grouped distinctly
                </p>
              </div>
              <button
                onClick={() => setActiveTab('memories')}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                View Full Gallery <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {photosByUploader.map(({ member, count }) => {
                const memberPhotos = photos.filter((p) => p.uploaderId === member.id);
                const latestPhoto = memberPhotos[0];

                return (
                  <div
                    key={member.id}
                    onClick={() => setActiveTab('memories')}
                    className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/30 transition-all cursor-pointer group"
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 mb-2">
                      {latestPhoto ? (
                        <img
                          src={latestPhoto.imageUrl}
                          alt={latestPhoto.caption || `${member.name}'s upload`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">
                          No photos
                        </div>
                      )}
                      <div className="absolute top-1.5 left-1.5">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-5 h-5 rounded-full border border-slate-900 object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200 truncate">
                        {member.name}'s
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                        {count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Expense Breakdown By Category */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-amber-400" />
                  Category Expense Distribution
                </h3>
                <p className="text-xs text-slate-400">
                  Total of {formatINR(totalTripExpenses)} across categories
                </p>
              </div>
              <button
                onClick={() => setActiveTab('expenses')}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                Manage Bills <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(CATEGORY_METADATA).map(([catKey, meta]) => {
                const amount = expensesByCategory[catKey] || 0;
                if (amount === 0) return null;
                const percentage = totalTripExpenses > 0 ? Math.round((amount / totalTripExpenses) * 100) : 0;

                return (
                  <div
                    key={catKey}
                    className={`p-3.5 rounded-2xl border ${meta.borderClass} ${meta.bgClass} flex flex-col justify-between`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg">{meta.icon}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-900/60 text-slate-300">
                        {percentage}%
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-300 truncate">
                        {meta.label}
                      </div>
                      <div className="text-sm font-extrabold text-white">
                        {formatINR(amount)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Live Activity Timeline */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col h-full">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-400" />
              Recent Activity Feed
            </h3>
            <span className="text-[10px] bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded-full font-bold border border-teal-500/20">
              Live
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto pr-1 max-h-[480px]">
            {activities.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                No activity yet. Log an expense or photo to start!
              </div>
            ) : (
              activities.slice(0, 10).map((act, index) => (
                <div
                  key={act.id}
                  className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:bg-slate-900 transition-colors"
                >
                  <img
                    src={act.userAvatar}
                    alt={act.userName}
                    className="w-8 h-8 rounded-full object-cover border border-slate-700 flex-shrink-0 mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-slate-200 truncate">
                        {act.title}
                      </span>
                      <span className="text-[10px] text-slate-500 flex-shrink-0">
                        {formatRelativeTime(act.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed mt-0.5">
                      {act.description}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
