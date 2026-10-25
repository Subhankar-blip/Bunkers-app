import React from 'react';
import { User, Photo } from '../../types';
import { PhotoCard } from './PhotoCard';
import { Camera, Sparkles, Upload } from 'lucide-react';
import { useTrip } from '../../context/TripContext';

interface UploaderSectionProps {
  member: User;
  photos: Photo[];
  onOpenLightbox: (photo: Photo) => void;
  onOpenUploadModal: () => void;
}

export const UploaderSection: React.FC<UploaderSectionProps> = ({
  member,
  photos,
  onOpenLightbox,
  onOpenUploadModal,
}) => {
  const { currentUser } = useTrip();
  const isCurrentMember = member.id === currentUser.id;

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-7 space-y-5 border border-slate-800/90 shadow-xl">
      {/* Section Header: Standalone Uploader Identity */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src={member.avatar}
              alt={member.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-700 shadow-md ring-2 ring-emerald-500/20"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px]">
              📸
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight uppercase">
                📸 {member.name.toUpperCase()}'S MEMORIES
              </h3>
              {isCurrentMember && (
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  You
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Captured & uploaded by <strong className="text-slate-200">{member.name}</strong> • {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
            </p>
          </div>
        </div>

        {/* Quick Upload Action if current member */}
        {isCurrentMember && (
          <button
            onClick={onOpenUploadModal}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Add to my album</span>
          </button>
        )}
      </div>

      {/* Grid of Photos */}
      {photos.length === 0 ? (
        <div className="py-10 text-center rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 space-y-2">
          <p className="text-xs text-slate-400 font-medium">
            {member.name} hasn't uploaded any photos to this trip yet.
          </p>
          {isCurrentMember && (
            <button
              onClick={onOpenUploadModal}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300"
            >
              Upload your first memory 📸
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {photos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              onOpenLightbox={onOpenLightbox}
            />
          ))}
        </div>
      )}
    </div>
  );
};
