
import React from 'react';
import { X, Sparkles, Zap, ArrowRight } from 'lucide-react';
import { StoreSettings } from '../types';

interface PromoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StoreSettings;
}

const PromoPopup: React.FC<PromoPopupProps> = ({ isOpen, onClose, settings }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-lg" onClick={onClose}></div>
      
      <div className="bg-white w-full max-w-4xl rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col md:flex-row relative animate-in zoom-in-95 duration-500">
        <button onClick={onClose} className="absolute top-6 right-6 z-20 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
          <X size={24} />
        </button>

        <div className="md:w-1/2 relative h-64 md:h-auto overflow-hidden">
          <img src={settings.promoImage} alt="Promo" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
          <div className="absolute bottom-10 left-10">
            <div className="bg-yellow-400 text-slate-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Zap size={14} fill="currentColor" /> Solo por hoy
            </div>
          </div>
        </div>

        <div className="md:w-1/2 p-12 sm:p-20 flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <h3 className="text-emerald-500 text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={16} /> Exclusivo Online
            </h3>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter leading-none">
              {settings.promoTitle}
            </h2>
            <p className="text-slate-500 font-medium leading-relaxed">
              Recibe un cupón de **S/ 20 de descuento** para tu primera compra mayor a S/ 150. ¡Tu salud no puede esperar!
            </p>
          </div>

          <div className="space-y-4">
             <button 
               onClick={onClose}
               className="w-full py-5 rounded-2xl font-black text-white uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform"
               style={{ backgroundColor: settings.primaryColor }}
             >
               Obtener Beneficio <ArrowRight size={20} />
             </button>
             <button onClick={onClose} className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">
               No gracias, prefiero pagar precio completo
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoPopup;
