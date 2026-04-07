import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(form.email, form.password)
      navigate('/home')
    } catch {
      setError('Email ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center cinematic-bg overflow-hidden text-white font-body selection:bg-cyan-500/30">
      {/* Background Decor Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/40 to-black/80 pointer-events-none"></div>
      
      {/* Brand Header */}
      <header className="fixed top-0 left-0 w-full p-6 md:p-10 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <span className="material-symbols-outlined text-cyan-400 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>movie</span>
            <span className="text-2xl font-headline font-bold tracking-tight text-white">CinéStream</span>
          </Link>
          <div className="hidden md:flex items-center gap-2">
            <div className="h-[1px] w-8 bg-white/20"></div>
            <span className="text-white/60 text-xs font-semibold tracking-[0.2em] uppercase">Premium Experience</span>
          </div>
        </div>
      </header>

      {/* Main Auth Container */}
      <main className="relative z-10 w-full max-w-[1200px] px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
        {/* Left Side: Editorial Content */}
        <div className="hidden md:flex flex-col gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              Now Streaming in 4K
            </div>
            <h1 className="text-5xl lg:text-7xl font-headline font-bold leading-[1.1] text-white">
              Experience <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Pure Cinema</span><br /> 
              At Home.
            </h1>
          </div>
          
          <p className="text-white/60 text-lg max-w-[420px] font-light leading-relaxed">
            Access an exclusive library of curated masterpieces, HDR streams, and behind-the-scenes content tailored for the true cinephile.
          </p>

          <div className="flex items-center gap-6 mt-4 pt-8 border-t border-white/10">
            <div className="flex -space-x-4">
              <img alt="User avatar" className="w-12 h-12 rounded-full border-[3px] border-[#11131c] object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" />
              <img alt="User avatar" className="w-12 h-12 rounded-full border-[3px] border-[#11131c] object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80" />
              <img alt="User avatar" className="w-12 h-12 rounded-full border-[3px] border-[#11131c] object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" />
              <div className="w-12 h-12 rounded-full border-[3px] border-[#11131c] bg-white/10 backdrop-blur-md flex items-center justify-center text-xs font-bold text-white">
                +2M
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-sm">Join the front row</span>
              <span className="text-white/50 text-[11px] font-semibold tracking-widest uppercase mt-0.5">Global Community</span>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="w-full max-w-[480px] mx-auto">
          <div className="bg-[#0b0f19]/80 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.6)] overflow-hidden">
            <div className="p-8 sm:p-12">
              <div className="mb-10 text-center sm:text-left">
                <h2 className="text-3xl font-headline font-bold text-white tracking-tight mb-2">Welcome Back</h2>
                <p className="text-white/50 text-base">Sign in to your premium account</p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px]">error</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2.5">
                  <label className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/50 ml-1 block">
                    Email Address
                  </label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-[45%] text-[20px] text-white/40 group-focus-within:text-cyan-400 transition-colors pointer-events-none">
                      mail
                    </span>
                    <input 
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-base placeholder:text-white/20 focus:bg-white/[0.05] focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all outline-none" 
                      placeholder="cinephile@stream.com" 
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/50 block">
                      Password
                    </label>
                    <Link className="text-[12px] text-cyan-400 hover:text-cyan-300 font-medium transition-colors" to="/register">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-[45%] text-[20px] text-white/40 group-focus-within:text-cyan-400 transition-colors pointer-events-none">
                      lock
                    </span>
                    <input 
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-14 text-white text-base placeholder:text-white/20 focus:bg-white/[0.05] focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all outline-none tracking-wider" 
                      placeholder="••••••••" 
                      type={showPass ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                    />
                    <button 
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white flex items-center justify-center transition-colors" 
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      aria-label="Toggle password visibility"
                    >
                      <span className="material-symbols-outlined text-[20px]">{showPass ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>

                <button 
                  className="w-full bg-cyan-400 text-cyan-950 text-base font-bold py-4 rounded-2xl hover:bg-cyan-300 active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] mt-2 flex justify-center items-center" 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                       <span className="w-5 h-5 border-2 border-cyan-950/30 border-t-cyan-950 rounded-full animate-spin"></span>
                       Signing In...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-7">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest text-white/40">
                  <span className="px-4 bg-[#0b0f19]">Or continue with</span>
                </div>
              </div>

              {/* Social Logins */}
              <div className="grid grid-cols-2 gap-4">
                <button type="button" className="group flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all">
                  <svg className="w-[18px] h-[18px] opacity-80 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span className="text-sm font-semibold text-white/90">Google</span>
                </button>
                <button type="button" className="group flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all">
                  <svg className="w-[18px] h-[18px] fill-white opacity-80 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.11-.48-2.07-.46-3.17 0-1.05.44-2.01.62-3.05-.29C3.12 15.65 2.61 9.94 6.1 7.26c1.6-1.22 3.14-1.12 4.09-.7l.45.22c.98.45 2.16.53 3.12-.05 1.95-1.18 3.51-.9 4.34.18-2.63 1.34-2.12 4.95.82 5.92-.81 2.22-1.84 4.51-3.61 6.35h.01a11.13 11.13 0 0 1-1.74 1.1h-1.53zm-3.5-14.86c.03-3.67 3.5-5.38 3.5-5.38a5.1 5.1 0 0 0-4.14 2.8c-1.3 2.1-.2 4.52 1.3 4.67-.1 1.83.94 2.15 1.48 2.28a3.94 3.94 0 0 1-2.14-4.37z" />
                  </svg>
                  <span className="text-sm font-semibold text-white/90">Apple</span>
                </button>
              </div>

              {/* Footer Link */}
              <div className="mt-8 text-center border-t border-white/5 pt-6">
                <p className="text-white/50 text-sm">
                  Don't have an account? 
                  <Link className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors ml-1.5" to="/register">Create Account</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Footer Links */}
      <footer className="fixed bottom-0 left-0 w-full p-6 md:p-8 hidden lg:block z-50 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-between items-center opacity-40 hover:opacity-100 transition-opacity pointer-events-auto">
          <div className="flex gap-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
            <Link className="hover:text-cyan-400 transition-colors" to="#">Privacy Policy</Link>
            <Link className="hover:text-cyan-400 transition-colors" to="#">Terms of Service</Link>
            <Link className="hover:text-cyan-400 transition-colors" to="#">Support</Link>
          </div>
          <div className="text-[11px] font-semibold text-white uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} CinéStream Inc.
          </div>
        </div>
      </footer>
    </div>
  )
}