
import React, { useState, useRef, useEffect } from 'react';
import { 
  Database, Palette, Layers, CreditCard, 
  MapPin, X, Plus, Trash2, Check, 
  Search, RefreshCw, Sparkles, 
  Store, Trash, ClipboardList, Truck,
  Instagram, Facebook, Music2, MessageCircle, 
  Globe, Flag, Image as ImageIcon, Camera, Upload,
  QrCode, Edit3, Save, Filter, CheckSquare, Square
} from 'lucide-react';
import { OdooService } from '../services/odooService';
import { OdooSession, StoreSettings, PickupLocation, WebCategoryMap, Category, HeroSlide, MobilePaymentMethod, Order, OrderStatus, Product } from '../types';
import { PRODUCTS as MOCK_PRODUCTS } from '../data/mockData';

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

const LATAM_COUNTRIES = [
  { name: 'Argentina', symbol: '$', code: 'ARS', locale: 'es-AR' },
  { name: 'Bolivia', symbol: 'Bs', code: 'BOB', locale: 'es-BO' },
  { name: 'Brasil', symbol: 'R$', code: 'BRL', locale: 'pt-BR' },
  { name: 'Chile', symbol: '$', code: 'CLP', locale: 'es-CL' },
  { name: 'Colombia', symbol: '$', code: 'COP', locale: 'es-CO' },
  { name: 'Costa Rica', symbol: '₡', code: 'CRC', locale: 'es-CR' },
  { name: 'Cuba', symbol: '$', code: 'CUP', locale: 'es-CU' },
  { name: 'Ecuador', symbol: '$', code: 'USD', locale: 'es-EC' },
  { name: 'El Salvador', symbol: '$', code: 'USD', locale: 'es-SV' },
  { name: 'Guatemala', symbol: 'Q', code: 'GTQ', locale: 'es-GT' },
  { name: 'Honduras', symbol: 'L', code: 'HNL', locale: 'es-HN' },
  { name: 'México', symbol: '$', code: 'MXN', locale: 'es-MX' },
  { name: 'Nicaragua', symbol: 'C$', code: 'NIO', locale: 'es-NI' },
  { name: 'Panamá', symbol: 'B/.', code: 'PAB', locale: 'es-PA' },
  { name: 'Paraguay', symbol: 'Gs', code: 'PYG', locale: 'es-PY' },
  { name: 'Perú', symbol: 'S/', code: 'PEN', locale: 'es-PE' },
  { name: 'Puerto Rico', symbol: '$', code: 'USD', locale: 'es-PR' },
  { name: 'R. Dominicana', symbol: 'RD$', code: 'DOP', locale: 'es-DO' },
  { name: 'Uruguay', symbol: '$U', code: 'UYU', locale: 'es-UY' },
  { name: 'Venezuela', symbol: 'Bs.S', code: 'VES', locale: 'es-VE' },
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate, session, setSession, settings, setSettings,
  publishedIds, setPublishedIds, categoryMappings, setCategoryMappings,
  pickupLocations, setPickupLocations, orders, onUpdateOrder
}) => {
  const [activeTab, setActiveTab] = useState('erp');
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);
  const [odooProducts, setOdooProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [catFilter, setCatFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  
  const logoHeaderRef = useRef<HTMLInputElement>(null);
  const logoFooterRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    url: session?.url || '',
    db: session?.db || '',
    user: session?.username || '',
    pass: session?.apiKey || ''
  });

  useEffect(() => {
    if (session) {
      loadOdooProducts();
    }
  }, [session]);

  const loadOdooProducts = async () => {
    if (!session) return;
    setIsLoading(true);
    try {
      const { uid, client } = await OdooService.connect(session.url, session.db, session.username, session.apiKey);
      const prods = await client.execute(uid, session.apiKey, 'product.product', 'search_read', [[['sale_ok','=',true],['company_id','=',session.companyId]]], { fields: ['id','name','categ_id','list_price'] });
      setOdooProducts(prods);
    } catch (e) {
      console.error("Error cargando productos Odoo", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Filtrado de productos para el catálogo
  const filteredProducts = (odooProducts.length > 0 ? odooProducts : MOCK_PRODUCTS).filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = catFilter === 'all' || (p.category === catFilter || p.categ_id?.[1]?.includes(catFilter));
    return matchesSearch && matchesCat;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map(p => p.id));
    }
  };

  const toggleSelectOne = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const bulkPublish = (publish: boolean) => {
    if (selectedIds.length === 0) return;
    let newPublished = [...publishedIds];
    if (publish) {
      // Agregar solo los que no están
      selectedIds.forEach(id => {
        if (!newPublished.includes(id)) newPublished.push(id);
      });
    } else {
      // Quitar los seleccionados
      newPublished = newPublished.filter(id => !selectedIds.includes(id));
    }
    setPublishedIds(newPublished);
    setSelectedIds([]); // Limpiar selección después de acción
  };

  const togglePublish = (id: number) => {
    if (publishedIds.includes(id)) {
      setPublishedIds(publishedIds.filter(i => i !== id));
    } else {
      setPublishedIds([...publishedIds, id]);
    }
  };

  const addSlide = () => {
    const newSlide: HeroSlide = {
      id: Date.now().toString(),
      badge: "NUEVA OFERTA",
      title: "Título de Banner",
      highlight: "Destacado",
      subtitle: "SUBTÍTULO PROMOCIONAL",
      description: "Descripción breve de la promoción.",
      image: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=1600",
      cta: "Comprar ahora",
      isActive: true
    };
    setSettings({ ...settings, heroSlides: [...(settings.heroSlides || []), newSlide] });
  };

  const updateSlideField = (index: number, field: keyof HeroSlide, value: any) => {
    const newSlides = [...(settings.heroSlides || [])];
    newSlides[index] = { ...newSlides[index], [field]: value };
    setSettings({ ...settings, heroSlides: newSlides });
  };

  const addMobilePayment = (name: string) => {
    const newPayment: MobilePaymentMethod = {
      id: Date.now().toString(),
      name,
      identifier: '',
      qrCodeUrl: '',
      isActive: true
    };
    setSettings({ ...settings, mobilePayments: [...(settings.mobilePayments || []), newPayment] });
  };

  const handleCountrySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = LATAM_COUNTRIES.find(c => c.name === e.target.value);
    if (country) {
      setSettings({
        ...settings,
        currencySymbol: country.symbol,
        currencyCode: country.code,
        locale: country.locale
      });
    }
  };

  const connectERP = async () => {
    setIsLoading(true);
    try {
      const { uid, client } = await OdooService.connect(form.url, form.db, form.user, form.pass);
      const resCompanies = await client.execute(uid, form.pass, 'res.company', 'search_read', [[]], { fields: ['id', 'name'] });
      setCompanies(resCompanies);
    } catch (e: any) { alert("Error: " + e.message); }
    finally { setIsLoading(false); }
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
    } catch (e) { alert("Error al cargar productos"); }
    finally { setIsLoading(false); }
  };

  const addPickupLocation = () => {
    const newLoc: PickupLocation = {
      id: Date.now().toString(),
      name: 'Nueva Sede',
      address: 'Dirección #123',
      city: 'Ciudad',
      phone: ''
    };
    setPickupLocations([...pickupLocations, newLoc]);
  };

  const updatePickupLocation = (id: string, field: keyof PickupLocation, value: string) => {
    setPickupLocations(pickupLocations.map(loc => loc.id === id ? { ...loc, [field]: value } : loc));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-cabin">
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-xl z-30 sticky top-0 h-screen">
        <div className="p-10 border-b border-slate-100 text-center">
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-4">Admin Panel</h1>
          <button onClick={() => onNavigate('home')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2 hover:text-emerald-600 transition-colors">
            <X size={14} /> Salir
          </button>
        </div>
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto no-scrollbar">
          {[
            { id: 'erp', label: 'Conexión Odoo', icon: <Database size={18} /> },
            { id: 'catalog', label: 'Catálogo', icon: <Layers size={18} /> },
            { id: 'marketing', label: 'Marketing', icon: <Sparkles size={18} /> },
            { id: 'logistics', label: 'Logística', icon: <MapPin size={18} /> },
            { id: 'brand', label: 'Marca', icon: <Palette size={18} /> },
            { id: 'payments', label: 'Pagos', icon: <CreditCard size={18} /> },
            { id: 'locale', label: 'Regional', icon: <Globe size={18} /> },
            { id: 'orders', label: 'Pedidos', icon: <ClipboardList size={18} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-12 overflow-y-auto bg-slate-50">
        <div className="max-w-5xl mx-auto pb-20">
          
          {/* CATALOGO MEJORADO */}
          {activeTab === 'catalog' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Catálogo</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Gestiona la visibilidad de tus productos</p>
                </div>
                {session && (
                   <button onClick={loadOdooProducts} className="bg-white border p-3 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                     <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
                   </button>
                )}
              </div>

              {/* Barra de Filtros y Acciones */}
              <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                    placeholder="Buscar producto..." 
                    className="w-full bg-slate-50 border rounded-2xl py-3 pl-14 pr-6 text-sm font-bold" 
                  />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                    <select 
                      value={catFilter} 
                      onChange={e => setCatFilter(e.target.value)}
                      className="w-full bg-slate-50 border rounded-2xl py-3 pl-10 pr-6 text-[10px] font-black uppercase appearance-none cursor-pointer"
                    >
                      <option value="all">Todas las Categorías</option>
                      {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Acciones Masivas Flotantes */}
              {selectedIds.length > 0 && (
                <div className="bg-slate-900 text-white p-4 rounded-3xl flex items-center justify-between animate-in slide-in-from-top-4 shadow-2xl">
                   <div className="flex items-center gap-4 ml-4">
                      <span className="text-[10px] font-black uppercase tracking-widest">{selectedIds.length} seleccionados</span>
                   </div>
                   <div className="flex gap-2">
                      <button onClick={() => bulkPublish(true)} className="px-6 py-2 bg-emerald-500 text-white text-[9px] font-black uppercase rounded-xl hover:bg-emerald-600 transition-colors">Publicar en Web</button>
                      <button onClick={() => bulkPublish(false)} className="px-6 py-2 bg-rose-500 text-white text-[9px] font-black uppercase rounded-xl hover:bg-rose-600 transition-colors">Ocultar de Web</button>
                      <button onClick={() => setSelectedIds([])} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={18} /></button>
                   </div>
                </div>
              )}

              <div className="bg-white rounded-[3rem] shadow-sm border overflow-hidden">
                <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                   <table className="w-full text-left">
                     <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b sticky top-0 z-10">
                       <tr>
                         <th className="px-8 py-4 w-10">
                            <button onClick={toggleSelectAll} className="text-slate-300 hover:text-slate-900 transition-colors">
                               {selectedIds.length === filteredProducts.length ? <CheckSquare size={20} className="text-emerald-500" /> : <Square size={20} />}
                            </button>
                         </th>
                         <th className="px-6 py-4">Producto</th>
                         <th className="px-6 py-4">Categoría ERP</th>
                         <th className="px-6 py-4 text-center">Estado Web</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y">
                       {filteredProducts.length === 0 ? (
                         <tr><td colSpan={4} className="py-20 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">No se encontraron productos con estos filtros</td></tr>
                       ) : (
                        filteredProducts.map(p => {
                         const isPub = publishedIds.includes(p.id);
                         const isSelected = selectedIds.includes(p.id);
                         return (
                           <tr key={p.id} className={`hover:bg-slate-50 transition-colors ${isSelected ? 'bg-emerald-50/30' : ''}`}>
                             <td className="px-8 py-5">
                                <button onClick={() => toggleSelectOne(p.id)} className="text-slate-200 hover:text-emerald-500 transition-colors">
                                   {isSelected ? <CheckSquare size={18} className="text-emerald-500" /> : <Square size={18} />}
                                </button>
                             </td>
                             <td className="px-6 py-5">
                                <p className="font-black text-xs text-slate-900 uppercase tracking-tight leading-tight mb-1">{p.name}</p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">ID: {p.id}</p>
                             </td>
                             <td className="px-6 py-5">
                                <span className="text-[9px] font-black text-slate-400 uppercase bg-slate-100 px-3 py-1 rounded-lg">
                                  {p.categ_id?.[1] || p.category || 'General'}
                                </span>
                             </td>
                             <td className="px-6 py-5 text-center">
                               <button 
                                onClick={() => togglePublish(p.id)} 
                                className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isPub ? 'bg-emerald-100 text-emerald-700 shadow-sm' : 'bg-slate-100 text-slate-400 opacity-60'}`}
                               >
                                 {isPub ? 'Visible' : 'Oculto'}
                               </button>
                             </td>
                           </tr>
                         )
                       })
                       )}
                     </tbody>
                   </table>
                </div>
              </div>
            </div>
          )}

          {/* MARKETING */}
          {activeTab === 'marketing' && (
            <div className="space-y-10 animate-in fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Marketing Visual</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Gestiona los banners principales</p>
                </div>
                <button onClick={addSlide} className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-3 hover:scale-105 transition-transform">
                  <Plus size={18} /> Nuevo Banner
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {(settings.heroSlides || []).length === 0 ? (
                  <div className="bg-white p-20 rounded-[3rem] border border-dashed text-center space-y-4">
                    <Sparkles className="mx-auto text-slate-200" size={64} />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No hay banners activos</p>
                  </div>
                ) : (
                  (settings.heroSlides || []).map((s, idx) => (
                    <div key={s.id} className="bg-white p-8 rounded-[3.5rem] border border-slate-100 flex flex-col md:flex-row gap-8 items-start shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-full md:w-64 aspect-video bg-slate-100 rounded-3xl overflow-hidden shadow-inner flex-shrink-0 border relative group">
                          <img src={s.image} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <button onClick={() => {
                               const url = prompt("URL de la Imagen del Banner:", s.image);
                               if(url) updateSlideField(idx, 'image', url);
                             }} className="bg-white text-slate-900 p-3 rounded-full shadow-xl"><Edit3 size={20} /></button>
                          </div>
                        </div>
                        <div className="flex-1 space-y-6 w-full">
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Badge Superior</label>
                                <input value={s.badge} onChange={e => updateSlideField(idx, 'badge', e.target.value)} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-xs font-bold uppercase" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Título</label>
                                <input value={s.title} onChange={e => updateSlideField(idx, 'title', e.target.value)} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-xs font-bold uppercase" />
                              </div>
                           </div>
                           <div className="space-y-1">
                              <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Descripción</label>
                              <textarea value={s.description} onChange={e => updateSlideField(idx, 'description', e.target.value)} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-xs font-medium" rows={2} />
                           </div>
                        </div>
                        <button onClick={() => setSettings({...settings, heroSlides: settings.heroSlides.filter(x => x.id !== s.id)})} className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"><Trash2 size={24} /></button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* LOGISTICA (SEDES) */}
          {activeTab === 'logistics' && (
            <div className="space-y-10 animate-in fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Logística y Sedes</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Configura puntos de entrega y métodos</p>
                </div>
                <button onClick={addPickupLocation} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-3 hover:scale-105 transition-transform">
                  <Plus size={18} /> Agregar Sede
                </button>
              </div>

              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <button onClick={() => setSettings({...settings, allowDelivery: !settings.allowDelivery})} className={`p-10 border-2 rounded-[3.5rem] flex flex-col items-center gap-6 transition-all ${settings.allowDelivery ? 'border-emerald-500 bg-emerald-50 shadow-xl' : 'border-slate-50 opacity-40 hover:opacity-100'}`}>
                      <div className={`p-8 rounded-[2rem] ${settings.allowDelivery ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-200 text-slate-400'}`}><Truck size={54} /></div>
                      <div className="text-center">
                        <span className="block font-black uppercase text-xs tracking-widest mb-1">Envío a Domicilio</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{settings.allowDelivery ? 'Disponible' : 'Desactivado'}</span>
                      </div>
                   </button>
                   <button onClick={() => setSettings({...settings, allowPickup: !settings.allowPickup})} className={`p-10 border-2 rounded-[3.5rem] flex flex-col items-center gap-6 transition-all ${settings.allowPickup ? 'border-blue-500 bg-blue-50 shadow-xl' : 'border-slate-50 opacity-40 hover:opacity-100'}`}>
                      <div className={`p-8 rounded-[2rem] ${settings.allowPickup ? 'bg-blue-500 text-white shadow-lg' : 'bg-slate-200 text-slate-400'}`}><Store size={54} /></div>
                      <div className="text-center">
                        <span className="block font-black uppercase text-xs tracking-widest mb-1">Recojo en Tienda</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{settings.allowPickup ? 'Disponible' : 'Desactivado'}</span>
                      </div>
                   </button>
                </div>

                <div className="space-y-8">
                   <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest flex items-center gap-3">
                     <div className="w-1 h-4 bg-emerald-500 rounded-full"></div> Listado de Sedes Físicas
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {pickupLocations.length === 0 ? (
                       <div className="col-span-2 p-12 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center">
                          <MapPin size={48} className="mx-auto text-slate-300 mb-4" />
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No hay sedes registradas para recojo</p>
                       </div>
                     ) : (
                       pickupLocations.map(loc => (
                         <div key={loc.id} className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all space-y-6">
                            <div className="flex justify-between items-start">
                               <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 shadow-inner"><Store size={22} /></div>
                               <button onClick={() => setPickupLocations(pickupLocations.filter(x => x.id !== loc.id))} className="p-2 text-slate-200 hover:text-rose-500 transition-colors"><Trash2 size={20} /></button>
                            </div>
                            <div className="space-y-4">
                               <div className="space-y-1">
                                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Nombre Sede</label>
                                  <input value={loc.name} onChange={e => updatePickupLocation(loc.id, 'name', e.target.value)} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-xs font-black uppercase" />
                               </div>
                               <div className="space-y-1">
                                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Dirección Completa</label>
                                  <input value={loc.address} onChange={e => updatePickupLocation(loc.id, 'address', e.target.value)} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-xs font-bold" />
                               </div>
                               <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                     <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Ciudad</label>
                                     <input value={loc.city} onChange={e => updatePickupLocation(loc.id, 'city', e.target.value)} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-xs font-bold uppercase" />
                                  </div>
                                  <div className="space-y-1">
                                     <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Teléfono</label>
                                     <input value={loc.phone} onChange={e => updatePickupLocation(loc.id, 'phone', e.target.value)} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-xs font-bold" />
                                  </div>
                               </div>
                            </div>
                         </div>
                       ))
                     )}
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* ERP CONNECTION */}
          {activeTab === 'erp' && (
            <div className="space-y-8 animate-in fade-in">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Conexión Odoo ERP</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-10 rounded-[3rem] shadow-sm border space-y-4">
                  <input value={form.url} onChange={e => setForm({...form, url: e.target.value})} placeholder="URL de Odoo" className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-bold" />
                  <input value={form.db} onChange={e => setForm({...form, db: e.target.value})} placeholder="Base de datos" className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-bold" />
                  <input value={form.user} onChange={e => setForm({...form, user: e.target.value})} placeholder="Email Usuario" className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-bold" />
                  <input type="password" value={form.pass} onChange={e => setForm({...form, pass: e.target.value})} placeholder="API Key" className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-bold" />
                  <button onClick={connectERP} className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
                    <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} /> {isLoading ? 'Conectando...' : 'Conectar'}
                  </button>
                </div>
                <div className="bg-white p-10 rounded-[3rem] shadow-sm border flex flex-col">
                  <h3 className="text-[10px] font-black uppercase mb-6 text-slate-400 tracking-widest">Seleccionar Empresa</h3>
                  <div className="space-y-2 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {companies.length === 0 ? (
                      <p className="text-center py-10 text-slate-300 font-bold uppercase text-[10px] tracking-widest italic">Inicia sesión para ver empresas</p>
                    ) : (
                      companies.map(c => (
                        <button key={c.id} onClick={() => selectCompany(c.id)} className={`w-full p-5 rounded-2xl border-2 text-left font-bold text-xs uppercase flex justify-between items-center transition-all ${session?.companyId === c.id ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-slate-50 hover:bg-slate-50'}`}>
                          {c.name} {session?.companyId === c.id && <Check size={18} className="text-emerald-500" />}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BRAND IDENTITY */}
          {activeTab === 'brand' && (
            <div className="space-y-10 animate-in fade-in">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leadin-none">Marca e Identidad</h2>
              <div className="bg-white p-10 rounded-[3rem] shadow-sm border space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nombre de la Tienda</label>
                     <input value={settings.storeName} onChange={e => setSettings({...settings, storeName: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-black uppercase" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Color Primario Corporativo</label>
                     <div className="flex gap-4">
                       <input type="color" value={settings.primaryColor} onChange={e => setSettings({...settings, primaryColor: e.target.value})} className="w-16 h-12 rounded-xl cursor-pointer" />
                       <input value={settings.primaryColor} onChange={e => setSettings({...settings, primaryColor: e.target.value})} className="flex-1 bg-slate-50 border rounded-xl px-4 text-xs font-mono font-bold uppercase" />
                     </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t">
                   <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase text-slate-400 block ml-1">Logo Cabecera</label>
                     <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-center overflow-hidden shadow-inner p-4">
                           {settings.logoUrl ? <img src={settings.logoUrl} className="w-full h-full object-contain" /> : <ImageIcon className="text-slate-300" size={32} />}
                        </div>
                        <button onClick={() => logoHeaderRef.current?.click()} className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase rounded-2xl shadow-xl hover:scale-105 transition-transform">
                          <Upload size={16} /> Subir Logo
                        </button>
                        <input type="file" ref={logoHeaderRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (b) => setSettings({...settings, logoUrl: b}))} />
                     </div>
                   </div>
                   <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase text-slate-400 block ml-1">Logo Pie de Página</label>
                     <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-slate-900 rounded-3xl border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl p-4">
                           {settings.footerLogoUrl ? <img src={settings.footerLogoUrl} className="w-full h-full object-contain" /> : <ImageIcon className="text-slate-700" size={32} />}
                        </div>
                        <button onClick={() => logoFooterRef.current?.click()} className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase rounded-2xl shadow-xl hover:scale-105 transition-transform">
                          <Upload size={16} /> Subir Logo
                        </button>
                        <input type="file" ref={logoFooterRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (b) => setSettings({...settings, footerLogoUrl: b}))} />
                     </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><MessageCircle size={14} className="text-emerald-500" /> WhatsApp</label>
                     <input value={settings.whatsappNumber} onChange={e => setSettings({...settings, whatsappNumber: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-bold" placeholder="51999888777" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><Instagram size={14} className="text-pink-500" /> Instagram</label>
                     <input value={settings.socialInstagram} onChange={e => setSettings({...settings, socialInstagram: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-bold" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><Facebook size={14} className="text-blue-600" /> Facebook</label>
                     <input value={settings.socialFacebook} onChange={e => setSettings({...settings, socialFacebook: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-bold" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><Music2 size={14} className="text-slate-900" /> TikTok</label>
                     <input value={settings.socialTikTok} onChange={e => setSettings({...settings, socialTikTok: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-bold" />
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* PAYMENTS */}
          {activeTab === 'payments' && (
            <div className="space-y-10 animate-in fade-in">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Pagos y Billeteras</h2>
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
                {(settings.mobilePayments || []).map((p, idx) => (
                   <div key={p.id} className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 relative shadow-inner">
                      <button onClick={() => setSettings({...settings, mobilePayments: settings.mobilePayments.filter(x => x.id !== p.id)})} className="absolute top-8 right-8 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={24} /></button>
                      
                      <div className="space-y-6">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Método (Ej: Yape)</label>
                          <input value={p.name} onChange={e => {
                              const up = [...settings.mobilePayments];
                              up[idx].name = e.target.value;
                              setSettings({...settings, mobilePayments: up});
                            }} className="w-full p-4 text-sm border rounded-xl bg-white font-black uppercase text-emerald-600 shadow-sm" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Identificador / Número</label>
                          <input value={p.identifier} onChange={e => {
                              const up = [...settings.mobilePayments];
                              up[idx].identifier = e.target.value;
                              setSettings({...settings, mobilePayments: up});
                            }} className="w-full p-4 text-sm border rounded-xl bg-white font-black shadow-sm" />
                        </div>
                        <div className="space-y-4 pt-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 ml-1 block">Código QR</label>
                          <div className="flex items-center gap-6">
                            <div className="w-28 h-28 bg-white rounded-3xl border border-slate-200 flex items-center justify-center overflow-hidden shadow-xl p-2">
                              {p.qrCodeUrl ? <img src={p.qrCodeUrl} className="w-full h-full object-contain" /> : <QrCode size={48} className="text-slate-100" />}
                            </div>
                            <button onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*';
                                input.onchange = (e) => handleFileUpload(e as any, (b) => {
                                   const up = [...settings.mobilePayments];
                                   up[idx].qrCodeUrl = b;
                                   setSettings({...settings, mobilePayments: up});
                                });
                                input.click();
                            }} className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase rounded-2xl flex items-center gap-3 shadow-xl hover:scale-105 transition-transform">
                               <Upload size={18} /> Subir QR
                            </button>
                          </div>
                        </div>
                      </div>
                   </div>
                ))}
                <button onClick={() => addMobilePayment('Nueva Billetera')} className="p-16 border-4 border-dashed border-slate-100 rounded-[3.5rem] text-[10px] font-black uppercase text-slate-400 hover:bg-white hover:border-emerald-500 transition-all flex flex-col items-center gap-6 group">
                  <div className="p-6 bg-slate-50 rounded-full group-hover:bg-emerald-50 transition-colors"><Plus size={48} /></div>
                  Agregar Billetera Digital
                </button>
              </div>
            </div>
          )}

          {/* REGIONAL */}
          {activeTab === 'locale' && (
            <div className="space-y-10 animate-in fade-in">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Localización</h2>
              <div className="bg-white p-10 rounded-[3rem] shadow-sm border space-y-10">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><Flag size={14} /> Seleccionar País (LATAM)</label>
                  <select onChange={handleCountrySelect} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-sm font-black uppercase outline-none focus:border-emerald-500 transition-all">
                    <option value="">-- Elige tu país --</option>
                    {LATAM_COUNTRIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t">
                  <div className="space-y-2 text-center">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Símbolo</label>
                    <input value={settings.currencySymbol} onChange={e => setSettings({...settings, currencySymbol: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-4 py-4 text-center text-xl font-black text-slate-900" />
                  </div>
                  <div className="space-y-2 text-center">
                    <label className="text-[10px] font-black text-slate-400 uppercase">ISO</label>
                    <input value={settings.currencyCode} onChange={e => setSettings({...settings, currencyCode: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-4 py-4 text-center text-xl font-black text-slate-900" />
                  </div>
                  <div className="space-y-2 text-center">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Locale</label>
                    <input value={settings.locale} onChange={e => setSettings({...settings, locale: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-4 py-4 text-center text-xl font-black text-slate-900" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-8 animate-in fade-in">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Gestión de Ventas</h2>
              <div className="bg-white rounded-[3rem] shadow-sm border overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b">
                    <tr>
                      <th className="px-10 py-8">Orden / Cliente</th>
                      <th className="px-10 py-8">Estado</th>
                      <th className="px-10 py-8">Acción</th>
                      <th className="px-10 py-8 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orders.length === 0 ? (
                      <tr><td colSpan={4} className="px-10 py-24 text-center text-slate-300 font-bold uppercase tracking-widest italic">Sin ventas registradas</td></tr>
                    ) : (
                      orders.map(order => (
                        <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-10 py-8">
                            <p className="text-sm font-black text-slate-900 uppercase leading-none mb-1">{order.id}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{order.customerName}</p>
                          </td>
                          <td className="px-10 py-8">
                            <span className="px-4 py-1.5 bg-slate-100 rounded-full text-[9px] font-black uppercase text-slate-600">{order.status}</span>
                          </td>
                          <td className="px-10 py-8">
                            <button onClick={() => {
                                const st = prompt("Nuevo estado (received, validated, preparing, shipped, delivered):", order.status);
                                if(st) onUpdateOrder(order.id, { status: st as OrderStatus });
                            }} className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"><Check size={20} /></button>
                          </td>
                          <td className="px-10 py-8 text-right font-black text-slate-900 text-lg">{settings.currencySymbol}{order.total.toFixed(2)}</td>
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
