import { X, Globe, Calendar, Music, Loader2 } from 'lucide-react';
import type { Band } from '@/data/bands';
import { categories } from '@/data/bands';
import { useAlbumCovers } from '@/hooks/useAlbumCovers';

interface MetalDetailsModalProps {
  band: Band;
  onClose: () => void;
  onEdit?: (band: Band) => void;
}

export function MetalDetailsModal({ band, onClose, onEdit }: MetalDetailsModalProps) {
  const category = categories[band.category];
  const color = category.color;
  const { albums, loading } = useAlbumCovers(band.name, band.topAlbums);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-[#0D0D0D] border-2 rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
        style={{ borderColor: `${color}40` }}
      >
        {/* Header/Banner */}
        <div 
          className="h-32 w-full relative"
          style={{ background: `linear-gradient(to bottom, ${color}40, transparent)` }}
        >
          <div className="absolute top-4 right-4 flex gap-2">
            {onEdit && (
              <button 
                onClick={() => onEdit(band)}
                className="p-2 rounded-full bg-white/50 dark:bg-black/40 text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-xs font-bold uppercase tracking-wider px-3"
              >
                Edit
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 rounded-full bg-white/50 dark:bg-black/40 text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <X size={25} />
            </button>
          </div>
          
          <div className="absolute -bottom-10 left-8 flex items-end gap-6 text-gray-900 dark:text-white">
            <div 
              className="w-24 h-24 flex items-center justify-center text-4xl font-bold border-4 rounded-xl bg-white dark:bg-[#0D0D0D]"
              style={{ borderColor: color, color: color, textShadow: `0 0 10px ${color}40` }}
            >
              {band.symbol}
            </div>
            <div className="mb-2">
              <h2 className="text-3xl font-bold tracking-tight">{band.name}</h2>
              <div className="flex items-center gap-2 text-sm" style={{ color: color }}>
                <span className="font-semibold uppercase tracking-wider">{category.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-16 px-8 pb-8 space-y-6">
          <div className="flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 pb-4">
            <div className="flex items-center gap-2">
              <Globe size={20} className="text-gray-500" />
              <span>{band.origin}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-gray-500" />
              <span>Formed in {band.year}</span>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
              {band.description || "Experimental metal pioneer with a unique sonic fingerprint in the periodic landscape of heavy music."}
            </p>

            {albums && albums.length > 0 && (
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-widest flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Music size={18} />
                    Essential Elements (Top Albums)
                  </div>
                  {loading && <Loader2 size={18} className="animate-spin text-blue-500" />}
                </h3>
                
                <div className="grid grid-cols-3 gap-4">
                  {albums.map((album, i) => (
                    <div key={i} className="group relative space-y-2">
                      <div className="aspect-square w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg overflow-hidden relative">
                        {album.coverUrl ? (
                          <img 
                            src={album.coverUrl} 
                            alt={album.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onLoad={(e) => (e.currentTarget.style.opacity = '1')}
                            style={{ opacity: 0, transition: 'opacity 0.5s' }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-700">
                            <Music size={24} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                          <span className="text-[12.5px] text-white font-medium leading-tight line-clamp-2">
                            {album.title}
                          </span>
                        </div>
                      </div>
                      <p className="text-[12.5px] text-gray-500 text-center truncate group-hover:text-gray-900 dark:group-hover:text-gray-300 transition-colors">
                        {album.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Accent */}
        <div className="h-1 shadow-inner" style={{ backgroundColor: color }} />
      </div>

      {/* Backdrop Close Trigger */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
}
