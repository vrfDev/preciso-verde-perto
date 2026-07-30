import { X, Trash2, Plus, Minus, ShoppingBag, Info } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQuantity } = useCartStore();

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Fundo Escuro */}
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-5 border-b border-bark/10">
          <h2 className="font-display text-xl text-ink">Carrinho de compras</h2>
          <button onClick={closeCart} className="p-2 text-bark hover:text-ink transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Aviso */}
        <div className="bg-[#Fdf6e9] border-b border-[#F3e8d2] p-4 flex gap-3 text-[#A67c52]">
            <div className="mt-0.5 shrink-0"><Info size={16} /></div>
            <p className="text-xs font-medium">Atenção! Antes de finalizar sua compra, confira se escolheu a cor e o tamanho correto das peças.</p>
        </div>

        {/* Lista de Produtos */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-bark space-y-4">
              <ShoppingBag size={48} className="opacity-20" />
              <p>Seu carrinho está vazio.</p>
              <button onClick={closeCart} className="text-forest font-bold text-sm hover:underline">
                Continuar comprando
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4">
                  <div className="w-20 h-24 bg-linen rounded-lg overflow-hidden shrink-0 border border-bark/10">
                    <img src={item.image_url || item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-body text-sm font-semibold text-ink line-clamp-2 leading-snug">{item.name}</h3>
                      <button onClick={() => removeItem(item.id, item.size)} className="text-bark hover:text-red-600 transition-colors mt-0.5" title="Remover item">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    {/* Aqui está a lógica de exibição inteligente */}
                    <div className="text-[10px] text-bark mt-1 space-y-0.5">
                      {item.color && (
                        <p>Cor: <span className="font-medium text-ink">{item.color}</span></p>
                      )}
                      {item.size && item.size !== "Único" && (
                        <p>Tamanho: <span className="font-medium text-ink">{item.size}</span></p>
                      )}
                    </div>

                    <p className="font-body text-sm font-bold text-ink mt-1">
                      {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>

                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center bg-linen/50 rounded-full border border-bark/20">
                        <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-bark hover:text-ink">
                          <Minus size={12} />
                        </button>
                        <span className="w-4 text-center text-xs font-bold text-ink">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-bark hover:text-ink">
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rodapé de Finalização */}
        {items.length > 0 && (
          <div className="p-5 border-t border-bark/10 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-6">
              <span className="font-body font-semibold text-ink">Subtotal</span>
              <span className="font-body text-xl font-bold text-ink">
                {subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
            <div className="space-y-3">
              <Link
                to="/checkout"
                onClick={closeCart}
                className="w-full flex items-center justify-center bg-[#1B271A] text-linen font-bold py-4 rounded-xl hover:bg-black transition-colors"
              >
                Finalizar Compra
              </Link>
              <button
                onClick={closeCart}
                className="w-full flex items-center justify-center bg-white text-ink font-bold py-4 rounded-xl border border-bark/20 hover:bg-linen transition-colors"
              >
                Continuar comprando
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}