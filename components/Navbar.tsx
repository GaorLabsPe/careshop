
import React from 'react';
import { Search, ShoppingCart, User, ShieldCheck, Phone, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { StoreSettings } from '../types';

interface NavbarProps {
  onCartToggle: () => void;
  onNavigate: (page: string) => void;
  onLogoClick: () => void;
  storeSettings: StoreSettings;
}

const Navbar: React.FC<NavbarProps> = ({ onCartToggle, onNavigate, onLogoClick, storeSettings }) => {
  const { totalItems } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
      <div className="bg-slate-900 text-white text-[10px] py-2 px-6 hidden sm:flex justify-between items-center font-ubuntu uppercase tracking-[0.2em]">
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-2 opacity-90"><ShieldCheck size={12} className="text-emerald-400" /> Resolución Sanitaria Vigente</span>
          <span className="flex items-center gap-2 opacity-90"><Phone size={12} className="text-orange-400" /> Central: 01 444 5555</span>
        </div>
        <div className="opacity-90 font-black">🔥 Delivery Gratis por compras mayores a S/ 99</div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 h-20 sm:h-24 flex items-center gap-4 sm:gap-10">
        <div 
          onClick={onLogoClick}
          className="flex items-center gap-3 cursor-pointer group shrink-0 active:scale-95 transition-transform"
        >
          {storeSettings.logoUrl ? (
            <img 
              src={storeSettings.logoUrl} 
              alt={storeSettings.storeName} 
              className="h-10 sm:h-12 w-auto object-contain transition-all group-hover:scale-105"
            />
          ) : (
            <div 
              className="w-10 h-10 sm:w-12 sm:h-12 text-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg transition-all group-hover:scale-105"
              style={{ backgroundColor: storeSettings.primaryColor }}
            >
              <ShoppingBag size={24} />
            </div>
          )}
          <span className="text-xl sm:text-3xl font-bold tracking-tighter text-slate-900 font-ubuntu uppercase">
            {storeSettings.storeName}
          </span>
        </div>

        <div className="flex-1 relative group max-w-2xl">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors hidden sm:block">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="¿Qué medicamento o producto buscas hoy?"
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl sm:rounded-[1.5rem] py-2.5 sm:py-3.5 pl-4 sm:pl-12 pr-4 sm:pr-24 focus:bg-white outline-none transition-all text-xs sm:text-sm font-bold text-slate-800"
          />
          <button 
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold text-[9px] uppercase tracking-widest hidden xs:block font-ubuntu transition-colors"
            style={{ backgroundColor: storeSettings.primaryColor }}
          >
            Buscar
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-6 shrink-0">
          <button className="flex items-center gap-2 group p-2 hover:bg-slate-50 rounded-xl transition-all">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center transition-all shadow-sm">
              <User size={20} />
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Mi Cuenta</p>
              <p className="text-xs font-black text-slate-900 uppercase">Ingresar</p>
            </div>
          </button>

          <button 
            onClick={onCartToggle}
            className="text-white p-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-[1.5rem] flex items-center gap-3 shadow-lg shadow-orange-500/20 transition-all active:scale-95 group"
            style={{ backgroundColor: '#F97316' }}
          >
            <div className="relative">
              <ShoppingCart size={20} strokeWidth={2.5} />
              {totalItems > 0 && (
                <span className="absolute -top-4 -right-4 bg-white text-[#F97316] text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-md border-2 border-[#F97316] font-ubuntu">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="font-bold text-[10px] uppercase tracking-widest hidden xl:block font-ubuntu">Carrito</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
