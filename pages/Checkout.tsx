
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { 
  ShieldCheck, CreditCard, Truck, Camera, 
  MapPin, CheckCircle2, ArrowRight, ArrowLeft,
  ShoppingBag, Pill, AlertCircle, QrCode, Phone,
  Store, Loader2, Smartphone
} from 'lucide-react';
import { PrescriptionStatus, PickupLocation, StoreSettings, MobilePaymentMethod, Order, OrderStatus } from '../types';

interface CheckoutProps {
  onNavigate: (page: string, params?: any) => void;
  pickupLocations: PickupLocation[];
  settings: StoreSettings;
  onOrderCreated: (order: Order) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onNavigate, pickupLocations, settings, onOrderCreated }) => {
  const { cart, totalPrice, clearCart } = useCart();
  const [method, setMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentType, setPaymentType] = useState<'card' | 'mobile'>('card');
  const [selectedMobilePayment, setSelectedMobilePayment] = useState<MobilePaymentMethod | null>(
    settings.mobilePayments?.find(p => p.isActive) || null
  );
  
  const [orderComplete, setOrderComplete] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [address, setAddress] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [recipeUploaded, setRecipeUploaded] = useState(false);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat(settings.locale, {
      style: 'currency',
      currency: settings.currencyCode,
    }).format(amount);
  };

  const needsPrescription = cart.some(item => item.prescription === PrescriptionStatus.Required);

  const getMyLocation = () => {
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setAddress(`GPS: ${pos.coords.latitude}, ${pos.coords.longitude}`);
        setIsGettingLocation(false);
      },
      () => {
        alert("No se pudo obtener la ubicación");
        setIsGettingLocation(false);
      }
    );
  };

  const handleCompleteOrder = () => {
    if (!customerEmail || !customerName) {
      alert("Por favor completa tus datos");
      return;
    }

    const orderId = `S00${Math.floor(Math.random() * 90000) + 10000}`;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder: Order = {
      id: orderId,
      customerName,
      customerEmail,
      address: method === 'delivery' ? address : 'Recojo en Sede',
      total: totalPrice,
      date: new Date().toLocaleDateString(),
      status: OrderStatus.Received,
      items: [...cart],
      history: [
        { status: OrderStatus.Received, title: 'Pedido Recibido', desc: 'Tu orden ha entrado al sistema.', time: now, completed: true },
        { status: OrderStatus.Validated, title: 'Validación Farmacéutica', desc: 'Receta verificada por nuestro experto.', time: '--:--', completed: false },
        { status: OrderStatus.Preparing, title: 'En Preparación', desc: 'Estamos empacando tus productos con cuidado.', time: '--:--', completed: false },
        { status: OrderStatus.Shipped, title: 'En Camino', desc: 'El motorizado está en ruta a tu dirección.', time: '--:--', completed: false },
        { status: OrderStatus.Delivered, title: 'Entregado', desc: 'Confirmación de recepción.', time: '--:--', completed: false },
      ]
    };

    onOrderCreated(newOrder);
    setOrderComplete(true);
    setTimeout(() => clearCart(), 500);
  };

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-6 text-center space-y-8 animate-in zoom-in">
        <div className="w-32 h-32 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xl"><CheckCircle2 size={64} /></div>
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">¡Pedido Recibido!</h1>
        <p className="text-slate-500 font-medium">Gracias por confiar en {settings.storeName}. En breve nos comunicaremos contigo.</p>
        <div className="bg-slate-50 p-6 rounded-2xl border">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Guarda tu número de orden</p>
           <p className="text-2xl font-black text-slate-900">Su pedido se está procesando...</p>
        </div>
        <button onClick={() => onNavigate('tracking')} className="btn-action w-full py-5 rounded-2xl font-black uppercase tracking-widest">Rastrear mi Pedido</button>
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
            {/* Paso 0: Datos */}
            <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-6">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Tus Datos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Nombre Completo" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold" />
                 <input value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} placeholder="Email de Contacto" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold" />
              </div>
            </section>

            {/* Paso 1: Entrega */}
            <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-8">
              <div className="flex items-center gap-4 border-b pb-6">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><Truck size={24} /></div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">1. ¿Cómo lo recibes?</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setMethod('delivery')} className={`p-6 border-2 rounded-3xl flex flex-col items-center gap-4 transition-all ${method === 'delivery' ? 'border-emerald-600 bg-emerald-50 shadow-md' : 'border-slate-50 opacity-60'}`}>
                  <Truck size={32} />
                  <span className="font-black uppercase text-[10px] tracking-widest">Envío a Domicilio</span>
                </button>
                <button onClick={() => setMethod('pickup')} className={`p-6 border-2 rounded-3xl flex flex-col items-center gap-4 transition-all ${method === 'pickup' ? 'border-emerald-600 bg-emerald-50 shadow-md' : 'border-slate-50 opacity-60'}`}>
                  <Store size={32} />
                  <span className="font-black uppercase text-[10px] tracking-widest">Recojo en Sede</span>
                </button>
              </div>
              {method === 'delivery' && (
                <div className="space-y-4 pt-4">
                  <div className="relative">
                    <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Tu dirección exacta de entrega" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold" />
                    <button onClick={getMyLocation} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600 hover:scale-110 transition-transform">
                      {isGettingLocation ? <Loader2 className="animate-spin" size={20} /> : <MapPin size={20} />}
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* Paso 2: Receta */}
            {needsPrescription && (
              <section className="bg-emerald-50 p-10 rounded-[3rem] border-2 border-emerald-100 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><Camera size={24} /></div>
                  <h3 className="text-xl font-black text-emerald-900 uppercase tracking-tight">Adjuntar Receta Médica</h3>
                </div>
                <p className="text-xs text-emerald-700 font-medium">Uno o más productos en tu carrito requieren validación farmacéutica.</p>
                <div className="border-4 border-dashed border-emerald-200 rounded-3xl p-10 flex flex-col items-center justify-center gap-4 bg-white/50 cursor-pointer hover:bg-white transition-all" onClick={() => setRecipeUploaded(true)}>
                  {recipeUploaded ? <CheckCircle2 className="text-emerald-600" size={48} /> : <Camera className="text-emerald-300" size={48} />}
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{recipeUploaded ? 'Receta Cargada' : 'Subir Foto o PDF'}</span>
                </div>
              </section>
            )}

            {/* Paso 3: Pago */}
            <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-8">
              <div className="flex items-center gap-4 border-b pb-6">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg"><CreditCard size={24} /></div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">2. Método de Pago</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => setPaymentType('card')} className={`p-6 border-2 rounded-3xl flex flex-col items-center gap-4 transition-all ${paymentType === 'card' ? 'border-slate-900 bg-slate-50' : 'border-slate-50 opacity-60'}`}>
                  <CreditCard size={32} />
                  <span className="font-black uppercase text-[10px] tracking-widest">Tarjeta Débito/Crédito</span>
                </button>
                <button onClick={() => setPaymentType('mobile')} className={`p-6 border-2 rounded-3xl flex flex-col items-center gap-4 transition-all ${paymentType === 'mobile' ? 'border-emerald-600 bg-emerald-50' : 'border-slate-50 opacity-60'}`}>
                  <Smartphone size={32} />
                  <span className="font-black uppercase text-[10px] tracking-widest">Billetera Digital</span>
                </button>
              </div>

              {paymentType === 'mobile' && selectedMobilePayment && (
                <div className="bg-slate-50 p-8 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col md:flex-row items-center gap-8">
                  <div className="w-32 h-32 bg-white rounded-2xl p-2 shadow-xl flex items-center justify-center overflow-hidden">
                    {selectedMobilePayment.qrCode ? <img src={selectedMobilePayment.qrCode} className="w-full h-full object-contain" /> : <QrCode size={100} />}
                  </div>
                  <div className="space-y-2 text-center md:text-left">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Paga con {selectedMobilePayment.name}</p>
                    <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{selectedMobilePayment.identifier}</p>
                  </div>
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
                    <span className="font-black text-slate-900">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-6 border-t space-y-2">
                <div className="flex justify-between text-2xl font-black text-slate-900 uppercase tracking-tighter">
                  <span>Total</span>
                  <span className="text-emerald-600">{formatPrice(totalPrice)}</span>
                </div>
              </div>
              <button onClick={handleCompleteOrder} className="w-full btn-accent py-6 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl">Confirmar Pedido</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
