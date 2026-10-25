import React from 'react';
import { Photo } from '../../types';
import { useTrip } from '../../context/TripContext';
import { Heart, Trash2, MapPin, Download, Eye } from 'lucide-react';
import { formatDate } from '../../utils/currency';

interface PhotoCardProps {
  photo: Photo;
  onOpenLightbox: (photo: Photo) => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ photo, onOpenLightbox }) => {
  const { currentUser, toggleFavoritePhoto, deletePhoto } = useTrip();

  const isFavorited = photo.favorites.includes(currentUser.id);
  const canDelete = photo.uploaderId === currentUser.id || currentUser.role === 'admin';

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = photo.imageUrl;
    link.download = `Bunkers_${photo.uploaderName}_${photo.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      onClick={() => onOpenLightbox(photo)}
      className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 hover:border-emerald-500/50 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-emerald-950/20 cursor-pointer flex flex-col"
    >
      {/* Image Thumbnail Container */}
      <div className="relative aspect-square sm:aspect-[4/3] w-full overflow-hidden bg-slate-950">
        <img
          src={photo.imageUrl}
          alt={photo.caption || `Photo uploaded by ${photo.uploaderName}`}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Hover Overlay with Quick Actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3">
          {/* Top Actions: Favorite & Delete */}
          <div className="flex items-center justify-between">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavoritePhoto(photo.id);
              }}
              className={`p-2 rounded-xl backdrop-blur-md transition-transform active:scale-90 ${
                isFavorited
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-950/50'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            </button>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleDownload}
                className="p-2 rounded-xl bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 backdrop-blur-md transition-colors"
                title="Download Photo"
              >
                <Download className="w-4 h-4" />
              </button>
              {canDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Delete this photo from the trip album?')) {
                      deletePhoto(photo.id);
                    }
                  }}
                  className="p-2 rounded-xl bg-rose-500/80 hover:bg-rose-600 text-white backdrop-blur-md transition-colors"
                  title="Delete Photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Bottom Overlay Info */}
          <div className="text-left">
            {photo.caption && (
              <p className="text-xs text-white font-medium line-clamp-2 leading-snug mb-1">
                {photo.caption}
              </p>
            )}
            <div className="flex items-center gap-2 text-[10px] text-slate-300">
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>Click for Fullscreen</span>
            </div>
          </div>
        </div>

        {/* Permanent Favorite Badge if Favorited */}
        {isFavorited && (
          <div className="absolute top-2.5 right-2.5 group-hover:hidden">
            <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg">
              <Heart className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>
        )}
      </div>

      {/* Card Footer: Strictly Displaying Uploader Attribution */}
      <div className="p-3 bg-slate-900/90 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={photo.uploaderAvatar}
            alt={photo.uploaderName}
            className="w-6 h-6 rounded-full object-cover border border-slate-700 flex-shrink-0"
          />
          <div className="truncate text-left">
            <span className="text-xs font-bold text-slate-200 block truncate">
              {photo.uploaderName}
            </span>
            <span className="text-[10px] text-slate-400 block truncate">
              {formatDate(photo.uploadedAt)}
            </span>
          </div>
        </div>

        {photo.location && (
          <span className="hidden sm:flex items-center gap-1 text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md truncate max-w-[100px]">
            <MapPin className="w-2.5 h-2.5 text-emerald-400 flex-shrink-0" />
            <span className="truncate">{photo.location}</span>
          </span>
        )}
      </div>
    </div>
  );
};
