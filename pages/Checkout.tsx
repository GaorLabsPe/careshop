
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { 
  ShieldCheck, CreditCard, Truck, Camera, 
  MapPin, CheckCircle2, ArrowRight, ArrowLeft,
  ShoppingBag, Pill, AlertCircle, QrCode, Phone,
  Store, Loader2
} from 'lucide-react';
import { PrescriptionStatus, PickupLocation, StoreSettings } from '../types';

interface CheckoutProps {
  onNavigate: (page: string, params?: any) => void;
  pickupLocations: PickupLocation[];
  settings: StoreSettings;
}

const Checkout: React.FC<CheckoutProps> = ({ onNavigate, pickupLocations, settings }) => {
  const { cart, totalPrice, clearCart } = useCart();
  const [method, setMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [selectedPickup, setSelectedPickup] = useState<string>(pickupLocations[0]?.id);
  const [paymentType, setPaymentType] = useState<'card' | 'yape' | 'plin'>('card');
  
  const [orderComplete, setOrderComplete] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [address, setAddress] = useState('');
  const [recipeUploaded, setRecipeUploaded] = useState(false);

  const needsPrescription = cart.some(item => item.prescription === PrescriptionStatus.Required);

  const getMyLocation = () => {
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setAddress(`Ubicación GPS: ${pos.coords.latitude}, ${pos.coords.longitude}`);
        setIsGettingLocation(false);
      },
      () => {
        alert("No se pudo obtener la ubicación");
        setIsGettingLocation(false);
      }
    );
  };

  const handleCompleteOrder = () => {
    setOrderComplete(true);
    setTimeout(() => clearCart(), 500);
  };

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-6 text-center space-y-8 animate-in zoom-in">
        <div className="w-32 h-32 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xl"><CheckCircle2 size={64} /></div>
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">¡Pedido Recibido!</h1>
        <p className="text-slate-500 font-medium">Su orden #PH-{Math.floor(Math.random() * 9999)} está siendo procesada.</p>
        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 grid grid-cols-2 gap-4">
          <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Entrega</p><p className="font-black text-emerald-600">{method === 'delivery' ? 'A Domicilio' : 'Recojo en Sede'}</p></div>
          <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pago</p><p className="font-black text-emerald-600 uppercase">{paymentType}</p></div>
        </div>
        <button onClick={() => onNavigate('home')} className="btn-action w-full py-5 rounded-2xl font-black uppercase tracking-widest">Seguir Comprando</button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="max-w-[1440px] mx-auto px-6 py-10">
        <div className="flex items-center gap-4 mb-10">
          <button onClick={() => onNavigate('home')} className="p-3 bg-white rounded-xl shadow-sm"><ArrowLeft size={20} /></button>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Checkout Final</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Logística */}
            <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-8">
              <div className="flex items-center gap-4 border-b pb-6">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><Truck size={24} /></div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">1. ¿Cómo lo recibes?</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setMethod('delivery')} className={`p-6 border-2 rounded-3xl flex flex-col items-center gap-4 transition-all ${method === 'delivery' ? 'border-emerald-600 bg-emerald-50 shadow-md' : 'border-slate-50 opacity-60'}`}>
                  <Truck size={32} className={method === 'delivery' ? 'text-emerald-600' : 'text-slate-400'} />
                  <span className="font-black uppercase text-[10px] tracking-widest">Envío a Domicilio</span>
                </button>
                <button onClick={() => setMethod('pickup')} className={`p-6 border-2 rounded-3xl flex flex-col items-center gap-4 transition-all ${method === 'pickup' ? 'border-emerald-600 bg-emerald-50 shadow-md' : 'border-slate-50 opacity-60'}`}>
                  <Store size={32} className={method === 'pickup' ? 'text-emerald-600' : 'text-slate-400'} />
                  <span className="font-black uppercase text-[10px] tracking-widest">Recojo en Sede</span>
                </button>
              </div>

              {method === 'delivery' ? (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Dirección de Entrega</label>
                    <button onClick={getMyLocation} className="text-[9px] font-black text-emerald-600 flex items-center gap-1 uppercase tracking-wider hover:underline">
                      {isGettingLocation ? <Loader2 className="animate-spin" size={10} /> : <MapPin size={10} />} Usar GPS
                    </button>
                  </div>
                  <input value={address} onChange={e => setAddress(e.target.value)} type="text" placeholder="Av. Los Fresnos 123, Urb. San Antonio..." className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-emerald-600 outline-none" />
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Selecciona la Sede de Recojo</label>
                  <div className="grid grid-cols-1 gap-3">
                    {pickupLocations.map(loc => (
                      <button key={loc.id} onClick={() => setSelectedPickup(loc.id)} className={`p-5 rounded-2xl border-2 text-left transition-all ${selectedPickup === loc.id ? 'border-emerald-600 bg-emerald-50' : 'border-slate-50'}`}>
                        <p className="font-black text-slate-800 uppercase text-xs">{loc.name}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{loc.address}, {loc.city}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* 2. Receta */}
            {needsPrescription && (
              <section className="bg-white p-10 rounded-[3rem] shadow-sm border-2 border-orange-100 space-y-8">
                <div className="flex items-center gap-4 border-b pb-6">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center"><Camera size={24} /></div>
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">2. Receta Médica Requerida</h3>
                </div>
                {!recipeUploaded ? (
                  <button onClick={() => setRecipeUploaded(true)} className="w-full border-4 border-dashed border-orange-50 p-10 rounded-3xl flex flex-col items-center gap-4 hover:bg-orange-50 transition-all group">
                    <Camera size={40} className="text-orange-500 group-hover:scale-110 transition-transform" />
                    <span className="font-black uppercase text-[11px] tracking-widest text-orange-600">Subir foto de Receta</span>
                  </button>
                ) : (
                  <div className="bg-emerald-50 p-6 rounded-2xl flex items-center gap-4 text-emerald-600 border border-emerald-100">
                    <CheckCircle2 size={24} />
                    <span className="font-black uppercase text-xs tracking-widest">Receta validada para el pedido</span>
                  </div>
                )}
              </section>
            )}

            {/* 3. Pago */}
            <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-8">
              <div className="flex items-center gap-4 border-b pb-6">
                <div className="w-12 h-12 bg-emerald-900 text-white rounded-2xl flex items-center justify-center"><CreditCard size={24} /></div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">3. Método de Pago</h3>
              </div>
              <div className="flex flex-wrap gap-4">
                {[
                  { id: 'card', icon: <CreditCard size={18} />, label: 'Tarjeta' },
                  { id: 'yape', icon: <QrCode size={18} />, label: 'Yape' },
                  { id: 'plin', icon: <QrCode size={18} />, label: 'Plin' }
                ].map(p => (
                  <button key={p.id} onClick={() => setPaymentType(p.id as any)} className={`px-8 py-4 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all ${paymentType === p.id ? 'border-emerald-600 bg-emerald-50 text-emerald-900' : 'border-slate-50 text-slate-400'}`}>
                    {p.icon} {p.label}
                  </button>
                ))}
              </div>

              {paymentType !== 'card' && (
                <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 flex flex-col items-center text-center space-y-4 animate-in slide-in-from-top-4">
                  <div className="bg-white p-4 rounded-2xl shadow-lg">
                    <QrCode size={120} className="text-emerald-950" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Número de pago {paymentType}</p>
                    <p className="text-2xl font-black text-emerald-600">{paymentType === 'yape' ? settings.yapeNumber : settings.plinNumber || '999 888 777'}</p>
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase max-w-xs">Envíe su comprobante al WhatsApp 900 100 200 luego de confirmar.</p>
                </div>
              )}
            </section>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl border border-slate-100 space-y-8 sticky top-32">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Resumen Vital</h3>
              <div className="space-y-4 max-h-40 overflow-y-auto pr-2">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-600 uppercase truncate max-w-[150px]">{item.name} x{item.quantity}</span>
                    <span className="font-black text-slate-900">S/ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-6 border-t space-y-2">
                <div className="flex justify-between text-2xl font-black text-slate-900 uppercase tracking-tighter">
                  <span>Total</span>
                  <span className="text-emerald-600">S/ {totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <button 
                onClick={handleCompleteOrder}
                disabled={needsPrescription && !recipeUploaded}
                className={`w-full py-6 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-4 transition-all ${needsPrescription && !recipeUploaded ? 'bg-slate-200 text-slate-400' : 'btn-accent'}`}
              >
                {needsPrescription && !recipeUploaded ? 'Suba su receta' : 'Confirmar Pedido'} <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
