import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import MovieCard from '../components/MovieCard';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [filter, setFilter] = useState('all'); // 'all', 'movies', 'series'
  const [results, setResults] = useState({ movies: [], series: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setResults({ movies: [], series: [] });
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Fetch both simultaneously
    Promise.all([
      api.get('/movies', { params: { search: query } }),
      api.get('/series', { params: { search: query } })
    ]).then(([moviesRes, seriesRes]) => {
      setResults({
        movies: moviesRes.data.data || [],
        series: seriesRes.data.data || []
      });
    }).catch(error => {
      console.error("Error fetching search results:", error);
    }).finally(() => {
      setLoading(false);
    });
  }, [query]);

  // Merge and apply filters
  let displayedItems = [];
  if (filter === 'all' || filter === 'movies') {
    displayedItems = [...displayedItems, ...results.movies.map(m => ({ ...m, _cardType: 'movie' }))];
  }
  if (filter === 'all' || filter === 'series') {
    displayedItems = [...displayedItems, ...results.series.map(s => ({ ...s, _cardType: 'series' }))];
  }
  
  // Sort by rating to ensure the highest quality results rise to the top
  displayedItems.sort((a, b) => (b.rating || 0) - (a.rating || 0));

  return (
    <div className="pt-24 px-8 md:px-16 pb-16 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold mb-2">Recherche</h1>
          <p className="text-white/60">
            {query ? `Résultats pour "${query}"` : "Entrez un terme de recherche..."}
          </p>
        </div>
        
        {/* Filtering Tabs */}
        {query && (
          <div className="flex bg-[#11131c] border border-white/10 rounded-full p-1 w-fit">
            <button 
              onClick={() => setFilter('all')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${filter === 'all' ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'text-white/60 hover:text-white'}`}
            >
              Tous ({results.movies.length + results.series.length})
            </button>
            <button 
              onClick={() => setFilter('movies')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${filter === 'movies' ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'text-white/60 hover:text-white'}`}
            >
              Films ({results.movies.length})
            </button>
            <button 
              onClick={() => setFilter('series')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${filter === 'series' ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'text-white/60 hover:text-white'}`}
            >
              Séries ({results.series.length})
            </button>
          </div>
        )}
      </div>

      {!query ? (
        <div className="flex flex-col items-center justify-center py-32 opacity-50">
          <span className="material-symbols-outlined text-[64px] mb-4">search</span>
          <p className="text-xl">Utilisez la barre de navigation pour rechercher</p>
        </div>
      ) : loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#00daf3]"></div>
        </div>
      ) : displayedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 opacity-60 bg-white/5 rounded-3xl border border-white/10 shadow-inner">
          <span className="material-symbols-outlined text-[64px] mb-4 text-[#ffb950]">sentiment_dissatisfied</span>
          <p className="text-2xl font-bold mb-2">Aucun résultat trouvé</p>
          <p className="text-white/50 text-center max-w-md">Nous n'avons trouvé aucune correspondance pour "{query}". Essayez avec un titre différent ou parcourez nos catégories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {displayedItems.map(item => (
            <MovieCard 
              key={`${item._cardType}-${item.id}`} 
              movie={item} 
              type={item._cardType} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
