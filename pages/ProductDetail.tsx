
import React, { useState } from 'react';
import { 
  ArrowLeft, ShoppingCart, ShieldCheck, Zap, 
  ChevronRight, Star, Heart, Share2, Plus, 
  Minus, Pill, Info, FileText, Calendar, Building2,
  Clock, CheckCircle, Package, FlaskConical, X
} from 'lucide-react';
import { PRODUCTS } from '../data/mockData';
import { PrescriptionStatus, Product, StoreSettings } from '../types';
import { useCart } from '../context/CartContext';

interface ProductDetailProps {
  productId: string;
  onNavigate: (page: string, params?: any) => void;
  externalProduct?: Product;
  storeSettings: StoreSettings;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ productId, onNavigate, externalProduct, storeSettings }) => {
  const { addToCart } = useCart();
  const product = externalProduct || PRODUCTS.find(p => p.id === productId);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'dosage' | 'technical'>('description');

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
          <Pill size={48} />
        </div>
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Producto no encontrado</h2>
        <button 
          onClick={() => onNavigate('home')}
          className="bg-[#10B981] text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat(storeSettings.locale, {
      style: 'currency',
      currency: storeSettings.currencyCode,
    }).format(amount);
  };

  return (
    <div className="bg-[#fdfdfd] min-h-screen relative">
      {/* Botón Flotante de Cerrar */}
      <div className="absolute top-6 right-6 sm:top-10 sm:right-10 z-20">
        <button 
          onClick={() => onNavigate('home')}
          className="w-12 h-12 sm:w-16 sm:h-16 bg-white shadow-2xl rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:scale-110 active:scale-95 transition-all border border-slate-100 group"
        >
          <X size={28} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-6">
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <button onClick={() => onNavigate('home')} className="hover:text-[#10B981] transition-colors">Inicio</button>
          <ChevronRight size={12} />
          <span className="hover:text-[#10B981] cursor-pointer">{product.category}</span>
          <ChevronRight size={12} />
          <span className="text-slate-800">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 pb-24">
        <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col lg:flex-row relative">
          
          {/* Imagen de Producto */}
          <div className="lg:w-1/2 p-8 lg:p-20 bg-slate-50/50 flex flex-col gap-10">
            <div className="relative aspect-square bg-white rounded-[3rem] p-12 flex items-center justify-center border border-slate-100 shadow-inner group">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
              />
              {product.oldPrice && (
                <div className="absolute top-8 left-8 bg-[#F59E0B] text-white text-[11px] font-black px-5 py-2 rounded-2xl shadow-lg animate-pulse uppercase tracking-widest">
                  Oferta Vital
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><CheckCircle size={20} /></div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Estado</p>
                  <p className="text-xs font-black text-slate-800 uppercase">{product.stock > 0 ? 'En Stock' : 'Sin Stock'}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Package size={20} /></div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Formato</p>
                  <p className="text-xs font-black text-slate-800 uppercase">{product.format || 'Unidad'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info de Producto */}
          <div className="lg:w-1/2 p-8 lg:p-20 flex flex-col space-y-10">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-[#10B981] uppercase tracking-[0.3em]">{product.brand}</span>
                <div className="flex gap-2">
                  <button className="w-12 h-12 bg-slate-50 hover:bg-rose-50 text-slate-300 hover:text-rose-500 rounded-2xl flex items-center justify-center transition-all">
                    <Heart size={20} />
                  </button>
                  <button className="w-12 h-12 bg-slate-50 hover:bg-slate-100 text-slate-300 hover:text-slate-600 rounded-2xl flex items-center justify-center transition-all">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight uppercase">
                {product.name}
              </h1>
              {product.genericName && (
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                   <FlaskConical size={16} /> Principio: {product.genericName}
                </p>
              )}
            </div>

            <div className="bg-slate-50/80 rounded-[2.5rem] p-10 space-y-8 border border-slate-100 shadow-inner">
              <div className="flex flex-col">
                {product.oldPrice && (
                  <span className="text-base text-slate-400 line-through font-bold mb-1">Precio regular: {formatPrice(product.oldPrice)}</span>
                )}
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-black text-slate-900 tracking-tighter">{formatPrice(product.price)}</span>
                  <span className="bg-[#10B981] text-white text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest">Precio Web</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <button onClick={() => quantity > 1 && setQuantity(quantity - 1)} className="p-5 hover:bg-slate-50 transition-colors"><Minus size={20} /></button>
                  <span className="w-14 text-center font-black text-xl text-slate-900">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-5 hover:bg-slate-50 transition-colors"><Plus size={20} /></button>
                </div>
                <button 
                  onClick={() => addToCart(product, quantity)}
                  className="flex-1 btn-accent py-6 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 shadow-xl active:scale-95 transition-all"
                >
                  <ShoppingCart size={24} /> Añadir al Carrito
                </button>
              </div>
            </div>

            {/* Tabs de Información */}
            <div className="space-y-6">
              <div className="flex border-b border-slate-100">
                {(['description', 'dosage', 'technical'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {tab === 'description' && 'Descripción'}
                    {tab === 'dosage' && 'Posología'}
                    {tab === 'technical' && 'Técnico'}
                    {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500"></div>}
                  </button>
                ))}
              </div>
              
              <div className="min-h-[150px] animate-in fade-in slide-in-from-top-2">
                 {activeTab === 'description' && (
                    <div className="space-y-4">
                      <p className="text-slate-600 font-medium leading-relaxed">{product.description || 'No hay descripción disponible para este producto.'}</p>
                      <div className="flex items-center gap-3 text-[#F97316]">
                        <ShieldCheck size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Autenticidad Garantizada por {storeSettings.storeName}</span>
                      </div>
                    </div>
                 )}
                 {activeTab === 'dosage' && (
                    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex items-start gap-6">
                      <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0"><Info size={24} /></div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Uso Recomendado</p>
                        <p className="text-sm font-bold text-slate-700 leading-relaxed">{product.dosage || 'Consulte con su médico sobre la dosificación recomendada para este medicamento.'}</p>
                      </div>
                    </div>
                 )}
                 {activeTab === 'technical' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                       <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col gap-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Registro Sanitario</span>
                          <span className="text-xs font-black text-slate-800 uppercase tracking-tighter">{product.registrationNumber || 'N/A'}</span>
                       </div>
                       <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col gap-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Laboratorio</span>
                          <span className="text-xs font-black text-slate-800 uppercase tracking-tighter">{product.laboratory || 'N/A'}</span>
                       </div>
                       <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col gap-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Expiración</span>
                          <span className="text-xs font-black text-slate-800 uppercase tracking-tighter">{product.expiryDate || 'Consultar'}</span>
                       </div>
                       <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col gap-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Cod. Nacional</span>
                          <span className="text-xs font-black text-slate-800 uppercase tracking-tighter">CN-{product.odooId}</span>
                       </div>
                    </div>
                 )}
              </div>
            </div>
            
            <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row gap-6 justify-between items-center opacity-60">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"><Clock size={16} /></div>
                  <span className="text-[9px] font-black uppercase tracking-widest">Envío hoy antes 6PM</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"><Package size={16} /></div>
                  <span className="text-[9px] font-black uppercase tracking-widest">Embalaje Discreto</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
