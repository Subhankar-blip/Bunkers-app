import {
  User,
  Expense,
  MemberBalance,
  SettlementRecommendation,
  SettlementTransaction,
  ExpenseCategory,
} from '../types';

/**
 * Calculates total paid, total share, and net balances for all members in a trip.
 * Net Balance = Total Paid - Total Share
 * Positive -> Member should RECEIVE money
 * Negative -> Member OWES money
 * Zero -> Member is SETTLED
 */
export function calculateMemberBalances(
  members: User[],
  expenses: Expense[],
  completedSettlements: SettlementTransaction[] = []
): MemberBalance[] {
  // Initialize accumulators
  const paidMap: Record<string, number> = {};
  const shareMap: Record<string, number> = {};
  const settledPaymentMap: Record<string, number> = {}; // Tracks completed direct settlements

  members.forEach((m) => {
    paidMap[m.id] = 0;
    shareMap[m.id] = 0;
    settledPaymentMap[m.id] = 0;
  });

  // Calculate expense distributions
  expenses.forEach((expense) => {
    // Add to payer's total paid
    if (paidMap[expense.paidBy] !== undefined) {
      paidMap[expense.paidBy] += expense.amount;
    }

    // Add shares to each participant
    expense.participants.forEach((p) => {
      if (shareMap[p.userId] !== undefined) {
        shareMap[p.userId] += p.shareAmount;
      }
    });
  });

  // Factor in completed settlement transactions (direct payments made outside expenses)
  completedSettlements.forEach((tx) => {
    if (tx.status === 'completed') {
      // Payer has effectively given money -> increases payer's net standing
      if (settledPaymentMap[tx.payerId] !== undefined) {
        settledPaymentMap[tx.payerId] += tx.amount;
      }
      // Receiver has received money -> decreases receiver's remaining receivable
      if (settledPaymentMap[tx.receiverId] !== undefined) {
        settledPaymentMap[tx.receiverId] -= tx.amount;
      }
    }
  });

  return members.map((member) => {
    const totalPaid = paidMap[member.id] || 0;
    const totalShare = shareMap[member.id] || 0;
    // Base balance from expenses + direct settled adjustments
    const settlementAdjustment = settledPaymentMap[member.id] || 0;
    const netBalance = Math.round((totalPaid - totalShare + settlementAdjustment) * 100) / 100;

    return {
      userId: member.id,
      user: member,
      totalPaid,
      totalShare,
      netBalance,
    };
  });
}

/**
 * Min-Cash-Flow Smart Settlement Algorithm.
 * Simplifies mutual debts into the minimum number of practical transactions.
 * Example:
 * Rahul: +₹3,000 (Creditor)
 * Priya: -₹1,000 (Debtor)
 * Aman: -₹1,000 (Debtor)
 * Sneha: -₹1,000 (Debtor)
 * Yields:
 * Priya -> Rahul ₹1,000
 * Aman -> Rahul ₹1,000
 * Sneha -> Rahul ₹1,000
 */
export function calculateSettlements(
  balances: MemberBalance[]
): SettlementRecommendation[] {
  // Separate into debtors (need to pay) and creditors (need to receive)
  interface Party {
    userId: string;
    userName: string;
    userAvatar: string;
    amount: number; // positive value representing owed or receiving
  }

  const debtors: Party[] = [];
  const creditors: Party[] = [];

  balances.forEach((b) => {
    const rounded = Math.round(b.netBalance);
    if (rounded < -0.5) {
      debtors.push({
        userId: b.userId,
        userName: b.user.name,
        userAvatar: b.user.avatar,
        amount: Math.abs(rounded),
      });
    } else if (rounded > 0.5) {
      creditors.push({
        userId: b.userId,
        userName: b.user.name,
        userAvatar: b.user.avatar,
        amount: rounded,
      });
    }
  });

  // Sort descending by amount to minimize transaction chain
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const recommendations: SettlementRecommendation[] = [];
  let dIndex = 0;
  let cIndex = 0;

  while (dIndex < debtors.length && cIndex < creditors.length) {
    const debtor = debtors[dIndex];
    const creditor = creditors[cIndex];

    const transferAmount = Math.min(debtor.amount, creditor.amount);

    if (transferAmount > 0) {
      recommendations.push({
        fromUserId: debtor.userId,
        fromUserName: debtor.userName,
        fromUserAvatar: debtor.userAvatar,
        toUserId: creditor.userId,
        toUserName: creditor.userName,
        toUserAvatar: creditor.userAvatar,
        amount: Math.round(transferAmount),
      });
    }

    debtor.amount -= transferAmount;
    creditor.amount -= transferAmount;

    if (debtor.amount < 0.5) {
      dIndex++;
    }
    if (creditor.amount < 0.5) {
      cIndex++;
    }
  }

  return recommendations;
}

/**
 * Category metadata: icons, labels, colors
 */
export const CATEGORY_METADATA: Record<
  ExpenseCategory,
  { label: string; icon: string; bgClass: string; textClass: string; borderClass: string }
> = {
  hotel: {
    label: 'Hotel / Stay',
    icon: '🏨',
    bgClass: 'bg-indigo-500/10',
    textClass: 'text-indigo-400',
    borderClass: 'border-indigo-500/20',
  },
  food: {
    label: 'Food & Drinks',
    icon: '🍔',
    bgClass: 'bg-amber-500/10',
    textClass: 'text-amber-400',
    borderClass: 'border-amber-500/20',
  },
  transport: {
    label: 'Transport & Fuel',
    icon: '🚗',
    bgClass: 'bg-blue-500/10',
    textClass: 'text-blue-400',
    borderClass: 'border-blue-500/20',
  },
  activities: {
    label: 'Activities & Sports',
    icon: '🎟️',
    bgClass: 'bg-emerald-500/10',
    textClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/20',
  },
  shopping: {
    label: 'Shopping',
    icon: '🛍️',
    bgClass: 'bg-purple-500/10',
    textClass: 'text-purple-400',
    borderClass: 'border-purple-500/20',
  },
  groceries: {
    label: 'Groceries & Snacks',
    icon: '🛒',
    bgClass: 'bg-teal-500/10',
    textClass: 'text-teal-400',
    borderClass: 'border-teal-500/20',
  },
  emergency: {
    label: 'Emergency & Medical',
    icon: '💊',
    bgClass: 'bg-rose-500/10',
    textClass: 'text-rose-400',
    borderClass: 'border-rose-500/20',
  },
  other: {
    label: 'Other Misc',
    icon: '📦',
    bgClass: 'bg-slate-500/10',
    textClass: 'text-slate-400',
    borderClass: 'border-slate-500/20',
  },
};
