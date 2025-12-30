
import React, { useState } from 'react';
import { 
  ArrowLeft, ShoppingCart, ShieldCheck, Zap, 
  ChevronRight, Star, Heart, Share2, Plus, 
  Minus, Pill, Info, FileText, Calendar, Building2
} from 'lucide-react';
import { PRODUCTS } from '../data/mockData';
import { PrescriptionStatus } from '../types';
import { useCart } from '../context/CartContext';

interface ProductDetailProps {
  productId: string;
  onNavigate: (page: string, params?: any) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId, onNavigate }) => {
  const { addToCart } = useCart();
  const product = PRODUCTS.find(p => p.id === productId);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

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

  const tabs = [
    { id: 'description', label: 'Descripción', icon: <FileText size={16} /> },
    { id: 'dosage', label: 'Dosis & Uso', icon: <Info size={16} /> },
    { id: 'technical', label: 'Ficha Técnica', icon: <Building2 size={16} /> },
  ];

  return (
    <div className="bg-[#fdfdfd] min-h-screen">
      {/* Breadcrumbs */}
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
        <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col lg:flex-row">
          
          {/* Left: Image Gallery */}
          <div className="lg:w-1/2 p-12 lg:p-20 bg-slate-50/50 flex flex-col gap-10">
            <div className="relative aspect-square bg-white rounded-[3rem] p-12 flex items-center justify-center border border-slate-100 shadow-inner group">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
              />
              {product.oldPrice && (
                <div className="absolute top-8 left-8 bg-[#F59E0B] text-white text-[11px] font-black px-5 py-2 rounded-2xl shadow-lg animate-bounce uppercase">
                  Oferta Vital
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {[product.image, ...product.thumbnails].slice(0, 4).map((img, i) => (
                <div key={i} className="aspect-square bg-white rounded-2xl border-2 border-transparent hover:border-[#10B981] transition-all cursor-pointer overflow-hidden p-2">
                  <img src={img} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Info Area */}
          <div className="lg:w-1/2 p-12 lg:p-20 flex flex-col space-y-10">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-[#10B981] uppercase tracking-[0.2em]">{product.brand}</span>
                <div className="flex gap-2">
                  <button className="w-12 h-12 bg-slate-50 hover:bg-rose-50 text-slate-300 hover:text-rose-500 rounded-2xl flex items-center justify-center transition-all">
                    <Heart size={20} />
                  </button>
                  <button className="w-12 h-12 bg-slate-50 hover:bg-emerald-50 text-slate-300 hover:text-[#10B981] rounded-2xl flex items-center justify-center transition-all">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tighter leading-tight">
                {product.name}
              </h1>
              {product.genericName && (
                <p className="text-sm font-bold text-slate-400 italic">Genérico: {product.genericName}</p>
              )}
              
              <div className="flex items-center gap-4 py-2">
                <div className="flex items-center gap-1 text-[#F59E0B]">
                  {[1,2,3,4,5].map(i => <Star key={i} size={18} fill={i <= 4 ? "currentColor" : "none"} />)}
                </div>
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">(1,248 Opiniones)</span>
              </div>
            </div>

            <div className="bg-slate-50/80 rounded-[2.5rem] p-10 space-y-6 border border-slate-100 shadow-inner">
              <div className="flex flex-col">
                {product.oldPrice && (
                  <span className="text-base text-slate-300 line-through font-bold">Antes: S/ {product.oldPrice.toFixed(2)}</span>
                )}
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-black text-slate-900 tracking-tighter">S/ {product.price.toFixed(2)}</span>
                  <span className="text-[10px] font-black text-[#10B981] uppercase tracking-widest">Ahorro Vital</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                  <button 
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    className="p-4 hover:bg-slate-50 text-slate-400 transition-colors"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="w-12 text-center font-black text-slate-800">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-4 hover:bg-slate-50 text-slate-400 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <button 
                  onClick={() => addToCart(product, quantity)}
                  className="flex-1 btn-buy py-6 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4"
                >
                  <ShoppingCart size={22} />
                  Añadir al Carrito
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase">
                  <Zap size={16} className="text-[#10B981]" /> Envío en 90 min
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase">
                  <ShieldCheck size={16} className="text-[#10B981]" /> Compra Segura
                </div>
              </div>
            </div>

            {/* Product Status Badges */}
            <div className="flex flex-wrap gap-3">
              {product.prescription === PrescriptionStatus.Required && (
                <div className="bg-slate-900 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
                  Requiere Receta Médica
                </div>
              )}
              <div className="bg-emerald-50 text-[#10B981] px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-emerald-100">
                <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
                Stock Disponible ({product.stock})
              </div>
            </div>

            {/* Tabs for detailed info */}
            <div className="space-y-8">
              <div className="flex border-b border-slate-100 gap-8">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-4 text-[11px] font-black uppercase tracking-widest transition-all relative flex items-center gap-2 ${activeTab === tab.id ? 'text-[#10B981]' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {tab.icon}
                    {tab.label}
                    {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#10B981] rounded-full"></div>}
                  </button>
                ))}
              </div>
              
              <div className="text-slate-600 text-sm leading-relaxed font-medium animate-in fade-in duration-300">
                {activeTab === 'description' && (
                  <div className="space-y-4">
                    <p>{product.description}</p>
                    <div className="bg-slate-50 p-6 rounded-2xl border-l-4 border-[#10B981]">
                       <p className="text-xs font-bold text-slate-400 uppercase mb-2">Formato:</p>
                       <p className="font-black text-slate-800">{product.format}</p>
                    </div>
                  </div>
                )}
                {activeTab === 'dosage' && (
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-emerald-100 text-[#10B981] rounded-lg flex items-center justify-center shrink-0">1</div>
                      <p><span className="font-black text-slate-800">Uso Recomendado:</span> {product.dosage}</p>
                    </div>
                    <p className="text-xs text-slate-400 italic">Nota: Siempre siga las indicaciones de su médico de cabecera.</p>
                  </div>
                )}
                {activeTab === 'technical' && (
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Laboratorio</p>
                      <p className="font-black text-slate-800">{product.laboratory}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reg. Sanitario</p>
                      <p className="font-black text-slate-800">{product.registrationNumber}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Principio Activo</p>
                      <p className="font-black text-slate-800">{product.activeIngredient || 'No aplica'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vencimiento</p>
                      <p className="font-black text-slate-800 flex items-center gap-2">
                        <Calendar size={14} className="text-[#10B981]" /> {product.expiryDate}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Bottom Mobile */}
        <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white p-6 border-t border-slate-100 flex items-center justify-between gap-6 z-50">
           <div className="flex flex-col">
              <span className="text-2xl font-black text-slate-900 tracking-tighter">S/ {product.price.toFixed(2)}</span>
              <span className="text-[9px] font-bold text-[#10B981] uppercase">Añadir al Carrito</span>
           </div>
           <button 
             onClick={() => addToCart(product, quantity)}
             className="btn-buy flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl"
           >
             Comprar Ahora
           </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
