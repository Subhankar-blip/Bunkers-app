import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { Photo, User } from '../../types';
import { UploaderSection } from './UploaderSection';
import { LightboxViewer } from './LightboxViewer';
import {
  Camera,
  Upload,
  Search,
  Filter,
  Heart,
  Sparkles,
  Users,
  Grid,
} from 'lucide-react';

interface MemoriesPageProps {
  onOpenUploadModal: () => void;
}

export const MemoriesPage: React.FC<MemoriesPageProps> = ({ onOpenUploadModal }) => {
  const { currentTrip, members, photos, currentUser } = useTrip();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUploaderId, setSelectedUploaderId] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [activeLightboxPhoto, setActiveLightboxPhoto] = useState<Photo | null>(null);

  if (!currentTrip) return null;

  // Filter photos
  const filteredPhotos = photos.filter((photo) => {
    // Search query match
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      photo.uploaderName.toLowerCase().includes(query) ||
      (photo.caption && photo.caption.toLowerCase().includes(query)) ||
      (photo.location && photo.location.toLowerCase().includes(query));

    // Uploader filter
    const matchesUploader =
      selectedUploaderId === 'all' || photo.uploaderId === selectedUploaderId;

    // Favorites filter
    const matchesFavorites =
      !showFavoritesOnly || photo.favorites.includes(currentUser.id);

    return matchesSearch && matchesUploader && matchesFavorites;
  });

  // Determine members to display as sections
  const displayedMembers =
    selectedUploaderId === 'all'
      ? members
      : members.filter((m) => m.id === selectedUploaderId);

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Page Header & Stats Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Strictly Organized by Member</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Shared Memories Hub 📸
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Every moment captured during <strong className="text-slate-200">{currentTrip.name}</strong>, neatly cataloged into individual member albums.
          </p>
        </div>

        {/* Upload Button */}
        <button
          onClick={onOpenUploadModal}
          className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-950/50 transition-all transform hover:-translate-y-0.5 flex-shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Upload as {currentUser.name}</span>
        </button>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by person, caption, or place..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Uploader Filter Chips */}
          <div className="flex items-center gap-1 overflow-x-auto py-1">
            <button
              onClick={() => setSelectedUploaderId('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedUploaderId === 'all'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              All Crew ({photos.length})
            </button>

            {members.map((member) => {
              const count = photos.filter((p) => p.uploaderId === member.id).length;
              return (
                <button
                  key={member.id}
                  onClick={() => setSelectedUploaderId(member.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedUploaderId === member.id
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span>{member.name}</span>
                  <span className="text-[10px] opacity-75">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Favorites Only Toggle */}
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              showFavoritesOnly
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-current' : ''}`} />
            <span>Favorites</span>
          </button>
        </div>
      </div>

      {/* 3. Render Uploader Sections */}
      <div className="space-y-8">
        {displayedMembers.map((member) => {
          const memberPhotos = filteredPhotos.filter(
            (p) => p.uploaderId === member.id
          );

          // If filtering or searching and this member has no matching photos, skip or show empty
          if (
            (searchQuery || showFavoritesOnly) &&
            memberPhotos.length === 0
          ) {
            return null;
          }

          return (
            <UploaderSection
              key={member.id}
              member={member}
              photos={memberPhotos}
              onOpenLightbox={(photo) => setActiveLightboxPhoto(photo)}
              onOpenUploadModal={onOpenUploadModal}
            />
          );
        })}

        {filteredPhotos.length === 0 && (
          <div className="text-center py-16 glass-panel rounded-3xl border border-slate-800 space-y-3">
            <Camera className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No photos matched your filter</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your search query or switch back to "All Crew" to view the full gallery.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedUploaderId('all');
                setShowFavoritesOnly(false);
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <LightboxViewer
        photo={activeLightboxPhoto}
        allPhotos={filteredPhotos.length > 0 ? filteredPhotos : photos}
        onClose={() => setActiveLightboxPhoto(null)}
        onNavigate={(newPhoto) => setActiveLightboxPhoto(newPhoto)}
      />
    </div>
  );
};
