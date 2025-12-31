
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
    <div className="group bg-white rounded-xl sm:rounded-[3rem] overflow-hidden border border-slate-100 product-shadow transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      {/* Imagen */}
      <div className="relative aspect-square overflow-hidden bg-white p-3 sm:p-10 flex items-center justify-center cursor-pointer" onClick={onViewDetails}>
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
        />
        
        <div className="absolute top-2 left-2 sm:top-6 sm:left-6 flex flex-col gap-1 sm:gap-2 z-10">
          {product.oldPrice && (
            <div className="bg-accent text-white text-[6px] sm:text-[9px] font-ubuntu font-bold px-1.5 py-0.5 sm:px-3 sm:py-1.5 rounded sm:rounded-xl shadow-lg uppercase tracking-wider flex items-center gap-1">
              <Zap size={7} className="sm:w-2.5 sm:h-2.5" fill="currentColor" /> Oferta
            </div>
          )}
          {product.prescription === PrescriptionStatus.Required && (
            <div className="bg-slate-900 text-white text-[6px] sm:text-[8px] font-ubuntu px-1.5 py-0.5 sm:px-3 sm:py-1.5 rounded flex items-center gap-1 sm:gap-1.5 uppercase tracking-widest">
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-primary rounded-full"></div> Rx
            </div>
          )}
        </div>

        <button className="absolute top-2 right-2 sm:top-6 sm:right-6 w-7 h-7 sm:w-11 sm:h-11 bg-white/90 backdrop-blur-md shadow-xl rounded-full flex items-center justify-center text-slate-300 hover:text-rose-500 transition-all z-10 border border-slate-50">
          <Heart size={14} className="sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Info */}
      <div className="p-2 sm:p-8 pt-0 flex-1 flex flex-col">
        <div className="mb-2 sm:mb-6">
          <p className="text-[7px] sm:text-[10px] font-ubuntu font-bold text-primary uppercase tracking-[0.2em] mb-0.5 sm:mb-2 line-clamp-1">{product.brand}</p>
          <h3 className="text-[10px] sm:text-xl font-ubuntu tracking-tighter text-slate-800 leading-tight group-hover:text-primary transition-colors cursor-pointer line-clamp-2" onClick={onViewDetails}>
            {product.name}
          </h3>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-amber-400 mb-8">
          {[1,2,3,4,5].map(i => <Star key={i} size={14} fill={i <= 4 ? "currentColor" : "none"} strokeWidth={3} />)}
          <span className="text-[10px] text-slate-400 font-bold ml-2 uppercase">Best-Seller</span>
        </div>
        
        <div className="mt-auto">
          <div className="flex flex-col mb-2 sm:mb-6">
            {product.oldPrice && (
              <span className="text-[8px] sm:text-sm text-slate-300 line-through font-bold leading-none mb-0.5">{storeSettings.currencySymbol} {product.oldPrice.toFixed(2)}</span>
            )}
            <div className="flex items-baseline gap-1 sm:gap-2">
              <span className="text-sm sm:text-4xl font-ubuntu text-slate-900 tracking-tighter leading-none">{storeSettings.currencySymbol} {product.price.toFixed(2)}</span>
              <span className="text-[6px] sm:text-[9px] font-ubuntu font-bold text-primary bg-emerald-50 px-1 py-0.5 rounded uppercase leading-none">Club</span>
            </div>
          </div>

          <div className="flex gap-1 sm:gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              className="flex-1 bg-accent text-white py-2 sm:py-4 rounded-lg sm:rounded-2xl font-ubuntu text-[8px] sm:text-[11px] uppercase tracking-widest flex items-center justify-center gap-1 sm:gap-3 hover:bg-orange-600 transition-colors"
            >
              <ShoppingCart size={12} className="sm:w-[18px] sm:h-[18px]" strokeWidth={3} />
              <span>Añadir</span>
            </button>
            <button 
              onClick={onViewDetails}
              className="p-2 sm:p-4 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-lg sm:rounded-2xl transition-all"
            >
              <Info size={14} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
