
import React, { useState, useEffect } from 'react';
import { 
  Plus, Zap, Star, HeartPulse, Pill, Baby, Apple, User, Dumbbell, Sparkles, ArrowRight, Truck, ChevronDown, ChevronUp
} from 'lucide-react';
import { Product, HeroSlide } from '../types';
import { ProductCard } from '../components/ProductCard';
import HeroSlider from '../components/HeroSlider';

interface HomeProps {
  onNavigate: (page: string, params?: any) => void;
  externalProducts?: Product[];
  heroSlides: HeroSlide[];
}

const Home: React.FC<HomeProps> = ({ onNavigate, externalProducts = [], heroSlides = [] }) => {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const categories = [
    { name: 'Medicina', icon: <Pill size={24} />, color: 'bg-emerald-500 text-white' },
    { name: 'Belleza', icon: <Sparkles size={24} />, color: 'bg-pink-500 text-white' },
    { name: 'Nutrición', icon: <Apple size={24} />, color: 'bg-orange-500 text-white' },
    { name: 'Bebés', icon: <Baby size={24} />, color: 'bg-blue-500 text-white' },
    { name: 'Fitness', icon: <Dumbbell size={24} />, color: 'bg-indigo-500 text-white' },
    { name: 'Vitaminas', icon: <Plus size={24} />, color: 'bg-amber-500 text-white' },
    { name: 'Cuidado', icon: <User size={24} />, color: 'bg-teal-500 text-white' },
  ];

  const displayCategories = (isMobile && !showAllCategories) 
    ? categories.slice(0, 4) 
    : categories;

  return (
    <div className="min-h-screen pb-10">
      <HeroSlider onNavigate={(page) => onNavigate(page)} slides={heroSlides} />

      <section className="max-w-[1440px] mx-auto px-6 py-10 sm:py-16">
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-ubuntu text-slate-900 tracking-tighter flex items-center gap-3">
            <div className="w-1.5 h-8 sm:h-10 bg-emerald-600 rounded-full"></div>
            Explorar Categorías
          </h2>
          <button 
            onClick={() => onNavigate('shop')} 
            className="hidden sm:block text-[10px] font-ubuntu font-bold text-emerald-600 uppercase tracking-widest hover:underline"
          >
            Catálogo Completo
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-6 overflow-hidden">
          {displayCategories.map((cat, i) => (
            <div 
              key={i} 
              className="group cursor-pointer flex flex-col items-center gap-3 sm:gap-4 p-5 sm:p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className={`w-14 h-14 sm:w-20 sm:h-20 ${cat.color} rounded-2xl sm:rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg`}>
                <div className="scale-75 sm:scale-100">{cat.icon}</div>
              </div>
              <span className="text-[10px] sm:text-[11px] font-ubuntu font-bold text-slate-800 uppercase tracking-tight text-center">{cat.name}</span>
            </div>
          ))}
        </div>

        {isMobile && (
          <div className="mt-8">
            <button 
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="w-full py-5 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 shadow-sm active:scale-95 transition-all"
            >
              {showAllCategories ? (
                <>Ver menos <ChevronUp size={16} /></>
              ) : (
                <>Ver todas las categorías ({categories.length}) <ChevronDown size={16} /></>
              )}
            </button>
          </div>
        )}
      </section>

      <section className="max-w-[1440px] mx-auto px-6 py-6 sm:py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 border-b-2 border-slate-50 pb-6 sm:pb-8 gap-4">
          <h2 className="text-3xl sm:text-4xl font-ubuntu text-slate-900 tracking-tighter uppercase">Los Más Buscados</h2>
          <button onClick={() => onNavigate('shop')} className="text-[10px] font-ubuntu font-bold text-emerald-600 uppercase tracking-widest hover:underline">Ver todo el catálogo</button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
          {externalProducts.length > 0 ? (
            externalProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onViewDetails={() => onNavigate('product', { id: product.id })}
              />
            ))
          ) : (
            <p className="col-span-full text-center py-20 text-slate-400 font-bold uppercase tracking-widest animate-pulse">
              Cargando productos de salud...
            </p>
          )}
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 mt-10 sm:mt-20">
        <div className="bg-slate-900 rounded-[2.5rem] sm:rounded-[4rem] p-8 sm:p-12 md:p-20 shadow-2xl flex flex-col md:flex-row items-center gap-10 sm:gap-16 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[50%] h-full bg-[#10B981]/10 blur-[100px] rounded-full"></div>
          
          <div className="md:w-1/2 space-y-6 sm:space-y-8 relative z-10 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start">
               <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white"><Baby size={20} /></div>
               <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Compromiso con la Familia</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-ubuntu text-white tracking-tighter leading-tight">
              ¿Sin tiempo para salir? <br /> <span className="text-emerald-500">careShop vuela por ti.</span>
            </h2>
            <p className="text-slate-400 text-base sm:text-lg font-medium leading-relaxed max-w-md mx-auto md:mx-0">
              Delivery especializado en 90 minutos para todo Lima. Seguridad garantizada en el transporte de medicamentos delicados y productos para tu bebé.
            </p>
            <div className="flex justify-center md:justify-start gap-8 sm:gap-10">
              <div className="flex flex-col">
                <span className="text-3xl sm:text-4xl font-ubuntu text-orange-500">90min</span>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Promedio Lima</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl sm:text-4xl font-ubuntu text-emerald-600">S/ 0</span>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Envíos Gratis*</span>
              </div>
            </div>
            <button className="bg-emerald-600 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-ubuntu text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 mx-auto md:mx-0 shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 transition-all">
              Rastrear Pedido <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="md:w-1/2 flex justify-center relative z-10 w-full">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl relative overflow-hidden group w-full max-w-sm">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500"></div>
               <Truck size={60} className="mb-4 sm:mb-6 text-emerald-500 mx-auto md:mx-0" />
               <p className="text-2xl sm:text-3xl font-ubuntu uppercase tracking-tighter leading-none mb-2 text-white text-center md:text-left">Envío <br /> Prioritario</p>
               <p className="text-xs sm:text-sm font-medium text-slate-400 text-center md:text-left">Seguimiento por GPS en tiempo real para tu tranquilidad.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
