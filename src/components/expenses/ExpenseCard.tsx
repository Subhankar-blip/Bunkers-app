import React from 'react';
import { Expense } from '../../types';
import { useTrip } from '../../context/TripContext';
import { CATEGORY_METADATA } from '../../utils/calculations';
import { formatINR, formatDate } from '../../utils/currency';
import { Receipt, Users, MoreVertical, Edit2, Trash2, Eye } from 'lucide-react';

interface ExpenseCardProps {
  expense: Expense;
  onViewDetails: (expense: Expense) => void;
  onEditExpense: (expense: Expense) => void;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  onViewDetails,
  onEditExpense,
}) => {
  const { members, currentUser, deleteExpense } = useTrip();

  const payer = members.find((m) => m.id === expense.paidBy);
  const catMeta = CATEGORY_METADATA[expense.category] || CATEGORY_METADATA.other;
  const participantCount = expense.participants.length;
  const isPayer = expense.paidBy === currentUser.id;

  // Check current user's share in this expense
  const userParticipant = expense.participants.find(
    (p) => p.userId === currentUser.id
  );
  const userShare = userParticipant ? userParticipant.shareAmount : 0;

  const perPersonText =
    expense.splitType === 'equal' && participantCount > 0
      ? `${formatINR(expense.amount / participantCount)} / person`
      : 'Custom shares';

  return (
    <div className="glass-card glass-card-hover rounded-3xl p-5 sm:p-6 border border-slate-800/90 flex flex-col justify-between space-y-4">
      {/* Top Header: Category & Amount */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border ${catMeta.borderClass} ${catMeta.bgClass} flex-shrink-0`}
          >
            {catMeta.icon}
          </div>
          <div>
            <span
              className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${catMeta.borderClass} ${catMeta.bgClass} ${catMeta.textClass}`}
            >
              {catMeta.label}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white leading-snug mt-1 line-clamp-1">
              {expense.title}
            </h3>
          </div>
        </div>

        {/* Total Expense Amount in ₹ */}
        <div className="text-right flex-shrink-0">
          <span className="text-lg sm:text-xl font-black text-amber-300 block">
            {formatINR(expense.amount)}
          </span>
          <span className="text-[10px] text-slate-400">
            {formatDate(expense.createdAt)}
          </span>
        </div>
      </div>

      {/* Middle Details: Paid By & Split Summary */}
      <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-xs">
        {/* Paid By */}
        <div className="flex items-center gap-2">
          {payer && (
            <img
              src={payer.avatar}
              alt={payer.name}
              className="w-6 h-6 rounded-full object-cover border border-slate-700"
            />
          )}
          <div className="truncate">
            <span className="text-[10px] text-slate-500 block">Paid By</span>
            <span className="font-bold text-slate-200 truncate">
              {payer ? payer.name : 'Unknown'}{' '}
              {isPayer && (
                <span className="text-emerald-400 font-semibold">(You)</span>
              )}
            </span>
          </div>
        </div>

        {/* Split info */}
        <div className="text-right">
          <span className="text-[10px] text-slate-500 block">
            Split ({participantCount} friends)
          </span>
          <span className="font-semibold text-slate-300 truncate block">
            {perPersonText}
          </span>
        </div>
      </div>

      {/* Current User Standing for this Expense */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
        <div className="text-slate-400 text-[11px]">
          {isPayer ? (
            <span className="text-emerald-400 font-semibold">
              You paid {formatINR(expense.amount)} (Your share: {formatINR(userShare)})
            </span>
          ) : userShare > 0 ? (
            <span className="text-rose-400 font-semibold">
              Your share in this bill: {formatINR(userShare)}
            </span>
          ) : (
            <span className="text-slate-500">You were not part of this split</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onViewDetails(expense)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="View Split Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onEditExpense(expense)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Edit Expense"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              if (window.confirm(`Delete "${expense.title}"?`)) {
                deleteExpense(expense.id);
              }
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
            title="Delete Expense"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
