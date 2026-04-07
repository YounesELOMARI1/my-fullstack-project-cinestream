import { useState, useEffect } from 'react'
import api from '../../api/axios'

export default function Dashboard() {
  const [stats, setStats] = useState({ movies: 0, series: 0, genres: 0 })

  useEffect(() => {
    Promise.all([
      api.get('/movies'),
      api.get('/series'),
      api.get('/genres'),
    ]).then(([m, s, g]) => {
      setStats({
        movies: m.data.total,
        series: s.data.total,
        genres: g.data.length,
      })
    })
  }, [])

  const cards = [
    { label: 'Films', value: stats.movies, color: 'text-[#00daf3]', bg: 'bg-[#00daf3]/10 border-[#00daf3]/20' },
    { label: 'Séries', value: stats.series, color: 'text-[#ffb950]', bg: 'bg-[#ffb950]/10 border-[#ffb950]/20' },
    { label: 'Genres', value: stats.genres, color: 'text-[#00e5ff]', bg: 'bg-[#00e5ff]/10 border-[#00e5ff]/20' },
  ]

  return (
    <div className="pt-24 px-8 md:px-16 pb-16">
      <h1 className="text-4xl font-bold mb-2">Dashboard Admin</h1>
      <p className="text-white/40 mb-10">Statistiques de la plateforme</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {cards.map(card => (
          <div key={card.label} className={`glass-effect rounded-2xl border p-8 ${card.bg}`}>
            <p className="text-white/40 text-sm uppercase tracking-widest mb-2">{card.label}</p>
            <p className={`text-5xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-effect rounded-2xl border border-white/10 p-8">
        <h2 className="text-xl font-bold mb-6">Actions rapides</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Importer Films TMDB', action: () => alert('Lance: php artisan tmdb:import movies') },
            { label: 'Importer Séries TMDB', action: () => alert('Lance: php artisan tmdb:import series') },
          ].map(btn => (
            <button key={btn.label} onClick={btn.action}
              className="bg-[#00daf3]/10 hover:bg-[#00daf3]/20 border border-[#00daf3]/20 text-[#00daf3] rounded-xl p-4 text-sm font-medium transition-colors text-left">
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}