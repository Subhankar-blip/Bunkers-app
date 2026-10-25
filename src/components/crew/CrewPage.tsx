import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { AddMemberModal } from './AddMemberModal';
import { formatINR } from '../../utils/currency';
import {
  Users,
  UserPlus,
  Crown,
  Camera,
  Receipt,
  Scale,
  Sparkles,
  Check,
  UserCheck,
  Share2,
} from 'lucide-react';

export const CrewPage: React.FC = () => {
  const { currentTrip, members, currentUser, setCurrentUser, photos, memberBalances } =
    useTrip();

  const [addMemberOpen, setAddMemberOpen] = useState(false);

  if (!currentTrip) return null;

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Page Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Trip Community & Roles</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Trip Crew 👥
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Members of <strong className="text-slate-200">{currentTrip.name}</strong>. Switch active persona with one click to test different views.
          </p>
        </div>

        {/* Add Member Button */}
        <button
          onClick={() => setAddMemberOpen(true)}
          className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-950/50 transition-all transform hover:-translate-y-0.5 flex-shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Crew Member</span>
        </button>
      </div>

      {/* 2. Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {members.map((member) => {
          const isCurrentUser = member.id === currentUser.id;
          const photoCount = photos.filter((p) => p.uploaderId === member.id).length;
          const balanceRecord = memberBalances.find((b) => b.userId === member.id);
          const totalPaid = balanceRecord ? balanceRecord.totalPaid : 0;
          const netBalance = balanceRecord ? balanceRecord.netBalance : 0;

          return (
            <div
              key={member.id}
              className={`glass-card rounded-3xl p-5 sm:p-6 border transition-all duration-300 flex flex-col justify-between space-y-5 ${
                isCurrentUser
                  ? 'border-emerald-500/50 ring-2 ring-emerald-500/20 shadow-xl bg-slate-900/90'
                  : 'border-slate-800/90 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header: Avatar, Name, Role */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="relative">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700 shadow-md ring-2 ring-emerald-500/20"
                    />
                    {member.role === 'admin' && (
                      <div
                        className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg"
                        title="Trip Administrator"
                      >
                        <Crown className="w-3.5 h-3.5 fill-current" />
                      </div>
                    )}
                  </div>

                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      member.role === 'admin'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {member.role}
                  </span>
                </div>

                {/* Name & Contact */}
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight flex items-center gap-1.5">
                    {member.name}
                    {isCurrentUser && (
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-1.5 py-0.2 rounded">
                        You
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {member.email || 'Trip Explorer'}
                  </p>
                </div>

                {/* Member Stats */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800/80 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">
                      Memories
                    </span>
                    <span className="font-bold text-white text-sm">
                      {photoCount} Photos
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">
                      Total Paid
                    </span>
                    <span className="font-bold text-amber-300 text-sm">
                      {formatINR(totalPaid)}
                    </span>
                  </div>
                </div>

                {/* Current Net Balance Indicator */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">Net Standing:</span>
                  <span
                    className={`font-black ${
                      netBalance > 0.5
                        ? 'text-emerald-400'
                        : netBalance < -0.5
                        ? 'text-rose-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {netBalance > 0
                      ? `+${formatINR(netBalance)}`
                      : formatINR(netBalance)}
                  </span>
                </div>
              </div>

              {/* Persona Switch Button */}
              <button
                onClick={() => setCurrentUser(member)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isCurrentUser
                    ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 cursor-default'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700'
                }`}
              >
                {isCurrentUser ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Active Perspective</span>
                  </>
                ) : (
                  <>
                    <span>Switch to {member.name}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <AddMemberModal
        isOpen={addMemberOpen}
        onClose={() => setAddMemberOpen(false)}
      />
    </div>
  );
};
