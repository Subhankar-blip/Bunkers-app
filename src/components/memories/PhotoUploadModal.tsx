import React, { useState, useRef } from 'react';
import { useTrip } from '../../context/TripContext';
import { Modal } from '../common/Modal';
import {
  Upload,
  Camera,
  X,
  MapPin,
  Sparkles,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PendingUploadItem {
  id: string;
  imageUrl: string;
  caption: string;
  location: string;
}

const SAMPLE_TRAVEL_PHOTOS = [
  {
    title: 'Goa Sunset Shack',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    caption: 'Chilling at Curlies shack with the crew',
    location: 'Anjuna Beach',
  },
  {
    title: 'Beach Scooter Ride',
    url: 'https://images.unsplash.com/photo-1569388330292-79cc1ec67270?w=800&auto=format&fit=crop&q=80',
    caption: 'Scenic coconut tree road ride on Vespas',
    location: 'Parra Road, Goa',
  },
  {
    title: 'Fresh Coconut Water',
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
    caption: 'Morning tropical fresh drinks',
    location: 'Vagator, Goa',
  },
  {
    title: 'Beach Bonfire',
    url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
    caption: 'Stargazing and guitar by the waves',
    location: 'Morjim Beach',
  },
];

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentUser, currentTrip, uploadPhotos } = useTrip();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pendingItems, setPendingItems] = useState<PendingUploadItem[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [defaultLocation, setDefaultLocation] = useState(
    currentTrip?.destination || 'Goa, India'
  );

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPendingItems((prev) => [
            ...prev,
            {
              id: `pending-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              imageUrl: e.target!.result as string,
              caption: '',
              location: defaultLocation,
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddSample = (sample: typeof SAMPLE_TRAVEL_PHOTOS[0]) => {
    setPendingItems((prev) => [
      ...prev,
      {
        id: `sample-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        imageUrl: sample.url,
        caption: sample.caption,
        location: sample.location,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setPendingItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateCaption = (id: string, caption: string) => {
    setPendingItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, caption } : item))
    );
  };

  const handleUploadSubmit = () => {
    if (pendingItems.length === 0) return;

    uploadPhotos(
      pendingItems.map((item) => ({
        imageUrl: item.imageUrl,
        caption: item.caption,
        location: item.location || defaultLocation,
      }))
    );

    setPendingItems([]);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Trip Memories 📸"
      subtitle="Share photos with your trip crew. Uploads are strictly tagged to your profile."
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Active Uploader Identity Banner */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover border border-emerald-500/40"
            />
            <div>
              <span className="text-xs text-slate-400 block font-medium">
                Uploading as:
              </span>
              <span className="text-sm font-bold text-white flex items-center gap-1.5">
                {currentUser.name}
                <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded">
                  {currentUser.role}
                </span>
              </span>
            </div>
          </div>
          <span className="text-xs text-emerald-400 font-semibold hidden sm:inline">
            ✓ Photos will appear in {currentUser.name}'s album
          </span>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-200 ${
            dragActive
              ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]'
              : 'border-slate-700/80 bg-slate-900/40 hover:border-emerald-500/50 hover:bg-slate-900/80'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <div className="w-14 h-14 rounded-2xl bg-slate-800 text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Upload className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold text-white mb-1">
            📸 Drop photos here, or <span className="text-emerald-400">click to browse</span>
          </h4>
          <p className="text-xs text-slate-400 font-medium">
            Supports multiple JPG, PNG, WEBP files
          </p>
        </div>

        {/* Quick Sample Selector for Demo */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Quick Demo Samples (Click to add high-res beach photos):
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SAMPLE_TRAVEL_PHOTOS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAddSample(sample)}
                className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-800/80 text-left transition-all text-xs group"
              >
                <img
                  src={sample.url}
                  alt={sample.title}
                  className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                />
                <div className="truncate">
                  <span className="font-semibold text-slate-200 block truncate group-hover:text-emerald-300">
                    {sample.title}
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">
                    + Add
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Preview of Pending Uploads */}
        {pendingItems.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                Selected Photos ({pendingItems.length})
              </h5>
              <button
                type="button"
                onClick={() => setPendingItems([])}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
              >
                Clear all
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
              {pendingItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-900 border border-slate-800 relative group"
                >
                  <img
                    src={item.imageUrl}
                    alt="preview"
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-slate-700"
                  />
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <input
                      type="text"
                      placeholder="Add a caption... (optional)"
                      value={item.caption}
                      onChange={(e) => handleUpdateCaption(item.id, e.target.value)}
                      className="w-full text-xs bg-slate-950/80 border border-slate-700/80 rounded-lg px-2.5 py-1 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500 text-slate-400 hover:text-white transition-colors ml-1"
                    title="Remove"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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
            type="button"
            disabled={pendingItems.length === 0}
            onClick={handleUploadSubmit}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg shadow-emerald-600/30 transition-all"
          >
            <Camera className="w-4 h-4" />
            <span>Upload {pendingItems.length} Photo{pendingItems.length === 1 ? '' : 's'} as {currentUser.name}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
