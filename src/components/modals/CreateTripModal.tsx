import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { Modal } from '../common/Modal';
import { PlaneTakeoff, Calendar, MapPin, Sparkles, Copy, Check } from 'lucide-react';

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTripCreated?: () => void;
}

const PRESET_COVERS = [
  'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&auto=format&fit=crop&q=80',
];

export const CreateTripModal: React.FC<CreateTripModalProps> = ({
  isOpen,
  onClose,
  onTripCreated,
}) => {
  const { createTrip } = useTrip();

  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('2026-10-12');
  const [endDate, setEndDate] = useState('2026-10-16');
  const [description, setDescription] = useState('');
  const [creatorName, setCreatorName] = useState('Rahul');
  const [selectedCover, setSelectedCover] = useState(PRESET_COVERS[0]);

  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !destination.trim() || !creatorName.trim()) return;

    const newTrip = createTrip({
      name: name.trim(),
      destination: destination.trim(),
      startDate,
      endDate,
      description: description.trim(),
      coverImage: selectedCover,
      creatorName: creatorName.trim(),
    });

    setCreatedCode(newTrip.code);
    if (onTripCreated) onTripCreated();
  };

  const handleCopyCode = () => {
    if (createdCode) {
      navigator.clipboard.writeText(createdCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleFinish = () => {
    setCreatedCode(null);
    setName('');
    setDestination('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleFinish}
      title={createdCode ? 'Trip Created! 🌴' : 'Create New Trip ✈️'}
      subtitle={
        createdCode
          ? 'Share your invite code with friends to let them join'
          : 'Setup a new shared workspace for your group adventure'
      }
      maxWidth="lg"
    >
      {createdCode ? (
        <div className="text-center space-y-6 py-4">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-xl">
            <Sparkles className="w-8 h-8 text-emerald-400" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-black text-white">{name}</h3>
            <p className="text-xs text-slate-300">
              Trip workspace ready! You are the trip administrator.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Your Unique Trip Code
            </span>
            <div className="text-3xl font-mono font-black text-emerald-400 tracking-wider">
              {createdCode}
            </div>
            <button
              type="button"
              onClick={handleCopyCode}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Invite Code</span>
                </>
              )}
            </button>
          </div>

          <button
            onClick={handleFinish}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl transition-all"
          >
            Enter Trip Dashboard
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Trip Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Goa 2026, Manali Road Trip, Bali Vacation"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full glass-input rounded-2xl px-4 py-3 text-sm focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Destination *
              </label>
              <input
                type="text"
                placeholder="e.g. Goa, India"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
                className="w-full glass-input rounded-2xl px-4 py-2.5 text-xs focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Your Name (Admin) *
              </label>
              <input
                type="text"
                placeholder="e.g. Rahul"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                required
                className="w-full glass-input rounded-2xl px-4 py-2.5 text-xs focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Start Date *
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full glass-input rounded-2xl px-3 py-2 text-xs focus:border-emerald-500 text-slate-200"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                End Date *
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full glass-input rounded-2xl px-3 py-2 text-xs focus:border-emerald-500 text-slate-200"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Description (Optional)
            </label>
            <textarea
              placeholder="What is this trip about? Beaches, mountains, food tour..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full glass-input rounded-2xl px-4 py-2 text-xs focus:border-emerald-500"
            />
          </div>

          {/* Cover Photo */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Select Cover Theme
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_COVERS.map((coverUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedCover(coverUrl)}
                  className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                    selectedCover === coverUrl
                      ? 'border-emerald-400 scale-105 shadow-md'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={coverUrl}
                    alt="cover"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleFinish}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all"
            >
              <PlaneTakeoff className="w-4 h-4" />
              <span>Create Trip & Generate Code</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
