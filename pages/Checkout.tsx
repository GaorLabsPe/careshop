
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { 
  ShieldCheck, CreditCard, Truck, Camera, 
  MapPin, CheckCircle2, ArrowRight, ArrowLeft,
  ShoppingBag, Pill, AlertCircle
} from 'lucide-react';
import { PrescriptionStatus } from '../types';

interface CheckoutProps {
  onNavigate: (page: string, params?: any) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onNavigate }) => {
  const { cart, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [orderComplete, setOrderComplete] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [recipeUploaded, setRecipeUploaded] = useState(false);

  // Verificar si hay productos que requieren receta
  const needsPrescription = cart.some(item => item.prescription === PrescriptionStatus.Required);

  const handleCompleteOrder = () => {
    setOrderComplete(true);
    setTimeout(() => {
      clearCart();
    }, 100);
  };

  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <ShoppingBag size={64} className="text-slate-200" />
        <h2 className="text-2xl font-black text-slate-800 uppercase">Tu carrito está vacío</h2>
        <button onClick={() => onNavigate('home')} className="btn-primary px-8 py-3 rounded-xl text-xs uppercase tracking-widest">Ir a comprar</button>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-6 text-center space-y-8 animate-in zoom-in duration-500">
        <div className="w-32 h-32 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-100/50">
          <CheckCircle2 size={64} />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">¡Pedido Confirmado!</h1>
          <p className="text-slate-500 font-medium text-lg">Tu orden #PH-{Math.floor(Math.random() * 99999)} ha sido recibida y está siendo procesada por nuestro farmacéutico.</p>
        </div>
        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex flex-col sm:flex-row justify-center gap-6 items-center">
          <div className="text-center sm:text-left">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tiempo estimado</p>
            <p className="font-black text-emerald-600">90 - 120 minutos</p>
          </div>
          <div className="w-px h-10 bg-slate-200 hidden sm:block"></div>
          <div className="text-center sm:text-left">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estado</p>
            <p className="font-black text-emerald-600">Validando Receta</p>
          </div>
        </div>
        <button onClick={() => onNavigate('home')} className="btn-primary w-full py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl">Volver al Inicio</button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="max-w-[1440px] mx-auto px-6 py-10 sm:py-16">
        <div className="flex items-center gap-4 mb-10">
          <button onClick={() => onNavigate('home')} className="p-3 bg-white rounded-xl text-slate-400 hover:text-slate-600 transition-colors shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase font-ubuntu">Checkout Seguro</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Formulario de Checkout */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Datos de Entrega */}
            <section className="bg-white p-8 sm:p-12 rounded-[3.5rem] shadow-sm border border-slate-100 space-y-8">
              <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg"><MapPin size={24} /></div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">1. Datos de Entrega</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Dirección Completa</label>
                  <input type="text" placeholder="Av. Los Pinos 123..." className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium focus:border-primary focus:bg-white outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Distrito</label>
                  <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium focus:border-primary focus:bg-white outline-none transition-all appearance-none">
                    <option>Miraflores</option>
                    <option>San Isidro</option>
                    <option>Surco</option>
                  </select>
                </div>
              </div>
            </section>

            {/* 2. Validación de Receta (Si aplica) */}
            {needsPrescription && (
              <section className="bg-white p-8 sm:p-12 rounded-[3.5rem] shadow-sm border-2 border-orange-100 space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-orange-500 text-white text-[9px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-[0.2em]">Acción Requerida</div>
                <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg"><Camera size={24} /></div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">2. Validación de Receta</h3>
                    <p className="text-xs font-bold text-orange-500">Tu pedido contiene medicamentos restringidos</p>
                  </div>
                </div>
                <div className="p-8 border-2 border-dashed border-slate-100 rounded-[2rem] text-center space-y-6 group hover:border-orange-200 transition-colors">
                  {!recipeUploaded ? (
                    <>
                      <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                        <Camera size={32} />
                      </div>
                      <div className="space-y-2">
                        <p className="font-black text-slate-800">Sube una foto de tu receta médica</p>
                        <p className="text-xs text-slate-400 font-medium">Debe ser legible y contener nombre del médico y fecha.</p>
                      </div>
                      <button 
                        onClick={() => {
                          setIsUploading(true);
                          setTimeout(() => {
                            setIsUploading(false);
                            setRecipeUploaded(true);
                          }, 2000);
                        }}
                        className="btn-accent px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-3 mx-auto"
                      >
                        {isUploading ? "Analizando..." : "Tomar Foto / Subir"}
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center justify-center gap-4 text-emerald-600 bg-emerald-50 py-6 rounded-2xl">
                      <CheckCircle2 size={24} />
                      <span className="font-black uppercase text-xs tracking-widest">Receta cargada exitosamente</span>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* 3. Método de Pago */}
            <section className="bg-white p-8 sm:p-12 rounded-[3.5rem] shadow-sm border border-slate-100 space-y-8">
              <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                <div className="w-12 h-12 bg-emerald-900 text-white rounded-2xl flex items-center justify-center shadow-lg"><CreditCard size={24} /></div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">3. Método de Pago</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button className="p-6 border-2 border-primary bg-primary-light rounded-3xl flex items-center justify-between group transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm"><CreditCard size={20} /></div>
                    <span className="font-black text-slate-800 uppercase text-[10px] tracking-widest">Tarjeta Débito / Crédito</span>
                  </div>
                  <div className="w-4 h-4 rounded-full border-4 border-primary bg-white"></div>
                </button>
                <button className="p-6 border-2 border-slate-50 rounded-3xl flex items-center justify-between group hover:border-slate-200 transition-all opacity-60 grayscale">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm"><CheckCircle2 size={20} /></div>
                    <span className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Pago contra entrega</span>
                  </div>
                  <div className="w-4 h-4 rounded-full border-2 border-slate-200 bg-white"></div>
                </button>
              </div>
            </section>

          </div>

          {/* Resumen del Pedido */}
          <div className="space-y-8">
            <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 space-y-8 sticky top-32">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                <ShoppingBag className="text-primary" /> Resumen
              </h3>
              
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex-shrink-0 border p-2">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] font-black text-slate-800 leading-tight uppercase line-clamp-1">{item.name}</p>
                      <p className="text-[10px] font-bold text-slate-400">Cant: {item.quantity}</p>
                    </div>
                    <span className="font-black text-slate-900 text-xs">S/ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-4">
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                  <span>Subtotal</span>
                  <span>S/ {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-emerald-500 uppercase">
                  <span>Delivery Express</span>
                  <span>GRATIS</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xl font-black text-slate-900 uppercase tracking-tighter">Total</span>
                  <span className="text-3xl font-black text-primary tracking-tighter">S/ {totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl space-y-4 border border-slate-100">
                <div className="flex items-center gap-3 text-emerald-600">
                  <ShieldCheck size={20} />
                  <span className="text-[10px] font-black uppercase tracking-[0.1em]">Garantía GAORSYSTEM</span>
                </div>
                <p className="text-[9px] text-slate-400 font-bold uppercase leading-relaxed">
                  Al confirmar el pedido, aceptas nuestros términos de dispensación y certificas que eres mayor de 18 años.
                </p>
              </div>

              <button 
                onClick={handleCompleteOrder}
                disabled={needsPrescription && !recipeUploaded}
                className={`w-full py-6 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-4 transition-all ${needsPrescription && !recipeUploaded ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'btn-accent'}`}
              >
                {needsPrescription && !recipeUploaded ? "Sube tu receta primero" : "Confirmar Pedido"}
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
