
import React, { useState } from 'react';
import { 
  Database, Settings, Palette, Layers, CreditCard, 
  MapPin, Terminal, X, Building, ChevronRight, 
  Plus, Trash2, Check, Search, Image as ImageIcon,
  Save, RefreshCw, Loader2, Globe, Truck, Store, QrCode,
  Share2, MessageCircle, Sparkles, Layout, Languages,
  Smartphone, Wallet, Type, Eye, Trash
} from 'lucide-react';
import { OdooService } from '../services/odooService';
import { OdooSession, StoreSettings, PickupLocation, WebCategoryMap, Category, HeroSlide, MobilePaymentMethod } from '../types';

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
}

const COUNTRY_PRESETS = [
  { name: 'Perú', symbol: 'S/', code: 'PEN', locale: 'es-PE', flag: '🇵🇪' },
  { name: 'México', symbol: '$', code: 'MXN', locale: 'es-MX', flag: '🇲🇽' },
  { name: 'Colombia', symbol: '$', code: 'COP', locale: 'es-CO', flag: '🇨🇴' },
  { name: 'Chile', symbol: '$', code: 'CLP', locale: 'es-CL', flag: '🇨🇱' },
  { name: 'Argentina', symbol: '$', code: 'ARS', locale: 'es-AR', flag: '🇦🇷' },
  { name: 'Ecuador', symbol: '$', code: 'USD', locale: 'es-EC', flag: '🇪🇨' },
  { name: 'Bolivia', symbol: 'Bs', code: 'BOB', locale: 'es-BO', flag: '🇧🇴' },
  { name: 'Uruguay', symbol: '$U', code: 'UYU', locale: 'es-UY', flag: '🇺🇾' },
  { name: 'Paraguay', symbol: 'Gs', code: 'PYG', locale: 'es-PY', flag: '🇵🇾' },
  { name: 'Costa Rica', symbol: '₡', code: 'CRC', locale: 'es-CR', flag: '🇨🇷' },
  { name: 'Panamá', symbol: 'B/.', code: 'PAB', locale: 'es-PA', flag: '🇵🇦' },
  { name: 'Dom. Rep.', symbol: 'RD$', code: 'DOP', locale: 'es-DO', flag: '🇩🇴' },
];

const POPULAR_WALLETS = [
  { name: 'Yape', color: 'bg-purple-600' },
  { name: 'Plin', color: 'bg-blue-500' },
  { name: 'Nequi', color: 'bg-slate-900' },
  { name: 'DaviPlata', color: 'bg-red-600' },
  { name: 'Mercado Pago', color: 'bg-blue-400' },
  { name: 'Pix', color: 'bg-teal-500' },
  { name: 'MACH', color: 'bg-indigo-600' },
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate, session, setSession, settings, setSettings,
  publishedIds, setPublishedIds, categoryMappings, setCategoryMappings,
  pickupLocations, setPickupLocations
}) => {
  const [activeTab, setActiveTab] = useState('erp');
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);
  const [odooProducts, setOdooProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [form, setForm] = useState({
    url: session?.url || '',
    db: session?.db || '',
    user: session?.username || '',
    pass: session?.apiKey || ''
  });

  const [newMobilePayment, setNewMobilePayment] = useState({ name: '', identifier: '' });
  const [newLoc, setNewLoc] = useState({ name: '', address: '', city: '', phone: '' });

  const applyCountryPreset = (preset: typeof COUNTRY_PRESETS[0]) => {
    setSettings({ ...settings, currencySymbol: preset.symbol, currencyCode: preset.code, locale: preset.locale });
  };

  const connectERP = async () => {
    setIsLoading(true);
    try {
      const { uid, client } = await OdooService.connect(form.url, form.db, form.user, form.pass);
      const resCompanies = await client.execute(uid, form.pass, 'res.company', 'search_read', [[]], { fields: ['id', 'name'] });
      setCompanies(resCompanies);
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const selectCompany = async (coId: number) => {
    setIsLoading(true);
    try {
      const { uid, client } = await OdooService.connect(form.url, form.db, form.user, form.pass);
      const newSession: OdooSession = { ...form, apiKey: form.pass, username: form.user, uid, companyId: coId, useProxy: true };
      setSession(newSession);
      const prods = await client.execute(uid, form.pass, 'product.product', 'search_read', [[['sale_ok','=',true],['company_id','=',coId]]], { fields: ['id','name','categ_id','list_price'] });
      setOdooProducts(prods);
      setActiveTab('catalog');
    } catch (e) {
      alert("Error al cargar productos");
    } finally {
      setIsLoading(false);
    }
  };

  const updateMapping = (odooId: number, webCat: Category) => {
    const filtered = categoryMappings.filter(m => m.odooCategoryId !== odooId);
    setCategoryMappings([...filtered, { odooCategoryId: odooId, webCategory: webCat }]);
  };

  const togglePublish = (id: number) => {
    setPublishedIds(publishedIds.includes(id) ? publishedIds.filter(x => x !== id) : [...publishedIds, id]);
  };

  const addMobilePayment = (name?: string) => {
    const finalName = name || newMobilePayment.name;
    if (!finalName) return;
    const method: MobilePaymentMethod = { id: Date.now().toString(), name: finalName, identifier: newMobilePayment.identifier, isActive: true };
    setSettings({ ...settings, mobilePayments: [...(settings.mobilePayments || []), method] });
    setNewMobilePayment({ name: '', identifier: '' });
  };

  // Fix: Added missing removeMobilePayment function
  const removeMobilePayment = (id: string) => {
    setSettings({
      ...settings,
      mobilePayments: (settings.mobilePayments || []).filter(p => p.id !== id)
    });
  };

  // Fix: Added missing updateMobilePaymentValue function
  const updateMobilePaymentValue = (id: string, field: keyof MobilePaymentMethod, value: any) => {
    setSettings({
      ...settings,
      mobilePayments: (settings.mobilePayments || []).map(p => 
        p.id === id ? { ...p, [field]: value } : p
      )
    });
  };

  const updateSlideField = (idx: number, field: keyof HeroSlide, value: any) => {
    const newSlides = [...(settings.heroSlides || [])];
    newSlides[idx] = { ...newSlides[idx], [field]: value };
    setSettings({ ...settings, heroSlides: newSlides });
  };

  const addSlide = () => {
    const slide: HeroSlide = {
      id: Date.now().toString(),
      badge: "Nuevo",
      title: "Promoción",
      highlight: "Salud",
      subtitle: "EXCLUSIVO WEB",
      description: "Añade una descripción impactante.",
      image: "https://images.unsplash.com/photo-1576671081837-49000212a370?q=80&w=1600",
      cta: "Ver Más",
      isActive: true
    };
    setSettings({ ...settings, heroSlides: [...(settings.heroSlides || []), slide] });
  };

  const filteredOdooProducts = odooProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-50 flex font-cabin">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-xl z-30">
        <div className="p-10 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-slate-900 rounded-lg text-white"><Settings size={20} /></div>
            <h1 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Admin Panel</h1>
          </div>
          <button onClick={() => onNavigate('home')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 hover:text-emerald-600 transition-colors">
            <X size={14} /> Salir
          </button>
        </div>
        <nav className="flex-1 p-6 space-y-2">
          {[
            { id: 'erp', label: 'Conexión Odoo', icon: <Database size={18} /> },
            { id: 'locale', label: 'Conf. Regional', icon: <Languages size={18} /> },
            { id: 'brand', label: 'Marca & Estilo', icon: <Palette size={18} /> },
            { id: 'catalog', label: 'Catálogo', icon: <Layers size={18} /> },
            { id: 'marketing', label: 'Marketing', icon: <Sparkles size={18} /> },
            { id: 'payments', label: 'Pagos Móviles', icon: <CreditCard size={18} /> },
            { id: 'logistics', label: 'Logística', icon: <MapPin size={18} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-4">{tab.icon} {tab.label}</div>
              {activeTab === tab.id && <ChevronRight size={14} />}
            </button>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-12">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {activeTab === 'erp' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Conexión Odoo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border space-y-6">
                  <div className="space-y-4">
                    <input value={form.url} onChange={e => setForm({...form, url: e.target.value})} placeholder="URL de Odoo" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold" />
                    <input value={form.db} onChange={e => setForm({...form, db: e.target.value})} placeholder="Base de datos" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold" />
                    <input value={form.user} onChange={e => setForm({...form, user: e.target.value})} placeholder="Usuario" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold" />
                    <input type="password" value={form.pass} onChange={e => setForm({...form, pass: e.target.value})} placeholder="Password / API Key" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold" />
                    <button onClick={connectERP} className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2">
                      <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} /> Conectar
                    </button>
                  </div>
                </div>
                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border">
                  <h3 className="text-xs font-black uppercase mb-6 text-slate-400">Compañías</h3>
                  <div className="space-y-2">
                    {companies.map(c => (
                      <button key={c.id} onClick={() => selectCompany(c.id)} className={`w-full p-4 rounded-xl border-2 text-left font-bold text-xs uppercase flex justify-between items-center ${session?.companyId === c.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-50'}`}>
                        {c.name} {session?.companyId === c.id && <Check size={16} className="text-emerald-500" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'locale' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Conf. Regional</h2>
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border space-y-10">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {COUNTRY_PRESETS.map(p => (
                    <button key={p.code} onClick={() => applyCountryPreset(p)} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${settings.locale === p.locale ? 'border-emerald-500 bg-emerald-50' : 'border-slate-50 bg-slate-50/50'}`}>
                      <span className="text-2xl">{p.flag}</span>
                      <span className="text-[9px] font-black uppercase">{p.name}</span>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t">
                  <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase ml-2">Símbolo</label><input value={settings.currencySymbol} onChange={e => setSettings({...settings, currencySymbol: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold" /></div>
                  <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase ml-2">Código ISO</label><input value={settings.currencyCode} onChange={e => setSettings({...settings, currencyCode: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold" /></div>
                  <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase ml-2">Locale</label><input value={settings.locale} onChange={e => setSettings({...settings, locale: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold" /></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'brand' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Marca & Estilo</h2>
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Nombre de Tienda</label>
                    <input value={settings.storeName} onChange={e => setSettings({...settings, storeName: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Color Primario</label>
                    <div className="flex gap-2">
                      <input type="color" value={settings.primaryColor} onChange={e => setSettings({...settings, primaryColor: e.target.value})} className="w-16 h-12 rounded-xl border-2 border-slate-100" />
                      <input value={settings.primaryColor} onChange={e => setSettings({...settings, primaryColor: e.target.value})} className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2">URL Logo (PNG/SVG)</label>
                    <input value={settings.logoUrl} onChange={e => setSettings({...settings, logoUrl: e.target.value})} placeholder="https://..." className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Texto del Pie de Página</label>
                    <input value={settings.footerText} onChange={e => setSettings({...settings, footerText: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'catalog' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Catálogo</h2>
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border space-y-6">
                <div className="relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar en Odoo..." className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-4 pl-12 pr-6 text-sm font-bold" />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b">
                      <tr>
                        <th className="px-6 py-4">Producto</th>
                        <th className="px-6 py-4">Mapeo</th>
                        <th className="px-6 py-4 text-right">Visible</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-xs">
                      {filteredOdooProducts.map(p => {
                        const mapping = categoryMappings.find(m => m.odooCategoryId === p.categ_id?.[0]);
                        const isPub = publishedIds.includes(p.id);
                        return (
                          <tr key={p.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 font-bold">{p.name}</td>
                            <td className="px-6 py-4">
                              <select 
                                value={mapping?.webCategory || ''}
                                onChange={e => updateMapping(p.categ_id?.[0], e.target.value as Category)}
                                className="bg-white border rounded px-2 py-1"
                              >
                                <option value="">Elegir Categoría</option>
                                {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button onClick={() => togglePublish(p.id)} className={`px-4 py-1.5 rounded-full font-black uppercase text-[8px] ${isPub ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                {isPub ? 'Publicado' : 'Oculto'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'marketing' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Marketing</h2>
                <button onClick={addSlide} className="bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 shadow-lg">
                  <Plus size={16} /> Añadir Slide
                </button>
              </div>
              <div className="space-y-8">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-widest border-l-4 border-slate-900 pl-4">Pop-up de Inicio</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input value={settings.promoTitle} onChange={e => setSettings({...settings, promoTitle: e.target.value})} placeholder="Título Promo" className="bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold" />
                    <input value={settings.promoImage} onChange={e => setSettings({...settings, promoImage: e.target.value})} placeholder="URL Imagen" className="bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold" />
                  </div>
                </div>
                {(settings.heroSlides || []).map((slide, i) => (
                  <div key={slide.id} className="bg-white p-10 rounded-[2.5rem] shadow-sm border flex flex-col md:flex-row gap-8 relative">
                    <button onClick={() => setSettings({...settings, heroSlides: settings.heroSlides.filter(s => s.id !== slide.id)})} className="absolute top-6 right-6 text-slate-300 hover:text-rose-500"><Trash2 size={20} /></button>
                    <div className="md:w-1/3 aspect-video bg-slate-100 rounded-2xl overflow-hidden"><img src={slide.image} className="w-full h-full object-cover" /></div>
                    <div className="md:w-2/3 grid grid-cols-2 gap-4">
                      <input value={slide.badge} onChange={e => updateSlideField(i, 'badge', e.target.value)} placeholder="Badge" className="bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2 text-xs font-bold" />
                      <input value={slide.title} onChange={e => updateSlideField(i, 'title', e.target.value)} placeholder="Título" className="bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2 text-xs font-bold" />
                      <input value={slide.image} onChange={e => updateSlideField(i, 'image', e.target.value)} placeholder="URL Imagen" className="col-span-2 bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2 text-xs font-bold" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Pagos Móviles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border space-y-8">
                  <h3 className="text-xs font-black uppercase tracking-widest border-l-4 border-slate-900 pl-4">Populares (LATAM)</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {POPULAR_WALLETS.map(w => (
                      <button key={w.name} onClick={() => addMobilePayment(w.name)} className="p-4 rounded-xl border-2 hover:border-emerald-500 transition-all text-left text-[10px] font-black uppercase flex items-center justify-between">
                        {w.name} <Plus size={14} className="text-slate-300" />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border space-y-6">
                   <h3 className="text-xs font-black uppercase tracking-widest border-l-4 border-slate-900 pl-4">Billeteras Activas</h3>
                   <div className="space-y-4">
                      {(settings.mobilePayments || []).map(p => (
                        <div key={p.id} className="p-4 bg-slate-50 rounded-xl border relative">
                          <button onClick={() => removeMobilePayment(p.id)} className="absolute top-3 right-3 text-slate-300 hover:text-rose-500"><Trash2 size={16} /></button>
                          <p className="text-[10px] font-black uppercase mb-2">{p.name}</p>
                          <input value={p.identifier} onChange={e => updateMobilePaymentValue(p.id, 'identifier', e.target.value)} placeholder="Número / ID" className="w-full bg-white border-2 border-slate-100 rounded-lg px-3 py-2 text-xs font-bold" />
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logistics' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Logística Sedes</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border space-y-4 md:col-span-1">
                   <h3 className="text-xs font-black uppercase tracking-widest border-l-4 border-slate-900 pl-4 mb-4">Nueva Sede</h3>
                   <input value={newLoc.name} onChange={e => setNewLoc({...newLoc, name: e.target.value})} placeholder="Nombre Sede" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm" />
                   <input value={newLoc.address} onChange={e => setNewLoc({...newLoc, address: e.target.value})} placeholder="Dirección" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm" />
                   <button onClick={() => { if(!newLoc.name) return; setPickupLocations([...pickupLocations, {...newLoc, id: Date.now().toString()}]); setNewLoc({name:'', address:'', city:'', phone:''}); }} className="w-full bg-slate-900 text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg">Añadir Sede</button>
                </div>
                <div className="md:col-span-2 space-y-4">
                  {pickupLocations.map(l => (
                    <div key={l.id} className="bg-white p-6 rounded-[2rem] shadow-sm border flex justify-between items-center group">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-emerald-500"><Store size={24} /></div>
                         <div>
                            <p className="text-sm font-black uppercase">{l.name}</p>
                            <p className="text-xs text-slate-400">{l.address}</p>
                         </div>
                      </div>
                      <button onClick={() => setPickupLocations(pickupLocations.filter(x => x.id !== l.id))} className="p-3 text-slate-200 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"><Trash size={18} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
