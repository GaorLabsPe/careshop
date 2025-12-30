
import React from 'react';
import { Search, ShoppingCart, User, Heart, ShieldCheck, Phone, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  onCartToggle: () => void;
  onNavigate: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onCartToggle, onNavigate }) => {
  const { totalItems } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
      {/* Top bar vibrante */}
      <div className="bg-[#064E3B] text-white text-[9px] py-2 px-6 hidden sm:flex justify-between items-center font-ubuntu uppercase tracking-[0.2em]">
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-2 opacity-90"><ShieldCheck size={12} className="text-[#10B981]" /> Resolución Sanitaria</span>
          <span className="flex items-center gap-2 opacity-90"><Phone size={12} className="text-[#F97316]" /> Pedidos: 01 444 5555</span>
        </div>
        <div className="opacity-90">🚀 Delivery Express Lima</div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 h-20 sm:h-24 flex items-center gap-4 sm:gap-10">
        {/* Logo careshop Vibrante */}
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#10B981] text-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-[#059669] transition-all">
            <ShoppingBag size={20} className="sm:size-24" />
          </div>
          <span className="text-xl sm:text-3xl font-bold tracking-tighter text-slate-900 font-ubuntu">
            care<span className="text-[#10B981]">shop</span>
          </span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 relative group max-w-2xl">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#10B981] transition-colors hidden sm:block">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="¿Qué necesitas hoy?"
            className="w-full bg-slate-100 border-2 border-transparent rounded-xl sm:rounded-[1.5rem] py-2.5 sm:py-3.5 pl-4 sm:pl-12 pr-4 sm:pr-24 focus:bg-white focus:border-[#10B981] outline-none transition-all text-xs sm:text-sm font-bold text-slate-800 placeholder:text-slate-400"
          />
          <button className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#10B981] text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold text-[9px] uppercase tracking-widest hover:bg-[#059669] transition-colors hidden xs:block font-ubuntu">
            Buscar
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-6 shrink-0">
          <button 
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2 group p-2 hover:bg-slate-50 rounded-xl transition-all"
          >
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-[#10B981] group-hover:text-white transition-all shadow-sm">
              <User size={20} />
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 leading-none mb-1 font-ubuntu">Ingresa</p>
              <p className="text-xs font-bold text-slate-900 uppercase font-ubuntu">Perfil</p>
            </div>
          </button>

          <button 
            onClick={onCartToggle}
            className="bg-[#F97316] hover:bg-[#EA580C] text-white p-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-[1.5rem] flex items-center gap-3 shadow-lg shadow-orange-500/20 transition-all active:scale-95 group"
          >
            <div className="relative">
              <ShoppingCart size={20} strokeWidth={2.5} />
              {totalItems > 0 && (
                <span className="absolute -top-4 -right-4 bg-white text-[#F97316] text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md border-2 border-[#F97316] font-ubuntu">
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
