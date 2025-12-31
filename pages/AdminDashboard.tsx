
import React, { useState, useMemo } from 'react';
import { 
  Database, Palette, Layers, CreditCard, MapPin, X, Plus, Trash2, Check, 
  Search, RefreshCw, Sparkles, ClipboardList, Globe, Trash,
  Image as ImageIcon, Upload, QrCode, Settings2, ArrowRight, Layout, 
  Camera, Instagram, Facebook, Music2, MessageCircle, Truck, Store, 
  Lock, UserCheck, ShieldAlert, Monitor, LogOut, Eye, EyeOff, Flag
} from 'lucide-react';
import { OdooService } from '../services/odooService';
import { OdooSession, StoreSettings, PickupLocation, WebCategoryMap, Category, Order, HeroSlide, OrderStatus, UserRole } from '../types';
import { PRODUCTS as MOCK_PRODUCTS } from '../data/mockData';

const LATAM_COUNTRIES = [
  { name: 'Perú', code: 'PEN', symbol: 'S/', locale: 'es-PE' },
  { name: 'México', code: 'MXN', symbol: '$', locale: 'es-MX' },
  { name: 'Colombia', code: 'COP', symbol: '$', locale: 'es-CO' },
  { name: 'Chile', code: 'CLP', symbol: '$', locale: 'es-CL' },
  { name: 'Argentina', code: 'ARS', symbol: '$', locale: 'es-AR' },
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('brand');
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [odooCategories, setOdooCategories] = useState<{id: number, name: string}[]>([]);
  const [odooProducts, setOdooProducts] = useState<any[]>([]);
  const [currentUid, setCurrentUid] = useState<number | null>(session?.uid || null);

  const [form, setForm] = useState({
    url: session?.url || '',
    db: session?.db || '',
    user: session?.username || '',
    pass: session?.apiKey || ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Luis2021.') {
      setIsAuthenticated(true);
      setUserRole(UserRole.Admin);
      setActiveTab('erp');
    } else if (password === 'Tienda2021.') {
      setIsAuthenticated(true);
      setUserRole(UserRole.Client);
      setActiveTab('brand');
    } else { alert("Contraseña Incorrecta"); }
  };

  const connectERP = async () => {
    setIsLoading(true);
    try {
      const { uid, client } = await OdooService.connect(form.url, form.db, form.user, form.pass);
      setCurrentUid(uid);
      const comps = await client.execute(uid, form.pass, 'res.company', 'search_read', [[]], { fields: ['id', 'name'] });
      setCompanies(comps);
      const cats = await client.execute(uid, form.pass, 'product.category', 'search_read', [[]], { fields: ['id', 'name'] });
      setOdooCategories(cats);
      const prods = await client.execute(uid, form.pass, 'product.product', 'search_read', [['sale_ok', '=', true]], { fields: ['id', 'name', 'list_price'] });
      setOdooProducts(prods);
    } catch (e: any) { alert(e.message || "Error Odoo"); }
    finally { setIsLoading(false); }
  };

  const selectCompany = (companyId: number) => {
    if (currentUid) {
      setSession({ url: form.url, db: form.db, username: form.user, apiKey: form.pass, uid: currentUid, companyId, useProxy: true });
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

  const updateSlide = (id: string, updates: Partial<HeroSlide>) => {
    setSettings({ ...settings, heroSlides: settings.heroSlides.map(s => s.id === id ? { ...s, ...updates } : s) });
  };

  const updateMapping = (odooId: number, webCat: Category) => {
    const exists = categoryMappings.find(m => m.odooCategoryId === odooId);
    if (exists) setCategoryMappings(categoryMappings.map(m => m.odooCategoryId === odooId ? { ...m, webCategory: webCat } : m));
    else setCategoryMappings([...categoryMappings, { odooCategoryId: odooId, webCategory: webCat }]);
  };

  const filteredItems = useMemo(() => {
    const base = odooProducts.length > 0 ? odooProducts : MOCK_PRODUCTS;
    return base.filter(p => (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()));
  }, [odooProducts, searchTerm]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-cabin">
        <div className="max-w-md w-full bg-white rounded-[3.5rem] p-12 shadow-2xl space-y-8 animate-in zoom-in-95">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-emerald-500 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl">
              <Lock size={40} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 uppercase italic">careShop <span className="text-emerald-500 underline decoration-slate-900">Security</span></h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sistema de Gestión de Farmacias</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 font-black text-center outline-none focus:border-emerald-500"
                placeholder="CONTRASEÑA"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl active:scale-95">
              Acceder al Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'erp', label: 'Infraestructura Odoo', icon: <Database size={18} />, adminOnly: true },
    { id: 'brand', label: 'Identidad y Logos', icon: <Palette size={18} />, adminOnly: false },
    { id: 'ops', label: 'Operaciones y Ventas', icon: <Truck size={18} />, adminOnly: false },
    { id: 'marketing', label: 'Marketing Web', icon: <Sparkles size={18} />, adminOnly: false },
    { id: 'mapping', label: 'Mapeo ERP', icon: <Settings2 size={18} />, adminOnly: true },
    { id: 'catalog', label: 'Control Catálogo', icon: <Layers size={18} />, adminOnly: true },
    { id: 'payments', label: 'Pagos QR', icon: <CreditCard size={18} />, adminOnly: false },
  ].filter(item => !item.adminOnly || userRole === UserRole.Admin);

  return (
    <div className="min-h-screen bg-slate-50 flex font-cabin">
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-xl z-30 sticky top-0 h-screen">
        <div className="p-10 border-b text-center space-y-2">
          <h1 className="text-2xl font-black text-slate-900 uppercase italic">careShop <span className="text-emerald-500">Panel</span></h1>
          <div className="flex items-center justify-center gap-2 bg-emerald-50 py-1.5 rounded-full">
            <UserCheck size={12} className="text-emerald-500" />
            <span className="text-[9px] font-black uppercase text-emerald-600 tracking-widest">{userRole === UserRole.Admin ? 'Super Admin' : 'Business User'}</span>
          </div>
        </div>
        <nav className="flex-1 p-6 space-y-1 overflow-y-auto no-scrollbar">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === item.id ? 'bg-slate-900 text-white shadow-xl translate-x-2' : 'text-slate-500 hover:bg-slate-50'}`}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t space-y-3">
          <button onClick={() => onNavigate('home')} className="w-full py-4 bg-emerald-50 text-emerald-600 rounded-xl font-black uppercase text-[10px] tracking-widest">Ver Tienda</button>
          <button onClick={() => setIsAuthenticated(false)} className="w-full py-4 text-slate-400 font-black uppercase text-[10px] tracking-widest flex justify-center items-center gap-2 hover:text-rose-500"><LogOut size={14} /> Cerrar Sesión</button>
        </div>
      </aside>

      <main className="flex-1 p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-12 pb-24">
          
          {/* BRAND TAB */}
          {activeTab === 'brand' && (
            <div className="space-y-10 animate-in fade-in">
              <h2 className="text-4xl font-black text-slate-900 uppercase italic">Identidad Visual</h2>
              <div className="bg-white p-12 rounded-[3.5rem] border shadow-sm space-y-12">
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-6">Nombre del Ecommerce</label>
                  <input value={settings.storeName} onChange={e => setSettings({...settings, storeName: e.target.value})} className="w-full bg-slate-50 border-2 rounded-[2rem] px-10 py-6 text-3xl font-black uppercase outline-none focus:border-emerald-500" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-6">Logo Navbar (Claro)</label>
                    <div className="aspect-video bg-slate-50 border-2 border-dashed rounded-[3rem] flex flex-col items-center justify-center relative group overflow-hidden shadow-inner">
                       {settings.logoUrl ? <img src={settings.logoUrl} className="max-h-20 object-contain" /> : <ImageIcon size={48} className="text-slate-200" />}
                       <input type="file" onChange={e => handleFileUpload(e, (url) => setSettings({...settings, logoUrl: url}))} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-6">Logo Footer (Oscuro)</label>
                    <div className="aspect-video bg-slate-900 border-2 border-dashed border-slate-700 rounded-[3rem] flex flex-col items-center justify-center relative group overflow-hidden">
                       {settings.footerLogoUrl ? <img src={settings.footerLogoUrl} className="max-h-20 object-contain" /> : <ImageIcon size={48} className="text-slate-700" />}
                       <input type="file" onChange={e => handleFileUpload(e, (url) => setSettings({...settings, footerLogoUrl: url}))} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  </div>
                </div>

                <div className="pt-10 border-t space-y-6">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2"><Globe size={14} /> Configuración de Moneda y País</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-4">País de Operación</label>
                       <select 
                         value={settings.country} 
                         onChange={e => {
                           const c = LATAM_COUNTRIES.find(x => x.name === e.target.value);
                           if (c) setSettings({...settings, country: c.name, currencyCode: c.code, currencySymbol: c.symbol, locale: c.locale});
                         }}
                         className="w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 font-black uppercase text-xs outline-none"
                       >
                         {LATAM_COUNTRIES.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
                       </select>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-2xl flex items-center justify-between text-white">
                       <div className="flex items-center gap-4">
                          <Flag size={20} className="text-emerald-500" />
                          <div>
                            <p className="text-[8px] font-black uppercase text-slate-500">Moneda Activa</p>
                            <p className="text-lg font-black uppercase tracking-widest">{settings.currencyCode} ({settings.currencySymbol})</p>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* OPERATIONS TAB */}
          {activeTab === 'ops' && (
            <div className="space-y-10 animate-in fade-in">
              <h2 className="text-4xl font-black text-slate-900 uppercase italic">Operaciones y Ventas</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-10 rounded-[3.5rem] border shadow-sm space-y-8">
                   <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2"><Truck size={16} /> Controles de Despacho</h3>
                   <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border-2 transition-all">
                        <div><p className="font-black text-sm uppercase">Envío a Domicilio</p><p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Habilitar Delivery</p></div>
                        <button onClick={() => setSettings({...settings, allowDelivery: !settings.allowDelivery})} className={`w-14 h-8 rounded-full relative transition-all ${settings.allowDelivery ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.allowDelivery ? 'left-7' : 'left-1'}`}></div>
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border-2 transition-all">
                        <div><p className="font-black text-sm uppercase">Recojo en Tienda</p><p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Habilitar Pickup</p></div>
                        <button onClick={() => setSettings({...settings, allowPickup: !settings.allowPickup})} className={`w-14 h-8 rounded-full relative transition-all ${settings.allowPickup ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.allowPickup ? 'left-7' : 'left-1'}`}></div>
                        </button>
                      </div>
                   </div>
                </div>

                <div className="bg-white p-10 rounded-[3.5rem] border shadow-sm space-y-8">
                   <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2"><Store size={16} /> Sedes de Recojo</h3>
                      <button onClick={() => setPickupLocations([...pickupLocations, {id: Date.now().toString(), name: "NUEVA SEDE", address: "", city: "", phone: ""}])} className="text-emerald-500 hover:scale-110 transition-transform"><Plus size={24} /></button>
                   </div>
                   <div className="space-y-4 overflow-y-auto max-h-[300px] pr-2 no-scrollbar">
                      {pickupLocations.map((loc, idx) => (
                        <div key={loc.id} className="p-6 bg-slate-50 rounded-[2rem] border-2 space-y-4 relative group">
                           <button onClick={() => setPickupLocations(pickupLocations.filter(l => l.id !== loc.id))} className="absolute top-6 right-6 text-slate-300 hover:text-rose-500 transition-colors"><Trash size={16} /></button>
                           <input value={loc.name} onChange={e => { const up = [...pickupLocations]; up[idx].name = e.target.value; setPickupLocations(up); }} className="bg-transparent font-black uppercase text-sm w-full outline-none focus:text-emerald-500" placeholder="Nombre de Sede" />
                           <div className="grid grid-cols-2 gap-4">
                              <input value={loc.address} onChange={e => { const up = [...pickupLocations]; up[idx].address = e.target.value; setPickupLocations(up); }} className="bg-white border p-3 rounded-xl text-[10px] font-bold" placeholder="Dirección" />
                              <input value={loc.phone} onChange={e => { const up = [...pickupLocations]; up[idx].phone = e.target.value; setPickupLocations(up); }} className="bg-white border p-3 rounded-xl text-[10px] font-bold" placeholder="Teléfono" />
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              <div className="bg-white rounded-[3.5rem] border shadow-sm overflow-hidden">
                <div className="p-10 border-b flex justify-between items-center">
                   <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2"><ClipboardList size={18} /> Monitor de Ventas</h3>
                   <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{orders.length} Pedidos Reales</span>
                </div>
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b">
                    <tr><th className="px-10 py-6">ID Pedido</th><th className="px-10 py-6">Cliente</th><th className="px-10 py-6">Estatus</th><th className="px-10 py-6 text-right">Total</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {orders.length === 0 ? (
                      <tr><td colSpan={4} className="px-10 py-20 text-center text-slate-300 italic uppercase text-[10px] font-black">No hay transacciones registradas</td></tr>
                    ) : (
                      orders.map(o => (
                        <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-10 py-6 font-black text-xs text-slate-900">{o.id}</td>
                          <td className="px-10 py-6 font-bold text-xs uppercase text-slate-500">{o.customerName}</td>
                          <td className="px-10 py-6">
                            <select 
                              value={o.status} 
                              onChange={(e) => onUpdateOrder(o.id, { status: e.target.value as OrderStatus })}
                              className="bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-black uppercase px-4 py-2 outline-none border border-emerald-100"
                            >
                              <option value="received">Recibido</option>
                              <option value="validated">Validado</option>
                              <option value="preparing">Preparando</option>
                              <option value="shipped">Enviado</option>
                              <option value="delivered">Entregado</option>
                            </select>
                          </td>
                          <td className="px-10 py-6 text-right font-black text-slate-900 text-lg">{settings.currencySymbol}{o.total.toFixed(2)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MAPPING TAB */}
          {activeTab === 'mapping' && (
            <div className="space-y-10 animate-in fade-in">
               <h2 className="text-4xl font-black text-slate-900 uppercase italic">Mapeo de ERP a Web</h2>
               <div className="bg-white p-12 rounded-[3.5rem] border shadow-sm space-y-6">
                {odooCategories.length === 0 ? (
                  <div className="py-24 text-center space-y-6">
                    <Database size={48} className="mx-auto text-slate-100" />
                    <p className="text-slate-300 font-black uppercase text-xs">Sincroniza con Odoo para mapear categorías</p>
                  </div>
                ) : (
                  odooCategories.map(cat => (
                    <div key={cat.id} className="flex items-center justify-between p-8 bg-slate-50 rounded-[2.5rem] border-2 transition-all hover:border-emerald-500">
                      <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Odoo ID: {cat.id}</p><p className="font-black uppercase text-slate-800">{cat.name}</p></div>
                      <div className="flex items-center gap-6">
                         <ArrowRight className="text-slate-200" />
                         <select 
                           value={categoryMappings.find(m => m.odooCategoryId === cat.id)?.webCategory || Category.Medicamentos}
                           onChange={e => updateMapping(cat.id, e.target.value as Category)}
                           className="bg-white border-2 border-slate-100 rounded-xl px-6 py-3 text-[10px] font-black uppercase outline-none focus:border-emerald-500"
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

          {/* CATALOG TAB */}
          {activeTab === 'catalog' && (
            <div className="space-y-10 animate-in fade-in">
               <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <h2 className="text-4xl font-black text-slate-900 uppercase italic">Control de Catálogo</h2>
                  <div className="relative w-full md:w-80 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                    <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar producto..." className="w-full bg-white border-2 rounded-2xl py-5 pl-16 pr-6 text-xs font-black uppercase shadow-sm outline-none focus:border-emerald-500" />
                  </div>
               </div>
               <div className="bg-white rounded-[3.5rem] border shadow-sm overflow-hidden">
                 <table className="w-full text-left">
                   <thead className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
                     <tr><th className="px-12 py-7">Producto Web / Odoo</th><th className="px-12 py-7 text-center">Estatus Web</th></tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {filteredItems.map(p => {
                       const idNum = p.id.toString().includes('odoo-') ? Number(p.id.toString().split('-')[1]) : Number(p.id);
                       const isPub = publishedIds.includes(idNum) || p.published;
                       return (
                         <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                           <td className="px-12 py-7">
                             <p className="font-black text-xs uppercase text-slate-800">{p.name}</p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{p.brand} | {settings.currencySymbol}{p.price.toFixed(2)}</p>
                           </td>
                           <td className="px-12 py-7 text-center">
                             <button 
                               onClick={() => setPublishedIds(isPub ? publishedIds.filter(i => i !== idNum) : [...publishedIds, idNum])}
                               className={`px-8 py-3 rounded-2xl text-[9px] font-black uppercase transition-all border-2 ${isPub ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-100 text-slate-300 border-slate-100'}`}
                             >
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

          {/* ERP TAB */}
          {activeTab === 'erp' && (
            <div className="space-y-10 animate-in fade-in">
              <h2 className="text-4xl font-black text-slate-900 uppercase italic">Infraestructura Odoo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border space-y-4">
                  <div className="space-y-4">
                    <input value={form.url} onChange={e => setForm({...form, url: e.target.value})} placeholder="URL Odoo (ej: https://su-empresa.odoo.com)" className="w-full bg-slate-50 border-2 rounded-2xl px-8 py-5 text-sm font-bold" />
                    <input value={form.db} onChange={e => setForm({...form, db: e.target.value})} placeholder="Nombre de la Base de Datos" className="w-full bg-slate-50 border-2 rounded-2xl px-8 py-5 text-sm font-bold" />
                    <input value={form.user} onChange={e => setForm({...form, user: e.target.value})} placeholder="Email de Usuario" className="w-full bg-slate-50 border-2 rounded-2xl px-8 py-5 text-sm font-bold" />
                    <input type="password" value={form.pass} onChange={e => setForm({...form, pass: e.target.value})} placeholder="API Key / Contraseña" className="w-full bg-slate-50 border-2 rounded-2xl px-8 py-5 text-sm font-bold" />
                  </div>
                  <button onClick={connectERP} className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl hover:bg-emerald-600 transition-all">
                    <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} /> {isLoading ? 'Estableciendo Vínculo...' : 'Conectar Infraestructura'}
                  </button>
                </div>
                <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border flex flex-col min-h-[400px]">
                   <h3 className="text-[10px] font-black uppercase mb-8 text-slate-400 tracking-[0.3em] ml-6">Sedes de Negocio Detectadas</h3>
                   <div className="space-y-4 overflow-y-auto max-h-[450px] pr-4 no-scrollbar">
                      {companies.map(c => (
                        <button key={c.id} onClick={() => selectCompany(c.id)} className={`w-full p-6 rounded-[2rem] border-2 text-left font-black text-xs uppercase flex justify-between items-center transition-all ${session?.companyId === c.id ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/10' : 'border-slate-50 hover:bg-slate-50'}`}>
                           {c.name} {session?.companyId === c.id && <Check size={18} className="text-emerald-500" strokeWidth={3} />}
                        </button>
                      ))}
                      {companies.length === 0 && <p className="text-center py-24 text-slate-300 italic font-black uppercase text-[10px]">Realiza la conexión para cargar sedes</p>}
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* MARKETING TAB */}
          {activeTab === 'marketing' && (
            <div className="space-y-10 animate-in fade-in">
              <h2 className="text-4xl font-black text-slate-900 uppercase italic">Marketing y Banners</h2>
              <div className="bg-white p-12 rounded-[3.5rem] border shadow-sm space-y-12">
                <div className="space-y-6">
                   <div className="flex items-center justify-between p-8 bg-slate-900 text-white rounded-[2.5rem] relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl"></div>
                      <div className="relative z-10"><h3 className="text-xl font-black uppercase tracking-tighter">Popup Promocional</h3><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Ventana emergente al iniciar</p></div>
                      <button onClick={() => setSettings({...settings, promoActive: !settings.promoActive})} className={`w-16 h-10 rounded-full relative transition-all ${settings.promoActive ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                        <div className={`absolute top-1.5 w-7 h-7 bg-white rounded-full transition-all ${settings.promoActive ? 'left-7.5' : 'left-1.5'}`}></div>
                      </button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                         <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Imagen Popup</label>
                         <div className="aspect-video bg-slate-50 border-2 border-dashed rounded-[2rem] flex items-center justify-center relative overflow-hidden">
                            {settings.promoImage ? <img src={settings.promoImage} className="w-full h-full object-cover" /> : <ImageIcon size={32} className="text-slate-200" />}
                            <input type="file" onChange={e => handleFileUpload(e, (url) => setSettings({...settings, promoImage: url}))} className="absolute inset-0 opacity-0 cursor-pointer" />
                         </div>
                      </div>
                      <div className="space-y-4">
                         <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Título Promo</label>
                         <textarea value={settings.promoTitle} onChange={e => setSettings({...settings, promoTitle: e.target.value})} className="w-full bg-slate-50 border-2 rounded-[2rem] px-8 py-6 text-sm font-black uppercase outline-none focus:border-emerald-500" rows={4} />
                      </div>
                   </div>
                </div>

                <div className="pt-10 border-t space-y-8">
                   <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2"><Layout size={18} /> Hero Sliders (Home)</h3>
                      <button onClick={() => setSettings({...settings, heroSlides: [...settings.heroSlides, { id: Date.now().toString(), badge: "NEW", title: "Nuevo", highlight: "Banner", subtitle: "", description: "", image: "", cta: "Ver", isActive: true }]})} className="bg-emerald-500 text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-emerald-600 shadow-xl shadow-emerald-500/20">
                        <Plus size={16} /> Añadir Slide
                      </button>
                   </div>
                   <div className="space-y-8">
                      {settings.heroSlides.map((slide) => (
                        <div key={slide.id} className="p-10 bg-slate-50 rounded-[3rem] border-2 relative grid grid-cols-1 md:grid-cols-2 gap-10 group">
                           <button onClick={() => setSettings({...settings, heroSlides: settings.heroSlides.filter(s => s.id !== slide.id)})} className="absolute top-8 right-8 text-slate-200 hover:text-rose-500 transition-colors"><Trash2 size={24} /></button>
                           <div className="space-y-4">
                              <input value={slide.title} onChange={e => updateSlide(slide.id, {title: e.target.value})} className="w-full bg-white border-2 rounded-xl px-6 py-4 text-xs font-black uppercase" placeholder="Título" />
                              <input value={slide.highlight} onChange={e => updateSlide(slide.id, {highlight: e.target.value})} className="w-full bg-white border-2 rounded-xl px-6 py-4 text-xs font-black uppercase text-emerald-600" placeholder="Resaltado" />
                              <input value={slide.badge} onChange={e => updateSlide(slide.id, {badge: e.target.value})} className="w-full bg-white border-2 rounded-xl px-6 py-4 text-[10px] font-black uppercase" placeholder="Badge" />
                           </div>
                           <div className="space-y-4">
                              <div className="aspect-video bg-white rounded-[2rem] overflow-hidden border-2 border-dashed flex flex-col items-center justify-center relative shadow-inner">
                                 {slide.image ? <img src={slide.image} className="w-full h-full object-cover" /> : <ImageIcon size={48} className="text-slate-100" />}
                                 <input type="file" onChange={e => handleFileUpload(e, (url) => updateSlide(slide.id, {image: url}))} className="absolute inset-0 opacity-0 cursor-pointer" />
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* PAYMENTS TAB */}
          {activeTab === 'payments' && (
            <div className="space-y-10 animate-in fade-in">
              <h2 className="text-4xl font-black text-slate-900 uppercase italic">Billeteras y QR</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {settings.mobilePayments.map((p, idx) => (
                  <div key={p.id} className="bg-white p-12 rounded-[3.5rem] border shadow-sm relative space-y-8 group transition-all hover:border-emerald-500">
                    <button onClick={() => setSettings({...settings, mobilePayments: settings.mobilePayments.filter(x => x.id !== p.id)})} className="absolute top-10 right-10 text-slate-200 hover:text-rose-500 transition-colors"><Trash2 size={24} /></button>
                    <div className="flex flex-col items-center gap-10">
                       <div className="w-56 h-56 bg-slate-50 border-4 border-dashed rounded-[3rem] flex items-center justify-center relative group/qr overflow-hidden shadow-inner transition-all hover:bg-white">
                          {p.qrCodeUrl ? <img src={p.qrCodeUrl} className="w-full h-full object-contain" /> : <QrCode size={80} className="text-slate-100" />}
                          <input type="file" onChange={e => handleFileUpload(e, (url) => {
                             const up = [...settings.mobilePayments]; up[idx].qrCodeUrl = url; setSettings({...settings, mobilePayments: up});
                          })} className="absolute inset-0 opacity-0 cursor-pointer" />
                       </div>
                       <div className="w-full space-y-4">
                          <input value={p.name} onChange={e => { const up = [...settings.mobilePayments]; up[idx].name = e.target.value; setSettings({...settings, mobilePayments: up}); }} className="w-full bg-slate-50 border-2 rounded-2xl px-8 py-5 text-sm font-black uppercase outline-none focus:border-emerald-500" placeholder="Nombre (Ej: YAPE)" />
                          <input value={p.identifier} onChange={e => { const up = [...settings.mobilePayments]; up[idx].identifier = e.target.value; setSettings({...settings, mobilePayments: up}); }} className="w-full bg-slate-50 border-2 rounded-2xl px-8 py-5 text-sm font-bold outline-none focus:border-emerald-500" placeholder="Número Celular" />
                       </div>
                    </div>
                  </div>
                ))}
                <button onClick={() => setSettings({...settings, mobilePayments: [...settings.mobilePayments, {id: Date.now().toString(), name: "NUEVA", identifier: "", isActive: true}]})} className="border-4 border-dashed border-slate-200 rounded-[3.5rem] p-16 flex flex-col items-center justify-center gap-6 text-slate-300 hover:border-emerald-500 hover:text-emerald-500 transition-all bg-white shadow-sm">
                   <Plus size={80} strokeWidth={3} /><span className="text-xs font-black uppercase tracking-[0.4em]">Nueva Billetera QR</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
