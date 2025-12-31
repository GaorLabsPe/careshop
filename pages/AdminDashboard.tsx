
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Database, Palette, Layers, CreditCard, 
  MapPin, X, Plus, Trash2, Check, 
  Search, RefreshCw, Sparkles, 
  Store, Trash, ClipboardList, Truck,
  Instagram, Facebook, Music2, MessageCircle, 
  Globe, Flag, Image as ImageIcon, Camera, Upload,
  QrCode, Edit3, Save, Filter, CheckSquare, Square, Settings2,
  ArrowRight, Smartphone, Layout, Languages, DollarSign,
  Monitor, BellRing, MousePointer2
} from 'lucide-react';
import { OdooService } from '../services/odooService';
import { OdooSession, StoreSettings, PickupLocation, WebCategoryMap, Category, HeroSlide, MobilePaymentMethod, Order, OrderStatus, Product } from '../types';
import { PRODUCTS as MOCK_PRODUCTS } from '../data/mockData';

const LATAM_COUNTRIES = [
  { name: 'Perú', code: 'PEN', symbol: 'S/', locale: 'es-PE' },
  { name: 'Argentina', code: 'ARS', symbol: '$', locale: 'es-AR' },
  { name: 'Bolivia', code: 'BOB', symbol: 'Bs.', locale: 'es-BO' },
  { name: 'Brasil', code: 'BRL', symbol: 'R$', locale: 'pt-BR' },
  { name: 'Chile', code: 'CLP', symbol: '$', locale: 'es-CL' },
  { name: 'Colombia', code: 'COP', symbol: '$', locale: 'es-CO' },
  { name: 'México', code: 'MXN', symbol: '$', locale: 'es-MX' },
  { name: 'Ecuador', code: 'USD', symbol: '$', locale: 'es-EC' },
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
  const [odooProducts, setOdooProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [catFilter, setCatFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [odooCategories, setOdooCategories] = useState<{id: number, name: string}[]>([]);
  
  const logoHeaderRef = useRef<HTMLInputElement>(null);
  const logoFooterRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    url: session?.url || '',
    db: session?.db || '',
    user: session?.username || '',
    pass: session?.apiKey || ''
  });

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

  const loadOdooData = async () => {
    if (!session) return;
    setIsLoading(true);
    try {
      const { uid, client } = await OdooService.connect(session.url, session.db, session.username, session.apiKey);
      const cats = await client.execute(uid, session.apiKey, 'product.category', 'search_read', [[]], { fields: ['id', 'name'] });
      setOdooCategories(cats);
      const prods = await client.execute(uid, session.apiKey, 'product.product', 'search_read', [[['sale_ok','=',true],['company_id','=',session.companyId]]], { fields: ['id','name','categ_id','list_price'] });
      setOdooProducts(prods);
    } catch (e) {
      console.error("Error al sincronizar con Odoo", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) loadOdooData();
  }, [session]);

  const connectERP = async () => {
    setIsLoading(true);
    try {
      const { uid, client } = await OdooService.connect(form.url, form.db, form.user, form.pass);
      const comps = await client.execute(uid, form.pass, 'res.company', 'search_read', [[]], { fields: ['id', 'name'] });
      setCompanies(comps);
    } catch (e: any) {
      alert(e.message || "Error al conectar con Odoo");
    } finally {
      setIsLoading(false);
    }
  };

  const selectCompany = async (companyId: number) => {
    setIsLoading(true);
    try {
      const { uid } = await OdooService.connect(form.url, form.db, form.user, form.pass);
      setSession({
        url: form.url,
        db: form.db,
        username: form.user,
        apiKey: form.pass,
        uid: uid,
        companyId: companyId,
        useProxy: true
      });
      setActiveTab('mapping');
    } catch (e: any) {
      alert("Error al seleccionar empresa");
    } finally {
      setIsLoading(false);
    }
  };

  const getWebCategory = (odooCatId: number): Category => {
    const map = categoryMappings.find(m => m.odooCategoryId === odooCatId);
    return map ? map.webCategory : Category.Medicamentos;
  };

  const updateMapping = (odooId: number, webCat: Category) => {
    const exists = categoryMappings.find(m => m.odooCategoryId === odooId);
    if (exists) {
      setCategoryMappings(categoryMappings.map(m => m.odooCategoryId === odooId ? { ...m, webCategory: webCat } : m));
    } else {
      setCategoryMappings([...categoryMappings, { odooCategoryId: odooId, webCategory: webCat }]);
    }
  };

  // Fix: Lógica de catálogo siempre visible con fallback a mock
  const filteredProducts = useMemo(() => {
    const baseList = odooProducts.length > 0 ? odooProducts : MOCK_PRODUCTS;
    return baseList.filter(p => {
      const matchesSearch = (p.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      const webCat = p.categ_id ? getWebCategory(p.categ_id[0]) : p.category;
      const matchesCat = catFilter === 'all' || webCat === catFilter;
      return matchesSearch && matchesCat;
    });
  }, [odooProducts, searchTerm, catFilter, categoryMappings]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map(p => p.id));
    }
  };

  const bulkAction = (publish: boolean) => {
    let newPublished = [...publishedIds];
    if (publish) {
      selectedIds.forEach(id => { if (!newPublished.includes(id)) newPublished.push(id); });
    } else {
      newPublished = newPublished.filter(id => !selectedIds.includes(id));
    }
    setPublishedIds(newPublished);
    setSelectedIds([]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-cabin selection:bg-emerald-100">
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-xl z-30 sticky top-0 h-screen">
        <div className="p-10 border-b border-slate-100 text-center">
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-4 italic">CareShop <span className="text-emerald-500">Admin</span></h1>
          <button onClick={() => onNavigate('home')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2 hover:text-emerald-600 transition-colors">
            <X size={14} /> Salir a Tienda
          </button>
        </div>
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto no-scrollbar">
          {[
            { id: 'erp', label: 'Conexión Odoo', icon: <Database size={18} /> },
            { id: 'regional', label: 'Config. Regional', icon: <Globe size={18} /> },
            { id: 'brand', label: 'Marca y Logos', icon: <Palette size={18} /> },
            { id: 'logistics', label: 'Delivery y Sedes', icon: <MapPin size={18} /> },
            { id: 'marketing', label: 'Banners y Popups', icon: <Sparkles size={18} /> },
            { id: 'mapping', label: 'Categorías ERP', icon: <Settings2 size={18} /> },
            { id: 'catalog', label: 'Catálogo Web', icon: <Layers size={18} /> },
            { id: 'payments', label: 'Métodos Pago', icon: <CreditCard size={18} /> },
            { id: 'orders', label: 'Ventas Reales', icon: <ClipboardList size={18} /> },
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
          
          {/* TAB: ERP */}
          {activeTab === 'erp' && (
            <div className="space-y-8 animate-in fade-in">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Conexión Odoo ERP</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-10 rounded-[3rem] shadow-sm border space-y-4">
                  <input value={form.url} onChange={e => setForm({...form, url: e.target.value})} placeholder="URL Odoo (ej: https://miempresa.odoo.com)" className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-bold" />
                  <input value={form.db} onChange={e => setForm({...form, db: e.target.value})} placeholder="Base de datos" className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-bold" />
                  <input value={form.user} onChange={e => setForm({...form, user: e.target.value})} placeholder="Email de Usuario" className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-bold" />
                  <input type="password" value={form.pass} onChange={e => setForm({...form, pass: e.target.value})} placeholder="API Key / Contraseña" className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-bold" />
                  <button onClick={connectERP} className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
                    <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} /> {isLoading ? 'Conectando...' : 'Conectar'}
                  </button>
                </div>
                <div className="bg-white p-10 rounded-[3rem] shadow-sm border flex flex-col">
                  <h3 className="text-[10px] font-black uppercase mb-6 text-slate-400 tracking-widest">Empresas Detectadas</h3>
                  <div className="space-y-2 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {companies.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center opacity-30 italic">
                        <Store size={48} className="mb-4" />
                        <p className="text-center font-bold uppercase text-[10px] tracking-widest">Inicia sesión para listar empresas</p>
                      </div>
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

          {/* TAB: MAPPING */}
          {activeTab === 'mapping' && (
            <div className="space-y-8 animate-in fade-in">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Mapeo de Categorías ERP</h2>
              <div className="bg-white p-10 rounded-[3rem] border shadow-sm space-y-4">
                {odooCategories.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-slate-300 uppercase font-black text-xs tracking-widest mb-4 italic">Conecta con Odoo para listar categorías reales</p>
                    {/* Botón de carga manual si el session existe */}
                    {session && <button onClick={loadOdooData} className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase">Forzar Sincronización</button>}
                  </div>
                ) : (
                  odooCategories.map(cat => (
                    <div key={cat.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border">
                      <p className="text-xs font-black text-slate-900 uppercase">{cat.name}</p>
                      <div className="flex items-center gap-4">
                        <ArrowRight className="text-slate-300" />
                        <select value={getWebCategory(cat.id)} onChange={e => updateMapping(cat.id, e.target.value as Category)} className="bg-white border rounded-xl px-4 py-2 text-[10px] font-black uppercase">
                          {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: CATALOG */}
          {activeTab === 'catalog' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Catálogo Web</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Gestiona qué productos son visibles en la tienda</p>
                </div>
                <button onClick={loadOdooData} className="p-4 bg-white border rounded-2xl shadow-sm hover:bg-slate-50 transition-all"><RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} /></button>
              </div>
              <div className="bg-white p-6 rounded-[2.5rem] border shadow-sm flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Filtrar por nombre..." className="w-full bg-slate-50 border rounded-2xl py-3 pl-14 text-sm font-bold" />
                </div>
                <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="bg-slate-50 border rounded-2xl px-6 py-3 text-[10px] font-black uppercase">
                  <option value="all">Categoría Web: Todas</option>
                  {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {selectedIds.length > 0 && (
                <div className="bg-slate-900 text-white p-4 rounded-3xl flex items-center justify-between shadow-2xl animate-in slide-in-from-top-4">
                  <span className="ml-4 text-[10px] font-black uppercase tracking-widest">{selectedIds.length} ítems seleccionados</span>
                  <div className="flex gap-2">
                    <button onClick={() => bulkAction(true)} className="px-6 py-2 bg-emerald-500 text-white text-[9px] font-black uppercase rounded-xl">Publicar</button>
                    <button onClick={() => bulkAction(false)} className="px-6 py-2 bg-rose-500 text-white text-[9px] font-black uppercase rounded-xl">Ocultar</button>
                    <button onClick={() => setSelectedIds([])} className="p-2"><X size={18} /></button>
                  </div>
                </div>
              )}
              <div className="bg-white rounded-[3rem] border shadow-sm overflow-hidden overflow-y-auto max-h-[600px] custom-scrollbar">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] font-black uppercase border-b sticky top-0">
                    <tr>
                      <th className="px-8 py-4 w-12 text-center"><button onClick={toggleSelectAll}>{selectedIds.length === filteredProducts.length ? <CheckSquare size={18} className="text-slate-900" /> : <Square size={18} />}</button></th>
                      <th className="px-6 py-4">Información del Producto</th>
                      <th className="px-6 py-4 text-center">Estado Web</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredProducts.map(p => {
                      const isPub = publishedIds.includes(p.id);
                      const isSel = selectedIds.includes(p.id);
                      return (
                        <tr key={p.id} className={isSel ? 'bg-emerald-50/30' : ''}>
                          <td className="px-8 py-5 text-center"><button onClick={() => isSel ? setSelectedIds(selectedIds.filter(i => i !== p.id)) : setSelectedIds([...selectedIds, p.id])}>{isSel ? <CheckSquare className="text-emerald-500" size={18} /> : <Square size={18} />}</button></td>
                          <td className="px-6 py-5">
                            <p className="font-black text-xs text-slate-900 uppercase leading-none mb-1">{p.name}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">ID: {p.id}</p>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <button onClick={() => isPub ? setPublishedIds(publishedIds.filter(i => i !== p.id)) : setPublishedIds([...publishedIds, p.id])} className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${isPub ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 text-slate-300'}`}>
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
          )}

          {/* TAB: PAYMENTS */}
          {activeTab === 'payments' && (
            <div className="space-y-8 animate-in fade-in">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Pasarelas de Pago</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {settings.mobilePayments.map((p, idx) => (
                  <div key={p.id} className="p-8 bg-white border rounded-[2.5rem] shadow-sm space-y-4 group">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Billetera Móvil</span>
                       <button onClick={() => setSettings({...settings, mobilePayments: settings.mobilePayments.filter(x => x.id !== p.id)})} className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button>
                    </div>
                    <input value={p.name} onChange={e => { const up = [...settings.mobilePayments]; up[idx].name = e.target.value; setSettings({...settings, mobilePayments: up}); }} placeholder="Nombre (ej: Yape)" className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-xs font-black uppercase" />
                    <input value={p.identifier} onChange={e => { const up = [...settings.mobilePayments]; up[idx].identifier = e.target.value; setSettings({...settings, mobilePayments: up}); }} placeholder="Número o Identificador" className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-xs font-bold" />
                    <div className="w-24 h-24 bg-slate-50 rounded-xl border flex items-center justify-center relative cursor-pointer hover:bg-slate-100 transition-colors">
                       {p.qrCodeUrl ? <img src={p.qrCodeUrl} className="w-full h-full object-contain" /> : <QrCode size={32} className="text-slate-200" />}
                    </div>
                  </div>
                ))}
                <button onClick={() => setSettings({...settings, mobilePayments: [...settings.mobilePayments, { id: Date.now().toString(), name: "Nuevo Método", identifier: "", isActive: true }]})} className="border-4 border-dashed border-slate-100 rounded-[2.5rem] p-12 flex flex-col items-center justify-center gap-4 text-slate-300 hover:border-emerald-500 hover:text-emerald-500 transition-all hover:bg-white">
                  <Plus size={48} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Añadir Nuevo Canal de Pago</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-8 animate-in fade-in">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Ventas en Tiempo Real</h2>
              <div className="bg-white rounded-[3rem] border shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b text-[10px] font-black uppercase text-slate-400">
                    <tr><th className="px-10 py-6">ID Pedido</th><th className="px-10 py-6">Información Cliente</th><th className="px-10 py-6">Estado</th><th className="px-10 py-6 text-right">Monto Total</th></tr>
                  </thead>
                  <tbody className="divide-y">
                    {orders.length === 0 ? (
                      <tr><td colSpan={4} className="px-10 py-24 text-center text-slate-300 font-black uppercase text-xs tracking-[0.3em] italic">No hay registros de ventas actuales</td></tr>
                    ) : (
                      orders.map(o => (
                        <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-10 py-6 font-black text-xs text-slate-900">{o.id}</td>
                          <td className="px-10 py-6">
                            <p className="text-xs font-bold text-slate-800 uppercase leading-none mb-1">{o.customerName}</p>
                            <p className="text-[9px] text-slate-400 font-bold">{o.customerEmail}</p>
                          </td>
                          <td className="px-10 py-6">
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase border border-emerald-100">{o.status}</span>
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

          {/* TAB: BRAND (LOGOS Y REDES SOCIALES) */}
          {activeTab === 'brand' && (
            <div className="space-y-8 animate-in fade-in">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Identidad de Marca</h2>
              <div className="bg-white p-10 rounded-[3rem] border shadow-sm space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2 tracking-widest"><Layout size={14} /> Logo Header (Tienda)</label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 bg-slate-50 rounded-2xl flex items-center justify-center p-3 border shadow-inner">
                        {settings.logoUrl ? <img src={settings.logoUrl} className="max-h-full" /> : <ImageIcon className="text-slate-200" />}
                      </div>
                      <button onClick={() => logoHeaderRef.current?.click()} className="p-3 bg-slate-900 text-white rounded-xl hover:scale-105 transition-transform"><Upload size={18} /></button>
                      <input type="file" ref={logoHeaderRef} className="hidden" onChange={(e) => handleFileUpload(e, (b) => setSettings({...settings, logoUrl: b}))} />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2 tracking-widest"><Layout size={14} /> Logo Footer (Alternativo)</label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 bg-slate-900 rounded-2xl flex items-center justify-center p-3 border border-slate-700 shadow-inner">
                        {settings.footerLogoUrl ? <img src={settings.footerLogoUrl} className="max-h-full" /> : <ImageIcon className="text-slate-700" />}
                      </div>
                      <button onClick={() => logoFooterRef.current?.click()} className="p-3 bg-slate-900 text-white rounded-xl hover:scale-105 transition-transform"><Upload size={18} /></button>
                      <input type="file" ref={logoFooterRef} className="hidden" onChange={(e) => handleFileUpload(e, (b) => setSettings({...settings, footerLogoUrl: b}))} />
                    </div>
                  </div>
                </div>

                {/* REDES SOCIALES - COMPLETAS */}
                <div className="pt-10 border-t space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Redes Sociales y Contacto</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400">Instagram URL</label>
                      <div className="flex items-center gap-3 bg-slate-50 border rounded-xl px-4 py-3">
                        <Instagram className="text-pink-500" size={18} />
                        <input value={settings.socialInstagram || ''} onChange={e => setSettings({...settings, socialInstagram: e.target.value})} className="bg-transparent w-full text-xs font-bold outline-none" placeholder="https://instagram.com/tu_tienda" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400">Facebook URL</label>
                      <div className="flex items-center gap-3 bg-slate-50 border rounded-xl px-4 py-3">
                        <Facebook className="text-blue-600" size={18} />
                        <input value={settings.socialFacebook || ''} onChange={e => setSettings({...settings, socialFacebook: e.target.value})} className="bg-transparent w-full text-xs font-bold outline-none" placeholder="https://facebook.com/tu_tienda" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400">TikTok URL</label>
                      <div className="flex items-center gap-3 bg-slate-50 border rounded-xl px-4 py-3">
                        <Music2 className="text-slate-900" size={18} />
                        <input value={settings.socialTikTok || ''} onChange={e => setSettings({...settings, socialTikTok: e.target.value})} className="bg-transparent w-full text-xs font-bold outline-none" placeholder="https://tiktok.com/@tu_tienda" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400">WhatsApp Business</label>
                      <div className="flex items-center gap-3 bg-slate-50 border rounded-xl px-4 py-3">
                        <MessageCircle className="text-emerald-500" size={18} />
                        <input value={settings.whatsappNumber || ''} onChange={e => setSettings({...settings, whatsappNumber: e.target.value})} className="bg-transparent w-full text-xs font-bold outline-none" placeholder="Ej: 51999888777" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-10 border-t">
                   <label className="text-[10px] font-black uppercase text-slate-400">Texto Copyright y Footer</label>
                   <textarea value={settings.footerText} onChange={e => setSettings({...settings, footerText: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-6 py-4 text-xs font-bold mt-2 outline-none focus:bg-white transition-all" rows={2} />
                </div>
              </div>
            </div>
          )}

          {/* TAB: REGIONAL */}
          {activeTab === 'regional' && (
            <div className="space-y-8 animate-in fade-in">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Configuración de País</h2>
              <div className="bg-white p-12 rounded-[3rem] border shadow-sm space-y-10">
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase text-slate-400 flex items-center gap-2">
                    <Flag size={16} className="text-emerald-500" /> Selecciona tu Ubicación
                  </label>
                  <select value={settings.country} onChange={e => handleCountryChange(e.target.value)} className="w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 text-sm font-black uppercase outline-none focus:border-emerald-500 transition-all">
                    {LATAM_COUNTRIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-8 pt-10 border-t">
                   <div className="bg-slate-50 p-6 rounded-2xl border text-center">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Símbolo</span>
                     <p className="text-2xl font-black text-emerald-600 tracking-tighter">{settings.currencySymbol}</p>
                   </div>
                   <div className="bg-slate-50 p-6 rounded-2xl border text-center">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Código ISO</span>
                     <p className="text-2xl font-black text-emerald-600 tracking-tighter">{settings.currencyCode}</p>
                   </div>
                   <div className="bg-slate-50 p-6 rounded-2xl border text-center">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Localización</span>
                     <p className="text-2xl font-black text-emerald-600 tracking-tighter">{settings.locale}</p>
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: LOGISTICS */}
          {activeTab === 'logistics' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Logística de Entrega</h2>
                <button onClick={() => setPickupLocations([...pickupLocations, { id: Date.now().toString(), name: "Nuevo Local", address: "", city: "", phone: "" }])} className="bg-emerald-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"><Plus size={16} /> Añadir Sede Física</button>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className={`p-8 rounded-[2.5rem] border-2 transition-all flex items-center justify-between ${settings.allowDelivery ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-slate-100 bg-white opacity-60'}`}>
                  <div className="flex items-center gap-6"><Truck size={32} className={settings.allowDelivery ? 'text-emerald-600' : 'text-slate-300'} /> <span className="font-black uppercase text-sm">Activar Delivery</span></div>
                  <button onClick={() => setSettings({...settings, allowDelivery: !settings.allowDelivery})} className={`w-14 h-7 rounded-full relative transition-colors ${settings.allowDelivery ? 'bg-emerald-500' : 'bg-slate-200'}`}><div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${settings.allowDelivery ? 'left-8' : 'left-1'}`}></div></button>
                </div>
                <div className={`p-8 rounded-[2.5rem] border-2 transition-all flex items-center justify-between ${settings.allowPickup ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-slate-100 bg-white opacity-60'}`}>
                  <div className="flex items-center gap-6"><Store size={32} className={settings.allowPickup ? 'text-emerald-600' : 'text-slate-300'} /> <span className="font-black uppercase text-sm">Activar Recojo</span></div>
                  <button onClick={() => setSettings({...settings, allowPickup: !settings.allowPickup})} className={`w-14 h-7 rounded-full relative transition-colors ${settings.allowPickup ? 'bg-emerald-500' : 'bg-slate-200'}`}><div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${settings.allowPickup ? 'left-8' : 'left-1'}`}></div></button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pickupLocations.map(loc => (
                  <div key={loc.id} className="bg-white p-8 rounded-[2.5rem] border shadow-sm space-y-4 relative group">
                    <button onClick={() => setPickupLocations(pickupLocations.filter(x => x.id !== loc.id))} className="absolute top-6 right-6 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button>
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin size={14} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Datos de Sede</span>
                    </div>
                    <input value={loc.name} onChange={e => setPickupLocations(pickupLocations.map(l => l.id === loc.id ? {...l, name: e.target.value} : l))} placeholder="Nombre del Local" className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-xs font-black uppercase outline-none focus:bg-white transition-all" />
                    <input value={loc.address} onChange={e => setPickupLocations(pickupLocations.map(l => l.id === loc.id ? {...l, address: e.target.value} : l))} placeholder="Dirección Completa" className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-xs font-bold outline-none focus:bg-white transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: MARKETING */}
          {activeTab === 'marketing' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Marketing Visual</h2>
                <button onClick={() => setSettings({...settings, heroSlides: [...settings.heroSlides, { id: Date.now().toString(), badge: "NUEVO", title: "Nuevo Título", highlight: "PROMOCIÓN", subtitle: "", description: "", image: "", cta: "Comprar", isActive: true }]})} className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase shadow-lg hover:scale-105 transition-transform"><Plus size={16} /> Añadir Diapositiva</button>
              </div>
              <div className="space-y-6">
                {settings.heroSlides.map((s, idx) => (
                  <div key={s.id} className="bg-white p-8 rounded-[2.5rem] border shadow-sm flex gap-6 items-center group relative overflow-hidden">
                    <div className="w-40 aspect-video bg-slate-100 rounded-xl overflow-hidden shrink-0 border shadow-inner">
                      {s.image ? <img src={s.image} className="w-full h-full object-cover" /> : <ImageIcon className="m-auto text-slate-300" />}
                    </div>
                    <div className="flex-1 space-y-2">
                       <input value={s.title} onChange={e => { const up = [...settings.heroSlides]; up[idx].title = e.target.value; setSettings({...settings, heroSlides: up}); }} className="w-full bg-slate-50 border rounded-lg px-4 py-2 text-xs font-black uppercase outline-none focus:bg-white transition-all" placeholder="Título Principal" />
                       <input value={s.image} onChange={e => { const up = [...settings.heroSlides]; up[idx].image = e.target.value; setSettings({...settings, heroSlides: up}); }} className="w-full bg-slate-50 border rounded-lg px-4 py-2 text-[10px] font-bold outline-none focus:bg-white transition-all" placeholder="URL de la imagen del banner" />
                    </div>
                    <button onClick={() => setSettings({...settings, heroSlides: settings.heroSlides.filter(x => x.id !== s.id)})} className="text-rose-500 hover:bg-rose-50 p-3 rounded-xl transition-all"><Trash2 size={20} /></button>
                  </div>
                ))}
              </div>

              <div className="pt-10 border-t border-slate-200">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><BellRing size={16} /> Popup de Oferta Inicial</h3>
                    <button onClick={() => setSettings({...settings, promoActive: !settings.promoActive})} className={`w-16 h-8 rounded-full relative transition-colors ${settings.promoActive ? 'bg-emerald-500' : 'bg-slate-200'}`}><div className={`absolute top-1.5 w-5 h-5 bg-white rounded-full transition-all ${settings.promoActive ? 'left-9' : 'left-1.5'}`}></div></button>
                 </div>
                 <div className={`bg-white p-10 rounded-[3rem] border shadow-sm grid grid-cols-2 gap-10 transition-opacity ${settings.promoActive ? 'opacity-100' : 'opacity-40'}`}>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase text-slate-400">Título del Popup</label>
                       <input value={settings.promoTitle} onChange={e => setSettings({...settings, promoTitle: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-6 py-3 text-sm font-black uppercase" />
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase text-slate-400">URL Imagen Popup</label>
                       <input value={settings.promoImage} onChange={e => setSettings({...settings, promoImage: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-6 py-3 text-xs font-bold" />
                    </div>
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
