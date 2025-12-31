
import React, { useState } from 'react';
import { 
  Database, Settings, Palette, Layers, CreditCard, 
  MapPin, Terminal, X, Building, ChevronRight, 
  Plus, Trash2, Check, Search, Image as ImageIcon,
  Save, RefreshCw, Loader2, Globe, Truck, Store, QrCode,
  Share2, MessageCircle, Sparkles, Layout
} from 'lucide-react';
import { OdooService } from '../services/odooService';
import { OdooSession, StoreSettings, PickupLocation, WebCategoryMap, Category, HeroSlide } from '../types';

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

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate, session, setSession, settings, setSettings,
  publishedIds, setPublishedIds, categoryMappings, setCategoryMappings,
  pickupLocations, setPickupLocations
}) => {
  const [activeTab, setActiveTab] = useState('erp');
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);
  const [odooProducts, setOdooProducts] = useState<any[]>([]);
  const [odooCats, setOdooCats] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [newLoc, setNewLoc] = useState({ name: '', address: '', city: '', phone: '' });

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
      const resCompanies = await client.execute(uid, form.pass, 'res.company', 'search_read', [[]], { fields: ['id', 'name'] });
      setCompanies(resCompanies);
      alert(`Conexión Exitosa. Se encontraron ${resCompanies.length} compañías.`);
    } catch (e: any) {
      alert("Error de Conexión: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const selectCompany = async (coId: number) => {
    setIsLoading(true);
    const newSession: OdooSession = { 
      ...form, 
      apiKey: form.pass, 
      username: form.user, 
      uid: session?.uid || 1, 
      companyId: coId, 
      useProxy: true 
    };
    
    try {
      const { uid, client } = await OdooService.connect(form.url, form.db, form.user, form.pass);
      newSession.uid = uid;
      setSession(newSession);

      const prods = await client.execute(uid, form.pass, 'product.product', 'search_read', [[['sale_ok','=',true],['company_id','=',coId]]], { fields: ['id','name','categ_id','list_price'] });
      const cats = await client.execute(uid, form.pass, 'product.category', 'search_read', [[]], { fields: ['id','name'] });
      
      setOdooProducts(prods);
      setOdooCats(cats);
      setActiveTab('catalog');
    } catch (e) {
      alert("Error al cargar datos de la compañía");
    } finally {
      setIsLoading(false);
    }
  };

  const addPickupLocation = () => {
    if (!newLoc.name || !newLoc.address) return;
    const loc: PickupLocation = { ...newLoc, id: Date.now().toString() };
    setPickupLocations([...pickupLocations, loc]);
    setNewLoc({ name: '', address: '', city: '', phone: '' });
  };

  const deletePickupLocation = (id: string) => {
    setPickupLocations(pickupLocations.filter(l => l.id !== id));
  };

  const togglePublish = (id: number) => {
    const newIds = publishedIds.includes(id) 
      ? publishedIds.filter(x => x !== id) 
      : [...publishedIds, id];
    setPublishedIds(newIds);
  };

  const updateMapping = (odooId: number, webCat: Category) => {
    const filtered = categoryMappings.filter(m => m.odooCategoryId !== odooId);
    setCategoryMappings([...filtered, { odooCategoryId: odooId, webCategory: webCat }]);
  };

  const addSlide = () => {
    const slide: HeroSlide = {
      id: Date.now().toString(),
      badge: "Oferta Exclusiva",
      title: "Nueva Salud",
      highlight: "Para Ti",
      subtitle: "CALIDAD FARMACÉUTICA",
      description: "Descripción breve de este nuevo beneficio o promoción para tus clientes.",
      image: "https://images.unsplash.com/photo-1576671081837-49000212a370?q=80&w=1600",
      cta: "Ver Catálogo",
      isActive: true
    };
    setSettings({...settings, heroSlides: [...(settings.heroSlides || []), slide]});
  };

  const updateSlideField = (idx: number, field: keyof HeroSlide, value: any) => {
    const newSlides = [...(settings.heroSlides || [])];
    newSlides[idx] = { ...newSlides[idx], [field]: value };
    setSettings({...settings, heroSlides: newSlides});
  };

  const removeSlide = (id: string) => {
    setSettings({...settings, heroSlides: (settings.heroSlides || []).filter(s => s.id !== id)});
  };

  const filteredOdooProducts = odooProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-cabin">
      {/* Sidebar Admin */}
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-2xl z-30">
        <div className="p-10 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-slate-900 rounded-xl text-white shadow-lg"><Settings size={22} /></div>
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Pharmacy OS</h1>
          </div>
          <button onClick={() => onNavigate('home')} className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 hover:text-emerald-600 transition-colors">
            <X size={14} /> Salir al sitio
          </button>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          {[
            { id: 'erp', label: 'Conexión Odoo', icon: <Database size={18} /> },
            { id: 'brand', label: 'Marca & Estilo', icon: <Palette size={18} /> },
            { id: 'catalog', label: 'Catálogo & Mapeo', icon: <Layers size={18} /> },
            { id: 'marketing', label: 'Marketing & Media', icon: <Sparkles size={18} /> },
            { id: 'payments', label: 'Pasarelas & Redes', icon: <CreditCard size={18} /> },
            { id: 'logistics', label: 'Logística Sedes', icon: <MapPin size={18} /> },
            { id: 'sql', label: 'Supabase SQL', icon: <Terminal size={18} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold text-sm transition-all group ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl translate-x-2' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-4">{tab.icon} {tab.label}</div>
              <ChevronRight size={14} className={activeTab === tab.id ? 'opacity-100' : 'opacity-0'} />
            </button>
          ))}
        </nav>
      </aside>

      {/* Area de Trabajo */}
      <main className="flex-1 overflow-y-auto p-12">
        <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-right-10 duration-500">
          
          {activeTab === 'erp' && (
            <div className="space-y-8">
              <header className="flex justify-between items-end">
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">Conexión Odoo ERP</h2>
                  <p className="text-slate-400 font-medium">Gestiona múltiples compañías desde un solo punto.</p>
                </div>
                {isLoading && <Loader2 className="animate-spin text-slate-400" size={32} />}
              </header>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 space-y-8">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-l-4 border-slate-900 pl-4">Credenciales</h3>
                  <div className="space-y-4">
                    <input value={form.url} onChange={e => setForm({...form, url: e.target.value})} placeholder="URL Instancia (https://mi-empresa.odoo.com)" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-slate-900" />
                    <input value={form.db} onChange={e => setForm({...form, db: e.target.value})} placeholder="Base de Datos" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold" />
                    <input value={form.user} onChange={e => setForm({...form, user: e.target.value})} placeholder="Usuario / Email" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold" />
                    <input type="password" value={form.pass} onChange={e => setForm({...form, pass: e.target.value})} placeholder="Contraseña o API Key" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold" />
                    <button onClick={connectERP} className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 hover:bg-slate-800 transition-all">
                      <Globe size={20} /> Autenticar
                    </button>
                  </div>
                </div>
                <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 space-y-8">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-l-4 border-slate-900 pl-4">Compañías Detectadas</h3>
                  <div className="space-y-4">
                    {companies.map(c => (
                      <button key={c.id} onClick={() => selectCompany(c.id)} className={`w-full p-6 border-2 rounded-2xl text-left font-bold text-xs uppercase flex items-center justify-between group transition-all ${session?.companyId === c.id ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-md' : 'border-slate-50 hover:bg-slate-50'}`}>
                        <span>{c.name}</span>
                        {session?.companyId === c.id && <Check className="text-emerald-600" size={18} />}
                      </button>
                    ))}
                    {companies.length === 0 && (
                      <div className="py-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest">
                        Ingrese credenciales para listar
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'marketing' && (
            <div className="space-y-8">
              <header className="flex justify-between items-center">
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">Marketing & Media</h2>
                  <p className="text-slate-400 font-medium">Gestiona el hero principal y popups de la tienda.</p>
                </div>
                <button onClick={addSlide} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-xl">
                  <Plus size={16} /> Crear Diapositiva
                </button>
              </header>

              <div className="space-y-12">
                {/* Pop-up Config */}
                <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 space-y-8">
                   <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-l-4 border-slate-900 pl-4">Pop-up Promocional</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{settings.promoActive ? 'Visible' : 'Oculto'}</span>
                      <button 
                        onClick={() => setSettings({...settings, promoActive: !settings.promoActive})} 
                        className={`w-14 h-7 rounded-full relative transition-all ${settings.promoActive ? 'bg-emerald-500' : 'bg-slate-200'}`}
                      >
                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${settings.promoActive ? 'left-8' : 'left-1'}`}></div>
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Título de la Promo</label>
                      <input value={settings.promoTitle} onChange={e => setSettings({...settings, promoTitle: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Imagen URL</label>
                      <input value={settings.promoImage} onChange={e => setSettings({...settings, promoImage: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold" />
                    </div>
                  </div>
                </div>

                {/* Slides Manager */}
                <div className="grid grid-cols-1 gap-8">
                  {(settings.heroSlides || []).map((slide, idx) => (
                    <div key={slide.id} className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 space-y-8 animate-in slide-in-from-bottom-5">
                      <div className="flex justify-between items-center border-b pb-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-slate-900 text-white rounded-2xl"><Layout size={20} /></div>
                          <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight">Diapositiva #{idx + 1}</h4>
                        </div>
                        <button onClick={() => removeSlide(slide.id)} className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-100 transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest">
                          <Trash2 size={18} /> Eliminar
                        </button>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-1 space-y-6">
                          <div className="aspect-[16/9] rounded-3xl overflow-hidden border-2 border-slate-50 shadow-inner bg-slate-100">
                            <img src={slide.image} className="w-full h-full object-cover" alt="Previsualización" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Imagen URL</label>
                            <input value={slide.image} onChange={e => updateSlideField(idx, 'image', e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-[9px] font-bold" />
                          </div>
                        </div>

                        <div className="lg:col-span-2 grid grid-cols-2 gap-6">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Badge (Mini Título)</label>
                            <input value={slide.badge} onChange={e => updateSlideField(idx, 'badge', e.target.value)} placeholder="Ej: Delivery Express" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Subtítulo</label>
                            <input value={slide.subtitle} onChange={e => updateSlideField(idx, 'subtitle', e.target.value)} placeholder="Ej: BIENESTAR TOTAL" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Título</label>
                            <input value={slide.title} onChange={e => updateSlideField(idx, 'title', e.target.value)} placeholder="Ej: Cuidamos tu" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Palabra Resaltada</label>
                            <input value={slide.highlight} onChange={e => updateSlideField(idx, 'highlight', e.target.value)} placeholder="Ej: Vitalidad" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold" />
                          </div>
                          <div className="col-span-2 space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Descripción</label>
                            <textarea value={slide.description} onChange={e => updateSlideField(idx, 'description', e.target.value)} rows={2} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold resize-none" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Texto del Botón (CTA)</label>
                            <input value={slide.cta} onChange={e => updateSlideField(idx, 'cta', e.target.value)} placeholder="Ej: Comprar Ahora" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!settings.heroSlides || settings.heroSlides.length === 0) && (
                     <div className="bg-white p-20 rounded-[3.5rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300">
                        <Layout size={64} className="mb-4 opacity-20" />
                        <p className="text-[10px] font-black uppercase tracking-widest">No hay diapositivas configuradas</p>
                        <button onClick={addSlide} className="mt-6 text-emerald-600 font-black text-xs hover:underline uppercase">Añadir la primera ahora</button>
                     </div>
                  )}
                </div>
              </div>
              <button onClick={() => alert("Cambios de marketing guardados")} className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black uppercase tracking-widest shadow-2xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-3">
                <Save size={20} /> Guardar Configuración de Marketing
              </button>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-8">
              <header>
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">Pasarelas & Redes</h2>
                <p className="text-slate-400 font-medium">Configuración de Yape/Plin, Redes Sociales y WhatsApp.</p>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pasarelas Perú */}
                <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 space-y-6">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-l-4 border-slate-900 pl-4">Yape & Plin</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Número Yape</label>
                        <input value={settings.yapeNumber} onChange={e => setSettings({...settings, yapeNumber: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">QR Yape (URL)</label>
                        <input value={settings.yapeQr} onChange={e => setSettings({...settings, yapeQr: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-[9px] font-bold" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Número Plin</label>
                        <input value={settings.plinNumber} onChange={e => setSettings({...settings, plinNumber: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">QR Plin (URL)</label>
                        <input value={settings.plinQr} onChange={e => setSettings({...settings, plinQr: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-[9px] font-bold" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Soporte & Redes */}
                <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 space-y-6">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-l-4 border-slate-900 pl-4">Ayuda & Redes</h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3 flex items-center gap-2"><MessageCircle size={12} className="text-[#25D366]" /> WhatsApp de Soporte</label>
                      <input value={settings.whatsappNumber} onChange={e => setSettings({...settings, whatsappNumber: e.target.value})} placeholder="999888777" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3 flex items-center gap-2"><Share2 size={12} className="text-pink-500" /> Instagram URL</label>
                      <input value={settings.socialInstagram} onChange={e => setSettings({...settings, socialInstagram: e.target.value})} placeholder="https://instagram.com/tu-tienda" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3 flex items-center gap-2"><Share2 size={12} className="text-blue-600" /> Facebook URL</label>
                      <input value={settings.socialFacebook} onChange={e => setSettings({...settings, socialFacebook: e.target.value})} placeholder="https://facebook.com/tu-tienda" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3 flex items-center gap-2"><Share2 size={12} className="text-slate-900" /> TikTok URL</label>
                      <input value={settings.socialTikTok} onChange={e => setSettings({...settings, socialTikTok: e.target.value})} placeholder="https://tiktok.com/@tu-tienda" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold" />
                    </div>
                  </div>
                </div>
              </div>
              <button onClick={() => alert("Redes y Pagos guardados")} className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3">
                <Save size={20} /> Guardar Conexiones
              </button>
            </div>
          )}

          {activeTab === 'logistics' && (
            <div className="space-y-8">
              <header>
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">Logística Sedes</h2>
                <p className="text-slate-400 font-medium">Configura los puntos físicos para el recojo de pedidos.</p>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 space-y-6">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-l-4 border-slate-900 pl-4">Añadir Sede</h3>
                  <div className="space-y-4">
                    <input value={newLoc.name} onChange={e => setNewLoc({...newLoc, name: e.target.value})} placeholder="Nombre (Ej: Sede Norte)" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-xs font-bold" />
                    <input value={newLoc.address} onChange={e => setNewLoc({...newLoc, address: e.target.value})} placeholder="Dirección Exacta" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-xs font-bold" />
                    <input value={newLoc.city} onChange={e => setNewLoc({...newLoc, city: e.target.value})} placeholder="Ciudad / Distrito" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-xs font-bold" />
                    <input value={newLoc.phone} onChange={e => setNewLoc({...newLoc, phone: e.target.value})} placeholder="Teléfono" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-xs font-bold" />
                    <button onClick={addPickupLocation} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-emerald-500 transition-all shadow-lg"><Plus size={16} /> Crear Local</button>
                  </div>
                </div>

                <div className="lg:col-span-2 bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 space-y-6">
                   <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-l-4 border-slate-900 pl-4">Locales Activos</h3>
                   <div className="grid grid-cols-1 gap-4">
                      {pickupLocations.map(loc => (
                        <div key={loc.id} className="p-6 bg-slate-50 rounded-2xl flex justify-between items-center group hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-slate-100">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-400 group-hover:text-emerald-600 transition-colors"><MapPin size={24} /></div>
                              <div>
                                <p className="font-black text-slate-800 uppercase text-xs">{loc.name}</p>
                                <p className="text-[10px] font-bold text-slate-400">{loc.address}, {loc.city} • {loc.phone}</p>
                              </div>
                           </div>
                           <button onClick={() => deletePickupLocation(loc.id)} className="text-slate-300 hover:text-rose-500 p-3 rounded-xl transition-all"><Trash2 size={20} /></button>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'brand' && (
            <div className="space-y-8">
              <header>
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">Marca & Estilo</h2>
                <p className="text-slate-400 font-medium">Personaliza la identidad visual de tu plataforma.</p>
              </header>

              <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Colores de Marca</h3>
                    <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <input 
                        type="color" 
                        value={settings.primaryColor} 
                        onChange={e => setSettings({...settings, primaryColor: e.target.value})}
                        className="h-20 w-20 bg-transparent rounded-2xl cursor-pointer shadow-xl"
                      />
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Color Principal</p>
                        <p className="font-mono font-black text-xl uppercase text-slate-900">{settings.primaryColor}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Textos Globales</h3>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Nombre de la Tienda</label>
                        <input value={settings.storeName} onChange={e => setSettings({...settings, storeName: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Texto Footer</label>
                        <input value={settings.footerText} onChange={e => setSettings({...settings, footerText: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-slate-50">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3 flex items-center gap-2">
                      <ImageIcon size={14} /> Logo Navbar (URL)
                    </label>
                    <input value={settings.logoUrl} onChange={e => setSettings({...settings, logoUrl: e.target.value})} placeholder="https://..." className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold" />
                    <div className="h-32 bg-slate-50 rounded-3xl flex items-center justify-center p-4 border-2 border-dashed border-slate-100">
                       {settings.logoUrl ? <img src={settings.logoUrl} className="max-h-full object-contain" /> : <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest">Vista Previa Logo</span>}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3 flex items-center gap-2">
                      <ImageIcon size={14} /> Logo Footer (URL)
                    </label>
                    <input value={settings.footerLogoUrl} onChange={e => setSettings({...settings, footerLogoUrl: e.target.value})} placeholder="https://..." className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold" />
                    <div className="h-32 bg-slate-900 rounded-3xl flex items-center justify-center p-4 border-2 border-dashed border-slate-800">
                       {settings.footerLogoUrl ? <img src={settings.footerLogoUrl} className="max-h-full object-contain grayscale opacity-60" /> : <span className="text-[10px] text-slate-700 font-black uppercase tracking-widest">Vista Previa Logo</span>}
                    </div>
                  </div>
                </div>

                <button onClick={() => alert("Identidad visual actualizada")} className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3">
                  <Save size={20} /> Guardar Marca
                </button>
              </div>
            </div>
          )}

          {activeTab === 'catalog' && (
            <div className="space-y-8">
              <header className="flex justify-between items-center">
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">Catálogo & Mapeo</h2>
                  <p className="text-slate-400 font-medium">Sincroniza y filtra los productos del ERP Odoo.</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Buscar producto..."
                    className="bg-white border-2 border-slate-100 rounded-2xl pl-12 pr-6 py-3 text-sm font-bold outline-none focus:border-slate-900 shadow-sm"
                  />
                </div>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 space-y-6">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-l-4 border-slate-900 pl-4">Categorías</h3>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {odooCats.map(cat => {
                      const current = categoryMappings.find(m => m.odooCategoryId === cat.id)?.webCategory;
                      return (
                        <div key={cat.id} className="p-4 bg-slate-50 rounded-2xl space-y-2">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{cat.name}</p>
                          <select 
                            value={current || ''}
                            onChange={(e) => updateMapping(cat.id, e.target.value as Category)}
                            className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-slate-900"
                          >
                            <option value="">Sin Mapear</option>
                            {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="lg:col-span-2 bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 space-y-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-l-4 border-slate-900 pl-4">Visibilidad en Web</h3>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-4 py-1.5 rounded-full">{publishedIds.length} Seleccionados</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
                    {filteredOdooProducts.map(p => (
                      <div key={p.id} className={`p-5 rounded-3xl border-2 transition-all flex justify-between items-center group ${publishedIds.includes(p.id) ? 'border-emerald-500 bg-emerald-50' : 'border-slate-50 bg-white hover:bg-slate-50'}`}>
                        <div className="flex-1 min-w-0 pr-4">
                          <p className="text-xs font-black text-slate-800 uppercase leading-tight mb-1 truncate">{p.name}</p>
                          <p className="text-[10px] font-bold text-slate-400">S/ {p.list_price.toFixed(2)} • ID: {p.id}</p>
                        </div>
                        <button 
                          onClick={() => togglePublish(p.id)}
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm ${publishedIds.includes(p.id) ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-300'}`}
                        >
                          <Check size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-8">
              <header>
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">Supabase SQL Console</h2>
                <p className="text-slate-400 font-medium">Ejecuta este script para preparar tu base de datos final.</p>
              </header>
              <div className="bg-slate-950 p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Terminal size={120} className="text-emerald-500" />
                </div>
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-3 h-3 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
                  <div className="w-3 h-3 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                  <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                </div>
                <pre className="text-emerald-400 font-mono text-sm leading-relaxed overflow-x-auto selection:bg-emerald-900/50">
{`-- 1. Estructura Completa para Configuraciones Globales
CREATE TABLE IF NOT EXISTS store_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_name TEXT NOT NULL DEFAULT 'careShop',
  primary_color TEXT DEFAULT '#10B981',
  footer_text TEXT,
  logo_url TEXT,
  footer_logo_url TEXT,
  yape_number TEXT,
  yape_qr TEXT,
  plin_number TEXT,
  plin_qr TEXT,
  whatsapp_number TEXT,
  social_instagram TEXT,
  social_facebook TEXT,
  social_tiktok TEXT,
  promo_active BOOLEAN DEFAULT true,
  promo_title TEXT,
  promo_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insertar valores iniciales si la tabla está vacía
INSERT INTO store_settings (id) 
SELECT uuid_generate_v4() 
WHERE NOT EXISTS (SELECT 1 FROM store_settings LIMIT 1);

-- 2. Tabla para Sedes Físicas (Pickup)
CREATE TABLE IF NOT EXISTS pickup_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Tabla para Diapositivas Dinámicas (Hero Slides)
CREATE TABLE IF NOT EXISTS hero_slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  badge TEXT,
  title TEXT,
  highlight TEXT,
  subtitle TEXT,
  description TEXT,
  image TEXT,
  cta TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Registro de Sesiones Odoo (Solo lectura para Admin)
CREATE TABLE IF NOT EXISTS odoo_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  db TEXT NOT NULL,
  username TEXT NOT NULL,
  api_key TEXT NOT NULL,
  company_id INTEGER,
  last_sync TIMESTAMP WITH TIME ZONE DEFAULT now()
);`}
                </pre>
                <div className="mt-12 flex items-center justify-between border-t border-emerald-900/30 pt-10">
                   <p className="text-[10px] text-emerald-900/60 font-black uppercase tracking-widest">Script v3.0 • Pharmacy OS Enterprise</p>
                   <button 
                     onClick={() => { 
                       const code = document.querySelector('pre')?.innerText || '';
                       navigator.clipboard.writeText(code); 
                       alert("Script completo copiado."); 
                     }}
                     className="bg-emerald-600/10 hover:bg-emerald-600 text-emerald-600 hover:text-white px-8 py-3 rounded-xl border border-emerald-600/30 font-black uppercase text-[10px] tracking-widest transition-all"
                   >
                     Copiar Script SQL Completo
                   </button>
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
