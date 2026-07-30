import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShoppingBag, Menu, X, User } from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import Logo from "../assets/Logo.png";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // PUXANDO DE FORMA SEGURA: Se a memória falhar, ele assume uma lista vazia e não quebra a tela!
  const items = useCartStore((state) => state.items || []);
  const openCart = useCartStore((state) => state.openCart);

  // A MÁGICA ACONTECE AQUI: Somamos a quantidade de itens direto no componente!
  const totalItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  // Lista centralizada com os links exatos das rotas
  const navLinks = [
    { name: "Camisetas", path: "/camisetas" },
    { name: "Moletons", path: "/moletons" },
    { name: "Ecobags", path: "/ecobags" },
    { name: "Toucas", path: "/touca" },
    { name: "Bonés", path: "/bone" },
    { name: "Corta Vento", path: "/corta-vento" },
    { name: "Calça Moletom", path: "/calca-moletom" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-linen border-b border-bark/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* LOGO */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <img src={Logo} alt="Preciso Verde Perto" className="h-20 w-auto object-contain" />
          </Link>

          {/* MENU DESKTOP */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `font-body text-sm font-semibold transition-colors hover:text-forest ${
                    isActive ? "text-forest" : "text-ink"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* ÍCONES (CARRINHO E ADMIN) */}
          <div className="flex items-center gap-4">
            
            {/* BOTÃO ADMIN SEMPRE VISÍVEL AGORA */}
            <Link to="/admin" className="hidden md:flex items-center gap-2 text-sm font-semibold text-forest hover:text-ink transition-colors">
              <User size={20} />
              Admin
            </Link>

            {/* BOTÃO DO CARRINHO */}
            <button
              onClick={openCart}
              className="relative p-2 text-ink hover:text-forest transition-colors"
              aria-label="Abrir carrinho"
            >
              <ShoppingBag size={24} />
              {totalItemsCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-forest text-linen text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* BOTÃO MENU MOBILE (HAMBURGUER) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-ink hover:text-forest transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* GAVETA DO MENU MOBILE */}
      {isMenuOpen && (
        <div className="md:hidden bg-linen border-b border-bark/10 absolute w-full shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 rounded-md font-body text-base font-semibold text-ink hover:bg-forest/5 hover:text-forest transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/admin"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-md font-body text-base font-semibold text-forest hover:bg-forest/5 transition-colors"
            >
              Painel Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}