
import React from 'react';
import { 
  Plus, Zap, Star, HeartPulse, Pill, Baby, Apple, User, Dumbbell, Sparkles, ArrowRight, Truck
} from 'lucide-react';
import { PRODUCTS } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';

interface HomeProps {
  onNavigate: (page: string, params?: any) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const categories = [
    { name: 'Medicina', icon: <Pill size={24} />, color: 'bg-emerald-500 text-white' },
    { name: 'Belleza', icon: <Sparkles size={24} />, color: 'bg-pink-500 text-white' },
    { name: 'Nutrición', icon: <Apple size={24} />, color: 'bg-orange-500 text-white' },
    { name: 'Bebés', icon: <Baby size={24} />, color: 'bg-blue-500 text-white' },
    { name: 'Fitness', icon: <Dumbbell size={24} />, color: 'bg-indigo-500 text-white' },
    { name: 'Vitaminas', icon: <Plus size={24} />, color: 'bg-amber-500 text-white' },
    { name: 'Cuidado', icon: <User size={24} />, color: 'bg-teal-500 text-white' },
  ];

  return (
    <div className="min-h-screen pb-10">
      {/* Hero Section - Fully Responsive Scaling */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="relative h-[450px] sm:h-[500px] md:h-[550px] rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden hero-retail shadow-2xl border-2 sm:border-4 border-white">
          <div className="absolute inset-0 opacity-40 sm:opacity-50">
            <img 
              src="https://images.unsplash.com/photo-1576091160550-2173dad99978?q=80&w=1600&auto=format&fit=crop" 
              className="w-full h-full object-cover"
              alt="careshop Bienestar"
            />
          </div>
          
          <div className="relative h-full flex flex-col justify-center px-6 sm:px-12 md:px-24 space-y-6 sm:space-y-8 max-w-4xl">
            <div className="bg-orange-500 text-white font-ubuntu text-[9px] sm:text-[11px] uppercase tracking-[0.2em] px-4 sm:px-6 py-1.5 sm:py-2 rounded-full w-fit shadow-xl flex items-center gap-2">
              <Zap size={12} fill="currentColor" /> Salud al Instante
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-ubuntu text-white leading-[0.9] sm:leading-[0.85] tracking-tighter drop-shadow-2xl">
              Cuidamos tu <br /> <span className="text-orange-500">Energía Vital.</span>
            </h1>
            <p className="text-white font-medium text-sm sm:text-xl max-w-sm sm:max-w-lg opacity-95 leading-snug sm:leading-relaxed">
              La farmacia del futuro hoy. Tecnología y calidez para que vivas al máximo cada día.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
              <button 
                onClick={() => onNavigate('shop')}
                className="btn-action px-8 sm:px-12 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-ubuntu text-[10px] sm:text-sm uppercase tracking-widest w-full sm:w-auto"
              >
                Comprar Ofertas
              </button>
              <button className="bg-white/10 backdrop-blur-md border-2 border-white/30 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-ubuntu text-[10px] sm:text-sm uppercase tracking-widest hover:bg-white/20 transition-all w-full sm:w-auto">
                Sube tu Receta
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories - Compact Grid for Mobile */}
      <section className="max-w-[1440px] mx-auto px-6 py-10 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-ubuntu text-slate-900 tracking-tighter mb-8 sm:mb-10 flex items-center gap-3">
          <div className="w-1.5 h-8 sm:h-10 bg-emerald-600 rounded-full"></div>
          Categorías
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-6">
          {categories.map((cat, i) => (
            <div 
              key={i} 
              className="group cursor-pointer flex flex-col items-center gap-3 sm:gap-4 p-5 sm:p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-14 h-14 sm:w-20 sm:h-20 ${cat.color} rounded-2xl sm:rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg`}>
                <div className="scale-75 sm:scale-100">{cat.icon}</div>
              </div>
              <span className="text-[10px] sm:text-[11px] font-ubuntu font-bold text-slate-800 uppercase tracking-tight text-center">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Marketplace - Grid Scaling */}
      <section className="max-w-[1440px] mx-auto px-6 py-6 sm:py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 border-b-2 border-slate-50 pb-6 sm:pb-8 gap-4">
          <h2 className="text-3xl sm:text-4xl font-ubuntu text-slate-900 tracking-tighter uppercase">Los Favoritos</h2>
          <button className="text-[10px] font-ubuntu font-bold text-emerald-600 uppercase tracking-widest hover:underline">Ver todo el catálogo</button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
          {PRODUCTS.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onViewDetails={() => onNavigate('product', { id: product.id })}
            />
          ))}
        </div>
      </section>

      {/* Trust Banner - Fully Responsive */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 mt-10 sm:mt-20">
        <div className="bg-white rounded-[2.5rem] sm:rounded-[4rem] p-8 sm:p-12 md:p-20 border-2 sm:border-4 border-emerald-50 shadow-2xl flex flex-col md:flex-row items-center gap-10 sm:gap-16 overflow-hidden relative">
          <div className="md:w-1/2 space-y-6 sm:space-y-8 relative z-10 text-center md:text-left">
            <h2 className="text-3xl sm:text-5xl font-ubuntu text-slate-900 tracking-tighter leading-tight">
              ¿Sin tiempo para salir? <br /> <span className="text-emerald-600">Nosotros volamos.</span>
            </h2>
            <p className="text-slate-500 text-base sm:text-lg font-medium leading-relaxed max-w-md mx-auto md:mx-0">
              Delivery especializado en 90 minutos para Lima. Tus medicamentos rápido y seguro.
            </p>
            <div className="flex justify-center md:justify-start gap-8 sm:gap-10">
              <div className="flex flex-col">
                <span className="text-3xl sm:text-4xl font-ubuntu text-orange-500">90min</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Promedio</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl sm:text-4xl font-ubuntu text-emerald-600">S/ 0</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Desde S/ 79</span>
              </div>
            </div>
            <button className="btn-action px-8 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-ubuntu text-[10px] flex items-center gap-3 mx-auto md:mx-0">
              Rastrear Pedido <ArrowRight size={16} />
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center relative z-10 w-full">
            <div className="bg-emerald-600 text-white p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl md:rotate-3 relative overflow-hidden group w-full max-w-sm">
               <Truck size={60} className="mb-4 sm:mb-6 animate-pulse mx-auto md:mx-0" />
               <p className="text-2xl sm:text-3xl font-ubuntu uppercase tracking-tighter leading-none mb-2 text-center md:text-left">Delivery <br /> Express</p>
               <p className="text-xs sm:text-sm font-medium opacity-80 text-center md:text-left">Rastreo GPS en tiempo real</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
