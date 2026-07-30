import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  ArrowLeftCircle,
  Bell,
  Menu,
  X,
} from "lucide-react";
// Importando a Logo Real
import Logo from "../assets/Logo.png";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Produtos", to: "/admin/produtos", icon: Package },
  { label: "Pedidos", to: "/admin/pedidos", icon: ShoppingCart },
  { label: "Clientes", to: "/admin/clientes", icon: Users },
  { label: "Configurações", to: "/admin/configuracoes", icon: Settings },
];

function usePageTitle() {
  const { pathname } = useLocation();
  const match = NAV_ITEMS.find((item) =>
    item.end ? pathname === item.to : pathname.startsWith(item.to)
  );
  return match?.label ?? "Dashboard";
}

function SidebarContent({ onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      {/* LOGO AUMENTADA */}
      <div className="flex items-center justify-center border-b border-bark/15 py-8">
        <img 
          src={Logo} 
          alt="Preciso Verde Perto Admin" 
          className="h-28 w-auto object-contain drop-shadow-sm px-4" 
        />
      </div>

      {/* Navegação */}
      <nav className="flex-1 space-y-1 px-3 mt-4">
        {NAV_ITEMS.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-forest text-linen shadow-sm shadow-forest/30"
                  : "text-ink/70 hover:bg-moss/15 hover:text-ink",
              ].join(" ")
            }
          >
            <Icon size={18} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Rodapé da sidebar */}
      <div className="border-t border-bark/15 p-3">
        <a
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-bark transition-colors hover:bg-linen hover:text-ink"
        >
          <ArrowLeftCircle size={18} strokeWidth={2} />
          Voltar para a Loja
        </a>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pageTitle = usePageTitle();

  return (
    // Removido o max-w-[1600px] e mx-auto. Agora é 100% da tela!
    <div className="min-h-screen bg-linen overflow-x-hidden">
      <div className="flex min-h-screen w-full">
        
        {/* Sidebar fixa colada na esquerda */}
        <aside className="hidden w-64 shrink-0 border-r border-bark/15 bg-white lg:block shadow-sm">
          <div className="sticky top-0 h-screen">
            <SidebarContent />
          </div>
        </aside>

        {/* Sidebar Mobile */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative z-10 h-full w-72 bg-linen shadow-xl">
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-4 rounded-lg p-1.5 text-bark hover:bg-bark/10"
              >
                <X size={20} />
              </button>
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        )}

        {/* Área Principal Esticada */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-bark/15 bg-linen/90 px-4 py-4 backdrop-blur-sm sm:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="rounded-lg p-2 text-ink hover:bg-bark/10 lg:hidden"
              >
                <Menu size={20} />
              </button>
              <h1 className="text-lg font-semibold text-ink sm:text-xl">
                {pageTitle}
              </h1>
            </div>

            <div className="flex items-center gap-3 sm:gap-5">
              <button className="relative rounded-full p-2 text-bark hover:bg-bark/10 hover:text-ink">
                <Bell size={20} />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-forest ring-2 ring-linen" />
              </button>

              <div className="flex items-center gap-2.5">
                <img
                  src="https://i.pravatar.cc/80?img=12"
                  alt="Admin"
                  className="h-9 w-9 rounded-full border border-bark/20 object-cover"
                />
                <div className="hidden leading-tight sm:block">
                  <p className="text-sm font-medium text-ink">Vitor Ramos</p>
                  <p className="text-xs text-bark">Administrador</p>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 w-full px-4 py-6 sm:px-8 sm:py-8">
            {children ?? <Outlet />}
          </main>
        </div>
      </div>
    </div>
  );
}