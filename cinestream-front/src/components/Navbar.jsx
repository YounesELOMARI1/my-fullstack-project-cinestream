import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [search, setSearch] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  // Navigation Links Definition
  const mainLinks = [
    { path: '/home', label: 'Accueil' },
    { path: '/movies', label: 'Films' },
    { path: '/series', label: 'Séries' }
  ];

  if (user) {
    mainLinks.push({ path: '/watchlist', label: 'Ma liste' });
  }

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0b0f19]/95 backdrop-blur-xl border-b border-white/5 shadow-2xl' : 'bg-transparent bg-gradient-to-b from-[#0b0f19]/90 via-[#0b0f19]/50 to-transparent'}`}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-4 flex items-center justify-between gap-6">
        
        {/* Left: Brand & Links */}
        <div className="flex items-center gap-10">
          <Link to="/home" className="flex items-center gap-2 md:gap-3 shrink-0 z-50">
            <span className="material-symbols-outlined text-cyan-400 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>movie</span>
            <span className="text-2xl md:text-3xl font-headline font-bold tracking-tight text-[#00daf3]">
              Ciné<span className="text-white">Stream</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8 text-[15px] font-medium mt-1">
            {mainLinks.map(({ path, label }) => (
              <Link 
                key={path} 
                to={path}
                className={`relative group transition-colors py-1 ${isActive(path) ? 'text-white' : 'text-white/60 hover:text-white'}`}
              >
                {label}
                {/* Active Indicator & Hover Underline */}
                <span className={`absolute -bottom-1 left-0 h-[2px] bg-cyan-400 transition-all duration-300 ease-out ${isActive(path) ? 'w-full shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'w-0 group-hover:w-full opacity-50'}`}></span>
              </Link>
            ))}
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-[#ffb950] hover:text-[#ffc779] transition-colors relative group py-1">
                Admin
                <span className="absolute -bottom-1 left-0 h-[2px] bg-[#ffb950] w-0 group-hover:w-full transition-all duration-300 opacity-50"></span>
              </Link>
            )}
          </div>
        </div>

        {/* Right: Search & Profile */}
        <div className="flex items-center gap-6 justify-end flex-1">
          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden lg:block flex-1 max-w-[320px]">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-[20px] group-focus-within:text-cyan-400 transition-colors">
                search
              </span>
              <input
                type="text" 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher des films, séries…"
                className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-11 pr-5 text-sm text-white placeholder-white/40 focus:outline-none focus:bg-white/10 focus:border-cyan-400/50 transition-all shadow-inner focus:shadow-[0_0_15px_rgba(34,211,238,0.15)]"
              />
            </div>
          </form>

          {/* User Profile / Mobile Toggle */}
          <div className="flex items-center gap-4">
            {user ? (
              // Profile Dropdown Setup
              <div className="relative hidden lg:block" ref={profileRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 active:scale-95 transition-transform"
                >
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 border-2 border-cyan-400/30 flex items-center justify-center text-cyan-400 font-bold text-lg hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all overflow-hidden bg-[#11131c]">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className={`material-symbols-outlined text-white/50 text-[24px] transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : 'rotate-0'}`}>
                    arrow_drop_down
                  </span>
                </button>

                {/* Dropdown Menu */}
                <div 
                  className={`absolute right-0 mt-4 w-56 bg-[#0b0f19]/95 backdrop-blur-3xl border border-white/5 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300 origin-top-right ${isProfileOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}
                >
                  <div className="p-4 border-b border-white/5">
                    <p className="text-white font-bold truncate">{user.name}</p>
                    <p className="text-white/40 text-xs truncate">{user.email || 'Premium Member'}</p>
                  </div>
                  <div className="p-2 flex flex-col gap-1">
                    <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                      <span className="material-symbols-outlined text-[18px]">person</span>
                      Profil
                    </Link>
                    <Link to="#" className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                      <span className="material-symbols-outlined text-[18px]">settings</span>
                      Paramètres
                    </Link>
                  </div>
                  <div className="p-2 border-t border-white/5">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      Se déconnecter
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login"
                className="hidden lg:flex bg-cyan-400 hover:bg-cyan-300 text-cyan-950 font-bold px-6 py-2.5 rounded-full text-sm transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]">
                Connexion
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button 
              className="lg:hidden text-white/80 hover:text-white z-50 p-2 relative transition-transform active:scale-95"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="material-symbols-outlined text-[32px]">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sliding Menu */}
      <div 
        className={`fixed inset-0 bg-[#0b0f19]/98 backdrop-blur-3xl z-40 lg:hidden overflow-y-auto transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-[100%]'}`}
      >
        <div className="px-6 pt-28 pb-12 flex flex-col min-h-screen">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="mb-10">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-white/40 text-[20px]">
                search
              </span>
              <input
                type="text" 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher des films, séries…"
                className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-14 pr-6 text-base text-white placeholder-white/40 focus:outline-none focus:bg-white/10 focus:border-cyan-400/50 transition-all font-body"
              />
            </div>
          </form>

          {/* Mobile Navigation Links */}
          <div className="flex flex-col gap-3">
            {mainLinks.map(({ path, label }) => (
              <Link 
                key={path} 
                to={path}
                className={`py-4 px-6 rounded-2xl text-xl font-medium transition-all flex items-center justify-between ${isActive(path) ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]' : 'text-white/70 hover:bg-white/5 hover:text-white border border-transparent'}`}
              >
                {label}
                {isActive(path) && <span className="material-symbols-outlined">chevron_right</span>}
              </Link>
            ))}
            {user?.role === 'admin' && (
               <Link 
                 to="/admin"
                 className="py-4 px-6 mt-2 rounded-2xl text-xl font-medium text-[#ffb950] transition-all flex items-center justify-between hover:bg-white/5 border border-transparent"
               >
                 Admin
               </Link>
            )}
          </div>

          <div className="mt-auto pt-12">
            {user ? (
              <div className="border border-white/10 rounded-3xl bg-[#11131c]/50 p-6 shadow-inner">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 font-bold text-2xl flex-shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-white font-bold text-lg truncate">{user.name}</p>
                      <p className="text-white/40 text-sm truncate">{user.email || 'Premium Member'}</p>
                    </div>
                 </div>
                 <div className="flex flex-col gap-2">
                    <Link to="/profile" className="flex items-center gap-3 py-3.5 px-4 rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition-all font-medium">
                      <span className="material-symbols-outlined">person</span> Profil
                    </Link>
                    <Link to="#" className="flex items-center gap-3 py-3.5 px-4 rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition-all font-medium">
                      <span className="material-symbols-outlined">settings</span> Paramètres
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-3 py-3.5 px-4 mt-2 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-left w-full font-medium shadow-[0_0_10px_rgba(239,68,68,0.05)]">
                      <span className="material-symbols-outlined">logout</span> Se déconnecter
                    </button>
                 </div>
              </div>
            ) : (
              <Link to="/login"
                className="w-full flex justify-center bg-cyan-400 text-cyan-950 font-bold px-6 py-4 rounded-full text-lg transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                Connexion
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}