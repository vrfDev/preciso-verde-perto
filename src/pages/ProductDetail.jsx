import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Minus, Plus, ShoppingBag, ArrowRight, AlertCircle, Package } from "lucide-react";
import { useProductStore } from "../store/useProductStore";
import { useCartStore } from "../store/useCartStore";

const SIZES_LIST = ["P", "M", "G", "GG"];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, fetchProducts } = useProductStore();
  const addItem = useCartStore((state) => state.addItem);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(""); // Começa vazio para forçar a escolha!
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [id, fetchProducts]);

  const product = products.find((p) => p.id === id);

  useEffect(() => {
    if (product) {
      const colors = product.colors || [];
      if (colors.length > 0) {
        const firstColor = colors[0];
        setSelectedColor(firstColor);
        
        if (firstColor.images && firstColor.images.length > 0) {
          setCurrentImage(firstColor.images[0]);
        } else {
          setCurrentImage(product.image_url);
        }

        // Se tem tamanho, NÃO seleciona nenhum por padrão. Se não tem (Boné), já seta como "Único".
        if (!firstColor.hasSizes) {
          setSelectedSize("Único");
        } else {
          setSelectedSize(""); 
        }
      } else {
        setCurrentImage(product.image_url);
      }
    }
  }, [product]);

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setQuantity(1);

    if (color.images && color.images.length > 0) {
      setCurrentImage(color.images[0]);
    } else {
      setCurrentImage(product.image_url);
    }

    if (!color.hasSizes) {
      setSelectedSize("Único");
    } else {
      setSelectedSize(""); // Reseta o tamanho ao trocar de cor
    }
  };

  if (!product) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-forest border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-body text-ink/60">Buscando detalhes da peça...</p>
        </div>
      </section>
    );
  }

  // LÓGICA DE ESTOQUE E VALIDAÇÃO
  const needsSizeSelection = selectedColor?.hasSizes && !selectedSize;
  
  let currentStock = 0;
  if (selectedColor) {
    if (selectedColor.hasSizes) {
      currentStock = selectedSize ? (selectedColor.sizeStock?.[selectedSize] || 0) : 0;
    } else {
      currentStock = selectedColor.stock || 0;
    }
  }

  const isOutOfStock = !needsSizeSelection && currentStock === 0;
  const canAdd = !needsSizeSelection && !isOutOfStock;

  const handleQuantityChange = (newQty) => {
    if (newQty >= 1 && newQty <= currentStock) {
      setQuantity(newQty);
    }
  };

  const activeGallery = selectedColor?.images?.length > 0 
    ? selectedColor.images 
    : (product.image_url ? [product.image_url] : []);

  const handleAdd = () => {
    if (!canAdd) return;
    const itemImage = selectedColor?.images?.[0] || product.image_url;
    
    for (let i = 0; i < quantity; i++) {
      addItem({ ...product, image: itemImage, color: selectedColor.name }, selectedSize);
    }
    
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!canAdd) return;
    handleAdd();
    navigate("/checkout");
  };

  return (
    <section className="bg-linen py-8 sm:py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/produtos" className="inline-flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-wider text-bark hover:text-forest mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar ao catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          <div className="lg:col-span-7 flex flex-col gap-4 lg:sticky lg:top-24">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-white/50 border border-bark/10 shadow-sm relative group">
              {currentImage ? (
                <img src={currentImage} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-bark/5 text-bark">Sem imagem</div>
              )}
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {activeGallery.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(imgUrl)}
                  className={`relative w-24 h-28 rounded-2xl overflow-hidden shrink-0 transition-all ${
                    currentImage === imgUrl ? "ring-2 ring-forest ring-offset-2 ring-offset-linen opacity-100" : "border border-bark/15 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={imgUrl} alt={`Vista ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col pt-2 sm:pt-6">
            
            <div className="mb-8">
              <span className="inline-block px-3 py-1 bg-white border border-bark/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-forest mb-4">
                {product.category}
              </span>
              <h1 className="font-display text-4xl sm:text-5xl text-ink leading-tight mb-3">
                {product.name}
              </h1>
              <p className="font-body text-2xl text-ink font-medium">
                {product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </p>
            </div>

            <hr className="border-bark/10 mb-8" />

            {selectedColor && (
              <>
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-body text-xs font-bold uppercase tracking-wider text-bark">Cor Selecionada</span>
                    <span className="font-body text-sm text-ink font-medium">{selectedColor.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {(product.colors || []).map((color, index) => (
                      <button
                        key={index}
                        onClick={() => handleColorChange(color)}
                        className={`w-9 h-9 rounded-full relative transition-all ${
                          selectedColor?.name === color.name ? "ring-2 ring-ink ring-offset-2 ring-offset-linen scale-110" : "ring-1 ring-bark/30 hover:scale-105"
                        }`}
                        style={{ backgroundColor: color.hex || "#cccccc" }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {selectedColor.hasSizes && (
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-body text-xs font-bold uppercase tracking-wider text-bark">Tamanho</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {SIZES_LIST.map((size) => {
                        const stockSize = selectedColor.sizeStock?.[size] || 0;
                        const isAvailable = stockSize > 0;
                        
                        return (
                          <button
                            key={size}
                            disabled={!isAvailable}
                            onClick={() => {
                              setSelectedSize(size);
                              setQuantity(1);
                            }}
                            className={`w-14 h-12 rounded-xl font-body text-sm font-semibold transition-all relative overflow-hidden ${
                              !isAvailable 
                                ? "bg-bark/5 text-bark/40 border border-bark/10 cursor-not-allowed"
                                : selectedSize === size
                                  ? "bg-ink text-linen shadow-md border-ink"
                                  : "bg-white text-ink border border-bark/20 hover:border-ink hover:bg-ink/5"
                            }`}
                          >
                            {size}
                            {!isAvailable && (
                              <div className="absolute inset-0 m-auto w-full h-[1px] bg-bark/20 rotate-45" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="mb-10">
                  <span className="font-body text-xs font-bold uppercase tracking-wider text-bark mb-3 block">Quantidade</span>
                  
                  <div className="flex items-center w-36 bg-white rounded-xl border border-bark/20 h-14 p-1">
                    <button 
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1 || needsSizeSelection || isOutOfStock}
                      className="w-10 h-full flex items-center justify-center text-bark hover:text-ink hover:bg-linen rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="flex-1 text-center font-body font-semibold text-ink text-lg">{quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= currentStock || needsSizeSelection || isOutOfStock}
                      className="w-10 h-full flex items-center justify-center text-bark hover:text-ink hover:bg-linen rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  {/* MOSTRADOR DE ESTOQUE EXATO */}
                  {!needsSizeSelection && currentStock > 0 && (
                    <span className="text-xs font-bold text-forest flex items-center gap-1.5 mt-3">
                      <Package size={14}/> {currentStock} {currentStock === 1 ? 'unidade disponível' : 'unidades disponíveis'}
                    </span>
                  )}
                </div>
              </>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={handleAdd}
                disabled={!canAdd || added}
                className={`w-full flex items-center justify-center gap-2 font-body font-bold px-8 py-4 rounded-xl shadow-sm transition-all ${
                  !canAdd
                    ? "bg-bark/10 text-bark cursor-not-allowed" 
                    : "bg-forest hover:bg-forest/90 text-linen disabled:opacity-80"
                }`}
              >
                {added ? (
                  <><Check className="w-5 h-5" /> Adicionado à Sacola</>
                ) : needsSizeSelection ? (
                  "Selecione um Tamanho"
                ) : isOutOfStock ? (
                  "Esgotado"
                ) : (
                  <><ShoppingBag className="w-5 h-5" /> Adicionar à Sacola</>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!canAdd}
                className={`w-full flex items-center justify-center gap-2 border-2 font-body font-bold px-8 py-4 rounded-xl transition-all ${
                  !canAdd
                    ? "border-bark/20 text-bark/40 cursor-not-allowed bg-transparent"
                    : "bg-transparent hover:bg-ink hover:text-linen text-ink border-ink"
                }`}
              >
                Comprar Agora <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-12 pt-8 border-t border-bark/10">
              <h3 className="font-body text-sm font-bold uppercase tracking-wider text-ink mb-4">Sobre a Peça</h3>
              <p className="font-body text-base text-ink/80 leading-relaxed whitespace-pre-wrap">
                {product.description || "Nenhuma descrição fornecida para este produto."}
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}