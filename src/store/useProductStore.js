import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,

  // BUSCAR PRODUTOS DO BANCO
  fetchProducts: async () => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Erro ao buscar produtos:', error);
    else set({ products: data });
    set({ loading: false });
  },

  // ADICIONAR NOVO PRODUTO
  addProduct: async (newProduct) => {
    const { data, error } = await supabase
      .from('products')
      .insert([newProduct])
      .select();

    if (error) throw error;
    set((state) => ({ products: [data[0], ...state.products] }));
  },

  // DELETAR PRODUTO
  deleteProduct: async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    }));
  },
}));