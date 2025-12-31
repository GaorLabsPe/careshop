
import React, { useState } from 'react';
import { 
  Search, Truck, CheckCircle2, Package, 
  MapPin, Clock, ArrowLeft, ShieldCheck, 
  PhoneCall, MessageCircle, Info, ChevronRight,
  Loader2, AlertCircle
} from 'lucide-react';
import { StoreSettings, Order } from '../types';

interface TrackingProps {
  onNavigate: (page: string) => void;
  storeSettings: StoreSettings;
  orders: Order[];
}

const Tracking: React.FC<TrackingProps> = ({ onNavigate, storeSettings, orders }) => {
  const [orderId, setOrderId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [orderStatus, setOrderStatus] = useState<Order | null>(null);
  const [error, setError] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;
    
    setIsSearching(true);
    setError(false);
    
    // Búsqueda en el estado real de órdenes
    setTimeout(() => {
      const foundOrder = orders.find(o => o.id.toLowerCase() === orderId.toLowerCase());
      if (foundOrder) {
        setOrderStatus(foundOrder);
      } else {
        setError(true);
        setOrderStatus(null);
      }
      setIsSearching(false);
    }, 1000);
  };

  const getActiveStepIndex = (order: Order) => {
    return order.history.filter(h => h.completed).length - 1;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 py-6 sm:py-10">
        <div className="max-w-[1440px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('home')} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all"><ArrowLeft size={20} /></button>
            <div>
              <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tighter uppercase">Rastrear Pedido</h1>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Sigue tu salud en tiempo real</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3 bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100">
             <ShieldCheck className="text-emerald-500" size={24} />
             <span className="text-[10px] font-black uppercase text-emerald-800 tracking-widest">Seguimiento Seguro</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-10 space-y-8">
        {!orderStatus && (
          <div className="bg-white p-8 sm:p-16 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 text-center space-y-8 animate-in fade-in zoom-in-95">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Search size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Ingresa los datos de tu orden</h2>
              <p className="text-slate-400 text-sm font-medium">Usa el código S00XXX proporcionado al finalizar tu compra.</p>
            </div>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="text" 
                placeholder="Ej: S00123"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-emerald-500 transition-all outline-none"
              />
              <button 
                type="submit"
                disabled={isSearching}
                className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {isSearching ? <Loader2 className="animate-spin" size={16} /> : 'Rastrear'}
              </button>
            </form>
            {error && (
              <div className="flex items-center justify-center gap-2 text-rose-500 text-xs font-black uppercase tracking-widest mt-4 animate-bounce">
                <AlertCircle size={16} /> Pedido no encontrado
              </div>
            )}
          </div>
        )}

        {orderStatus && (
          <div className="space-y-6 animate-in slide-in-from-bottom-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
                    <Package size={32} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pedido Identificado</p>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{orderStatus.id}</h2>
                  </div>
               </div>
               <button onClick={() => setOrderStatus(null)} className="text-[9px] font-black uppercase text-slate-400 hover:text-slate-600 tracking-widest">Nueva Búsqueda</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Timeline Dinámico */}
              <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
                 <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-10 border-l-4 border-emerald-500 pl-4">Línea de Tiempo</h3>
                 <div className="space-y-12 relative">
                    <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-slate-100"></div>
                    {orderStatus.history.map((step, idx) => (
                      <div key={idx} className="relative flex gap-8 group">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${step.completed ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-100 text-slate-300'}`}>
                            {step.completed && idx < getActiveStepIndex(orderStatus) ? <CheckCircle2 size={20} /> : <div className="w-2 h-2 bg-current rounded-full" />}
                         </div>
                         <div className="flex-1 pb-2">
                            <div className="flex justify-between items-center mb-1">
                               <p className={`text-sm font-black uppercase tracking-tight ${step.completed ? 'text-slate-900' : 'text-slate-300'}`}>{step.title}</p>
                               <span className="text-[10px] font-bold text-slate-400">{step.time}</span>
                            </div>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed">{step.desc}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full"></div>
                    <div className="relative z-10 space-y-6">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center"><Truck size={24} /></div>
                          <div>
                            <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Tu Repartidor</p>
                            <p className="text-lg font-black tracking-tight">Asignado al Despachar</p>
                          </div>
                       </div>
                       <p className="text-[11px] text-slate-400 font-medium">Entrega estimada: Hoy mismo</p>
                    </div>
                 </div>

                 <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                    <div className="flex items-center gap-3 text-emerald-600 mb-2">
                       <Info size={18} />
                       <span className="text-[10px] font-black uppercase tracking-widest">Aviso Importante</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      Si tienes dudas sobre la cadena de frío de tus medicamentos, contacta a un farmacéutico.
                    </p>
                    <button 
                      onClick={() => onNavigate('home')}
                      className="w-full py-4 border-2 border-slate-50 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                    >
                      Volver a la tienda <ChevronRight size={14} />
                    </button>
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tracking;
