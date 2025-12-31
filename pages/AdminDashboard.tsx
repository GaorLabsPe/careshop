
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Database, Palette, Layers, CreditCard, MapPin, X, Plus, Trash2, Check, 
  Search, RefreshCw, Sparkles, Trash, ClipboardList, Globe, Flag, 
  Image as ImageIcon, Upload, QrCode, Settings2, ArrowRight, Layout, 
  Camera, Instagram, Facebook, Music2, MessageCircle, Truck, Store, Info
} from 'lucide-react';
import { OdooService } from '../services/odooService';
import { OdooSession, StoreSettings, PickupLocation, WebCategoryMap, Category, Order, HeroSlide, OrderStatus } from '../types';
import { PRODUCTS as MOCK_PRODUCTS } from '../data/mockData';

const LATAM_COUNTRIES = [
  { name: 'Perú', code: 'PEN', symbol: 'S/', locale: 'es-PE' },
  { name: 'México', code: 'MXN', symbol: '$', locale: 'es-MX' },
  { name: 'Colombia', code: 'COP', symbol: '$', locale: 'es-CO' },
  { name: 'Chile', code: 'CLP', symbol: '$', locale: 'es-CL' },
  { name: 'Argentina', code: 'ARS', symbol: '$', locale: 'es-AR' },
  { name: 'Bolivia', code: 'BOB', symbol: 'Bs.', locale: 'es-BO' },
  { name: 'Ecuador', code: 'USD', symbol: '$', locale: 'es-EC' },
  { name: 'Paraguay', code: 'PYG', symbol: 'Gs.', locale: 'es-PY' },
  { name: 'Uruguay', code: 'UYU', symbol: '$', locale: 'es-UY' },
  { name: 'Costa Rica', code: 'CRC', symbol: '₡', locale: 'es-CR' },
  { name: 'Panamá', code: 'PAB', symbol: 'B/.', locale: 'es-PA' },
  { name: 'Guatemala', code: 'GTQ', symbol: 'Q', locale: 'es-GT' },
  { name: 'El Salvador', code: 'USD', symbol: '$', locale: 'es-SV' },
  { name: 'Honduras', code: 'HNL', symbol: 'L', locale: 'es-HN' },
  { name: 'Nicaragua', code: 'NIO', symbol: 'C$', locale: 'es-NI' },
  { name: 'Rep. Dominicana', code: 'DOP', symbol: 'RD$', locale: 'es-DO' },
];

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
  session: OdooSession | null;
  setSession: (s: OdooSession | null) => void;
  settings: StoreSettings;
  setSettings: (s: StoreSettings) => void;
  publishedIds: number[];
  setPublishedIds: (p: number[]) => void;
  categoryMappings: WebCategoryMap[];
  setCategoryMappings: (m: WebCategoryMap[]) => void;
  pickupLocations: PickupLocation[];
  setPickupLocations: (l: PickupLocation[]) => void;
  orders: Order[];
  onUpdateOrder: (id: string, updates: Partial<Order>) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate, session, setSession, settings, setSettings,
  publishedIds, setPublishedIds, categoryMappings, setCategoryMappings,
  pickupLocations, setPickupLocations, orders, onUpdateOrder
}) => {
  const [activeTab, setActiveTab] = useState('erp');
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [odooCategories, setOdooCategories] = useState<{id: number, name: string}[]>([]);
  const [odooProducts, setOdooProducts] = useState<any[]>([]);
  
  const [form, setForm] = useState({
    url: session?.url || '',
    db: session?.db || '',
    user: session?.username || '',
    pass: session?.apiKey || ''
  });

  const connectERP = async () => {
    setIsLoading(true);
    try {
      const { uid, client } = await OdooService.connect(form.url, form.db, form.user, form.pass);
      const comps = await client.execute(uid, form.pass, 'res.company', 'search_read', [[]], { fields: ['id', 'name'] });
      setCompanies(comps);
      const cats = await client.execute(uid, form.pass, 'product.category', 'search_read', [[]], { fields: ['id', 'name'] });
      setOdooCategories(cats);
      // Cargar productos iniciales para el catálogo
      const prods = await client.execute(uid, form.pass, 'product.product', 'search_read', [['sale_ok', '=', true]], { fields: ['id', 'name', 'list_price'] });
      setOdooProducts(prods);
    } catch (e: any) { alert(e.message || "Error de conexión"); }
    finally { setIsLoading(false); }
  };

  const selectCompany = (companyId: number) => {
    setSession({ ...form, username: form.user, apiKey: form.pass, uid: 0, companyId, useProxy: true });
    alert("Empresa vinculada correctamente.");
  };

  const handleCountryChange = (countryName: string) => {
    const data = LATAM_COUNTRIES.find(c => c.name === countryName);
    if (data) {
      setSettings({
        ...settings,
        country: data.name,
        currencyCode: data.code,
        currencySymbol: data.symbol,
        locale: data.locale
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const updateMapping = (odooId: number, webCat: Category) => {
    const exists = categoryMappings.find(m => m.odooCategoryId === odooId);
    if (exists) {
      setCategoryMappings(categoryMappings.map(m => m.odooCategoryId === odooId ? { ...m, webCategory: webCat } : m));
    } else {
      setCategoryMappings([...categoryMappings, { odooCategoryId: odooId, webCategory: webCat }]);
    }
  };

  const updateSlide = (id: string, updates: Partial<HeroSlide>) => {
    setSettings({
      ...settings,
      heroSlides: settings.heroSlides.map(s => s.id === id ? { ...s, ...updates } : s)
    });
  };

  const filteredItems = useMemo(() => {
    const base = odooProducts.length > 0 ? odooProducts : MOCK_PRODUCTS;
    return base.filter(p => (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()));
  }, [odooProducts, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 flex font-cabin">
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-xl z-30 sticky top-0 h-screen">
        <div className="p-8 border-b text-center">
          <h1 className="text-xl font-black text-slate-900 uppercase italic">careShop <span className="text-emerald-500">Admin</span></h1>
          <button onClick={() => onNavigate('home')} className="mt-2 text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2 hover:text-emerald-600">
            <X size={14} /> Salir a Tienda
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
          {[
            { id: 'erp', label: 'Conexión ERP', icon: <Database size={18} /> },
            { id: 'regional', label: 'País y Moneda', icon: <Globe size={18} /> },
            { id: 'ops', label: 'Operaciones Tienda', icon: <Store size={18} /> },
            { id: 'brand', label: 'Marca y Redes', icon: <Palette size={18} /> },
            { id: 'marketing', label: 'Marketing Web', icon: <Sparkles size={18} /> },
            { id: 'mapping', label: 'Categorías ERP', icon: <Settings2 size={18} /> },
            { id: 'catalog', label: 'Control Catálogo', icon: <Layers size={18} /> },
            { id: 'payments', label: 'Pagos y QR', icon: <CreditCard size={18} /> },
            { id: 'orders', label: 'Gestión Ventas', icon: <ClipboardList size={18} /> },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl font-bold text-sm transition-all ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
          
          {/* ERP */}
          {activeTab === 'erp' && (
            <div className="space-y-8 animate-in fade-in">
              <h2 className="text-3xl font-black text-slate-900 uppercase italic">Conexión con Odoo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl shadow-sm border space-y-4">
                  <input value={form.url} onChange={e => setForm({...form, url: e.target.value})} placeholder="URL Odoo" className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-bold" />
                  <input value={form.db} onChange={e => setForm({...form, db: e.target.value})} placeholder="Nombre Base de Datos" className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-bold" />
                  <input value={form.user} onChange={e => setForm({...form, user: e.target.value})} placeholder="Usuario / Email" className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-bold" />
                  <input type="password" value={form.pass} onChange={e => setForm({...form, pass: e.target.value})} placeholder="Contraseña / API Key" className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-bold" />
                  <button onClick={connectERP} className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2">
                    <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} /> {isLoading ? 'Sincronizando...' : 'Conectar con Odoo'}
                  </button>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-sm border flex flex-col min-h-[300px]">
                  <h3 className="text-[10px] font-black uppercase mb-4 text-slate-400 tracking-widest">Empresas Detectadas</h3>
                  <div className="space-y-2 overflow-y-auto max-h-[400px] no-scrollbar">
                    {companies.map(c => (
                      <button key={c.id} onClick={() => selectCompany(c.id)} className={`w-full p-4 rounded-xl border-2 text-left font-bold text-xs uppercase flex justify-between items-center ${session?.companyId === c.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-50 hover:bg-slate-50'}`}>
                        {c.name} {session?.companyId === c.id && <Check size={16} className="text-emerald-500" />}
                      </button>
                    ))}
                    {companies.length === 0 && <p className="text-xs text-slate-300 italic text-center py-10 uppercase font-black">Conexión Pendiente</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* REGIONAL */}
          {activeTab === 'regional' && (
            <div className="space-y-8 animate-in fade-in">
              <h2 className="text-3xl font-black text-slate-900 uppercase italic">Localización Regional</h2>
              <div className="bg-white p-10 rounded-3xl border shadow-sm space-y-10">
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase text-slate-400 flex items-center gap-2 tracking-widest"><Flag size={14} /> Seleccionar País de Operación</label>
                  <select value={settings.country} onChange={e => handleCountryChange(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-6 py-4 text-sm font-black uppercase focus:border-emerald-500 outline-none">
                    {LATAM_COUNTRIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-slate-50 rounded-2xl border text-center font-black">
                    <p className="text-[9px] text-slate-400 uppercase mb-2">Divisa</p>
                    <p className="text-2xl">{settings.currencyCode}</p>
                  </div>
                  <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 text-center font-black">
                    <p className="text-[9px] text-emerald-500 uppercase mb-2">Símbolo</p>
                    <p className="text-2xl text-emerald-600">{settings.currencySymbol}</p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-2xl border text-center font-black">
                    <p className="text-[9px] text-slate-400 uppercase mb-2">Locale</p>
                    <p className="text-2xl">{settings.locale}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* OPERACIONES */}
          {activeTab === 'ops' && (
            <div className="space-y-8 animate-in fade-in">
              <h2 className="text-3xl font-black text-slate-900 uppercase italic">Operaciones de Tienda</h2>
              <div className="bg-white p-10 rounded-3xl border shadow-sm space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border">
                      <div>
                        <p className="font-black text-sm uppercase">Habilitar Delivery</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Envío a domicilio activo</p>
                      </div>
                      <button onClick={() => setSettings({...settings, allowDelivery: !settings.allowDelivery})} className={`w-14 h-8 rounded-full transition-all relative ${settings.allowDelivery ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' : 'bg-slate-300'}`}>
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.allowDelivery ? 'left-7' : 'left-1'}`}></div>
                      </button>
                   </div>
                   <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border">
                      <div>
                        <p className="font-black text-sm uppercase">Recojo en Tienda</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Pickup físico activo</p>
                      </div>
                      <button onClick={() => setSettings({...settings, allowPickup: !settings.allowPickup})} className={`w-14 h-8 rounded-full transition-all relative ${settings.allowPickup ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' : 'bg-slate-300'}`}>
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.allowPickup ? 'left-7' : 'left-1'}`}></div>
                      </button>
                   </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-100">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2"><MapPin size={14} /> Datos de Sede Física</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400">Dirección Exacta</label>
                      <input value={settings.storeAddress} onChange={e => setSettings({...settings, storeAddress: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-xs font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400">Ciudad / Estado</label>
                      <input value={settings.storeCity} onChange={e => setSettings({...settings, storeCity: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-xs font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400">Teléfono Sede</label>
                      <input value={settings.storePhone} onChange={e => setSettings({...settings, storePhone: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-xs font-bold" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BRAND */}
          {activeTab === 'brand' && (
            <div className="space-y-8 animate-in fade-in">
              <h2 className="text-3xl font-black text-slate-900 uppercase italic">Identidad y Redes</h2>
              <div className="bg-white p-10 rounded-3xl border shadow-sm space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Instagram</label>
                    <div className="flex items-center gap-3 bg-slate-50 border rounded-xl px-4 py-3">
                      <Instagram size={18} className="text-pink-500" />
                      <input value={settings.socialInstagram || ''} onChange={e => setSettings({...settings, socialInstagram: e.target.value})} className="bg-transparent w-full text-xs font-bold outline-none" placeholder="https://instagram.com/..." />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Facebook</label>
                    <div className="flex items-center gap-3 bg-slate-50 border rounded-xl px-4 py-3">
                      <Facebook size={18} className="text-blue-600" />
                      <input value={settings.socialFacebook || ''} onChange={e => setSettings({...settings, socialFacebook: e.target.value})} className="bg-transparent w-full text-xs font-bold outline-none" placeholder="https://facebook.com/..." />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">TikTok</label>
                    <div className="flex items-center gap-3 bg-slate-50 border rounded-xl px-4 py-3">
                      <Music2 size={18} className="text-slate-900" />
                      <input value={settings.socialTikTok || ''} onChange={e => setSettings({...settings, socialTikTok: e.target.value})} className="bg-transparent w-full text-xs font-bold outline-none" placeholder="https://tiktok.com/@..." />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">WhatsApp (Sin +)</label>
                    <div className="flex items-center gap-3 bg-slate-50 border rounded-xl px-4 py-3">
                      <MessageCircle size={18} className="text-emerald-500" />
                      <input value={settings.whatsappNumber || ''} onChange={e => setSettings({...settings, whatsappNumber: e.target.value})} className="bg-transparent w-full text-xs font-bold outline-none" placeholder="Ej: 51999888777" />
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-100">
                  <label className="text-[10px] font-black uppercase text-slate-400">Copyright del Pie de Página</label>
                  <textarea value={settings.footerText} onChange={e => setSettings({...settings, footerText: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-xs font-bold mt-2 outline-none focus:border-emerald-500" rows={2} />
                </div>
              </div>
            </div>
          )}

          {/* MARKETING (Hero Slider) */}
          {activeTab === 'marketing' && (
            <div className="space-y-8 animate-in fade-in">
              <h2 className="text-3xl font-black text-slate-900 uppercase italic">Marketing Web</h2>
              
              <div className="bg-white p-10 rounded-3xl border shadow-sm space-y-10">
                <div className="flex items-center justify-between p-6 bg-slate-900 text-white rounded-2xl">
                   <div>
                     <p className="font-black text-sm uppercase">Popup Promocional</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Activo al cargar la web</p>
                   </div>
                   <button onClick={() => setSettings({...settings, promoActive: !settings.promoActive})} className={`w-14 h-8 rounded-full transition-all relative ${settings.promoActive ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                     <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.promoActive ? 'left-7' : 'left-1'}`}></div>
                   </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400">Imagen del Popup</label>
                    <div className="aspect-video bg-slate-50 border-2 border-dashed rounded-2xl overflow-hidden relative flex items-center justify-center cursor-pointer group">
                       {settings.promoImage ? <img src={settings.promoImage} className="w-full h-full object-cover" /> : <ImageIcon size={32} className="text-slate-200" />}
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"><Upload className="text-white" /></div>
                       <input type="file" onChange={e => handleFileUpload(e, (url) => setSettings({...settings, promoImage: url}))} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400">Título Principal</label>
                    <input value={settings.promoTitle} onChange={e => setSettings({...settings, promoTitle: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-bold uppercase" />
                  </div>
                </div>

                <div className="pt-10 border-t border-slate-100 space-y-8">
                  <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2"><Layout size={18} /> Gestión de Banners (Home Slider)</h3>
                  <div className="space-y-6">
                     {settings.heroSlides.map((slide, idx) => (
                       <div key={slide.id} className="p-8 bg-slate-50 rounded-[2.5rem] border relative grid grid-cols-1 md:grid-cols-2 gap-8 group">
                          <button onClick={() => setSettings({...settings, heroSlides: settings.heroSlides.filter(s => s.id !== slide.id)})} className="absolute top-6 right-6 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={18} /></button>
                          <div className="space-y-4">
                             <div className="space-y-1">
                               <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Badge Superior</label>
                               <input value={slide.badge} onChange={e => updateSlide(slide.id, {badge: e.target.value})} className="w-full bg-white border rounded-xl px-4 py-3 text-[10px] font-black uppercase" />
                             </div>
                             <div className="space-y-1">
                               <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Título</label>
                               <input value={slide.title} onChange={e => updateSlide(slide.id, {title: e.target.value})} className="w-full bg-white border rounded-xl px-4 py-3 text-xs font-black uppercase" />
                             </div>
                             <div className="space-y-1">
                               <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest text-emerald-500">Resaltado</label>
                               <input value={slide.highlight} onChange={e => updateSlide(slide.id, {highlight: e.target.value})} className="w-full bg-white border rounded-xl px-4 py-3 text-xs font-black uppercase text-emerald-600" />
                             </div>
                          </div>
                          <div className="space-y-4">
                             <div className="aspect-video bg-white rounded-2xl overflow-hidden relative border-2 border-dashed flex items-center justify-center">
                                <img src={slide.image} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-all cursor-pointer">
                                   <Camera className="text-white" size={32} />
                                   <input type="file" onChange={e => handleFileUpload(e, (url) => updateSlide(slide.id, {image: url}))} className="absolute inset-0 opacity-0 cursor-pointer" />
                                </div>
                             </div>
                             <input value={slide.cta} onChange={e => updateSlide(slide.id, {cta: e.target.value})} placeholder="Texto del Botón" className="w-full bg-white border rounded-xl px-4 py-3 text-[10px] font-black uppercase" />
                          </div>
                       </div>
                     ))}
                     <button onClick={() => setSettings({...settings, heroSlides: [...settings.heroSlides, { id: Date.now().toString(), badge: "NUEVO", title: "Nuevo", highlight: "Banner", subtitle: "", description: "", image: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=1600", cta: "Ver más", isActive: true }]})} className="w-full py-6 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-slate-400 font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:border-emerald-500 hover:text-emerald-500 transition-all">
                        <Plus size={16} /> Añadir Nueva Diapositiva al Slider
                     </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MAPPING */}
          {activeTab === 'mapping' && (
            <div className="space-y-8 animate-in fade-in">
              <h2 className="text-3xl font-black text-slate-900 uppercase italic">Categorización ERP</h2>
              <div className="bg-white p-10 rounded-3xl border shadow-sm space-y-4">
                {odooCategories.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-slate-300 font-black uppercase text-xs italic mb-4">Debes conectar Odoo en la pestaña ERP para mapear categorías</p>
                    <button onClick={() => setActiveTab('erp')} className="text-emerald-600 font-black uppercase text-[10px] tracking-widest hover:underline">Ir a Conexión ERP</button>
                  </div>
                ) : (
                  odooCategories.map(cat => (
                    <div key={cat.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border hover:border-emerald-500 transition-all">
                      <span className="text-xs font-black uppercase text-slate-700">{cat.name}</span>
                      <div className="flex items-center gap-3">
                         <ArrowRight className="text-slate-300" size={16} />
                         <select 
                           value={categoryMappings.find(m => m.odooCategoryId === cat.id)?.webCategory || Category.Medicamentos}
                           onChange={e => updateMapping(cat.id, e.target.value as Category)}
                           className="bg-white border-2 border-slate-100 rounded-xl px-4 py-2 text-[10px] font-black uppercase outline-none focus:border-emerald-500"
                         >
                           {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                         </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* CATALOG */}
          {activeTab === 'catalog' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-3xl font-black text-slate-900 uppercase italic">Control de Catálogo</h2>
                <div className="relative w-full md:w-64">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                   <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar producto..." className="w-full bg-white border rounded-xl py-3 pl-11 pr-4 text-xs font-bold" />
                </div>
              </div>
              <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    <tr>
                      <th className="px-10 py-5">Nombre de Producto</th>
                      <th className="px-10 py-5 text-center">Estado Web</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredItems.map(p => {
                      const idNum = p.id.toString().includes('odoo-') ? Number(p.id.toString().split('-')[1]) : Number(p.id);
                      const isPub = publishedIds.includes(idNum) || p.published;
                      return (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-10 py-5 font-black text-xs uppercase text-slate-800">{p.name}</td>
                          <td className="px-10 py-5 text-center">
                            <button 
                              onClick={() => setPublishedIds(isPub ? publishedIds.filter(i => i !== idNum) : [...publishedIds, idNum])}
                              className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all border-2 ${isPub ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-100 text-slate-300 border-slate-100'}`}
                            >
                              {isPub ? 'Visible' : 'Oculto'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredItems.length === 0 && (
                      <tr><td colSpan={2} className="px-10 py-20 text-center text-slate-300 font-black uppercase text-xs italic">No se encontraron productos</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PAYMENTS */}
          {activeTab === 'payments' && (
            <div className="space-y-8 animate-in fade-in">
              <h2 className="text-3xl font-black text-slate-900 uppercase italic">Pagos Digitales & QR</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {settings.mobilePayments.map((p, idx) => (
                  <div key={p.id} className="bg-white p-8 rounded-[3rem] border shadow-sm relative space-y-6 animate-in slide-in-from-bottom-2">
                    <button onClick={() => setSettings({...settings, mobilePayments: settings.mobilePayments.filter(x => x.id !== p.id)})} className="absolute top-6 right-6 text-slate-200 hover:text-rose-500 transition-colors"><Trash2 size={18} /></button>
                    <div className="flex flex-col items-center gap-6">
                       <div className="w-40 h-40 bg-slate-50 border-4 border-dashed rounded-3xl flex items-center justify-center relative group/qr overflow-hidden">
                          {p.qrCodeUrl ? <img src={p.qrCodeUrl} className="w-full h-full object-cover" /> : <QrCode size={64} className="text-slate-200" />}
                          <div className="absolute inset-0 bg-emerald-600/80 opacity-0 group-hover/qr:opacity-100 flex flex-col items-center justify-center transition-all cursor-pointer text-white">
                             <Camera size={32} />
                             <span className="text-[10px] font-black uppercase mt-1 tracking-widest">Subir QR</span>
                          </div>
                          <input type="file" onChange={e => handleFileUpload(e, (url) => {
                             const up = [...settings.mobilePayments]; up[idx].qrCodeUrl = url; setSettings({...settings, mobilePayments: up});
                          })} className="absolute inset-0 opacity-0 cursor-pointer" />
                       </div>
                       <div className="w-full space-y-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Billetera</label>
                            <input value={p.name} onChange={e => { const up = [...settings.mobilePayments]; up[idx].name = e.target.value; setSettings({...settings, mobilePayments: up}); }} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-xs font-black uppercase" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Número / ID</label>
                            <input value={p.identifier} onChange={e => { const up = [...settings.mobilePayments]; up[idx].identifier = e.target.value; setSettings({...settings, mobilePayments: up}); }} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-xs font-bold" />
                          </div>
                       </div>
                    </div>
                  </div>
                ))}
                <button onClick={() => setSettings({...settings, mobilePayments: [...settings.mobilePayments, {id: Date.now().toString(), name: "NUEVA", identifier: "", isActive: true}]})} className="border-4 border-dashed border-slate-200 rounded-[3rem] p-10 flex flex-col items-center justify-center gap-2 text-slate-300 hover:border-emerald-500 hover:text-emerald-500 transition-all bg-white shadow-sm">
                   <Plus size={48} /><span className="text-[10px] font-black uppercase tracking-widest">Añadir Pasarela QR</span>
                </button>
              </div>
            </div>
          )}

          {/* ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-8 animate-in fade-in">
              <h2 className="text-3xl font-black text-slate-900 uppercase italic">Gestión de Ventas Reales</h2>
              <div className="bg-white rounded-[3rem] border shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b text-[10px] font-black uppercase text-slate-400">
                    <tr><th className="px-10 py-6">ID Pedido</th><th className="px-10 py-6">Cliente</th><th className="px-10 py-6">Estado Real</th><th className="px-10 py-6 text-right">Total</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {orders.length === 0 ? (
                      <tr><td colSpan={4} className="px-10 py-24 text-center text-slate-300 font-black uppercase text-xs italic">Sin transacciones registradas</td></tr>
                    ) : (
                      orders.map(o => (
                        <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-10 py-6 font-black text-xs text-slate-900">{o.id}</td>
                          <td className="px-10 py-6 font-bold text-xs uppercase text-slate-600 truncate max-w-[150px]">{o.customerName}</td>
                          <td className="px-10 py-6">
                            <select 
                              value={o.status} 
                              onChange={(e) => {
                                const newStatus = e.target.value as OrderStatus;
                                const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                const updatedHistory = o.history.map(h => 
                                  h.status === newStatus ? { ...h, completed: true, time: now } : h
                                );
                                onUpdateOrder(o.id, { status: newStatus, history: updatedHistory });
                              }}
                              className="bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-black uppercase px-4 py-2 outline-none border border-emerald-100 focus:ring-2 ring-emerald-500/20"
                            >
                              <option value="received">Recibido</option>
                              <option value="validated">Validado</option>
                              <option value="preparing">Preparando</option>
                              <option value="shipped">Enviado</option>
                              <option value="delivered">Entregado</option>
                            </select>
                          </td>
                          <td className="px-10 py-6 text-right font-black text-slate-900 text-lg tracking-tighter">{settings.currencySymbol}{o.total.toFixed(2)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
