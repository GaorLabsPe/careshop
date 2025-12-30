
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import AdminDashboard from './pages/AdminDashboard';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import AIChatBot from './components/AIChatBot';
import CartDrawer from './components/CartDrawer';
import { CartProvider } from './context/CartContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { ShieldCheck, ArrowRight, ShoppingBag, Globe, Settings, Lock } from 'lucide-react';
import { User as UserType } from './types';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [pageParams, setPageParams] = useState<any>(null);
  const [session, setSession] = useState<UserType | null>(() => {
    const saved = localStorage.getItem('saas_session');
    return saved ? JSON.parse(saved) : null;
  });
  
  const { config } = useStore();

  useEffect(() => {
    if (session) {
      localStorage.setItem('saas_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('saas_session');
    }
  }, [session]);

  const navigate = (page: string, params?: any) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo(0, 0);
  };

  const handleAdminAccess = () => {
    if (session?.role === 'superadmin') {
      navigate('admin');
    } else {
      navigate('login');
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={navigate} />;
      case 'product':
        return <ProductDetail productId={pageParams?.id} onNavigate={navigate} />;
      case 'login':
        return <Login onLogin={(user) => { setSession(user); navigate('admin'); }} onNavigate={navigate} />;
      case 'admin':
        if (session?.role !== 'superadmin') return <Login onLogin={(user) => { setSession(user); navigate('admin'); }} onNavigate={navigate} />;
        return <AdminDashboard onLogout={() => { setSession(null); navigate('home'); }} />;
      case 'checkout':
        return <Checkout onNavigate={navigate} />;
      case 'shop':
        return (
          <div className="py-20 px-6 text-center space-y-6">
            <h1 className="text-4xl font-bold text-slate-900 tracking-tighter uppercase font-ubuntu">Catálogo {config.name}</h1>
            <p className="text-slate-400 font-medium italic">Sincronizando con Odoo ERP...</p>
            <button onClick={() => navigate('home')} className="bg-primary text-white px-10 py-4 rounded-2xl font-bold uppercase tracking-widest shadow-lg text-xs">Volver al Inicio</button>
          </div>
        );
      default:
        return <Home onNavigate={navigate} />;
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {currentPage !== 'login' && currentPage !== 'admin' && (
        <Navbar 
          onCartToggle={() => setIsCartOpen(true)} 
          onNavigate={navigate}
        />
      )}
      
      <main className="flex-1">
        {renderPage()}
      </main>

      {/* Floating Admin Button - SuperAdmin Entry Point */}
      {currentPage !== 'login' && currentPage !== 'admin' && (
        <button 
          onClick={handleAdminAccess}
          className="fixed left-6 bottom-6 bg-slate-900 text-white p-4 rounded-full shadow-2xl z-[70] hover:bg-emerald-500 transition-all border-2 border-white group"
        >
          {session ? <Settings size={20} /> : <Lock size={20} className="group-hover:animate-bounce" />}
          {!session && (
            <span className="absolute left-full ml-4 bg-slate-900 text-white text-[8px] font-black py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-widest">
              Portal Admin
            </span>
          )}
        </button>
      )}

      {currentPage !== 'login' && currentPage !== 'admin' && (
        <footer className="bg-slate-950 text-slate-400 py-8 border-t border-slate-900">
          <div className="max-w-[1440px] mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="bg-primary p-1.5 rounded-lg">
                    <ShoppingBag className="text-white" size={16} />
                  </div>
                  <span className="text-lg font-bold text-white tracking-tighter font-ubuntu uppercase">{config.name}</span>
                </div>
                <p className="text-[11px] leading-tight opacity-60">SaaS Pharmacy Solutions powered by Odoo.</p>
              </div>
              <div className="grid grid-cols-2 gap-4 col-span-1 lg:col-span-1">
                <div className="space-y-2">
                  <h4 className="text-white font-bold text-[9px] uppercase tracking-widest text-primary">Tienda</h4>
                  <ul className="space-y-1 text-[11px]">
                    <li className="hover:text-white cursor-pointer">Medicinas</li>
                    <li className="hover:text-white cursor-pointer">Recetas</li>
                  </ul>
                </div>
              </div>
              <div className="lg:col-span-2 space-y-3">
                <h4 className="text-white font-bold text-[9px] uppercase tracking-widest">Suscríbete</h4>
                <div className="flex gap-2 max-w-sm">
                  <input 
                    type="email" 
                    placeholder="Email"
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white flex-1 focus:ring-1 focus:ring-primary outline-none"
                  />
                  <button className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-[10px] uppercase">Unirme</button>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[8px] font-bold uppercase tracking-widest">
              <div className="text-center sm:text-left space-y-1">
                <p className="text-white">© 2024 {config.name.toUpperCase()} PERÚ</p>
                <p className="opacity-40">
                  Desarrollado por <a href="https://gaorsystem.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-hover transition-colors inline-flex items-center gap-1 font-black">
                    <Globe size={10} /> GAORSYSTEM PERU
                  </a>
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <span className="flex items-center gap-1.5 text-emerald-500">
                  <ShieldCheck size={10} /> 100% SEGURO
                </span>
                <span className="opacity-40 uppercase">Odoo XML-RPC Enabled</span>
              </div>
            </div>
          </div>
        </footer>
      )}

      {currentPage !== 'login' && currentPage !== 'admin' && <AIChatBot />}
      
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onCheckout={() => {
          setIsCartOpen(false);
          navigate('checkout');
        }}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </StoreProvider>
  );
};

export default App;
