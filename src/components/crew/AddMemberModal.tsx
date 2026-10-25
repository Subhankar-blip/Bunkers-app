import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { Modal } from '../common/Modal';
import { UserPlus, Sparkles, User as UserIcon } from 'lucide-react';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
];

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose }) => {
  const { addMember } = useTrip();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addMember(name.trim(), email.trim(), selectedAvatar);
    setName('');
    setEmail('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Friend to Crew 👥"
      subtitle="Expand your group trip crew so they can upload photos and split bills"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Friend's Name *
          </label>
          <input
            type="text"
            placeholder="e.g. Vikram, Ananya, Rohan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full glass-input rounded-2xl px-4 py-3 text-sm focus:border-emerald-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Email (Optional)
          </label>
          <input
            type="email"
            placeholder="friend@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full glass-input rounded-2xl px-4 py-3 text-sm focus:border-emerald-500"
          />
        </div>

        {/* Avatar Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Choose Avatar
          </label>
          <div className="flex items-center gap-3">
            {PRESET_AVATARS.map((avatarUrl, idx) => {
              const isSelected = selectedAvatar === avatarUrl;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedAvatar(avatarUrl)}
                  className={`relative rounded-full p-0.5 transition-transform ${
                    isSelected
                      ? 'ring-2 ring-emerald-400 scale-110'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </button>
              );
            })}
          </div>
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
