
import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import CartDrawer from './components/CartDrawer';
import AdminDashboard from './pages/AdminDashboard';
import PromoPopup from './components/PromoPopup';
import { CartProvider } from './context/CartContext';
import { PRODUCTS as MOCK_PRODUCTS } from './data/mockData';
import { OdooService } from './services/odooService';
import { Product, StoreSettings, PickupLocation, WebCategoryMap, OdooSession, HeroSlide } from './types';
import { ShoppingBag, Instagram, Facebook, Music2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [pageParams, setPageParams] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  
  const [clickCount, setClickCount] = useState(0);
  const clickTimer = useRef<any>(null);

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('store_settings');
    return saved ? JSON.parse(saved) : {
      storeName: 'careShop',
      logoUrl: '', 
      footerLogoUrl: '',
      primaryColor: '#10B981',
      footerText: '© 2024 CARESHOP FARMACIAS PERÚ',
      whatsappNumber: '999888777',
      socialInstagram: 'https://instagram.com',
      socialFacebook: 'https://facebook.com',
      socialTikTok: 'https://tiktok.com',
      allowDelivery: true,
      allowPickup: true,
      promoActive: true,
      promoTitle: '¡OFERTA DE BIENVENIDA!',
      promoImage: 'https://images.unsplash.com/photo-1576671081837-49000212a370?q=80&w=800',
      heroSlides: [
        {
          id: '1',
          badge: "Delivery Express 90min",
          title: "Cuidamos tu",
          highlight: "Energía Vital",
          subtitle: "SALUD Y CONFIANZA",
          description: "La farmacia del futuro hoy. Tecnología y calidez para que vivas al máximo cada día.",
          image: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=1600",
          cta: "Comprar Ofertas",
          isActive: true
        }
      ]
    };
  });

  const [session, setSession] = useState<OdooSession | null>(() => {
    const saved = localStorage.getItem('odoo_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [publishedIds, setPublishedIds] = useState<number[]>(() => {
    const saved = localStorage.getItem('published_ids');
    return saved ? JSON.parse(saved) : [];
  });

  const [categoryMappings, setCategoryMappings] = useState<WebCategoryMap[]>(() => {
    const saved = localStorage.getItem('category_mappings');
    return saved ? JSON.parse(saved) : [];
  });

  const [pickupLocations, setPickupLocations] = useState<PickupLocation[]>(() => {
    const saved = localStorage.getItem('pickup_locations');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Sede Principal Lima', address: 'Av. Arequipa 1234', city: 'Lima', phone: '01 444 5555' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('store_settings', JSON.stringify(settings));
    localStorage.setItem('odoo_session', JSON.stringify(session));
    localStorage.setItem('published_ids', JSON.stringify(publishedIds));
    localStorage.setItem('category_mappings', JSON.stringify(categoryMappings));
    localStorage.setItem('pickup_locations', JSON.stringify(pickupLocations));
    
    document.documentElement.style.setProperty('--primary', settings.primaryColor);
    document.documentElement.style.setProperty('--primary-hover', settings.primaryColor + 'dd');
  }, [settings, session, publishedIds, categoryMappings, pickupLocations]);

  useEffect(() => {
    if (settings.promoActive && currentPage === 'home') {
      const timer = setTimeout(() => setIsPromoOpen(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [settings.promoActive, currentPage]);

  useEffect(() => {
    const sync = async () => {
      if (session) {
        try {
          const odooProds = await OdooService.fetchProducts(session, categoryMappings, publishedIds);
          if (odooProds.length > 0) setProducts(odooProds);
        } catch (e) {
          console.error("Sync Error:", e);
        }
      }
    };
    sync();
  }, [session, categoryMappings, publishedIds]);

  const handleLogoClick = () => {
    setClickCount(prev => prev + 1);
    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => setClickCount(0), 1000);
    
    if (clickCount + 1 >= 4) {
      navigate('admin');
      setClickCount(0);
    }
  };

  const navigate = (page: string, params?: any) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home onNavigate={navigate} externalProducts={products} heroSlides={settings.heroSlides} />;
      case 'product': 
        const prod = products.find(p => p.id === pageParams?.id);
        return <ProductDetail productId={pageParams?.id} onNavigate={navigate} externalProduct={prod} />;
      case 'checkout': return <Checkout onNavigate={navigate} pickupLocations={pickupLocations} settings={settings} />;
      case 'admin': return (
        <AdminDashboard 
          onNavigate={navigate}
          session={session} setSession={setSession}
          settings={settings} setSettings={setSettings}
          publishedIds={publishedIds} setPublishedIds={setPublishedIds}
          categoryMappings={categoryMappings} setCategoryMappings={setCategoryMappings}
          pickupLocations={pickupLocations} setPickupLocations={setPickupLocations}
        />
      );
      default: return <Home onNavigate={navigate} externalProducts={products} heroSlides={settings.heroSlides} />;
    }
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar 
          onCartToggle={() => setIsCartOpen(true)} 
          onNavigate={navigate}
          onLogoClick={handleLogoClick}
          storeSettings={settings}
        />
        <main className="flex-1">{renderPage()}</main>
        
        {currentPage !== 'admin' && (
          <>
            <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
              <div className="max-w-[1440px] mx-auto px-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                  <div className="flex flex-col items-center md:items-start gap-6">
                    <div className="flex items-center gap-4">
                      {settings.footerLogoUrl ? (
                        <img src={settings.footerLogoUrl} className="h-10 object-contain grayscale opacity-60 hover:grayscale-0 transition-all" alt="Footer Logo" />
                      ) : (
                        <div className="p-2.5 rounded-xl" style={{ backgroundColor: settings.primaryColor }}>
                          <ShoppingBag className="text-white" size={24} />
                        </div>
                      )}
                      <span className="text-2xl font-bold text-white uppercase tracking-tighter">{settings.storeName}</span>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] max-w-xs text-center md:text-left leading-relaxed">{settings.footerText}</p>
                    <div className="flex gap-4">
                      {settings.socialInstagram && <a href={settings.socialInstagram} target="_blank" className="hover:text-white transition-colors"><Instagram size={20} /></a>}
                      {settings.socialFacebook && <a href={settings.socialFacebook} target="_blank" className="hover:text-white transition-colors"><Facebook size={20} /></a>}
                      {settings.socialTikTok && <a href={settings.socialTikTok} target="_blank" className="hover:text-white transition-colors"><Music2 size={20} /></a>}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center md:items-end gap-6">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Tecnología Farmacéutica Segura</p>
                    <div className="flex gap-8 grayscale opacity-40 hover:opacity-100 transition-opacity">
                       <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-6" alt="Visa" />
                       <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
                    </div>
                  </div>
                </div>
              </div>
            </footer>

            {/* WhatsApp Floating Button */}
            {settings.whatsappNumber && (
              <a 
                href={`https://wa.me/${settings.whatsappNumber}?text=Hola,%20necesito%20ayuda%20con%20mi%20pedido`}
                target="_blank"
                rel="noreferrer"
                className="fixed bottom-10 left-10 z-[60] bg-[#25D366] text-white w-20 h-20 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all group"
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.417-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.305 1.652zm6.599-3.835c1.516.893 3.188 1.364 4.891 1.365 5.398 0 9.79-4.393 9.793-9.793 0-2.614-1.017-5.072-2.865-6.922-1.848-1.85-4.305-2.867-6.919-2.867-5.398 0-9.791 4.393-9.793 9.793 0 1.729.456 3.419 1.321 4.908l-.995 3.635 3.72-.976zm11.381-7.103c-.311-.156-1.841-.908-2.126-1.012-.285-.104-.492-.156-.7.156-.207.312-.803 1.012-.985 1.22-.181.208-.363.234-.674.078-.311-.156-1.314-.484-2.503-1.545-.925-.825-1.549-1.844-1.73-2.156-.181-.312-.019-.481.136-.636.141-.139.311-.364.466-.546.156-.182.207-.312.311-.52.104-.208.052-.39-.026-.546-.078-.156-.7-1.688-.959-2.312-.252-.607-.51-.524-.7-.534-.18-.01-.388-.012-.597-.012-.208 0-.544.078-.83.39-.285.312-1.089 1.066-1.089 2.6 0 1.533 1.115 3.016 1.271 3.224.156.208 2.192 3.348 5.312 4.698.742.32 1.32.512 1.772.656.745.236 1.423.203 1.958.123.596-.088 1.841-.753 2.1-1.481.259-.727.259-1.351.181-1.481-.078-.13-.285-.208-.596-.364z"/>
                  </svg>
                </div>
                <div className="absolute left-24 bg-white text-slate-800 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all">
                  ¿Dudas o Consultas?
                </div>
              </a>
            )}
          </>
        )}

        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={() => { setIsCartOpen(false); navigate('checkout'); }} />
        <PromoPopup isOpen={isPromoOpen} onClose={() => setIsPromoOpen(false)} settings={settings} />
      </div>
    </CartProvider>
  );
};

const App: React.FC = () => <AppContent />;
export default App;
