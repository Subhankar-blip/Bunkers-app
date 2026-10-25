import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { Expense, ExpenseCategory } from '../../types';
import { ExpenseCard } from './ExpenseCard';
import { ExpenseDetailsModal } from './ExpenseDetailsModal';
import { CATEGORY_METADATA } from '../../utils/calculations';
import { formatINR } from '../../utils/currency';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  TrendingUp,
  CreditCard,
  Sparkles,
} from 'lucide-react';

interface ExpensesPageProps {
  onOpenAddExpenseModal: () => void;
  onEditExpense: (expense: Expense) => void;
}

export const ExpensesPage: React.FC<ExpensesPageProps> = ({
  onOpenAddExpenseModal,
  onEditExpense,
}) => {
  const { currentTrip, members, expenses, totalTripExpenses, currentUser } = useTrip();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPayerId, setSelectedPayerId] = useState<string>('all');
  const [activeDetailsExpense, setActiveDetailsExpense] = useState<Expense | null>(null);

  if (!currentTrip) return null;

  const avgPerPerson = members.length > 0 ? totalTripExpenses / members.length : 0;

  // Filter expenses
  const filteredExpenses = expenses.filter((exp) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      exp.title.toLowerCase().includes(query) ||
      (exp.notes && exp.notes.toLowerCase().includes(query));

    const matchesCategory =
      selectedCategory === 'all' || exp.category === selectedCategory;

    const matchesPayer =
      selectedPayerId === 'all' || exp.paidBy === selectedPayerId;

    return matchesSearch && matchesCategory && matchesPayer;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Page Header & Spending Overview Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Automatic Bill Splitting Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Group Expenses 💰
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Track who paid, who owes, and split every meal, stay, and activity without manual calculations.
          </p>
        </div>

        {/* Primary CTA: Add Expense */}
        <button
          onClick={onOpenAddExpenseModal}
          className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-950/50 transition-all transform hover:-translate-y-0.5 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Expense</span>
        </button>
      </div>

      {/* 2. Key Spending Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Trip Spend
            </span>
            <div className="text-2xl font-black text-amber-300 mt-0.5">
              {formatINR(totalTripExpenses)}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Average / Friend
            </span>
            <div className="text-2xl font-black text-emerald-400 mt-0.5">
              {formatINR(avgPerPerson)}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Bills Logged
            </span>
            <div className="text-2xl font-black text-white mt-0.5">
              {expenses.length} Records
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Search & Category Filter Chips */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search expenses by title or note..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Paid By Filter */}
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto py-1">
            <span className="text-xs text-slate-400 mr-1 hidden lg:inline">
              Paid By:
            </span>
            <button
              onClick={() => setSelectedPayerId('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedPayerId === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Everyone
            </button>
            {members.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedPayerId(m.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedPayerId === m.id
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <img
                  src={m.avatar}
                  alt={m.name}
                  className="w-4 h-4 rounded-full object-cover"
                />
                <span>{m.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-800/80">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-slate-700 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            All Categories
          </button>
          {Object.entries(CATEGORY_METADATA).map(([catKey, meta]) => {
            const isSelected = selectedCategory === catKey;
            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-slate-700 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{meta.icon}</span>
                <span>{meta.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Expenses Grid / List */}
      <div className="space-y-4">
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-3xl border border-slate-800 space-y-3">
            <Receipt className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No expenses found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No bills match your current filters. Add a new expense or clear filters to view all entries.
            </p>
            <button
              onClick={onOpenAddExpenseModal}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
            >
              Add First Expense
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredExpenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                onViewDetails={(exp) => setActiveDetailsExpense(exp)}
                onEditExpense={(exp) => onEditExpense(exp)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Expense Details Breakdown Modal */}
      <ExpenseDetailsModal
        expense={activeDetailsExpense}
        onClose={() => setActiveDetailsExpense(null)}
        onEdit={(exp) => onEditExpense(exp)}
      />
    </div>
  );
};
