export type Role = 'admin' | 'member';

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  role: Role;
}

export interface Trip {
  id: string;
  code: string; // e.g. "TRIP-7X92K"
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  description: string;
  coverImage: string;
  createdBy: string;
  createdAt: string;
}

export interface Photo {
  id: string;
  tripId: string;
  uploaderId: string;
  uploaderName: string;
  uploaderAvatar: string;
  imageUrl: string;
  caption?: string;
  uploadedAt: string;
  favorites: string[]; // List of user IDs
  location?: string;
}

export type ExpenseCategory =
  | 'food'
  | 'hotel'
  | 'transport'
  | 'activities'
  | 'shopping'
  | 'groceries'
  | 'emergency'
  | 'other';

export interface ExpenseParticipant {
  userId: string;
  shareAmount: number;
}

export interface Expense {
  id: string;
  tripId: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  paidBy: string; // userId
  splitType: 'equal' | 'custom';
  participants: ExpenseParticipant[];
  createdAt: string;
  notes?: string;
}

export interface MemberBalance {
  userId: string;
  user: User;
  totalPaid: number;
  totalShare: number;
  netBalance: number; // totalPaid - totalShare (+ = receive, - = owe, 0 = settled)
}

export interface SettlementRecommendation {
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  toUserId: string;
  toUserName: string;
  toUserAvatar: string;
  amount: number;
}

export interface SettlementTransaction {
  id: string;
  tripId: string;
  payerId: string;
  payerName: string;
  payerAvatar: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar: string;
  amount: number;
  status: 'completed' | 'processing' | 'pending' | 'failed';
  paymentMethod: string;
  transactionReference: string;
  createdAt: string;
  completedAt?: string;
}

export interface ActivityEvent {
  id: string;
  tripId: string;
  type: 'member_joined' | 'photo_uploaded' | 'expense_added' | 'expense_edited' | 'payment_completed';
  userId: string;
  userName: string;
  userAvatar: string;
  title: string;
  description: string;
  amount?: number;
  timestamp: string;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  title?: string;
}
