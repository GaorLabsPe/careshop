
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
          className="bg-emerald-500 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg"
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
      <div className="absolute top-4 right-4 sm:top-10 sm:right-10 z-20">
        <button 
          onClick={() => onNavigate('home')}
          className="w-12 h-12 sm:w-20 sm:h-20 bg-white shadow-2xl rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:scale-110 active:scale-95 transition-all border border-slate-100 group"
        >
          <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-6 sm:py-8">
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <button onClick={() => onNavigate('home')} className="hover:text-emerald-500 transition-colors">Inicio</button>
          <ChevronRight size={12} />
          <span className="hover:text-emerald-500 cursor-pointer">{product.category}</span>
          <ChevronRight size={12} />
          <span className="text-slate-800 truncate">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pb-20 sm:pb-32">
        <div className="bg-white rounded-[3rem] sm:rounded-[4rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col lg:flex-row relative">
          
          {/* Imagen de Producto */}
          <div className="lg:w-1/2 p-8 sm:p-24 bg-slate-50/50 flex flex-col gap-10">
            <div className="relative aspect-square bg-white rounded-[3rem] p-12 flex items-center justify-center border border-slate-100 shadow-inner group">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
              />
              {product.oldPrice && (
                <div className="absolute top-8 left-8 bg-orange-500 text-white text-[10px] sm:text-xs font-black px-5 py-2.5 rounded-2xl shadow-xl animate-pulse uppercase tracking-widest">
                  Oferta Exclusiva
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner"><CheckCircle size={20} /></div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Stock</p>
                  <p className="text-xs font-black text-slate-800 uppercase">{product.stock > 0 ? 'Disponible' : 'Agotado'}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner"><Package size={20} /></div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Empaque</p>
                  <p className="text-xs font-black text-slate-800 uppercase">{product.format || 'Unidad'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info de Producto */}
          <div className="lg:w-1/2 p-8 sm:p-24 flex flex-col space-y-8 sm:space-y-12">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-500 uppercase tracking-[0.4em]">{product.brand}</span>
                <div className="flex gap-2">
                  <button className="w-12 h-12 bg-slate-50 hover:bg-rose-50 text-slate-300 hover:text-rose-500 rounded-2xl flex items-center justify-center transition-all border shadow-sm group">
                    <Heart size={20} className="group-hover:fill-rose-500 transition-colors" />
                  </button>
                  <button className="w-12 h-12 bg-slate-50 hover:bg-blue-50 text-slate-300 hover:text-blue-500 rounded-2xl flex items-center justify-center transition-all border shadow-sm">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
              <h1 className="text-3xl sm:text-6xl font-black text-slate-900 tracking-tighter leading-none uppercase">
                {product.name}
              </h1>
              {product.genericName && (
                <p className="text-slate-400 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                   <FlaskConical size={16} className="text-emerald-500" /> Principio: {product.genericName}
                </p>
              )}
            </div>

            <div className="bg-slate-50/80 rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-14 space-y-10 border border-slate-100 shadow-inner">
              <div className="flex flex-col">
                {product.oldPrice && (
                  <span className="text-sm sm:text-lg text-slate-400 line-through font-black mb-1">Regular: {formatPrice(product.oldPrice)}</span>
                )}
                <div className="flex items-center gap-4">
                  <span className="text-4xl sm:text-7xl font-black text-slate-900 tracking-tighter">{formatPrice(product.price)}</span>
                  <div className="flex flex-col">
                     <span className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest shadow-lg shadow-emerald-500/20">Precio Club</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center bg-white border-2 border-slate-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm w-full sm:w-auto">
                  <button onClick={() => quantity > 1 && setQuantity(quantity - 1)} className="p-5 sm:p-6 hover:bg-slate-50 transition-colors text-slate-400"><Minus size={20} /></button>
                  <span className="w-12 sm:w-16 text-center font-black text-xl sm:text-2xl text-slate-900">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-5 sm:p-6 hover:bg-slate-50 transition-colors text-slate-400"><Plus size={20} /></button>
                </div>
                <button 
                  onClick={() => addToCart(product, quantity)}
                  className="flex-1 w-full bg-orange-500 hover:bg-orange-600 text-white py-5 sm:py-7 rounded-2xl sm:rounded-3xl font-black text-xs sm:text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-2xl shadow-orange-500/30 active:scale-95 transition-all"
                >
                  <ShoppingCart size={24} strokeWidth={3} /> Añadir al Carrito
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="space-y-6">
              <div className="flex border-b-2 border-slate-100 overflow-x-auto no-scrollbar">
                {(['description', 'dosage', 'technical'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 sm:px-10 py-4 sm:py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {tab === 'description' && 'Descripción'}
                    {tab === 'dosage' && 'Uso y Dosis'}
                    {tab === 'technical' && 'Info Técnica'}
                    {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500 rounded-t-full"></div>}
                  </button>
                ))}
              </div>
              
              <div className="min-h-[150px] animate-in fade-in slide-in-from-top-4 duration-500">
                 {activeTab === 'description' && (
                    <p className="text-slate-500 text-sm sm:text-lg font-medium leading-relaxed">{product.description || 'No hay descripción disponible para este producto.'}</p>
                 )}
                 {activeTab === 'dosage' && (
                    <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100 flex items-start gap-6">
                      <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg"><Info size={24} /></div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Indicaciones</p>
                        <p className="text-sm sm:text-base font-bold text-slate-700 leading-relaxed">{product.dosage || 'Consulte la etiqueta del producto o a su médico de confianza.'}</p>
                      </div>
                    </div>
                 )}
                 {activeTab === 'technical' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col gap-1 shadow-sm">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Reg. Sanitario</span>
                          <span className="text-xs font-black text-slate-800 uppercase">{product.registrationNumber || 'PENDIENTE'}</span>
                       </div>
                       <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col gap-1 shadow-sm">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Laboratorio</span>
                          <span className="text-xs font-black text-slate-800 uppercase">{product.laboratory || 'GENÉRICO'}</span>
                       </div>
                    </div>
                 )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
