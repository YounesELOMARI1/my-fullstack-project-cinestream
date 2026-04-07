import { useState, useEffect } from 'react'
import api from '../api/axios'
import MovieCard from '../components/MovieCard'

export default function Watchlist() {
  const [items, setItems]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/watchlist')
      .then(res => setItems(res.data))
      .finally(() => setLoading(false))
  }, [])

  const handleRemove = async (id) => {
    try {
      await api.delete(`/watchlist/${id}`);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error removing from watchlist:", error);
    }
  }

  return (
    <div className="pt-24 px-8 md:px-16 pb-16">
      <h1 className="text-4xl font-bold mb-8">Ma Liste</h1>
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#00daf3]"/>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/30 text-xl mb-4">Ta liste est vide</p>
          <p className="text-white/20 text-sm">Ajoute des films et séries depuis la page d'accueil</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map(item => (
            <MovieCard 
              key={item.id} 
              movie={item.watchlistable} 
              type={item.watchlistable_type?.includes('Movie') ? 'movie' : 'series'}
              isWatchlist={true}
              onRemove={() => handleRemove(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}