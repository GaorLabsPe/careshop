
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
  const [method, setMethod] = useState<'delivery' | 'pickup'>(settings.allowDelivery ? 'delivery' : 'pickup');
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
      address: method === 'delivery' ? address : `RECOJO EN TIENDA: ${settings.storeAddress}`,
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
        <button onClick={() => onNavigate('tracking')} className="bg-emerald-600 text-white w-full py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-500 transition-all">Rastrear mi Pedido</button>
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
            {/* Datos */}
            <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-6">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Tus Datos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Nombre Completo" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold" />
                 <input value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} placeholder="Email de Contacto" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold" />
              </div>
            </section>

            {/* Entrega */}
            <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-8">
              <div className="flex items-center gap-4 border-b pb-6">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><Truck size={24} /></div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">1. ¿Cómo lo recibes?</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {settings.allowDelivery && (
                  <button onClick={() => setMethod('delivery')} className={`p-6 border-2 rounded-3xl flex flex-col items-center gap-4 transition-all ${method === 'delivery' ? 'border-emerald-600 bg-emerald-50 shadow-md' : 'border-slate-50 opacity-60'}`}>
                    <Truck size={32} />
                    <span className="font-black uppercase text-[10px] tracking-widest text-center">Envío a Domicilio</span>
                  </button>
                )}
                {settings.allowPickup && (
                  <button onClick={() => setMethod('pickup')} className={`p-6 border-2 rounded-3xl flex flex-col items-center gap-4 transition-all ${method === 'pickup' ? 'border-emerald-600 bg-emerald-50 shadow-md' : 'border-slate-50 opacity-60'}`}>
                    <Store size={32} />
                    <span className="font-black uppercase text-[10px] tracking-widest text-center">Recojo en Sede</span>
                  </button>
                )}
              </div>
              {method === 'delivery' && (
                <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Tu dirección exacta de entrega" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold" />
              )}
              {method === 'pickup' && (
                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 space-y-2">
                   <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Sede de Recojo</p>
                   <p className="text-sm font-black text-slate-800 uppercase">{settings.storeAddress}</p>
                   <p className="text-xs text-slate-500 font-bold">{settings.storeCity} - {settings.storePhone}</p>
                </div>
              )}
            </section>

            {/* Pago */}
            <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-8">
              <div className="flex items-center gap-4 border-b pb-6">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg"><CreditCard size={24} /></div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">2. Método de Pago</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => setPaymentType('card')} className={`p-6 border-2 rounded-3xl flex flex-col items-center gap-4 transition-all ${paymentType === 'card' ? 'border-slate-900 bg-slate-50 shadow-md' : 'border-slate-50 opacity-60'}`}>
                  <CreditCard size={32} />
                  <span className="font-black uppercase text-[10px] tracking-widest">Tarjeta Débito/Crédito</span>
                </button>
                <button onClick={() => setPaymentType('mobile')} className={`p-6 border-2 rounded-3xl flex flex-col items-center gap-4 transition-all ${paymentType === 'mobile' ? 'border-emerald-600 bg-emerald-50 shadow-md' : 'border-slate-50 opacity-60'}`}>
                  <Smartphone size={32} />
                  <span className="font-black uppercase text-[10px] tracking-widest">Billetera Digital</span>
                </button>
              </div>

              {paymentType === 'mobile' && (
                <div className="space-y-6">
                  <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                    {settings.mobilePayments.map(p => (
                      <button 
                        key={p.id} 
                        onClick={() => setSelectedMobilePayment(p)}
                        className={`px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest border-2 whitespace-nowrap transition-all ${selectedMobilePayment?.id === p.id ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-400 border-slate-100'}`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                  {selectedMobilePayment && (
                    <div className="bg-slate-50 p-8 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col md:flex-row items-center gap-8 animate-in fade-in">
                      <div className="w-40 h-40 bg-white rounded-3xl p-2 shadow-xl flex items-center justify-center overflow-hidden border">
                        {selectedMobilePayment.qrCodeUrl ? (
                          <img src={selectedMobilePayment.qrCodeUrl} className="w-full h-full object-contain" alt="QR" />
                        ) : (
                          <QrCode size={100} className="text-slate-100" />
                        )}
                      </div>
                      <div className="space-y-2 text-center md:text-left">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Paga con {selectedMobilePayment.name}</p>
                        <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{selectedMobilePayment.identifier}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Adjunta el comprobante al finalizar</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl border border-slate-100 space-y-8 sticky top-32">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Resumen</h3>
              <div className="pt-6 border-t">
                <div className="flex justify-between text-2xl font-black text-slate-900 uppercase tracking-tighter">
                  <span>Total</span>
                  <span className="text-emerald-600">{formatPrice(totalPrice)}</span>
                </div>
              </div>
              <button onClick={handleCompleteOrder} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-6 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all">Confirmar Pedido</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
