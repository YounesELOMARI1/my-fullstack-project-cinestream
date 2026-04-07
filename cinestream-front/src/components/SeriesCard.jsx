import { useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import InfoModal from './InfoModal'

export default function SeriesCard({ series, type = 'series', isWatchlist = false, onRemove }) {
  const { user } = useAuth()
  const [added, setAdded] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const addToWatchlist = async (e) => {
    e.stopPropagation()
    if (!user) return
    try {
      await api.post('/watchlist', { type, id: series.id })
      setAdded(true)
    } catch {}
  }

  const poster = series.poster || `https://via.placeholder.com/300x450/11131c/00daf3?text=${encodeURIComponent(series.title)}`

  return (
    <>
      <div 
        className="group relative rounded-xl overflow-hidden cursor-pointer bg-[#11131c] transition-all duration-300 hover:z-20 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-1.5"
        onClick={() => setShowModal(true)}
      >
        <div className="aspect-[2/3] overflow-hidden relative">
          <img src={poster} alt={series.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform" />
            
          {/* Default Dark Overlay for Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
          
          {/* Hover Overlay with Blur & Button */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowModal(true); }}
              className="px-5 py-2.5 rounded-full bg-cyan-400 text-cyan-950 font-bold text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]"
            >
              <span className="material-symbols-outlined text-[18px]">info</span>
              Show Info
            </button>
          </div>
          
          {/* Watchlist button at top right */}
          {user && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (isWatchlist && onRemove) {
                  onRemove();
                } else {
                  addToWatchlist(e);
                }
              }}
              className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 backdrop-blur-md border ${
                isWatchlist 
                  ? 'bg-red-500/20 text-red-500 border-red-500/30 hover:bg-red-500/40 hover:text-red-400'
                  : added
                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                  : 'bg-black/40 hover:bg-black/60 text-white border-white/20'
              }`}
              title={isWatchlist ? "Remove from Watchlist" : (added ? "Added to Watchlist" : "Add to Watchlist")}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isWatchlist ? 'close' : (added ? 'check' : 'add')}
              </span>
            </button>
          )}

          {/* Bottom Card Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
            <h3 className="text-white font-bold text-sm md:text-base tracking-wide leading-tight mb-1 truncate">{series.title}</h3>
            
            <div className="flex items-center justify-between transform transition-all duration-300 group-hover:-translate-y-1">
              <span className="text-white/60 text-[11px] font-medium tracking-wider">
                {series.year ? series.year : ''} {series.seasons ? `• ${series.seasons} Seasons` : ''}
              </span>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[#ffb950] text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="text-[#ffb950] text-[11px] font-bold">{series.rating || 'N/A'}</span>
              </div>
            </div>
            
            <div className="flex gap-1.5 flex-wrap overflow-hidden h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 group-hover:mt-2 transition-all duration-300">
              {series.genres?.slice(0, 2).map(g => (
                <span key={g.id || g} className="text-[9px] font-bold uppercase tracking-widest bg-white/10 text-white/80 px-1.5 py-0.5 rounded">
                  {g.name || g}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <InfoModal 
          item={series} 
          type={type} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  )
}
