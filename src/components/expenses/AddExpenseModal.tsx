import React, { useState, useEffect } from 'react';
import { useTrip } from '../../context/TripContext';
import { Modal } from '../common/Modal';
import { Expense, ExpenseCategory } from '../../types';
import { CATEGORY_METADATA } from '../../utils/calculations';
import { formatINR } from '../../utils/currency';
import { Plus, Check, AlertCircle, Sparkles, Receipt } from 'lucide-react';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingExpense?: Expense | null;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  editingExpense,
}) => {
  const { members, currentUser, addExpense, editExpense } = useTrip();

  const [title, setTitle] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('food');
  const [paidBy, setPaidBy] = useState<string>(currentUser.id);
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');

  // Equal split selected member IDs
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(
    members.map((m) => m.id)
  );

  // Custom split share map (userId -> shareAmount)
  const [customShares, setCustomShares] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Prepopulate if editing
  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title);
      setAmountStr(editingExpense.amount.toString());
      setCategory(editingExpense.category);
      setPaidBy(editingExpense.paidBy);
      setSplitType(editingExpense.splitType);
      setSelectedMemberIds(editingExpense.participants.map((p) => p.userId));

      const shareObj: Record<string, string> = {};
      editingExpense.participants.forEach((p) => {
        shareObj[p.userId] = p.shareAmount.toString();
      });
      setCustomShares(shareObj);
      setNotes(editingExpense.notes || '');
    } else {
      // Reset form
      setTitle('');
      setAmountStr('');
      setCategory('food');
      setPaidBy(currentUser.id);
      setSplitType('equal');
      setSelectedMemberIds(members.map((m) => m.id));

      const initialShareObj: Record<string, string> = {};
      members.forEach((m) => {
        initialShareObj[m.id] = '';
      });
      setCustomShares(initialShareObj);
      setNotes('');
    }
    setError(null);
  }, [editingExpense, isOpen, currentUser, members]);

  const numAmount = parseFloat(amountStr) || 0;

  // Calculate Equal Split Per Person
  const equalPerPerson =
    selectedMemberIds.length > 0 && numAmount > 0
      ? Math.round((numAmount / selectedMemberIds.length) * 100) / 100
      : 0;

  // Calculate Custom Split Sum
  const customSum = Object.values(customShares).reduce((acc, val) => {
    const parsed = parseFloat(val) || 0;
    return acc + parsed;
  }, 0);

  const customDifference = Math.round((numAmount - customSum) * 100) / 100;

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMemberIds((prev) => {
      if (prev.includes(memberId)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter((id) => id !== memberId);
      } else {
        return [...prev, memberId];
      }
    });
  };

  const handleCustomShareChange = (userId: string, value: string) => {
    setCustomShares((prev) => ({
      ...prev,
      [userId]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Please enter an expense title.');
      return;
    }

    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount greater than ₹0.');
      return;
    }

    if (splitType === 'equal') {
      if (selectedMemberIds.length === 0) {
        setError('Please select at least one participant for the split.');
        return;
      }

      // Generate equal split participants with rounding safeguard
      const baseShare = Math.floor((numAmount / selectedMemberIds.length) * 100) / 100;
      let remainder = Math.round((numAmount - baseShare * selectedMemberIds.length) * 100) / 100;

      const participants = selectedMemberIds.map((userId, index) => {
        let share = baseShare;
        if (remainder > 0 && index === 0) {
          share = Math.round((share + remainder) * 100) / 100;
        }
        return { userId, shareAmount: share };
      });

      if (editingExpense) {
        editExpense(editingExpense.id, {
          title: title.trim(),
          amount: numAmount,
          category,
          paidBy,
          splitType: 'equal',
          participants,
          notes: notes.trim() || undefined,
        });
      } else {
        addExpense({
          title: title.trim(),
          amount: numAmount,
          category,
          paidBy,
          splitType: 'equal',
          participants,
          notes: notes.trim() || undefined,
        });
      }
    } else {
      // Custom Split Validation
      if (Math.abs(customDifference) > 0.01) {
        setError(
          `Custom shares must equal the total expense amount. Difference: ${formatINR(
            customDifference
          )}`
        );
        return;
      }

      const participants = Object.entries(customShares)
        .map(([userId, val]) => ({
          userId,
          shareAmount: parseFloat(val) || 0,
        }))
        .filter((p) => p.shareAmount > 0);

      if (participants.length === 0) {
        setError('Please allocate amounts to participants.');
        return;
      }

      if (editingExpense) {
        editExpense(editingExpense.id, {
          title: title.trim(),
          amount: numAmount,
          category,
          paidBy,
          splitType: 'custom',
          participants,
          notes: notes.trim() || undefined,
        });
      } else {
        addExpense({
          title: title.trim(),
          amount: numAmount,
          category,
          paidBy,
          splitType: 'custom',
          participants,
          notes: notes.trim() || undefined,
        });
      }
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingExpense ? 'Edit Trip Expense ✏️' : 'Add New Trip Expense 💰'}
      subtitle="Record a bill, assign who paid, and split it among your crew"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Title & Amount */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Expense Description *
            </label>
            <input
              type="text"
              placeholder="e.g. Hotel Booking, Dinner, Scooter Rental"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full glass-input rounded-2xl px-4 py-3 text-sm focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Amount (₹ INR) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                ₹
              </span>
              <input
                type="number"
                min="1"
                step="any"
                placeholder="4000"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                required
                className="w-full glass-input rounded-2xl pl-8 pr-4 py-3 text-sm font-bold text-amber-300 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* 2. Category Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Select Category *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.entries(CATEGORY_METADATA) as [ExpenseCategory, typeof CATEGORY_METADATA[ExpenseCategory]][]).map(
              ([catKey, meta]) => {
                const isSelected = category === catKey;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setCategory(catKey)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="text-lg">{meta.icon}</span>
                    <span className="truncate">{meta.label}</span>
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* 3. Paid By Dropdown */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Who Paid the Bill? *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {members.map((member) => {
              const isSelected = paidBy === member.id;
              return (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => setPaidBy(member.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md ring-2 ring-emerald-400/40'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-5 h-5 rounded-full object-cover border border-white/20"
                  />
                  <span className="truncate">{member.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 ml-auto text-emerald-200" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Split Type Switcher: Equal vs Custom */}
        <div className="space-y-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Split Breakdown Method
            </span>
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setSplitType('equal')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  splitType === 'equal'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Split Equally
              </button>
              <button
                type="button"
                onClick={() => setSplitType('custom')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  splitType === 'custom'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Custom Shares
              </button>
            </div>
          </div>

          {/* Equal Split Options */}
          {splitType === 'equal' && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Select who participated:</span>
                {numAmount > 0 && selectedMemberIds.length > 0 && (
                  <span className="font-bold text-emerald-400">
                    {formatINR(equalPerPerson)} / person ({selectedMemberIds.length} friends)
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {members.map((member) => {
                  const isChecked = selectedMemberIds.includes(member.id);
                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => toggleMemberSelection(member.id)}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium transition-all ${
                        isChecked
                          ? 'bg-slate-800 border-emerald-500/60 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border ${
                          isChecked
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'border-slate-700'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                      <span className="truncate">{member.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Custom Split Inputs */}
          {splitType === 'custom' && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Enter custom share for each member:</span>
                <span
                  className={`font-bold ${
                    customDifference === 0
                      ? 'text-emerald-400'
                      : 'text-amber-400'
                  }`}
                >
                  {customDifference === 0 ? (
                    'Shares Match Total ✓'
                  ) : customDifference > 0 ? (
                    `Remaining: ${formatINR(customDifference)}`
                  ) : (
                    `Overallocated by: ${formatINR(Math.abs(customDifference))}`
                  )}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800"
                  >
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-xs font-semibold text-slate-200 flex-1 truncate">
                      {member.name}
                    </span>
                    <div className="relative w-28">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="0"
                        value={customShares[member.id] || ''}
                        onChange={(e) =>
                          handleCustomShareChange(member.id, e.target.value)
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-6 pr-2 py-1 text-xs text-white text-right focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 5. Optional Notes */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Notes / Details (Optional)
          </label>
          <textarea
            placeholder="Add notes about bill items, restaurant name, or hotel confirmation..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full glass-input rounded-2xl px-4 py-2.5 text-xs text-slate-200 focus:border-emerald-500"
          />
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all"
          >
            <Receipt className="w-4 h-4" />
            <span>{editingExpense ? 'Save Changes' : 'Log Expense'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
