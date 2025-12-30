
import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, ArrowRight, RefreshCw, ShoppingBag } from 'lucide-react';

interface LoginProps {
  onLogin: (user: any) => void;
  onNavigate: (page: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulación de autenticación SuperAdmin
    setTimeout(() => {
      if (email === 'admin@careshop.com' && password === 'careshop2024') {
        onLogin({ email, role: 'superadmin' });
      } else {
        setError('Credenciales de administrador incorrectas');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[3.5rem] shadow-2xl space-y-8">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-emerald-500 text-white rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20 rotate-3">
              <ShoppingBag size={40} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tighter uppercase font-ubuntu">careshop <span className="text-emerald-500">SaaS</span></h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Portal de Super Administrador</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Email Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@careshop.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-14 py-4 text-sm text-white focus:border-emerald-500 outline-none transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Llave de Acceso</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-14 py-4 text-sm text-white focus:border-emerald-500 outline-none transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center gap-3 text-rose-500 text-xs font-bold">
                <ShieldCheck size={16} />
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 transition-all active:scale-95"
            >
              {isLoading ? <RefreshCw className="animate-spin" size={20} /> : <><ShieldCheck size={20} /> Autenticar</>}
            </button>
          </form>

          <button 
            onClick={() => onNavigate('home')}
            className="w-full text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            Volver a la Tienda <ArrowRight size={12} />
          </button>
        </div>
        <p className="mt-8 text-center text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">GAORSYSTEM SECURITY ENGINE</p>
      </div>
    </div>
  );
};

export default Login;
