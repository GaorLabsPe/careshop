
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
import { Product, StoreSettings, PickupLocation, WebCategoryMap, OdooSession, Order } from './types';
import { ShoppingBag, Rocket, Instagram, Facebook, Music2, MessageCircle } from 'lucide-react';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [pageParams, setPageParams] = useState<any>(null);
  const clickTimer = useRef<any>(null);
  const [clickCount, setClickCount] = useState(0);

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('care_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('store_settings');
    if (saved) return JSON.parse(saved);
    return {
      storeName: 'careShop',
      primaryColor: '#10B981',
      footerText: '© 2025 FARMACIAS TECNOLÓGICAS - TODOS LOS DERECHOS RESERVADOS',
      currencySymbol: 'S/',
      currencyCode: 'PEN',
      locale: 'es-PE',
      country: 'Perú',
      storeAddress: 'Sede Central Care',
      storeCity: 'Lima',
      storePhone: '01 444 5555',
      allowDelivery: true,
      allowPickup: true,
      mobilePayments: [
        { id: '1', name: 'Yape', identifier: '999888777', isActive: true },
        { id: '2', name: 'Plin', identifier: '999888777', isActive: true }
      ],
      whatsappNumber: '51999888777',
      socialInstagram: '',
      socialFacebook: '',
      socialTikTok: '',
      promoActive: true,
      promoTitle: '¡BIENVENIDO A TU SALUD DIGITAL!',
      promoImage: 'https://images.unsplash.com/photo-1576671081837-49000212a370?q=80&w=800',
      heroSlides: [
        { id: '1', badge: "DELIVERY EXPRESS", title: "Cuidamos tu", highlight: "Bienestar", subtitle: "FARMACIA CON TECNOLOGÍA", description: "Expertos en salud y confianza a un clic de distancia.", image: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=1600", cta: "Ver Catálogo", isActive: true }
      ]
    };
  });

  const [session, setSession] = useState<OdooSession | null>(() => {
    const saved = localStorage.getItem('odoo_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [publishedIds, setPublishedIds] = useState<number[]>(() => {
    const saved = localStorage.getItem('care_published_ids');
    return saved ? JSON.parse(saved) : [];
  });

  const [categoryMappings, setCategoryMappings] = useState<WebCategoryMap[]>(() => {
    const saved = localStorage.getItem('care_cat_mappings');
    return saved ? JSON.parse(saved) : [];
  });

  const [pickupLocations, setPickupLocations] = useState<PickupLocation[]>(() => {
    const saved = localStorage.getItem('care_pickup_locations');
    return saved ? JSON.parse(saved) : [{ id: '1', name: 'Sede Principal', address: 'Av. Principal 123', city: 'Lima', phone: '01 444 5555' }];
  });

  useEffect(() => {
    localStorage.setItem('store_settings', JSON.stringify(settings));
    localStorage.setItem('odoo_session', JSON.stringify(session));
    localStorage.setItem('care_orders', JSON.stringify(orders));
    localStorage.setItem('care_published_ids', JSON.stringify(publishedIds));
    localStorage.setItem('care_cat_mappings', JSON.stringify(categoryMappings));
    localStorage.setItem('care_pickup_locations', JSON.stringify(pickupLocations));
    document.documentElement.style.setProperty('--primary', settings.primaryColor);
    
    if (settings.promoActive && currentPage === 'home' && !sessionStorage.getItem('promo_shown')) {
      setIsPromoOpen(true);
      sessionStorage.setItem('promo_shown', 'true');
    }
  }, [settings, session, orders, publishedIds, categoryMappings, pickupLocations, currentPage]);

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
        <Navbar onCartToggle={() => setIsCartOpen(true)} onNavigate={navigate} onLogoClick={handleLogoClick} storeSettings={settings} />
        <main className="flex-1">
          {currentPage === 'home' && <Home onNavigate={navigate} externalProducts={MOCK_PRODUCTS} heroSlides={settings.heroSlides} storeSettings={settings} />}
          {currentPage === 'tracking' && <Tracking onNavigate={navigate} storeSettings={settings} orders={orders} />}
          {currentPage === 'product' && <ProductDetail productId={pageParams?.id} onNavigate={navigate} storeSettings={settings} />}
          {currentPage === 'checkout' && <Checkout onNavigate={navigate} pickupLocations={pickupLocations} settings={settings} onOrderCreated={(o) => setOrders([o, ...orders])} />}
          {currentPage === 'admin' && (
            <AdminDashboard 
              onNavigate={navigate} session={session} setSession={setSession}
              settings={settings} setSettings={setSettings}
              publishedIds={publishedIds} setPublishedIds={setPublishedIds}
              categoryMappings={categoryMappings} setCategoryMappings={setCategoryMappings}
              pickupLocations={pickupLocations} setPickupLocations={setPickupLocations}
              orders={orders} onUpdateOrder={(id, up) => setOrders(orders.map(o => o.id === id ? {...o, ...up} : o))}
            />
          )}
        </main>
        
        {currentPage !== 'admin' && (
          <footer className="bg-slate-950 text-slate-400 py-24 border-t border-slate-900">
            <div className="max-w-[1440px] mx-auto px-10">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                <div className="md:col-span-2 space-y-8">
                  <div className="flex items-center gap-5">
                    {settings.footerLogoUrl ? (
                      <img src={settings.footerLogoUrl} className="h-16 object-contain" alt={settings.storeName} />
                    ) : settings.logoUrl ? (
                      <img src={settings.logoUrl} className="h-16 object-contain brightness-0 invert" alt={settings.storeName} />
                    ) : (
                      <div className="p-4 rounded-3xl bg-emerald-500"><ShoppingBag className="text-white" size={32} /></div>
                    )}
                    <span className="text-4xl font-black text-white uppercase tracking-tighter italic">{settings.storeName}</span>
                  </div>
                  <p className="max-w-md text-sm leading-relaxed text-slate-500">Transformando la salud con tecnología avanzada y atención experta personalizada.</p>
                </div>
                <div className="space-y-8">
                  <h4 className="text-white font-black uppercase text-xs tracking-widest border-l-2 border-emerald-500 pl-4">Servicios</h4>
                  <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
                    <li><button onClick={() => navigate('home')} className="hover:text-emerald-500 transition-colors">Catálogo</button></li>
                    <li><button onClick={() => navigate('tracking')} className="hover:text-emerald-500 transition-colors">Rastrear Pedido</button></li>
                  </ul>
                </div>
                <div className="space-y-8">
                  <h4 className="text-white font-black uppercase text-xs tracking-widest border-l-2 border-emerald-500 pl-4">Asistencia</h4>
                  <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" className="flex items-center gap-4 p-5 bg-white/5 rounded-3xl hover:bg-white/10 transition-all group">
                    <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg"><MessageCircle size={24} /></div>
                    <div><span className="block text-xs font-black text-white uppercase tracking-widest">WhatsApp Directo</span></div>
                  </a>
                </div>
              </div>
              <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">{settings.footerText}</p>
                <a href="https://gaorsystem.vercel.app/" target="_blank" className="group flex items-center gap-5 p-8 bg-white/5 rounded-[3.5rem] border border-white/10 hover:bg-white/10 transition-all shadow-2xl relative overflow-hidden">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl group-hover:rotate-12 transition-transform"><Rocket size={26} className="text-indigo-600" /></div>
                  <div className="text-left"><span className="block text-xl font-black text-white tracking-tighter">GaorSystem</span><span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Global Pharma Platform</span></div>
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
