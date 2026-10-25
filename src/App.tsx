import React, { useState } from 'react';
import { TripProvider, useTrip } from './context/TripContext';
import { PersonaBanner } from './components/common/PersonaBanner';
import { Navbar } from './components/common/Navbar';
import { MobileNav } from './components/common/MobileNav';
import { ToastContainer } from './components/common/Toast';
import { LandingPage } from './components/landing/LandingPage';
import { TripDashboard } from './components/dashboard/TripDashboard';
import { MemoriesPage } from './components/memories/MemoriesPage';
import { ExpensesPage } from './components/expenses/ExpensesPage';
import { BalancesPage } from './components/balances/BalancesPage';
import { SettlementPage } from './components/settlement/SettlementPage';
import { CrewPage } from './components/crew/CrewPage';
import { TripSettingsPage } from './components/settings/TripSettingsPage';

// Modals
import { CreateTripModal } from './components/modals/CreateTripModal';
import { JoinTripModal } from './components/modals/JoinTripModal';
import { PhotoUploadModal } from './components/memories/PhotoUploadModal';
import { AddExpenseModal } from './components/expenses/AddExpenseModal';
import { Expense } from './types';

const MainAppContent: React.FC = () => {
  const { currentTrip } = useTrip();

  // Navigation state
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Modals state
  const [createTripOpen, setCreateTripOpen] = useState(false);
  const [joinTripOpen, setJoinTripOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [addExpenseModalOpen, setAddExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setAddExpenseModalOpen(true);
  };

  const handleCloseExpenseModal = () => {
    setAddExpenseModalOpen(false);
    setEditingExpense(null);
  };

  // If in landing mode, display the landing page
  if (viewMode === 'landing') {
    return (
      <>
        <LandingPage
          onEnterApp={() => setViewMode('app')}
          onOpenCreateTrip={() => setCreateTripOpen(true)}
          onOpenJoinTrip={() => setJoinTripOpen(true)}
        />
        <CreateTripModal
          isOpen={createTripOpen}
          onClose={() => setCreateTripOpen(false)}
          onTripCreated={() => setViewMode('app')}
        />
        <JoinTripModal
          isOpen={joinTripOpen}
          onClose={() => setJoinTripOpen(false)}
          onJoinedSuccess={() => setViewMode('app')}
        />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white pb-20 md:pb-8">
      {/* 1. Top Persona Switcher Ribbon */}
      <PersonaBanner />

      {/* 2. Main Desktop Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateTrip={() => setCreateTripOpen(true)}
        onOpenJoinTrip={() => setJoinTripOpen(true)}
        onGoHome={() => setViewMode('landing')}
      />

      {/* 3. Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'dashboard' && (
          <TripDashboard
            setActiveTab={setActiveTab}
            onOpenUploadModal={() => setUploadModalOpen(true)}
            onOpenAddExpenseModal={() => setAddExpenseModalOpen(true)}
          />
        )}

        {activeTab === 'memories' && (
          <MemoriesPage
            onOpenUploadModal={() => setUploadModalOpen(true)}
          />
        )}

        {activeTab === 'expenses' && (
          <ExpensesPage
            onOpenAddExpenseModal={() => setAddExpenseModalOpen(true)}
            onEditExpense={handleEditExpense}
          />
        )}

        {activeTab === 'balances' && (
          <BalancesPage setActiveTab={setActiveTab} />
        )}

        {activeTab === 'settle' && (
          <SettlementPage />
        )}

        {activeTab === 'crew' && (
          <CrewPage />
        )}

        {activeTab === 'settings' && (
          <TripSettingsPage />
        )}
      </main>

      {/* 4. Mobile Bottom Navigation */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 5. Modals */}
      <CreateTripModal
        isOpen={createTripOpen}
        onClose={() => setCreateTripOpen(false)}
      />

      <JoinTripModal
        isOpen={joinTripOpen}
        onClose={() => setJoinTripOpen(false)}
      />

      <PhotoUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />

      <AddExpenseModal
        isOpen={addExpenseModalOpen}
        onClose={handleCloseExpenseModal}
        editingExpense={editingExpense}
      />

      {/* 6. Notification Toasts */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <TripProvider>
      <MainAppContent />
    </TripProvider>
  );
}

export default App;
