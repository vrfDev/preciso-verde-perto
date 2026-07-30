import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Check, AlertCircle } from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import { useAdminStore } from "../store/useAdminStore";
import { useProductStore } from "../store/useProductStore"; // 🪄 Busca as informações completas do banco

export default function ProductCard(props) {
  const addItem = useCartStore((state) => state.addItem);
  const isAdmin = useAdminStore((state) => state.isAdmin);
  const { products } = useProductStore(); // Puxa todos os produtos carregados no site
  const navigate = useNavigate();

  const [added, setAdded] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // 1. Identifica o ID do produto
  const id = props.id || props.product?.id;

  // 2. BUSCA DO BANCO: Acha o produto completo para ler a coluna 'colors' (que tem os estoques/tamanhos)
  const dbProduct = products.find((p) => p.id === id);

  // 3. Monta o objeto final garantindo retrocompatibilidade
  const product = dbProduct || props.product || {
    id: props.id,
    name: props.name,
    price: props.price,
    image_url: props.image,
    colors: []
  };

  const name = product.name || props.name;
  const price = product.price || props.price;
  const image_url = product.image_url || props.image;

  const displayPrice = price ? price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "R$ 0,00";

  // 4. LÓGICA DE VERIFICAÇÃO REAL (Agora 100% precisa com os dados do banco):
  const colorsList = product.colors || [];
  
  // Precisa escolher se tiver mais de uma cor, OU se tiver apenas uma cor mas ela exigir tamanho (hasSizes === true)
  const needsSelection = colorsList.length > 1 || (colorsList.length === 1 && colorsList[0].hasSizes === true);

  // --- FUNÇÕES DE ADMIN ---
  const handleEdit = (e) => {
    e.preventDefault();
    console.log(`Mock: editar produto ${id}`);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    console.log(`Mock: excluir produto ${id}`);
  };

  // --- LÓGICA DO BOTÃO DA VITRINE ---
  const handleAddClick = (e) => {
    e.preventDefault();

    if (showWarning) return;

    // SE PRECISAR SELECIONAR TAMANHO/COR: Avisa e redireciona para dentro do produto
    if (needsSelection) {
      setShowWarning(true);
      setTimeout(() => {
        navigate(`/produto/${id}`);
        setShowWarning(false);
      }, 1200);
      return;
    }

    // SE FOR SEM VARIAÇÃO (ex: ecobag simples): Adiciona direto
    const colorName = colorsList.length === 1 ? colorsList[0].name : undefined;
    const itemImage = colorsList.length === 1 && colorsList[0].images?.length > 0 ? colorsList[0].images[0] : image_url;

    addItem({ ...product, image: itemImage, color: colorName }, "Único");
    
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="group bg-white/40 border border-bark/15 rounded-xl overflow-hidden hover:border-forest/50 transition-colors flex flex-col h-full">
      
      {/* IMAGEM DO PRODUTO */}
      <Link to={`/produto/${id}`} className="block relative aspect-square overflow-hidden bg-moss/10">
        <img
          src={image_url}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>
      
      <div className="p-4 flex flex-col flex-1">
        
        {/* TÍTULO E PREÇO */}
        <Link to={`/produto/${id}`}>
          <h3 className="font-body font-semibold text-sm sm:text-base text-ink mb-1 hover:text-forest transition-colors truncate">
            {name}
          </h3>
        </Link>
        <p className="font-body text-sm text-ink/60 mb-4">
          {displayPrice}
        </p>

        {/* BOTÕES */}
        <div className="mt-auto">
          {isAdmin ? (
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="flex-1 flex items-center justify-center gap-1.5 border border-bark text-bark font-body text-sm font-medium py-2 rounded-full hover:bg-bark hover:text-linen transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                Editar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 flex items-center justify-center gap-1.5 border border-red-700 text-red-700 font-body text-sm font-medium py-2 rounded-full hover:bg-red-700 hover:text-linen transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Excluir
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddClick}
              className={`w-full flex items-center justify-center gap-1.5 border font-body text-sm font-medium py-2 rounded-full transition-all ${
                showWarning 
                  ? "bg-[#Fdf6e9] text-[#A67c52] border-[#A67c52]" 
                  : added 
                    ? "bg-forest text-linen border-forest"
                    : "border-forest text-forest hover:bg-forest hover:text-linen"
              }`}
            >
              {showWarning ? (
                <>
                  <AlertCircle className="w-4 h-4" />
                  Selecione tamanho e cor...
                </>
              ) : added ? (
                <>
                  <Check className="w-4 h-4" />
                  Adicionado
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Adicionar
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}