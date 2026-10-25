import React from 'react';
import { Expense } from '../../types';
import { useTrip } from '../../context/TripContext';
import { Modal } from '../common/Modal';
import { CATEGORY_METADATA } from '../../utils/calculations';
import { formatINR, formatDate } from '../../utils/currency';
import { Calendar, User, Users, CheckCircle2, FileText } from 'lucide-react';

interface ExpenseDetailsModalProps {
  expense: Expense | null;
  onClose: () => void;
  onEdit: (expense: Expense) => void;
}

export const ExpenseDetailsModal: React.FC<ExpenseDetailsModalProps> = ({
  expense,
  onClose,
  onEdit,
}) => {
  const { members, currentUser } = useTrip();

  if (!expense) return null;

  const payer = members.find((m) => m.id === expense.paidBy);
  const catMeta = CATEGORY_METADATA[expense.category] || CATEGORY_METADATA.other;

  return (
    <Modal
      isOpen={!!expense}
      onClose={onClose}
      title="Expense Breakdown 🧾"
      subtitle={`Detailed share split for ${expense.title}`}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Top Summary Banner */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border ${catMeta.borderClass} ${catMeta.bgClass}`}
            >
              {catMeta.icon}
            </div>
            <div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${catMeta.borderClass} ${catMeta.bgClass} ${catMeta.textClass}`}
              >
                {catMeta.label}
              </span>
              <h4 className="text-base font-bold text-white mt-0.5">
                {expense.title}
              </h4>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xl font-black text-amber-300 block">
              {formatINR(expense.amount)}
            </span>
            <span className="text-[10px] text-slate-400">
              {formatDate(expense.createdAt)}
            </span>
          </div>
        </div>

        {/* Paid By Attribution */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {payer && (
              <img
                src={payer.avatar}
                alt={payer.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500/40"
              />
            )}
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">
                Full Bill Paid By:
              </span>
              <span className="text-sm font-bold text-white flex items-center gap-1.5">
                {payer ? payer.name : 'Unknown'}
                {payer?.id === currentUser.id && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold">
                    You
                  </span>
                )}
              </span>
            </div>
          </div>
          <span className="text-sm font-extrabold text-emerald-400">
            {formatINR(expense.amount)}
          </span>
        </div>

        {/* Participant Share Table */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              Participant Shares ({expense.participants.length} Friends)
            </span>
            <span>Split: {expense.splitType === 'equal' ? 'Equal' : 'Custom'}</span>
          </div>

          <div className="space-y-2">
            {expense.participants.map((p) => {
              const member = members.find((m) => m.id === p.userId);
              if (!member) return null;
              const isPayer = member.id === expense.paidBy;

              return (
                <div
                  key={p.userId}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800/80 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <span className="font-bold text-slate-200 block">
                        {member.name}{' '}
                        {member.id === currentUser.id && (
                          <span className="text-emerald-400 font-semibold">(You)</span>
                        )}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {isPayer ? 'Paid full bill' : 'Owes share to payer'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-white block">
                      {formatINR(p.shareAmount)}
                    </span>
                    <span
                      className={`text-[10px] font-semibold ${
                        isPayer ? 'text-emerald-400' : 'text-slate-400'
                      }`}
                    >
                      {isPayer
                        ? `Net: +${formatINR(expense.amount - p.shareAmount)}`
                        : `Share`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notes if any */}
        {expense.notes && (
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <FileText className="w-3 h-3 text-emerald-400" />
              Notes
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {expense.notes}
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onEdit(expense);
            }}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
          >
            Edit Expense
          </button>
        </div>
      </div>
    </Modal>
  );
};
