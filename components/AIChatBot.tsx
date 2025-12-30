
import React, { useState, useRef, useEffect } from 'react';
// Fix: Added ShieldCheck to the lucide-react imports to resolve the compilation error
import { X, Send, Bot, User, Sparkles, HeartPulse, Stethoscope, Zap, ShieldCheck } from 'lucide-react';
import { getPharmaceuticalAdvice } from '../services/geminiService';

const AIChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: '¡Hola! Soy careIA 🌿 Tu guía personalizada de bienestar. ¿Cómo puedo ayudarte a sentirte mejor hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const botResponse = await getPharmaceuticalAdvice(userMsg);
    setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-10 right-10 z-[60]">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-white border-4 border-[#059669] text-[#059669] w-24 h-24 rounded-[3rem] shadow-2xl hover:scale-110 transition-all flex items-center justify-center group relative overflow-hidden"
        >
          <div className="absolute inset-0 vital-gradient opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <Stethoscope size={40} className="relative z-10 group-hover:text-white transition-colors animate-pulse" />
          <div className="absolute top-0 right-0 bg-[#F97316] text-white text-[9px] font-black px-3 py-1 rounded-bl-xl shadow-lg">careIA</div>
        </button>
      ) : (
        <div className="bg-white rounded-[4rem] shadow-[0_60px_100px_-20px_rgba(0,0,0,0.25)] w-[90vw] sm:w-[520px] h-[800px] flex flex-col overflow-hidden border border-emerald-50 animate-in slide-in-from-bottom-20 duration-500">
          {/* High Impact Header */}
          <div className="vital-gradient p-12 text-white flex justify-between items-center relative">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-3xl rounded-full"></div>
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl rotate-3">
                <Bot size={44} className="text-[#059669] animate-bounce" />
              </div>
              <div>
                <p className="font-black text-3xl tracking-tighter leading-none mb-2">care<span className="text-white/80">IA</span></p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                  <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">Experto en Salud Online</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-4 rounded-2xl transition-all relative z-10">
              <X size={32} />
            </button>
          </div>

          {/* Chat History */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 space-y-12 bg-slate-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-5 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-[#F97316] text-white' : 'bg-white text-[#059669] border border-emerald-50'}`}>
                    {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                  </div>
                  <div className={`p-8 rounded-[3rem] text-sm font-bold leading-relaxed shadow-xl shadow-slate-200/50 ${msg.role === 'user' ? 'bg-[#F97316] text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-emerald-50'}`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-8 rounded-[3rem] border border-emerald-50 flex items-center gap-6 shadow-sm">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-[#059669] rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-[#059669] rounded-full animate-bounce delay-150"></div>
                    <div className="w-3 h-3 bg-[#059669] rounded-full animate-bounce delay-300"></div>
                  </div>
                  <span className="text-[10px] font-black text-[#059669] uppercase tracking-[0.3em]">Preparando consejo vital...</span>
                </div>
              </div>
            )}
          </div>

          {/* Smart Input */}
          <div className="p-12 bg-white border-t border-emerald-50">
            <div className="relative group">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Pregúntale a careIA sobre tu bienestar..."
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] py-8 pl-10 pr-28 text-sm font-bold focus:outline-none focus:bg-white focus:ring-8 focus:ring-emerald-500/5 focus:border-[#059669] transition-all shadow-inner"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-20 h-20 btn-action text-white rounded-full flex items-center justify-center hover:scale-105 transition-all shadow-2xl active:scale-95"
              >
                <Send size={28} />
              </button>
            </div>
            <div className="flex justify-center gap-10 mt-10">
               <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <Zap size={12} className="text-yellow-500" /> Consultas Gratis
               </div>
               <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <ShieldCheck size={12} className="text-emerald-500" /> Privacidad SSL
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatBot;
