import { useState, useEffect } from 'react'
import api from '../api/axios'
import MovieCard from '../components/MovieCard'
import { useSearchParams } from 'react-router-dom'

export default function Movies() {
  const [movies, setMovies] = useState([])
  const [page, setPage]     = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [loading, setLoading]   = useState(true)
  const [searchParams]          = useSearchParams()
  
  const search = searchParams.get('search') || ''

  useEffect(() => {
    setLoading(true)
    api.get('/movies', { params: { page, search } })
      .then(res => {
        setMovies(res.data.data)
        setLastPage(res.data.last_page)
      }).finally(() => setLoading(false))
  }, [page, search])

  return (
    <div className="pt-24 px-8 md:px-16 pb-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">
          {search ? `Résultats pour "${search}"` : "Films"}
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#00daf3]"/>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map(m => <MovieCard key={m.id} movie={m} type="movie"/>)}
          </div>
          <div className="flex justify-center items-center gap-4 mt-12">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
              className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl disabled:opacity-30 hover:bg-white/10 transition-colors">
              ← Précédent
            </button>
            <span className="text-white/50 text-sm">Page {page} / {lastPage}</span>
            <button onClick={() => setPage(p => Math.min(lastPage, p+1))} disabled={page === lastPage}
              className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl disabled:opacity-30 hover:bg-white/10 transition-colors">
              Suivant →
            </button>
          </div>
        </>
      )}
    </div>
  )
}