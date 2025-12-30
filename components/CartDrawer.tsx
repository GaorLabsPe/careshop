
import React from 'react';
import { X, ShoppingBag, Trash2, Minus, Plus, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onCheckout }) => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-500">
          {/* Header */}
          <div className="px-6 py-6 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="text-emerald-500" />
              <h2 className="text-xl font-bold text-slate-800">Tu Carrito ({totalItems})</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
              <X size={24} />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                  <ShoppingBag size={48} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Tu carrito está vacío</h3>
                <p className="text-slate-500 text-sm">Parece que aún no has agregado productos de salud a tu carrito.</p>
                <button 
                  onClick={onClose}
                  className="bg-emerald-500 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-600 transition-colors"
                >
                  Ir a comprar
                </button>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="w-20 h-20 bg-slate-50 rounded-2xl overflow-hidden border flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-emerald-500 uppercase mb-1">{item.brand}</p>
                    <h4 className="font-bold text-slate-800 text-sm mb-1 truncate">{item.name}</h4>
                    <p className="text-emerald-600 font-bold mb-3">${item.price.toFixed(2)}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border rounded-lg bg-slate-50 overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-slate-200 text-slate-600"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-xs font-bold text-slate-800">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-slate-200 text-slate-600"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-slate-300 hover:text-rose-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t px-6 py-8 bg-slate-50 space-y-4">
              <div className="flex justify-between text-slate-600 text-sm">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-sm">
                <span>Envío</span>
                <span className="text-emerald-600 font-semibold">Gratis</span>
              </div>
              <div className="flex justify-between text-xl font-extrabold text-slate-900">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3">
                <ShieldCheck className="text-emerald-500 flex-shrink-0" size={24} />
                <p className="text-[10px] text-emerald-700">
                  Compra 100% segura. Encriptación SSL certificada para tus datos de salud.
                </p>
              </div>

              <button 
                onClick={onCheckout}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-5 rounded-3xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 group"
              >
                Pagar Ahora <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
