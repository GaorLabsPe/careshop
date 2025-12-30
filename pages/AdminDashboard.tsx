
import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { OdooService } from '../services/odooService';
import { supabase } from '../services/supabaseClient';
import { 
  Settings, Database, Palette, Save, Lock, 
  ShieldCheck, RefreshCw, CheckCircle2, AlertCircle, 
  Store, Cloud, Layout, ArrowRight, Plus, Trash2,
  ExternalLink, LogOut
} from 'lucide-react';
import { StoreConfig } from '../types';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { config, updateConfig, isOdooConnected, setOdooConnected } = useStore();
  const [view, setView] = useState<'stores' | 'edit'>('stores');
  const [stores, setStores] = useState<StoreConfig[]>([]);
  const [formData, setFormData] = useState(config);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Cargar lista de tiendas para el SuperAdmin
  useEffect(() => {
    const loadStores = async () => {
      const { data } = await supabase.from('stores').select('*');
      if (data) setStores(data as StoreConfig[]);
    };
    loadStores();
  }, []);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    const result = await OdooService.checkConnection(formData);
    setTestResult(result);
    setOdooConnected(result.success);
    setIsTesting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateConfig(formData);
    setIsSaving(false);
    setView('stores');
  };

  const handleCreateNewStore = () => {
    const newStore: StoreConfig = {
      name: 'Nueva Farmacia',
      primaryColor: '#10B981',
      accentColor: '#F97316',
      odooUrl: '',
      odooDb: '',
      odooUser: '',
      odooKey: ''
    };
    setFormData(newStore);
    setView('edit');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header SaaS Pro */}
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-emerald-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Cloud size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase font-ubuntu">careshop <span className="text-emerald-500">SaaS</span></h1>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <ShieldCheck size={12} className="text-emerald-500" /> Super Administrador
                </span>
                <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   Engine v2.5.0
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
             <button 
               onClick={onLogout}
               className="p-4 bg-slate-100 text-slate-500 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all shadow-sm"
             >
                <LogOut size={20} />
             </button>
             <button onClick={() => window.open('/', '_blank')} className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl">
                Ir a Tienda Principal <ExternalLink size={14} />
             </button>
          </div>
        </div>

        {view === 'stores' ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-wider flex items-center gap-3">
                <Store className="text-emerald-500" /> Perfiles de Tienda
              </h2>
              <button 
                onClick={handleCreateNewStore}
                className="bg-emerald-500 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-lg"
              >
                <Plus size={16} /> Crear Nueva Tienda
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stores.length === 0 ? (
                <div className="col-span-full py-20 text-center space-y-4 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                   <Store size={48} className="mx-auto text-slate-200" />
                   <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No hay tiendas configuradas</p>
                </div>
              ) : (
                stores.map(store => (
                  <div key={store.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform"></div>
                    <div className="relative z-10 space-y-6">
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: store.primaryColor }}>
                          <Store size={24} />
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${store.odooUrl ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                          {store.odooUrl ? 'Configurada' : 'Pendiente'}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-800 tracking-tight">{store.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{store.odooUrl || 'Sin URL Odoo'}</p>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button 
                          onClick={() => { setFormData(store); setView('edit'); }}
                          className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
                        >
                          <Settings size={14} /> Configurar
                        </button>
                        <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-right-10 duration-500">
            <div className="lg:col-span-2 space-y-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 uppercase tracking-wider font-ubuntu">
                      <Database className="text-emerald-500" /> Parámetros XML-RPC Odoo
                    </h3>
                    <button type="button" onClick={() => setView('stores')} className="text-[10px] font-black text-slate-400 uppercase hover:text-slate-600">Cancelar</button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Endpoint URL</label>
                      <input 
                        type="url" 
                        value={formData.odooUrl}
                        onChange={e => setFormData({...formData, odooUrl: e.target.value})}
                        placeholder="https://instancia.odoo.com"
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm focus:border-emerald-500 focus:bg-white outline-none transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Base de Datos</label>
                      <input 
                        type="text" 
                        value={formData.odooDb}
                        onChange={e => setFormData({...formData, odooDb: e.target.value})}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm focus:border-emerald-500 focus:bg-white outline-none transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Usuario</label>
                      <input 
                        type="text" 
                        value={formData.odooUser}
                        onChange={e => setFormData({...formData, odooUser: e.target.value})}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm focus:border-emerald-500 focus:bg-white outline-none transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">API Key</label>
                      <div className="relative">
                        <input 
                          type="password" 
                          value={formData.odooKey}
                          onChange={e => setFormData({...formData, odooKey: e.target.value})}
                          className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm focus:border-emerald-500 focus:bg-white outline-none transition-all font-medium"
                        />
                        <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      type="button" 
                      onClick={handleTestConnection}
                      disabled={isTesting}
                      className="flex-1 bg-slate-900 text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-800 transition-all"
                    >
                      {isTesting ? <RefreshCw className="animate-spin" size={18} /> : <Database size={18} />}
                      Probar Odoo
                    </button>
                    <button 
                      type="submit"
                      disabled={isSaving}
                      className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20"
                    >
                      {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                      Desplegar Tienda
                    </button>
                  </div>

                  {testResult && (
                    <div className={`p-4 rounded-2xl flex items-center gap-3 ${testResult.success ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                      {testResult.success ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                      <span className="text-xs font-bold">{testResult.message}</span>
                    </div>
                  )}
                </div>
              </form>
            </div>

            <div className="space-y-8">
              <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 space-y-6">
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-3 uppercase tracking-wider font-ubuntu">
                  <Palette className="text-orange-500" /> Branding
                </h3>
                
                <div className="space-y-5">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nombre Comercial</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-xs font-bold focus:border-emerald-500 outline-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Primario</label>
                      <input 
                        type="color" 
                        value={formData.primaryColor}
                        onChange={e => setFormData({...formData, primaryColor: e.target.value})}
                        className="w-full h-12 rounded-xl cursor-pointer border-2 border-slate-100 bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Acento</label>
                      <input 
                        type="color" 
                        value={formData.accentColor}
                        onChange={e => setFormData({...formData, accentColor: e.target.value})}
                        className="w-full h-12 rounded-xl cursor-pointer border-2 border-slate-100 bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 p-8 rounded-[3rem] text-white space-y-4">
                 <div className="flex items-center gap-2 text-emerald-400">
                    <ShieldCheck size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest">SaaS Security Suite</span>
                 </div>
                 <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    Cada perfil de tienda es independiente. Al crear una nueva tienda, se genera un entorno aislado para los datos de pacientes y órdenes.
                 </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] py-4">
           GAORSYSTEM PERU • SAAS PHARMACY ENGINE v2.5.0
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
