
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import AIChatBot from './components/AIChatBot';
import CartDrawer from './components/CartDrawer';
import { CartProvider } from './context/CartContext';
import { ShoppingBag, Globe, ShieldCheck } from 'lucide-react';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [pageParams, setPageParams] = useState<any>(null);

  const navigate = (page: string, params?: any) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={navigate} />;
      case 'product':
        return <ProductDetail productId={pageParams?.id} onNavigate={navigate} />;
      case 'checkout':
        return <Checkout onNavigate={navigate} />;
      case 'shop':
        return (
          <div className="py-20 px-6 text-center space-y-6">
            <h1 className="text-4xl font-bold text-slate-900 tracking-tighter uppercase font-ubuntu">Catálogo Completo</h1>
            <p className="text-slate-400 font-medium italic">Explora nuestra amplia variedad de productos de salud.</p>
            <button onClick={() => navigate('home')} className="bg-[#10B981] text-white px-10 py-4 rounded-2xl font-bold uppercase tracking-widest shadow-lg text-xs">Volver al Inicio</button>
          </div>
        );
      default:
        return <Home onNavigate={navigate} />;
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar 
        onCartToggle={() => setIsCartOpen(true)} 
        onNavigate={navigate}
      />
      
      <main className="flex-1">
        {renderPage()}
      </main>

      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 items-start">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-[#10B981] p-2 rounded-xl">
                  <ShoppingBag className="text-white" size={20} />
                </div>
                <span className="text-2xl font-bold text-white tracking-tighter font-ubuntu uppercase">care<span className="text-[#10B981]">shop</span></span>
              </div>
              <p className="text-xs leading-relaxed opacity-60">Tu farmacia de confianza con entrega express y asesoría profesional en cada compra.</p>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-white font-bold text-xs uppercase tracking-widest">Secciones</h4>
              <ul className="space-y-2 text-xs">
                <li className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('shop')}>Medicamentos</li>
                <li className="hover:text-white cursor-pointer transition-colors">Dermocosmética</li>
                <li className="hover:text-white cursor-pointer transition-colors">Vitaminas</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-bold text-xs uppercase tracking-widest">Ayuda</h4>
              <ul className="space-y-2 text-xs">
                <li className="hover:text-white cursor-pointer transition-colors">Seguimiento de Pedido</li>
                <li className="hover:text-white cursor-pointer transition-colors">Preguntas Frecuentes</li>
                <li className="hover:text-white cursor-pointer transition-colors">Términos y Condiciones</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-bold text-xs uppercase tracking-widest">Boletín</h4>
              <p className="text-[10px] opacity-50 uppercase tracking-wider">Recibe ofertas exclusivas de salud.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Tu email"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white flex-1 focus:ring-1 focus:ring-[#10B981] outline-none"
                />
                <button className="bg-[#10B981] text-white px-4 py-3 rounded-xl font-bold text-[10px] uppercase">Ok</button>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest">
            <div className="text-center sm:text-left space-y-1">
              <p className="text-white">© 2024 CARESHOP FARMACIAS PERÚ</p>
              <p className="opacity-40">Desarrollado con tecnología GAORSYSTEM</p>
            </div>
            <div className="flex gap-6 items-center">
              <span className="flex items-center gap-2 text-[#10B981]">
                <ShieldCheck size={14} /> COMPRA 100% SEGURA
              </span>
              <div className="flex gap-4 grayscale opacity-50">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
              </div>
            </div>
          </div>
        </div>
      </footer>

      <AIChatBot />
      
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
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
};

export default App;
