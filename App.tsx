
import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Tracking from './pages/Tracking';
import CartDrawer from './components/CartDrawer';
import AdminDashboard from './pages/AdminDashboard';
import PromoPopup from './components/PromoPopup';
import { CartProvider } from './context/CartContext';
import { PRODUCTS as MOCK_PRODUCTS } from './data/mockData';
import { Product, StoreSettings, PickupLocation, WebCategoryMap, OdooSession, Order, OrderStatus } from './types';
import { ShoppingBag, Rocket, Instagram, Facebook, Music2, MessageCircle } from 'lucide-react';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [pageParams, setPageParams] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  
  const [clickCount, setClickCount] = useState(0);
  const clickTimer = useRef<any>(null);

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('care_orders');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('store_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) { }
    
    return {
      storeName: 'careShop',
      logoUrl: '', 
      footerLogoUrl: '',
      primaryColor: '#10B981',
      footerText: '© 2024 CARESHOP FARMACIAS - TODOS LOS DERECHOS RESERVADOS',
      currencySymbol: 'S/',
      currencyCode: 'PEN',
      locale: 'es-PE',
      mobilePayments: [
        { id: '1', name: 'Yape', identifier: '999888777', qrCodeUrl: '', isActive: true },
        { id: '2', name: 'Plin', identifier: '999888777', qrCodeUrl: '', isActive: true }
      ],
      whatsappNumber: '51999888777',
      socialInstagram: '',
      socialFacebook: '',
      socialTikTok: '',
      allowDelivery: true,
      allowPickup: true,
      promoActive: true,
      promoTitle: '¡OFERTA DE BIENVENIDA!',
      promoImage: 'https://images.unsplash.com/photo-1576671081837-49000212a370?q=80&w=800',
      heroSlides: [
        {
          id: '1',
          badge: "DELIVERY EXPRESS 90MIN",
          title: "Cuidamos tu",
          highlight: "Bienestar",
          subtitle: "SALUD Y CONFIANZA",
          description: "La farmacia del futuro hoy. Tecnología y calidez para tu salud.",
          image: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=1600",
          cta: "Comprar Ofertas",
          isActive: true
        }
      ]
    };
  });

  const [session, setSession] = useState<OdooSession | null>(() => {
    try {
      const saved = localStorage.getItem('odoo_session');
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  });

  const [publishedIds, setPublishedIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('care_published_ids');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [pickupLocations, setPickupLocations] = useState<PickupLocation[]>(() => {
    try {
      const saved = localStorage.getItem('care_pickup_locations');
      return saved ? JSON.parse(saved) : [
        { id: '1', name: 'Sede Principal', address: 'Av. Salud 123', city: 'Lima', phone: '01 444 5555' }
      ];
    } catch (e) { return []; }
  });

  const [categoryMappings, setCategoryMappings] = useState<WebCategoryMap[]>([]);

  // Efecto de persistencia global
  useEffect(() => {
    localStorage.setItem('store_settings', JSON.stringify(settings));
    localStorage.setItem('odoo_session', JSON.stringify(session));
    localStorage.setItem('care_orders', JSON.stringify(orders));
    localStorage.setItem('care_published_ids', JSON.stringify(publishedIds));
    localStorage.setItem('care_pickup_locations', JSON.stringify(pickupLocations));
    document.documentElement.style.setProperty('--primary', settings.primaryColor);
  }, [settings, session, orders, publishedIds, pickupLocations]);

  const handleLogoClick = () => {
    setClickCount(prev => prev + 1);
    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => setClickCount(0), 1000);
    if (clickCount + 1 >= 4) { setCurrentPage('admin'); setClickCount(0); }
  };

  const navigate = (page: string, params?: any) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo(0, 0);
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-white flex flex-col font-cabin">
        <Navbar 
          onCartToggle={() => setIsCartOpen(true)} 
          onNavigate={navigate}
          onLogoClick={handleLogoClick}
          storeSettings={settings}
        />
        <main className="flex-1">
          {currentPage === 'home' && <Home onNavigate={navigate} externalProducts={products} heroSlides={settings.heroSlides} storeSettings={settings} />}
          {currentPage === 'tracking' && <Tracking onNavigate={navigate} storeSettings={settings} orders={orders} />}
          {currentPage === 'product' && <ProductDetail productId={pageParams?.id} onNavigate={navigate} storeSettings={settings} />}
          {currentPage === 'checkout' && <Checkout onNavigate={navigate} pickupLocations={pickupLocations} settings={settings} onOrderCreated={(o) => setOrders([o, ...orders])} />}
          {currentPage === 'admin' && (
            <AdminDashboard 
              onNavigate={navigate}
              session={session} setSession={setSession}
              settings={settings} setSettings={setSettings}
              publishedIds={publishedIds} setPublishedIds={setPublishedIds}
              categoryMappings={categoryMappings} setCategoryMappings={setCategoryMappings}
              pickupLocations={pickupLocations} setPickupLocations={setPickupLocations}
              orders={orders} onUpdateOrder={(id, up) => setOrders(orders.map(o => o.id === id ? {...o, ...up} : o))}
            />
          )}
        </main>
        
        {currentPage !== 'admin' && (
          <footer className="bg-slate-950 text-slate-400 py-20 border-t border-slate-900">
            <div className="max-w-[1440px] mx-auto px-10">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <div className="md:col-span-2 space-y-8">
                  <div className="flex items-center gap-4">
                    {settings.footerLogoUrl ? (
                      <img src={settings.footerLogoUrl} className="h-12 object-contain" alt="Footer Logo" />
                    ) : (
                      <div className="p-3 rounded-2xl" style={{ backgroundColor: settings.primaryColor }}>
                        <ShoppingBag className="text-white" size={24} />
                      </div>
                    )}
                    <span className="text-3xl font-bold text-white uppercase tracking-tighter">{settings.storeName}</span>
                  </div>
                  <p className="text-sm max-w-sm leading-relaxed">{settings.footerText}</p>
                  <div className="flex gap-4">
                    {settings.socialInstagram && <a href={settings.socialInstagram} target="_blank" className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"><Instagram size={20} /></a>}
                    {settings.socialFacebook && <a href={settings.socialFacebook} target="_blank" className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"><Facebook size={20} /></a>}
                    {settings.socialTikTok && <a href={settings.socialTikTok} target="_blank" className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"><Music2 size={20} /></a>}
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h4 className="text-white font-black uppercase text-xs tracking-widest">Atención</h4>
                  <ul className="space-y-3 text-sm">
                    <li><button onClick={() => navigate('home')} className="hover:text-white transition-colors">Inicio</button></li>
                    <li><button onClick={() => navigate('tracking')} className="hover:text-white transition-colors">Rastreo</button></li>
                    <li><button className="hover:text-white transition-colors">Farmacias</button></li>
                  </ul>
                </div>

                <div className="space-y-6">
                  <h4 className="text-white font-black uppercase text-xs tracking-widest">Soporte</h4>
                  <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg"><MessageCircle size={20} /></div>
                    <div className="text-left">
                      <span className="block text-xs font-black text-white">Central WhatsApp</span>
                      <span className="text-[10px] text-emerald-400 font-bold">Respuesta inmediata</span>
                    </div>
                  </a>
                </div>
              </div>

              <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">{settings.footerText}</p>
                <a href="https://gaorsystem.vercel.app/" target="_blank" rel="noreferrer" className="group flex items-center gap-3 p-6 bg-white/5 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-xl"><Rocket size={20} className="text-indigo-600" /></div>
                  <div className="text-left">
                    <span className="block text-lg font-black text-white leading-none">GaorSystem</span>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Global Platform</span>
                  </div>
                </a>
              </div>
            </div>
          </footer>
        )}
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={() => { setIsCartOpen(false); navigate('checkout'); }} />
        <PromoPopup isOpen={isPromoOpen} onClose={() => setIsPromoOpen(false)} settings={settings} />
      </div>
    </CartProvider>
  );
};

const App: React.FC = () => <AppContent />;
export default App;
