import { Routes, Route, Outlet } from "react-router-dom";
import { useState } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import CategoryPage from "./pages/CategoryPage";
import AboutPage from "./pages/AboutPage";
import CartDrawer from "./components/CartDrawer";

import AdminLayout from "./pages/AdminLayout";
import AdminProducts from "./pages/AdminProducts";
import Checkout from "./pages/Checkout";



function ShopLayout() {
  // 2. Criamos o estado que controla se o carrinho está aberto ou fechado
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="font-body bg-linen min-h-screen flex flex-col">
      {/* 3. Passamos a função de ABRIR o carrinho para o Header */}
      <Header onOpenCart={() => setCartOpen(true)} />
      
      {/* 4. Passamos o estado e a função de FECHAR para o CartDrawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      
      <div className="flex-grow">
        <Outlet /> 
      </div>
      <Footer />
    </div>
  );
}
// Mocks das páginas do Admin
function AdminDashboard() {
  return (
    <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-bark/30 text-bark">
      <p>Dashboard em construção. Resumo de vendas aparecerá aqui.</p>
    </div>
  );
}

function AdminPedidos() {
  return (
    <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-bark/30 text-bark">
      <p>Tela de Pedidos em construção. A lista de compras dos clientes aparecerá aqui.</p>
    </div>
  );
}

function AdminClientes() {
  return (
    <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-bark/30 text-bark">
      <p>Tela de Clientes em construção. A base de usuários aparecerá aqui.</p>
    </div>
  );
}

function AdminConfiguracoes() {
  return (
    <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-bark/30 text-bark">
      <p>Configurações da loja em construção.</p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>

      <Route path="/checkout" element={<Checkout />} />
      
      {/* ROTAS DO CLIENTE */}
      <Route path="/" element={<ShopLayout />}>
        <Route index element={<Home />} />
        <Route path="produtos" element={<Catalog />} />
        <Route path="produto/:id" element={<ProductDetail />} />
        
        {/* Categorias Originais */}
        <Route path="camisetas" element={<CategoryPage title="Camisetas" />} />
        <Route path="moletons" element={<CategoryPage title="Moletons" />} />
        <Route path="ecobags" element={<CategoryPage title="Ecobags" />} />
        
        {/* Novas Categorias (Ajustadas para o nome exato dos links) */}
        <Route path="touca" element={<CategoryPage title="Touca" />} />
        <Route path="bone" element={<CategoryPage title="Boné" />} />
        <Route path="corta-vento" element={<CategoryPage title="Corta Vento" />} />
        <Route path="calca-moletom" element={<CategoryPage title="Calça Moletom" />} />
        
        <Route path="sobre" element={<AboutPage />} />
      </Route>

      {/* ROTAS DO ADMIN */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="produtos" element={<AdminProducts />} />
        <Route path="pedidos" element={<AdminPedidos />} />
        <Route path="clientes" element={<AdminClientes />} />
        <Route path="configuracoes" element={<AdminConfiguracoes />} />
      </Route>

    </Routes>
  );
}