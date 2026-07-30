import { useMemo, useState, useEffect } from "react";
import {
  Search, Plus, Pencil, Trash2, X, ImageOff, ImagePlus, ChevronDown, Loader2, Package, Filter, FilterX
} from "lucide-react";
import { supabase } from "../lib/supabase";

const CATEGORIES = ["Camisetas", "Moletons", "Ecobags", "Toucas", "Bonés", "Corta Vento", "Calça Moletom"];
const SIZES_LIST = ["P", "M", "G", "GG"];

const currency = (value) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function ProductDrawer({ open, onClose, productToEdit, onSave, isSaving }) {
  const isEditing = !!productToEdit;
  
  const [formData, setFormData] = useState({
    name: "",
    category: "Camisetas",
    price: "",
    description: "",
  });

  const [coverImage, setCoverImage] = useState(null); 
  
  const [colors, setColors] = useState([
    { id: 1, name: "Marrom", hex: "#5C3A21", hasSizes: true, stock: 0, sizeStock: { P: 0, M: 0, G: 0, GG: 0 }, images: [] }
  ]);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || "",
        category: productToEdit.category || "Camisetas",
        price: productToEdit.price || "",
        description: productToEdit.description || "",
      });
      
      setCoverImage(productToEdit.image_url ? { file: null, url: productToEdit.image_url } : null);

      if (productToEdit.colors && productToEdit.colors.length > 0) {
        setColors(productToEdit.colors.map((c, i) => ({
          id: i,
          name: c.name || "",
          hex: c.hex || "#000000",
          hasSizes: c.hasSizes !== undefined ? c.hasSizes : true,
          stock: c.stock || 0,
          sizeStock: c.sizeStock || { P: 0, M: 0, G: 0, GG: 0 },
          images: (c.images || []).map((url, j) => ({ id: j, file: null, url }))
        })));
      } else {
        setColors([]);
      }
    } else {
      setFormData({ name: "", category: "Camisetas", price: "", description: "" });
      setCoverImage(null);
      setColors([{ id: Date.now(), name: "Marrom", hex: "#5C3A21", hasSizes: true, stock: 0, sizeStock: { P: 0, M: 0, G: 0, GG: 0 }, images: [] }]);
    }
  }, [productToEdit, open]);

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) setCoverImage({ file, url: URL.createObjectURL(file) });
  };

  const addColor = () => setColors(prev => [...prev, { id: Date.now(), name: "", hex: "#111111", hasSizes: true, stock: 0, sizeStock: { P: 0, M: 0, G: 0, GG: 0 }, images: [] }]);
  const updateColor = (id, field, value) => setColors(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  const removeColor = (id) => setColors(prev => prev.filter(c => c.id !== id));

  const handleColorImageUpload = (colorId, e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file)
    }));
    setColors(prev => prev.map(c => 
      c.id === colorId ? { ...c, images: [...c.images, ...newImages] } : c
    ));
  };

  const removeColorImage = (colorId, imageId) => {
    setColors(prev => prev.map(c => 
      c.id === colorId ? { ...c, images: c.images.filter(img => img.id !== imageId) } : c
    ));
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSave({ ...formData, coverImage, colors });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <form onSubmit={handleSave} className="relative flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-bark/15 px-6 py-5">
          <h2 className="text-lg font-semibold text-ink">{isEditing ? "Editar Produto" : "Novo Produto"}</h2>
          <button type="button" onClick={onClose} disabled={isSaving} className="rounded-lg p-2 text-bark hover:bg-bark/10">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6 scrollbar-hide">
          <section>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-forest">Capa do Produto</h3>
            <div className="flex items-center gap-4">
              {coverImage ? (
                <div className="relative w-28 h-32 rounded-xl border border-bark/20 overflow-hidden group">
                  <img src={coverImage.url} alt="Capa" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setCoverImage(null)} className="absolute top-1 right-1 bg-white/90 text-red-600 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"><X size={14} /></button>
                  <span className="absolute bottom-0 left-0 right-0 bg-forest text-linen text-[10px] text-center py-1 font-bold">CAPA</span>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-28 h-32 rounded-xl border-2 border-dashed border-bark/30 text-bark hover:border-forest hover:text-forest hover:bg-forest/5 cursor-pointer transition-colors bg-linen/30">
                  <ImagePlus size={24} className="mb-2" />
                  <span className="text-xs font-semibold uppercase">Adicionar</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                </label>
              )}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-forest">Informações Básicas</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Nome do produto</label>
                <input required type="text" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full rounded-xl border border-bark/20 px-3.5 py-2.5 text-sm focus:border-forest outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">Categoria</label>
                  <div className="relative">
                    <select value={formData.category} onChange={(e)=>setFormData({...formData, category: e.target.value})} className="w-full appearance-none rounded-xl border border-bark/20 bg-white px-3.5 py-2.5 text-sm focus:border-forest outline-none">
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-bark" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">Preço (R$)</label>
                  <input required type="number" step="0.01" value={formData.price} onChange={(e)=>setFormData({...formData, price: e.target.value})} className="w-full rounded-xl border border-bark/20 px-3.5 py-2.5 text-sm focus:border-forest outline-none" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Descrição</label>
                <textarea rows="3" value={formData.description} onChange={(e)=>setFormData({...formData, description: e.target.value})} className="w-full rounded-xl border border-bark/20 px-3.5 py-2.5 text-sm focus:border-forest outline-none resize-none" />
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4 border-b border-bark/15 pb-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-forest">Cores, Estoque e Imagens</h3>
              <button type="button" onClick={addColor} className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-bold bg-forest/10 text-forest hover:bg-forest/20 transition-colors">
                <Plus size={14} /> Nova Cor
              </button>
            </div>
            
            <div className="space-y-6 mt-3">
              {colors.map((color) => (
                <div key={color.id} className="relative rounded-2xl border border-bark/20 bg-linen/30 p-5 shadow-sm">
                  
                  <button type="button" onClick={() => removeColor(color.id)} className="absolute -top-3 -right-3 p-2 text-bark hover:text-white hover:bg-red-500 transition-all bg-white rounded-full shadow-md border border-bark/15 z-10" title="Remover variação">
                    <Trash2 size={16} />
                  </button>

                  <div className="grid grid-cols-12 gap-4 items-end mb-4 border-b border-bark/10 pb-4">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-bark mb-1.5 text-center">Cor</label>
                      <div className="flex justify-center">
                        <input type="color" value={color.hex} onChange={(e) => updateColor(color.id, 'hex', e.target.value)} className="h-10 w-10 cursor-pointer appearance-none rounded-full border-2 border-white shadow-sm bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-full shrink-0" />
                      </div>
                    </div>
                    <div className="col-span-10">
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-bark mb-1.5">Nome da Cor</label>
                      <input type="text" placeholder="Ex: Verde Musgo" value={color.name} onChange={(e) => updateColor(color.id, 'name', e.target.value)} className="w-full rounded-xl border border-bark/20 bg-white px-3 py-2.5 text-sm focus:border-forest outline-none" />
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className="flex items-center gap-2 cursor-pointer mb-3 w-max">
                      <input type="checkbox" checked={color.hasSizes} onChange={(e) => updateColor(color.id, 'hasSizes', e.target.checked)} className="w-4 h-4 rounded border-bark/30 text-forest focus:ring-forest accent-forest" />
                      <span className="text-xs font-bold uppercase tracking-wide text-ink">Esta cor possui tamanhos (P, M, G, GG)</span>
                    </label>

                    {color.hasSizes ? (
                      <div className="grid grid-cols-4 gap-3 bg-white p-3 rounded-xl border border-bark/10">
                        {SIZES_LIST.map(sz => (
                          <div key={sz}>
                            <label className="block text-[10px] font-bold uppercase text-bark mb-1 text-center">Estoque {sz}</label>
                            <input type="number" min="0" placeholder="0" value={color.sizeStock[sz] || 0} onChange={(e) => { const newStock = { ...color.sizeStock, [sz]: parseInt(e.target.value) || 0 }; updateColor(color.id, 'sizeStock', newStock); }} className="w-full rounded-lg border border-bark/20 px-2 py-1.5 text-sm text-center focus:border-forest outline-none" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white p-3 rounded-xl border border-bark/10 w-1/2">
                        <label className="block text-[10px] font-bold uppercase text-bark mb-1 flex items-center gap-1"><Package size={12}/> Estoque Único (Sem tamanho)</label>
                        <input type="number" min="0" placeholder="0" value={color.stock} onChange={(e) => updateColor(color.id, 'stock', parseInt(e.target.value) || 0)} className="w-full rounded-lg border border-bark/20 px-3 py-2 text-sm focus:border-forest outline-none font-bold" />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wide text-bark mb-2">Fotos EXCLUSIVAS desta cor (Frente, Costas, etc)</label>
                    <div className="flex flex-wrap gap-3 p-3 bg-white border border-bark/10 rounded-xl">
                      {color.images.map((img) => (
                        <div key={img.id} className="relative w-16 h-20 rounded-lg border border-bark/20 overflow-hidden group">
                          <img src={img.url} alt="Galeria" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removeColorImage(color.id, img.id)} className="absolute inset-0 m-auto w-6 h-6 flex items-center justify-center bg-red-600/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      <label className="flex flex-col items-center justify-center w-16 h-20 rounded-lg border-2 border-dashed border-bark/20 text-bark hover:border-forest hover:text-forest hover:bg-forest/5 cursor-pointer transition-colors">
                        <Plus size={20} />
                        <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleColorImageUpload(color.id, e)} />
                      </label>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-bark/15 px-6 py-4 bg-linen/30">
          <button type="button" onClick={onClose} disabled={isSaving} className="rounded-xl px-5 py-2.5 text-sm font-medium text-bark hover:bg-bark/10">Cancelar</button>
          <button type="submit" disabled={isSaving} className="flex items-center gap-2 rounded-xl bg-forest px-6 py-2.5 text-sm font-bold text-linen shadow-sm hover:bg-forest/90 disabled:opacity-70 transition-colors">
            {isSaving ? <><Loader2 size={16} className="animate-spin" /> Salvando...</> : (isEditing ? "Salvar Alterações" : "Criar Produto")}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados de Busca e Filtros Avançados
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterCategory, setFilterCategory] = useState("Todas");
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [filterMinPrice, setFilterMinPrice] = useState("");
  const [filterMaxPrice, setFilterMaxPrice] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (!error && data) setProducts(data);
    setLoading(false);
  };

  // Lógica de Filtros Estilo Excel
  const filtered = useMemo(() => {
    return products.filter((p) => {
      // 1. Filtro por Busca (Nome do produto)
      const matchesQuery = !query.trim() || p.name.toLowerCase().includes(query.toLowerCase());

      // 2. Filtro por Categoria
      const matchesCategory = filterCategory === "Todas" || p.category === filterCategory;

      // 3. Filtro por Status
      const matchesStatus = filterStatus === "Todos" ||
        (filterStatus === "Ativo" && p.is_featured) ||
        (filterStatus === "Inativo" && !p.is_featured);

      // 4. Filtro por Preço (Mínimo e Máximo)
      const matchesMinPrice = !filterMinPrice || p.price >= parseFloat(filterMinPrice);
      const matchesMaxPrice = !filterMaxPrice || p.price <= parseFloat(filterMaxPrice);

      return matchesQuery && matchesCategory && matchesStatus && matchesMinPrice && matchesMaxPrice;
    });
  }, [query, filterCategory, filterStatus, filterMinPrice, filterMaxPrice, products]);

  const clearFilters = () => {
    setFilterCategory("Todas");
    setFilterStatus("Todos");
    setFilterMinPrice("");
    setFilterMaxPrice("");
    setQuery("");
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Ativo" ? "Inativo" : "Ativo";
    setProducts(products.map(p => p.id === id ? { ...p, status: newStatus } : p));
    await supabase.from('products').update({ is_featured: newStatus === 'Ativo' }).eq('id', id);
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      await supabase.from('products').delete().eq('id', id);
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSaveProduct = async (formData) => {
    setIsSaving(true);
    try {
      let finalCoverUrl = editingProduct?.image_url || null;
      if (formData.coverImage?.file) {
        const fileExt = formData.coverImage.file.name.split('.').pop();
        const fileName = `cover-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error } = await supabase.storage.from('produtos').upload(fileName, formData.coverImage.file);
        if (!error) {
          const { data } = supabase.storage.from('produtos').getPublicUrl(fileName);
          finalCoverUrl = data.publicUrl;
        }
      }

      const processedColors = [];
      for (const color of formData.colors) {
        const uploadedImagesUrls = [];
        for (const img of color.images) {
          if (img.file) {
            const fileExt = img.file.name.split('.').pop();
            const fileName = `color-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const { error } = await supabase.storage.from('produtos').upload(fileName, img.file);
            if (!error) {
              const { data } = supabase.storage.from('produtos').getPublicUrl(fileName);
              uploadedImagesUrls.push(data.publicUrl);
            }
          } else if (img.url) {
            uploadedImagesUrls.push(img.url);
          }
        }
        
        processedColors.push({
          name: color.name,
          hex: color.hex,
          hasSizes: color.hasSizes,
          stock: color.hasSizes ? 0 : (parseInt(color.stock) || 0),
          sizeStock: color.hasSizes ? color.sizeStock : null,
          images: uploadedImagesUrls
        });
      }

      const productData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        description: formData.description,
        image_url: finalCoverUrl,
        sizes: [], 
        colors: processedColors,
        is_featured: editingProduct ? editingProduct.is_featured : true
      };

      if (editingProduct) {
        const { error: dbError } = await supabase.from('products').update(productData).eq('id', editingProduct.id);
        if (dbError) throw dbError;
      } else {
        const { error: dbError } = await supabase.from('products').insert([productData]);
        if (dbError) throw dbError;
      }

      await fetchProducts();
      setDrawerOpen(false);
    } catch (error) {
      console.error("Erro detalhado:", error);
      alert(`Erro do banco de dados: ${error.message || "Falha ao salvar a variação"}.`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* CABEÇALHO E BUSCA PRINCIPAL */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-ink">Produtos</h2>
          <p className="text-sm text-bark">
            {filtered.length} {filtered.length === 1 ? 'produto' : 'produtos'} {filtered.length !== products.length && `de ${products.length}`}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex items-center gap-2">
            <div className="relative w-full sm:w-72">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-bark" />
              <input 
                type="text" 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                placeholder="Buscar produto por nome..." 
                className="w-full rounded-xl border border-bark/20 bg-white py-2.5 pl-9 pr-3 text-sm focus:border-forest outline-none" 
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)} 
              className={`flex items-center justify-center p-2.5 rounded-xl border transition-colors ${showFilters ? 'bg-forest/10 border-forest/20 text-forest' : 'bg-white border-bark/20 text-bark hover:text-ink'}`}
              title="Filtros Avançados"
            >
              <Filter size={18} />
            </button>
          </div>
          <button onClick={() => { setEditingProduct(null); setDrawerOpen(true); }} className="flex items-center justify-center gap-1.5 rounded-xl bg-forest px-4 py-2.5 text-sm font-bold text-linen hover:bg-forest/90 shadow-sm transition-colors">
            <Plus size={18} /> Novo Produto
          </button>
        </div>
      </div>

      {/* ÁREA DE FILTROS AVANÇADOS (ESTILO EXCEL) */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-5 bg-white rounded-2xl border border-bark/15 shadow-sm animate-in slide-in-from-top-2 duration-200">
          
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-bark mb-1.5">Categoria</label>
            <div className="relative">
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="w-full appearance-none rounded-lg border border-bark/20 bg-linen/30 px-3 py-2 text-sm focus:border-forest outline-none text-ink font-medium">
                <option value="Todas">Todas as categorias</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-bark" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-bark mb-1.5">Status</label>
            <div className="relative">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full appearance-none rounded-lg border border-bark/20 bg-linen/30 px-3 py-2 text-sm focus:border-forest outline-none text-ink font-medium">
                <option value="Todos">Todos</option>
                <option value="Ativo">Online (Ativos)</option>
                <option value="Inativo">Pausados (Inativos)</option>
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-bark" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-bark mb-1.5">Preço Mínimo (R$)</label>
            <input type="number" min="0" placeholder="0,00" value={filterMinPrice} onChange={(e) => setFilterMinPrice(e.target.value)} className="w-full rounded-lg border border-bark/20 bg-linen/30 px-3 py-2 text-sm focus:border-forest outline-none text-ink font-medium" />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-bark mb-1.5">Preço Máximo (R$)</label>
            <input type="number" min="0" placeholder="999,00" value={filterMaxPrice} onChange={(e) => setFilterMaxPrice(e.target.value)} className="w-full rounded-lg border border-bark/20 bg-linen/30 px-3 py-2 text-sm focus:border-forest outline-none text-ink font-medium" />
          </div>

          <div className="flex items-end">
            <button 
              onClick={clearFilters}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-bark/20 bg-white px-3 py-2 text-sm font-bold text-bark hover:bg-bark/5 hover:text-ink transition-colors h-[38px]"
            >
              <FilterX size={16} /> Limpar
            </button>
          </div>
        </div>
      )}

      {/* TABELA DE PRODUTOS */}
      <div className="overflow-hidden rounded-2xl border border-bark/15 bg-white shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="border-b border-bark/15 bg-linen/60 text-xs font-bold uppercase tracking-wider text-bark">
                <th className="w-16 px-5 py-4">Capa</th>
                <th className="px-3 py-4">Produto</th>
                <th className="px-3 py-4">Categoria</th>
                <th className="px-3 py-4">Preço</th>
                <th className="px-3 py-4">Status</th>
                <th className="px-5 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bark/10">
              {loading ? (
                <tr><td colSpan="6" className="py-12 text-center text-bark"><Loader2 size={24} className="animate-spin mx-auto mb-2 text-forest" /> Carregando catálogo...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="6" className="py-12 text-center text-bark font-medium">Nenhum produto encontrado com os filtros atuais.</td></tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product.id} className="transition-colors hover:bg-linen/50 group">
                    <td className="px-5 py-3">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="h-12 w-12 rounded-lg border border-bark/15 object-cover shadow-sm" />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-bark/25 bg-linen text-bark">
                          <ImageOff size={18} />
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-bold text-ink cursor-pointer hover:text-forest transition-colors" onClick={() => { setEditingProduct(product); setDrawerOpen(true); }}>{product.name}</p>
                    </td>
                    <td className="px-3 py-3 text-ink/70 font-medium">{product.category}</td>
                    <td className="px-3 py-3 font-bold text-ink">{currency(product.price)}</td>
                    <td className="px-3 py-3">
                      <button onClick={() => toggleStatus(product.id, product.is_featured ? "Ativo" : "Inativo")} className="hover:scale-105 transition-transform">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold shadow-sm ${product.is_featured ? "bg-forest/10 text-forest border border-forest/20" : "bg-bark/10 text-bark border border-bark/20"}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${product.is_featured ? "bg-forest" : "bg-bark"}`} />
                          {product.is_featured ? "Online" : "Pausado"}
                        </span>
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { setEditingProduct(product); setDrawerOpen(true); }} className="rounded-lg p-2.5 text-bark hover:bg-forest/10 hover:text-forest transition-colors" title="Editar">
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => deleteProduct(product.id)} className="rounded-lg p-2.5 text-bark hover:bg-red-50 hover:text-red-600 transition-colors" title="Excluir">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <ProductDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} productToEdit={editingProduct} onSave={handleSaveProduct} isSaving={isSaving} />
    </div>
  );
}