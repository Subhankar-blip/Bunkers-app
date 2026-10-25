import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trip,
  User,
  Photo,
  Expense,
  SettlementTransaction,
  ActivityEvent,
  MemberBalance,
  SettlementRecommendation,
  ToastNotification,
} from '../types';
import {
  INITIAL_TRIP,
  INITIAL_USERS,
  INITIAL_PHOTOS,
  INITIAL_EXPENSES,
  INITIAL_SETTLEMENTS,
  INITIAL_ACTIVITIES,
} from '../data/mockData';
import { calculateMemberBalances, calculateSettlements } from '../utils/calculations';
import { generateTransactionReference, generateTripCode } from '../utils/currency';

interface TripContextType {
  // Trip & User State
  trips: Trip[];
  currentTrip: Trip | null;
  members: User[];
  currentUser: User;
  setCurrentUser: (user: User) => void;
  setCurrentTripId: (id: string) => void;

  // Data Collections
  photos: Photo[];
  expenses: Expense[];
  settlementTransactions: SettlementTransaction[];
  activities: ActivityEvent[];
  toasts: ToastNotification[];

  // Computed Metrics
  memberBalances: MemberBalance[];
  settlementRecommendations: SettlementRecommendation[];
  currentUserBalance: MemberBalance | undefined;
  totalTripExpenses: number;
  totalPhotosCount: number;

  // Actions
  createTrip: (tripData: {
    name: string;
    destination: string;
    startDate: string;
    endDate: string;
    description: string;
    coverImage?: string;
    creatorName: string;
  }) => Trip;
  joinTrip: (code: string, userName: string, userAvatar?: string) => boolean;
  updateTrip: (tripData: Partial<Trip>) => void;
  addMember: (name: string, email?: string, avatar?: string) => User;

  // Photos Actions
  uploadPhotos: (
    items: { imageUrl: string; caption?: string; location?: string }[]
  ) => void;
  deletePhoto: (photoId: string) => boolean;
  toggleFavoritePhoto: (photoId: string) => void;

  // Expense Actions
  addExpense: (
    expenseData: Omit<Expense, 'id' | 'createdAt' | 'tripId'>
  ) => Expense;
  editExpense: (expenseId: string, expenseData: Partial<Expense>) => void;
  deleteExpense: (expenseId: string) => void;

  // Settlement & Payment Actions
  processPayment: (
    toUserId: string,
    amount: number,
    paymentMethod: string
  ) => Promise<SettlementTransaction>;

  // Utility Actions
  addToast: (message: string, type?: ToastNotification['type'], title?: string) => void;
  removeToast: (id: string) => void;
  resetDemoData: () => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TRIPS: 'bunkers_trips_v1',
  CURRENT_TRIP_ID: 'bunkers_current_trip_id_v1',
  MEMBERS: 'bunkers_members_v1',
  CURRENT_USER_ID: 'bunkers_current_user_id_v1',
  PHOTOS: 'bunkers_photos_v1',
  EXPENSES: 'bunkers_expenses_v1',
  SETTLEMENTS: 'bunkers_settlements_v1',
  ACTIVITIES: 'bunkers_activities_v1',
};

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with LocalStorage or Mock data
  const [trips, setTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRIPS);
    return saved ? JSON.parse(saved) : [INITIAL_TRIP];
  });

  const [currentTripId, setCurrentTripId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_TRIP_ID);
    return saved || INITIAL_TRIP.id;
  });

  const [members, setMembers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    return saved || INITIAL_USERS[0].id;
  });

  const [photos, setPhotos] = useState<Photo[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PHOTOS);
    return saved ? JSON.parse(saved) : INITIAL_PHOTOS;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [settlementTransactions, setSettlementTransactions] = useState<
    SettlementTransaction[]
  >(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTLEMENTS);
    return saved ? JSON.parse(saved) : INITIAL_SETTLEMENTS;
  });

  const [activities, setActivities] = useState<ActivityEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_TRIP_ID, currentTripId);
  }, [currentTripId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
  }, [photos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.SETTLEMENTS,
      JSON.stringify(settlementTransactions)
    );
  }, [settlementTransactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  }, [activities]);

  // Derived current references
  const currentTrip = trips.find((t) => t.id === currentTripId) || trips[0] || null;
  const currentUser = members.find((m) => m.id === currentUserId) || members[0];

  // Trip scoped data
  const tripPhotos = photos.filter((p) => p.tripId === currentTrip?.id);
  const tripExpenses = expenses.filter((e) => e.tripId === currentTrip?.id);
  const tripSettlements = settlementTransactions.filter(
    (s) => s.tripId === currentTrip?.id
  );
  const tripActivities = activities.filter((a) => a.tripId === currentTrip?.id);

  // Computations
  const memberBalances = calculateMemberBalances(
    members,
    tripExpenses,
    tripSettlements
  );
  const settlementRecommendations = calculateSettlements(memberBalances);
  const currentUserBalance = memberBalances.find((b) => b.userId === currentUser.id);
  const totalTripExpenses = tripExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalPhotosCount = tripPhotos.length;

  // Toast Management
  const addToast = (
    message: string,
    type: ToastNotification['type'] = 'info',
    title?: string
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setCurrentUser = (user: User) => {
    setCurrentUserId(user.id);
    addToast(`Switched active perspective to ${user.name}`, 'info', 'Persona Changed');
  };

  // Create Trip
  const createTrip = (tripData: {
    name: string;
    destination: string;
    startDate: string;
    endDate: string;
    description: string;
    coverImage?: string;
    creatorName: string;
  }): Trip => {
    const newTripId = `trip-${Date.now()}`;
    const creatorUser: User = {
      id: `user-${Date.now()}`,
      name: tripData.creatorName.trim() || 'Trip Creator',
      email: `${tripData.creatorName.toLowerCase().replace(/\s+/g, '')}@bunkers.app`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
        tripData.creatorName
      )}`,
      role: 'admin',
    };

    const newTrip: Trip = {
      id: newTripId,
      code: generateTripCode(),
      name: tripData.name.trim(),
      destination: tripData.destination.trim(),
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      description: tripData.description.trim() || 'Our group adventure!',
      coverImage:
        tripData.coverImage ||
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&auto=format&fit=crop&q=80',
      createdBy: creatorUser.id,
      createdAt: new Date().toISOString(),
    };

    setMembers([creatorUser]);
    setCurrentUserId(creatorUser.id);
    setTrips((prev) => [newTrip, ...prev]);
    setCurrentTripId(newTripId);

    const newActivity: ActivityEvent = {
      id: `act-${Date.now()}`,
      tripId: newTripId,
      type: 'member_joined',
      userId: creatorUser.id,
      userName: creatorUser.name,
      userAvatar: creatorUser.avatar,
      title: 'Trip Created',
      description: `${creatorUser.name} created the trip "${newTrip.name}"`,
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => [newActivity, ...prev]);

    addToast(`Trip "${newTrip.name}" created successfully! Invite code: ${newTrip.code}`, 'success', 'Trip Created');
    return newTrip;
  };

  // Join Trip
  const joinTrip = (code: string, userName: string, userAvatar?: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    const targetTrip = trips.find(
      (t) => t.code.toUpperCase() === cleanCode || t.id === cleanCode
    );

    if (!targetTrip) {
      addToast('Invalid Trip Code. Please check and try again.', 'error', 'Join Failed');
      return false;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userName.trim() || 'New Explorer',
      email: `${userName.toLowerCase().replace(/\s+/g, '')}@bunkers.app`,
      avatar:
        userAvatar ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userName)}`,
      role: 'member',
    };

    setMembers((prev) => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    setCurrentTripId(targetTrip.id);

    const newActivity: ActivityEvent = {
      id: `act-${Date.now()}`,
      tripId: targetTrip.id,
      type: 'member_joined',
      userId: newUser.id,
      userName: newUser.name,
      userAvatar: newUser.avatar,
      title: 'Member Joined Crew',
      description: `${newUser.name} joined ${targetTrip.name} via invite code`,
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => [newActivity, ...prev]);

    addToast(`You're in! Welcome to ${targetTrip.name}`, 'success', 'Joined Trip');
    return true;
  };

  const updateTrip = (tripData: Partial<Trip>) => {
    if (!currentTrip) return;
    setTrips((prev) =>
      prev.map((t) => (t.id === currentTrip.id ? { ...t, ...tripData } : t))
    );
    addToast('Trip settings updated.', 'success');
  };

  const addMember = (name: string, email?: string, avatar?: string): User => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email?.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@bunkers.app`,
      avatar:
        avatar ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      role: 'member',
    };

    setMembers((prev) => [...prev, newUser]);

    if (currentTrip) {
      const newActivity: ActivityEvent = {
        id: `act-${Date.now()}`,
        tripId: currentTrip.id,
        type: 'member_joined',
        userId: newUser.id,
        userName: newUser.name,
        userAvatar: newUser.avatar,
        title: 'New Member Added',
        description: `${newUser.name} was added to the trip crew`,
        timestamp: new Date().toISOString(),
      };
      setActivities((prev) => [newActivity, ...prev]);
    }

    addToast(`${newUser.name} has been added to the crew!`, 'success');
    return newUser;
  };

  // Upload Photos (Strictly associates active currentUser with every upload)
  const uploadPhotos = (
    items: { imageUrl: string; caption?: string; location?: string }[]
  ) => {
    if (!currentTrip || items.length === 0) return;

    const newPhotos: Photo[] = items.map((item, index) => ({
      id: `photo-${Date.now()}-${index}`,
      tripId: currentTrip.id,
      uploaderId: currentUser.id,
      uploaderName: currentUser.name,
      uploaderAvatar: currentUser.avatar,
      imageUrl: item.imageUrl,
      caption: item.caption?.trim() || undefined,
      location: item.location?.trim() || currentTrip.destination,
      uploadedAt: new Date().toISOString(),
      favorites: [],
    }));

    setPhotos((prev) => [...newPhotos, ...prev]);

    const newActivity: ActivityEvent = {
      id: `act-${Date.now()}`,
      tripId: currentTrip.id,
      type: 'photo_uploaded',
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      title: 'New Memories Uploaded',
      description: `${currentUser.name} uploaded ${newPhotos.length} new photo${
        newPhotos.length > 1 ? 's' : ''
      }`,
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => [newActivity, ...prev]);

    addToast(
      `Successfully uploaded ${newPhotos.length} photo${
        newPhotos.length > 1 ? 's' : ''
      } as ${currentUser.name}!`,
      'success',
      'Memories Added'
    );
  };

  const deletePhoto = (photoId: string): boolean => {
    const photo = photos.find((p) => p.id === photoId);
    if (!photo) return false;

    // Check permission: must be uploader or admin
    if (photo.uploaderId !== currentUser.id && currentUser.role !== 'admin') {
      addToast('You can only delete photos uploaded by you.', 'error', 'Permission Denied');
      return false;
    }

    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    addToast('Photo removed from album.', 'info');
    return true;
  };

  const toggleFavoritePhoto = (photoId: string) => {
    setPhotos((prev) =>
      prev.map((photo) => {
        if (photo.id !== photoId) return photo;
        const exists = photo.favorites.includes(currentUser.id);
        const updatedFavorites = exists
          ? photo.favorites.filter((id) => id !== currentUser.id)
          : [...photo.favorites, currentUser.id];
        return { ...photo, favorites: updatedFavorites };
      })
    );
  };

  // Expense Management
  const addExpense = (
    expenseData: Omit<Expense, 'id' | 'createdAt' | 'tripId'>
  ): Expense => {
    if (!currentTrip) throw new Error('No active trip');

    const newExpense: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}`,
      tripId: currentTrip.id,
      createdAt: new Date().toISOString(),
    };

    setExpenses((prev) => [newExpense, ...prev]);

    const payer = members.find((m) => m.id === expenseData.paidBy) || currentUser;
    const newActivity: ActivityEvent = {
      id: `act-${Date.now()}`,
      tripId: currentTrip.id,
      type: 'expense_added',
      userId: payer.id,
      userName: payer.name,
      userAvatar: payer.avatar,
      title: 'New Expense Added',
      description: `${payer.name} added "${newExpense.title} — ₹${newExpense.amount.toLocaleString(
        'en-IN'
      )}"`,
      amount: newExpense.amount,
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => [newActivity, ...prev]);

    addToast(
      `Recorded "${newExpense.title}" for ₹${newExpense.amount.toLocaleString(
        'en-IN'
      )}`,
      'success',
      'Expense Logged'
    );
    return newExpense;
  };

  const editExpense = (expenseId: string, expenseData: Partial<Expense>) => {
    setExpenses((prev) =>
      prev.map((exp) => (exp.id === expenseId ? { ...exp, ...expenseData } : exp))
    );
    addToast('Expense details updated.', 'success');
  };

  const deleteExpense = (expenseId: string) => {
    const expense = expenses.find((e) => e.id === expenseId);
    if (!expense) return;

    setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
    addToast(`Deleted "${expense.title}".`, 'info');
  };

  // Payment Settlement Simulation
  const processPayment = async (
    toUserId: string,
    amount: number,
    paymentMethod: string
  ): Promise<SettlementTransaction> => {
    if (!currentTrip) throw new Error('No active trip');

    const receiver = members.find((m) => m.id === toUserId);
    if (!receiver) throw new Error('Receiver not found');

    const ref = generateTransactionReference();
    const newTx: SettlementTransaction = {
      id: `txn-${Date.now()}`,
      tripId: currentTrip.id,
      payerId: currentUser.id,
      payerName: currentUser.name,
      payerAvatar: currentUser.avatar,
      receiverId: receiver.id,
      receiverName: receiver.name,
      receiverAvatar: receiver.avatar,
      amount: Math.round(amount),
      status: 'completed',
      paymentMethod,
      transactionReference: ref,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    // Update transactions
    setSettlementTransactions((prev) => [newTx, ...prev]);

    // Add activity event
    const newActivity: ActivityEvent = {
      id: `act-${Date.now()}`,
      tripId: currentTrip.id,
      type: 'payment_completed',
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      title: 'Payment Completed',
      description: `${currentUser.name} paid ${receiver.name} ₹${amount.toLocaleString(
        'en-IN'
      )} via ${paymentMethod}`,
      amount,
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => [newActivity, ...prev]);

    // Check if everything is now settled for celebration
    setTimeout(() => {
      // Confetti burst!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#f59e0b', '#ec4899', '#6366f1'],
      });
    }, 400);

    addToast(
      `₹${amount.toLocaleString('en-IN')} paid to ${receiver.name}! Reference: ${ref}`,
      'success',
      'Payment Successful'
    );

    return newTx;
  };

  // Reset demo data to initial pristine Goa 2026 state
  const resetDemoData = () => {
    setTrips([INITIAL_TRIP]);
    setCurrentTripId(INITIAL_TRIP.id);
    setMembers(INITIAL_USERS);
    setCurrentUserId(INITIAL_USERS[0].id);
    setPhotos(INITIAL_PHOTOS);
    setExpenses(INITIAL_EXPENSES);
    setSettlementTransactions(INITIAL_SETTLEMENTS);
    setActivities(INITIAL_ACTIVITIES);

    localStorage.removeItem(STORAGE_KEYS.TRIPS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_TRIP_ID);
    localStorage.removeItem(STORAGE_KEYS.MEMBERS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    localStorage.removeItem(STORAGE_KEYS.PHOTOS);
    localStorage.removeItem(STORAGE_KEYS.EXPENSES);
    localStorage.removeItem(STORAGE_KEYS.SETTLEMENTS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);

    addToast('Reset trip data to default Goa 2026 demo dataset!', 'info', 'Data Reset');
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        currentTrip,
        members,
        currentUser,
        setCurrentUser,
        setCurrentTripId,
        photos: tripPhotos,
        expenses: tripExpenses,
        settlementTransactions: tripSettlements,
        activities: tripActivities,
        toasts,
        memberBalances,
        settlementRecommendations,
        currentUserBalance,
        totalTripExpenses,
        totalPhotosCount,
        createTrip,
        joinTrip,
        updateTrip,
        addMember,
        uploadPhotos,
        deletePhoto,
        toggleFavoritePhoto,
        addExpense,
        editExpense,
        deleteExpense,
        processPayment,
        addToast,
        removeToast,
        resetDemoData,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
