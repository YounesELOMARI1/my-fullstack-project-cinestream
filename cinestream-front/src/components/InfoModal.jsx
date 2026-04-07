import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function InfoModal({ item, type = 'movie', onClose }) {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [added, setAdded] = useState(false);
  
  // TMDB Data States
  const [tmdbData, setTmdbData] = useState({ overview: '', cast: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Trigger animation frame for fade-in effect
    requestAnimationFrame(() => setIsVisible(true));
    
    // 2. Prevent background scrolling while modal is open
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    
    // 3. Add escape key listener
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    // 4. Fetch TMDB Data natively
    const fetchTMDB = async () => {
      try {
        setIsLoading(true);
        const tmdbType = type === 'series' ? 'tv' : 'movie';
        // Assume ID maps correctly; fallback to tmdb_id if backend provides it
        const targetId = item.tmdb_id || item.id; 
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;

        if (!apiKey) {
          throw new Error("VITE_TMDB_API_KEY not configured.");
        }

        const [detailsRes, creditsRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/${tmdbType}/${targetId}?api_key=${apiKey}&language=en-US`),
          fetch(`https://api.themoviedb.org/3/${tmdbType}/${targetId}/credits?api_key=${apiKey}`)
        ]);

        if (!detailsRes.ok || !creditsRes.ok) throw new Error("TMDB network response was not ok");

        const details = await detailsRes.json();
        const credits = await creditsRes.json();

        setTmdbData({
          overview: details.overview,
          cast: credits.cast?.slice(0, 5) || [] // Take top 5 main actors
        });
      } catch (error) {
        console.warn("TMDB Fetch Error (Falling back to local data):", error);
        // Fallback gracefully to existing local data
        setTmdbData({
          overview: item.description || "No description available for this title.",
          cast: []
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTMDB();
    
    return () => {
      document.body.style.overflow = origOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, type]);

  const handleAddToWatchlist = async (e) => {
    e.stopPropagation();
    if (!user) return;
    try {
      await api.post('/watchlist', { type, id: item.id });
      setAdded(true);
    } catch (error) {
      console.error("Error adding to watchlist:", error);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for transition duration before unmounting
  };

  const poster = item.poster || `https://via.placeholder.com/400x600/11131c/00daf3?text=${encodeURIComponent(item.title)}`;
  
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12" onClick={handleClose}>
      {/* Backdrop Overlay */}
      <div 
        className={`absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} 
      />
      
      {/* Modal Container */}
      <div 
        className={`relative w-full max-w-5xl max-h-[90vh] overflow-hidden bg-[#0b0f19] border border-white/10 rounded-2xl md:rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] flex flex-col md:flex-row transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-12'} `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-black/80 backdrop-blur-md transition-all border border-white/10 shadow-lg"
          aria-label="Close modal"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Poster Section (Left side on desktop) */}
        <div className="md:w-[45%] flex-shrink-0 relative h-64 md:h-full">
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0b0f19] via-transparent to-transparent z-10 pointer-events-none" />
          <img 
            src={poster} 
            alt={item.title}
            className="w-full h-full object-cover object-top md:object-center"
          />
        </div>

        {/* Info Detail Section (Right side on desktop) */}
        <div className="md:w-[55%] p-6 md:p-10 flex flex-col relative z-20 h-full overflow-y-auto custom-scrollbar">
          
          <div className="flex items-center gap-3 mb-3">
            {type === 'series' && (
              <span className="px-2 py-0.5 rounded bg-white/10 border border-white/10 text-white/80 text-[10px] font-bold uppercase tracking-[0.1em]">
                Series
              </span>
            )}
            <span className="text-cyan-400 font-bold text-sm tracking-wider">
              {item.year || 'N/A'}
            </span>
          </div>
          
          <h2 className="text-3xl lg:text-5xl font-headline font-bold text-white leading-[1.1] mb-5 tracking-tight">
            {item.title}
          </h2>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1.5 bg-[#ffb950]/15 border border-[#ffb950]/20 px-2.5 py-1 rounded-md">
              <span className="material-symbols-outlined text-[#ffb950] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="text-[#ffb950] font-bold text-sm">{item.rating || 'N/A'}</span>
            </div>
            
            {(item.seasons || item.episodes) && (
              <span className="text-white/60 text-sm font-medium border-l border-white/20 pl-4">
                {item.seasons ? `${item.seasons} Seasons` : `${item.episodes} Episodes`}
              </span>
            )}
          </div>

          <div className="flex gap-2 flex-wrap mb-8">
            {item.genres?.map(g => (
              <span key={g.id || g} className="text-xs bg-white/5 border border-white/10 text-white/70 px-3 py-1 rounded-full whitespace-nowrap">
                {g.name || g}
              </span>
            ))}
          </div>

          {/* TMDB Integration Area (Synopsis & Cast) */}
          <div className="space-y-8 mb-10">
            {/* Synopsis */}
            <div>
              <h3 className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-3">Synopsis</h3>
               {isLoading ? (
                  <div className="space-y-2 animate-pulse">
                     <div className="h-4 bg-white/10 rounded w-full"></div>
                     <div className="h-4 bg-white/10 rounded w-full"></div>
                     <div className="h-4 bg-white/10 rounded w-5/6"></div>
                     <div className="h-4 bg-white/10 rounded w-3/4"></div>
                  </div>
               ) : (
                  <p className="text-white/80 text-[15px] leading-relaxed font-light">
                    {tmdbData.overview}
                  </p>
               )}
            </div>

            {/* Top Cast */}
            <div>
              <h3 className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-4">Top Cast</h3>
              {isLoading ? (
                <div className="flex gap-4 overflow-hidden">
                   {[...Array(5)].map((_, i) => (
                     <div key={i} className="flex flex-col items-center gap-2 animate-pulse">
                       <div className="w-14 h-14 bg-white/10 rounded-full"></div>
                       <div className="w-12 h-2 bg-white/10 rounded"></div>
                     </div>
                   ))}
                </div>
              ) : tmdbData.cast.length > 0 ? (
                <div className="flex flex-wrap gap-x-6 gap-y-4">
                  {tmdbData.cast.map(actor => (
                    <div key={actor.id} className="flex flex-col items-center gap-2 w-[64px] group">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/5 group-hover:border-cyan-400/50 transition-colors bg-[#11131c]">
                        {actor.profile_path ? (
                          <img 
                            src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} 
                            alt={actor.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-white/5">
                            <span className="material-symbols-outlined text-white/30 text-[20px]">person</span>
                          </div>
                        )}
                      </div>
                      <span className="text-white/70 text-[10px] text-center font-medium leading-tight line-clamp-2">
                        {actor.name}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/50 text-sm italic">Cast information not available.</p>
              )}
            </div>
          </div>

          <div className="mt-auto flex gap-4 pt-4 border-t border-white/5 sticky bottom-0 bg-[#0b0f19]">
            <button className="flex-1 bg-cyan-400 hover:bg-cyan-300 text-cyan-950 font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] flex items-center justify-center gap-2 active:scale-95">
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              Play Now
            </button>
            {user && (
              <button 
                onClick={handleAddToWatchlist}
                className={`w-14 h-14 border rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 group ${
                  added 
                    ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400' 
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                }`}
                title={added ? "Added to Watchlist" : "Add to Watchlist"}
              >
                <span className={`material-symbols-outlined text-[24px] transition-colors ${!added && 'group-hover:text-cyan-400'}`}>
                  {added ? 'check' : 'add'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
