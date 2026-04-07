import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.password_confirmation) {
      setError('Les mots de passe ne correspondent pas')
      return
    }
    setLoading(true)
    setError('')
    try {
      await register(form.name, form.email, form.password, form.password_confirmation)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen cinematic-bg flex items-center justify-center p-6">
      <header className="fixed top-0 left-0 w-full p-6 z-50">
        <Link to="/" className="text-2xl font-bold text-[#00e5ff]">
          Ciné<span className="text-white">Stream</span>
        </Link>
      </header>

      <div className="w-full max-w-md mt-16">
        <div className="glass-effect rounded-2xl border border-white/10 p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-2">Créer un compte</h2>
          <p className="text-white/50 mb-8">Rejoins CinéStream gratuitement</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'name', label: 'Nom', type: 'text', placeholder: 'Ton nom' },
              { key: 'email', label: 'Email', type: 'email', placeholder: 'email@exemple.com' },
              { key: 'password', label: 'Mot de passe', type: 'password', placeholder: '••••••••' },
              { key: 'password_confirmation', label: 'Confirmer', type: 'password', placeholder: '••••••••' },
            ].map(field => (
              <div key={field.key} className="space-y-1">
                <label className="text-xs uppercase tracking-widest text-white/40">{field.label}</label>
                <input type={field.type} placeholder={field.placeholder}
                  value={form[field.key]}
                  onChange={e => setForm({...form, [field.key]: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/20 focus:outline-none focus:border-[#00daf3]/50 transition-colors"
                />
              </div>
            ))}

            <button type="submit" disabled={loading}
              className="w-full bg-[#00daf3] hover:bg-[#00c4da] disabled:opacity-50 text-[#001f24] font-bold py-4 rounded-xl transition-colors mt-2">
              {loading ? 'Inscription...' : "S'inscrire"}
            </button>
          </form>

          <p className="text-white/40 text-sm mt-6 text-center">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-[#00daf3] font-bold hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  )
}