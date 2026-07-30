import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], 
      isOpen: false,

      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (product, size = 'M') => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.id === product.id && item.size === size
        );

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.id === product.id && item.size === size
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
            items: [...currentItems, { ...product, size, quantity: 1 }],
          });
        }
        set({ isOpen: true });
      },

      removeItem: (productId, size) => {
        set({
          items: get().items.filter(
            (item) => !(item.id === productId && item.size === size)
          ),
        });
      },

      updateQuantity: (productId, size, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((item) =>
            item.id === productId && item.size === size
              ? { ...item, quantity }
              : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'preciso-verde-cart',
    }
  )
);