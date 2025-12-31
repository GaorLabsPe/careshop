
import React, { useState, useEffect } from 'react';
import { Zap, ShieldCheck, Baby, HeartPulse, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { HeroSlide } from '../types';

interface HeroSliderProps {
  onNavigate: (page: string) => void;
  slides: HeroSlide[];
}

const HeroSlider: React.FC<HeroSliderProps> = ({ onNavigate, slides }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides || slides.length === 0) return null;

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 py-2 sm:py-6">
      <div className="relative h-[380px] sm:h-[600px] md:h-[650px] rounded-[2rem] sm:rounded-[4rem] overflow-hidden shadow-2xl group border-2 sm:border-4 border-white">
        
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <div className="absolute inset-0">
              <img 
                src={slide.image} 
                className="w-full h-full object-cover"
                alt={slide.title}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-transparent"></div>
              <div className="absolute inset-0 bg-black/10"></div>
            </div>

            <div className="relative h-full flex flex-col justify-center px-6 sm:px-16 md:px-24 max-w-4xl space-y-4 sm:space-y-8">
              <div className="animate-fade-in-up">
                <div className="bg-white/90 backdrop-blur-md text-slate-800 font-ubuntu text-[8px] sm:text-[11px] uppercase tracking-[0.2em] px-3 py-1.5 sm:px-5 sm:py-2 rounded-full w-fit shadow-xl flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <span className="text-emerald-500 font-black"><Zap size={12} className="sm:w-[14px]" fill="currentColor" /></span>
                  <span className="font-black">{slide.badge}</span>
                </div>
                
                <p className="text-white/80 font-black text-[9px] sm:text-sm uppercase tracking-[0.4em] mb-1 sm:mb-2 drop-shadow-md">
                  {slide.subtitle}
                </p>
                
                <h1 className="text-3xl sm:text-6xl md:text-8xl font-ubuntu text-white leading-[0.9] tracking-tighter drop-shadow-2xl">
                  {slide.title} <br /> 
                  <span className="text-white underline decoration-[#F97316] decoration-4 sm:decoration-8 underline-offset-4 sm:underline-offset-8">
                    {slide.highlight}
                  </span>
                </h1>
                
                <p className="text-white font-medium text-xs sm:text-lg md:text-xl max-w-[200px] sm:max-w-xl opacity-90 leading-tight sm:leading-relaxed mt-4 sm:mt-6 line-clamp-2">
                  {slide.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-6 sm:mt-10">
                  <button 
                    onClick={() => onNavigate('shop')}
                    className="bg-[#F97316] hover:bg-[#EA580C] text-white px-8 sm:px-14 py-3.5 sm:py-5 rounded-xl sm:rounded-2xl font-ubuntu text-[9px] sm:text-xs uppercase tracking-widest transition-all shadow-2xl flex items-center justify-center gap-2 sm:gap-3 w-fit"
                  >
                    {slide.cta} <ArrowRight size={14} className="sm:w-[16px]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {slides.length > 1 && (
          <>
            <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-20">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 sm:h-2 transition-all duration-300 rounded-full ${
                    current === i ? 'w-8 sm:w-12 bg-white' : 'w-2 sm:w-3 bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>

            <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full items-center justify-center transition-all hidden md:flex hover:scale-110 z-20">
              <ChevronLeft size={32} />
            </button>
            <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full items-center justify-center transition-all hidden md:flex hover:scale-110 z-20">
              <ChevronRight size={32} />
            </button>
          </>
        )}
      </div>
    </section>
  );
};

export default HeroSlider;
