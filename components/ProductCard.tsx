
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
    <div className="group bg-white rounded-[3rem] overflow-hidden border border-slate-100 product-shadow transition-all duration-300 flex flex-col h-full hover:-translate-y-2">
      {/* Product Image Area */}
      <div className="relative aspect-square overflow-hidden bg-white p-10 flex items-center justify-center cursor-pointer" onClick={onViewDetails}>
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Retail Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
          {product.oldPrice && (
            <div className="bg-accent text-white text-[9px] font-ubuntu font-bold px-3 py-1.5 rounded-xl shadow-lg uppercase tracking-wider flex items-center gap-1">
              <Zap size={10} fill="currentColor" /> Oferta
            </div>
          )}
          {product.prescription === PrescriptionStatus.Required && (
            <div className="bg-slate-900 text-white text-[8px] font-ubuntu px-3 py-1.5 rounded-lg flex items-center gap-1.5 uppercase tracking-widest">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div> Rx
            </div>
          )}
        </div>

        <button className="absolute top-6 right-6 w-11 h-11 bg-white/90 backdrop-blur-md shadow-xl rounded-full flex items-center justify-center text-slate-300 hover:text-rose-500 hover:scale-110 transition-all z-10 border border-slate-50">
          <Heart size={20} />
        </button>
      </div>

      {/* Info Area */}
      <div className="p-8 pt-0 flex-1 flex flex-col">
        <div className="mb-6">
          <p className="text-[10px] font-ubuntu font-bold text-primary uppercase tracking-[0.2em] mb-2">{product.brand}</p>
          <h3 className="text-xl font-ubuntu tracking-tighter text-slate-800 leading-tight group-hover:text-primary transition-colors cursor-pointer" onClick={onViewDetails}>
            {product.name}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 text-amber-400 mb-8">
          {[1,2,3,4,5].map(i => <Star key={i} size={14} fill={i <= 4 ? "currentColor" : "none"} strokeWidth={3} />)}
          <span className="text-[10px] text-slate-400 font-bold ml-2 uppercase">Best-Seller</span>
        </div>
        
        <div className="mt-auto">
          <div className="flex flex-col mb-6">
            {product.oldPrice && (
              <span className="text-sm text-slate-300 line-through font-bold">{storeSettings.currencySymbol} {product.oldPrice.toFixed(2)}</span>
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-ubuntu text-slate-900 tracking-tighter">{storeSettings.currencySymbol} {product.price.toFixed(2)}</span>
              <span className="text-[9px] font-ubuntu font-bold text-primary bg-emerald-50 px-2 py-0.5 rounded uppercase">Club</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              className="flex-1 btn-accent py-4 rounded-2xl font-ubuntu text-[11px] uppercase tracking-widest flex items-center justify-center gap-3"
            >
              <ShoppingCart size={18} strokeWidth={3} />
              Agregar
            </button>
            <button 
              onClick={onViewDetails}
              className="p-4 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-2xl transition-all"
            >
              <Info size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
