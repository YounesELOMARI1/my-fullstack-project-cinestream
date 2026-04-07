import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user } = useAuth()

  return (
    <div className="pt-24 px-8 md:px-16 pb-16 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Mon Profil</h1>
      <div className="glass-effect rounded-2xl border border-white/10 p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-[#00daf3]/20 border-2 border-[#00daf3]/40 flex items-center justify-center text-[#00daf3] font-bold text-3xl">
            {user?.name[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-white/50">{user?.email}</p>
            <span className={`text-xs px-3 py-1 rounded-full mt-2 inline-block font-medium ${
              user?.role === 'admin'
                ? 'bg-[#ffb950]/20 text-[#ffb950] border border-[#ffb950]/30'
                : 'bg-[#00daf3]/20 text-[#00daf3] border border-[#00daf3]/30'
            }`}>
              {user?.role === 'admin' ? '👑 Admin' : '🎬 Utilisateur'}
            </span>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 space-y-4">
          {[
            { label: 'Nom', value: user?.name },
            { label: 'Email', value: user?.email },
            { label: 'Rôle', value: user?.role },
            { label: 'Membre depuis', value: new Date(user?.created_at).toLocaleDateString('fr-FR') },
          ].map(item => (
            <div key={item.label} className="flex justify-between items-center py-2">
              <span className="text-white/40 text-sm">{item.label}</span>
              <span className="text-white font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}