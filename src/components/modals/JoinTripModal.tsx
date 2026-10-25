import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { Modal } from '../common/Modal';
import { LogIn, KeyRound, User, Sparkles } from 'lucide-react';

interface JoinTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinedSuccess?: () => void;
}

export const JoinTripModal: React.FC<JoinTripModalProps> = ({
  isOpen,
  onClose,
  onJoinedSuccess,
}) => {
  const { joinTrip, currentTrip } = useTrip();

  const [tripCode, setTripCode] = useState(currentTrip?.code || 'TRIP-7X92K');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!tripCode.trim() || !userName.trim()) {
      setError('Please fill in both Trip Code and Your Name.');
      return;
    }

    const success = joinTrip(tripCode.trim(), userName.trim());
    if (success) {
      if (onJoinedSuccess) onJoinedSuccess();
      onClose();
    } else {
      setError('Trip Code not found. Please verify the code.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Join Group Trip 🤝"
      subtitle="Enter the invite code shared by your friend to access the trip"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Trip Invite Code *
          </label>
          <div className="relative">
            <KeyRound className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. TRIP-7X92K"
              value={tripCode}
              onChange={(e) => setTripCode(e.target.value.toUpperCase())}
              required
              className="w-full glass-input rounded-2xl pl-10 pr-4 py-3 text-sm font-mono font-bold uppercase tracking-wider focus:border-emerald-500"
            />
          </div>
          <p className="text-[11px] text-slate-500">
            Demo Trip Code: <strong className="text-emerald-400">TRIP-7X92K</strong> (Goa 2026)
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Your Name *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. Vikram"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="w-full glass-input rounded-2xl pl-10 pr-4 py-3 text-sm focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Email (Optional)
          </label>
          <input
            type="email"
            placeholder="vikram@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full glass-input rounded-2xl px-4 py-2.5 text-xs focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>Join Trip Crew</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
