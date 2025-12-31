
import React from 'react';
import { ShoppingCart, Heart, Star, Info, Zap } from 'lucide-react';
import { Product, PrescriptionStatus, StoreSettings } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onViewDetails: () => void;
  storeSettings: StoreSettings;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails, storeSettings }) => {
  const { addToCart } = useCart();

  return (
    <div className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full">
      {/* Área de Imagen */}
      <div className="relative aspect-square overflow-hidden bg-white p-6 sm:p-10 flex items-center justify-center cursor-pointer" onClick={onViewDetails}>
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
        />
        
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-col gap-2 z-10">
          {product.oldPrice && (
            <div className="bg-orange-500 text-white text-[8px] sm:text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg uppercase tracking-widest flex items-center gap-1">
              <Zap size={10} fill="currentColor" /> Oferta
            </div>
          )}
          {product.prescription === PrescriptionStatus.Required && (
            <div className="bg-slate-900 text-white text-[8px] font-black px-3 py-1.5 rounded-xl flex items-center gap-1.5 uppercase tracking-widest">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Receta
            </div>
          )}
        </div>

        <button className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-md shadow-xl rounded-full flex items-center justify-center text-slate-300 hover:text-rose-500 transition-all z-10 border border-slate-50 group/fav">
          <Heart size={20} className="group-hover/fav:fill-rose-500 transition-colors" />
        </button>
      </div>

      {/* Área de Información (Matching Screenshot) */}
      <div className="px-6 sm:px-8 pb-8 pt-0 flex-1 flex flex-col">
        <div className="mb-4">
          <p className="text-[9px] sm:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{product.brand}</p>
          <h3 className="text-sm sm:text-xl font-black tracking-tight text-slate-800 leading-tight group-hover:text-emerald-600 transition-colors cursor-pointer line-clamp-2 uppercase" onClick={onViewDetails}>
            {product.name}
          </h3>
        </div>

        <div className="flex items-center gap-1 text-amber-400 mb-6">
          {[1,2,3,4,5].map(i => <Star key={i} size={14} fill={i <= 4 ? "currentColor" : "none"} strokeWidth={3} />)}
          <span className="text-[9px] text-slate-400 font-black ml-2 uppercase tracking-widest">Best-Seller</span>
        </div>
        
        <div className="mt-auto space-y-5">
          <div className="flex flex-col">
            {product.oldPrice && (
              <span className="text-xs sm:text-sm text-slate-300 line-through font-black mb-0.5">{storeSettings.currencySymbol} {product.oldPrice.toFixed(2)}</span>
            )}
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tighter leading-none">
                {storeSettings.currencySymbol} {product.price.toFixed(2)}
              </span>
              <span className="text-[8px] sm:text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-widest border border-emerald-100">Club</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 sm:py-5 rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
            >
              <ShoppingCart size={18} strokeWidth={3} />
              <span>Añadir</span>
            </button>
            <button 
              onClick={onViewDetails}
              className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center transition-all border border-slate-100"
            >
              <Info size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
