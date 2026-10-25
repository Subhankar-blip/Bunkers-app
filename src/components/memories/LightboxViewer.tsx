import React, { useEffect } from 'react';
import { Photo } from '../../types';
import { useTrip } from '../../context/TripContext';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Heart,
  Calendar,
  MapPin,
  Trash2,
} from 'lucide-react';
import { formatDate } from '../../utils/currency';

interface LightboxViewerProps {
  photo: Photo | null;
  allPhotos: Photo[];
  onClose: () => void;
  onNavigate: (photo: Photo) => void;
}

export const LightboxViewer: React.FC<LightboxViewerProps> = ({
  photo,
  allPhotos,
  onClose,
  onNavigate,
}) => {
  const { currentUser, toggleFavoritePhoto, deletePhoto } = useTrip();

  useEffect(() => {
    if (!photo) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photo, allPhotos]);

  if (!photo) return null;

  const currentIndex = allPhotos.findIndex((p) => p.id === photo.id);
  const isFavorited = photo.favorites.includes(currentUser.id);
  const canDelete = photo.uploaderId === currentUser.id || currentUser.role === 'admin';

  const handlePrev = () => {
    if (currentIndex > 0) {
      onNavigate(allPhotos[currentIndex - 1]);
    } else {
      onNavigate(allPhotos[allPhotos.length - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < allPhotos.length - 1) {
      onNavigate(allPhotos[currentIndex + 1]);
    } else {
      onNavigate(allPhotos[0]);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = photo.imageUrl;
    link.download = `Bunkers_${photo.uploaderName}_${photo.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-2xl p-4 sm:p-6 select-none animate-fadeIn">
      {/* Top Header Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between z-20 bg-gradient-to-b from-slate-950/90 to-transparent">
        {/* Uploader Attribution Details */}
        <div className="flex items-center gap-3">
          <img
            src={photo.uploaderAvatar}
            alt={photo.uploaderName}
            className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500/60 shadow-lg"
          />
          <div className="text-left">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>{photo.uploaderName}'s Memory</span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-medium">
                {currentIndex + 1} of {allPhotos.length}
              </span>
            </h4>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-500" />
                {formatDate(photo.uploadedAt)}
              </span>
              {photo.location && (
                <span className="flex items-center gap-1 text-emerald-400">
                  <MapPin className="w-3 h-3" />
                  {photo.location}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFavoritePhoto(photo.id)}
            className={`p-2.5 rounded-xl border transition-all ${
              isFavorited
                ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-950/50'
                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title={isFavorited ? 'Favorited' : 'Add to Favorites'}
          >
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleDownload}
            className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Download Full Resolution"
          >
            <Download className="w-5 h-5" />
          </button>

          {canDelete && (
            <button
              onClick={() => {
                if (window.confirm('Delete this photo from the trip album?')) {
                  deletePhoto(photo.id);
                  onClose();
                }
              }}
              className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
              title="Delete Photo"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
            title="Close Lightbox (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      {allPhotos.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 sm:left-8 z-20 p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 shadow-2xl transition-all transform hover:-translate-x-1"
            title="Previous Photo (Left Arrow)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 sm:right-8 z-20 p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 shadow-2xl transition-all transform hover:translate-x-1"
            title="Next Photo (Right Arrow)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Main Image Container */}
      <div className="relative max-w-5xl max-h-[75vh] sm:max-h-[80vh] flex flex-col items-center justify-center p-2">
        <img
          src={photo.imageUrl}
          alt={photo.caption || 'Trip memory'}
          className="max-w-full max-h-[70vh] sm:max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-slate-800"
        />

        {/* Caption Bar */}
        {photo.caption && (
          <div className="mt-4 px-6 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center max-w-2xl backdrop-blur-md">
            <p className="text-sm font-medium text-slate-200">{photo.caption}</p>
          </div>
        )}
      </div>
    </div>
  );
};
