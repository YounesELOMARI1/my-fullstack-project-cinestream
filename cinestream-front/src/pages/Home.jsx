import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import MovieCard from '../components/MovieCard'

export default function Home() {
  const { user } = useAuth()
  const [movies, setMovies] = useState([])
  const [series, setSeries] = useState([])
  const [hero, setHero]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [heroAdded, setHeroAdded] = useState(false)

  const handleAddHero = async () => {
    if (!user) return
    try {
      await api.post('/watchlist', { type: 'movie', id: hero.id })
      setHeroAdded(true)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    Promise.all([
      api.get('/movies', { params: { sort: 'rating', order: 'desc' } }),
      api.get('/series',  { params: { sort: 'rating', order: 'desc' } }),
    ]).then(([m, s]) => {
      setMovies(m.data.data)
      setSeries(s.data.data)
      setHero(m.data.data[0])
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-[#11131c]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#00daf3]"/>
    </div>
  )

  return (
    <div className="pt-16">
      {hero && (
        <div className="relative h-[85vh] overflow-hidden">
          <img src={hero.backdrop || hero.poster} alt={hero.title}
            className="w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-r from-[#11131c] via-[#11131c]/60 to-transparent"/>
          <div className="absolute inset-0 bg-gradient-to-t from-[#11131c] via-transparent to-transparent"/>
          <div className="absolute bottom-16 left-0 px-8 md:px-16 max-w-2xl">
            <div className="flex gap-2 mb-4">
              {hero.genres?.slice(0,3).map(g => (
                <span key={g.id} className="text-xs bg-[#00daf3]/20 text-[#00daf3] border border-[#00daf3]/30 px-3 py-1 rounded-full">
                  {g.name}
                </span>
              ))}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">{hero.title}</h1>
            <p className="text-white/60 text-lg mb-6 line-clamp-2">{hero.synopsis}</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[#ffb950]">
                <span>★</span>
                <span className="font-bold text-xl">{hero.rating}</span>
              </div>
              <span className="text-white/30">|</span>
              <span className="text-white/50">{hero.year}</span>
            </div>
            <div className="flex gap-4 mt-6">
              <button className="bg-[#00daf3] hover:bg-[#00c4da] text-[#001f24] font-bold px-8 py-3 rounded-xl transition-colors">
                ▶ Regarder
              </button>
              {user && (
                <button 
                  onClick={handleAddHero}
                  className={`font-bold px-8 py-3 rounded-xl border transition-colors flex items-center justify-center gap-2 ${
                    heroAdded 
                      ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400' 
                      : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                  }`}
                >
                  <span className="material-symbols-outlined">{heroAdded ? 'check' : 'add'}</span>
                  {heroAdded ? 'Ajouté' : 'Ma liste'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="px-8 md:px-16 py-12 space-y-12">
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Films Populaires</h2>
            <Link to="/movies" className="text-[#00daf3] text-sm hover:underline">Voir tout →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.slice(0, 12).map(m => <MovieCard key={m.id} movie={m} type="movie"/>)}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Séries Populaires</h2>
            <Link to="/series" className="text-[#00daf3] text-sm hover:underline">Voir tout →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {series.slice(0, 12).map(s => <MovieCard key={s.id} movie={s} type="series"/>)}
          </div>
        </section>
      </div>
    </div>
  )
}