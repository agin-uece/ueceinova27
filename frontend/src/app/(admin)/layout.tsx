"use client";

import { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';
import '../globals.css';
import Link from 'next/link';
import {
  LayoutDashboard,
  LogOut,
  Layers,
  Shield,
  Home,
  User,
  Compass,
  Headset,
  UserCog,
  ChevronLeft,   // Ícone mais intuitivo
  ChevronRight   // Ícone mais intuitivo
} from 'lucide-react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

const comecaCom = (pathname: string, base: string) => pathname === base || pathname.startsWith(`${base}/`);

// Define qual item da sidebar representa a página atual
function itemAtivo(pathname: string): string | null {
  if (pathname === '/gestao') return 'painel';
  if (comecaCom(pathname, '/contato')) return 'contato';
  if (comecaCom(pathname, '/gestao/administracao') || comecaCom(pathname, '/gestao/usuarios')) return 'administracao';
  if (comecaCom(pathname, '/admin/incubacoes')) return 'incubacoes';
  // Cadastro/edição dos módulos (/admin/jogos/cadastrar etc.) pertencem a "Módulos - Conteúdo"
  if (comecaCom(pathname, '/gestao/conteudo') || comecaCom(pathname, '/admin')) return 'conteudo';
  if (comecaCom(pathname, '/gestao/perfil')) return 'perfil';
  return null;
}

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  ativo: boolean;
  collapsed: boolean;
}

function SidebarLink({ href, icon: Icon, label, ativo, collapsed }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      aria-current={ativo ? 'page' : undefined}
      title={collapsed ? label : undefined}
      className={`relative flex items-center gap-3 px-4 py-3 rounded-md transition-colors group ${collapsed ? 'justify-center' : ''} ${
        ativo ? 'bg-white/15 shadow-inner' : 'hover:bg-white/10'
      }`}
    >
      {/* Indicador da página atual */}
      <span
        aria-hidden="true"
        className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full bg-orange-400 transition-all duration-300 ${
          ativo ? 'h-7 opacity-100' : 'h-0 opacity-0'
        }`}
      />
      <Icon
        size={20}
        className={`shrink-0 transition-colors ${ativo ? 'text-orange-400' : 'text-gray-400 group-hover:text-white'}`}
      />
      {!collapsed && (
        <span className={`transition-colors ${ativo ? 'font-bold text-white' : 'font-medium text-gray-300 group-hover:text-white'}`}>
          {label}
        </span>
      )}
    </Link>
  );
}

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const ativo = itemAtivo(pathname);
  const [hasToken, setHasToken] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const userDataStr = localStorage.getItem("userData");

    setHasToken(!!token);

    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        setUserRole(userData.role || "");
        setUserName(userData.nome || "");
      } catch (e) {
        console.error("Erro ao ler userData", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    router.push("/");
  };

  return (
    <div className={`${inter.className} min-h-screen flex bg-gray-50 text-slate-900`}>

      {/* Barra lateral do painel admin */}
      <aside className={`relative transition-all duration-300 flex flex-col bg-purple-800 text-white shadow-xl overflow-y-auto ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>

        {/* Botão de recolher/expandir – agora com Chevron, fundo circular e tamanho maior */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute top-4 right-2 z-20 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-purple-300 hover:text-white transition-all"
          title={sidebarCollapsed ? "Expandir menu" : "Recolher menu"}
        >
          {sidebarCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </button>

        {/* Logo e Título */}
        <div className="p-6 mb-4 flex flex-col items-center border-b border-purple-900/50">
          {!sidebarCollapsed ? (
            <>
              <Image
                src="/imagens/Marca_horizontal.png"
                alt="Logo AGIN"
                width={120}
                height={48}
                className="h-12 w-auto mb-2"
                priority
              />
              <h2 className="text-xl font-bold text-orange-400 text-center">
                Inova27º <span className="text-white font-light">Admin</span>
              </h2>
            </>
          ) : (
            <div className="h-8" />
          )}
        </div>

        {/* Navegação */}
        <nav className="flex-1 px-2 space-y-2">

          {/* Botão Voltar ao Portal Público */}
          <Link href="/" className={`flex items-center gap-3 px-4 py-3 rounded-md hover:bg-white/10 transition-colors text-orange-200 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <Home size={20} />
            {!sidebarCollapsed && <span className="font-medium">Portal Público</span>}
          </Link>

          <div className="pt-4 pb-2">
            {!sidebarCollapsed && <p className="px-4 text-[10px] font-bold text-purple-300 uppercase tracking-widest opacity-70">Menu Principal</p>}
          </div>

          <SidebarLink href="/gestao" icon={Compass} label="Painel Principal" ativo={ativo === 'painel'} collapsed={sidebarCollapsed} />
          <SidebarLink href="/contato" icon={Headset} label="Contato e Suporte" ativo={ativo === 'contato'} collapsed={sidebarCollapsed} />

          <div className="pt-4 pb-2">
            {!sidebarCollapsed && <p className="px-4 text-[10px] font-bold text-purple-300 uppercase tracking-widest opacity-70">Gestão</p>}
          </div>

          {hasToken && userRole === "ADMIN" && (
            <>
              <SidebarLink href="/gestao/administracao" icon={Shield} label="Administração" ativo={ativo === 'administracao'} collapsed={sidebarCollapsed} />
              <SidebarLink href="/admin/incubacoes" icon={Layers} label="Incubações" ativo={ativo === 'incubacoes'} collapsed={sidebarCollapsed} />
            </>
          )}

          <SidebarLink href="/gestao/conteudo" icon={LayoutDashboard} label="Módulos - Conteúdo" ativo={ativo === 'conteudo'} collapsed={sidebarCollapsed} />
        </nav>

        {/* Rodapé */}
        <div className="p-2 border-t border-purple-900/50 space-y-2 mt-4">
          {hasToken && userName && !sidebarCollapsed && (
            <div className="flex items-center gap-3 px-4 py-2 mb-2 bg-white/5 rounded-lg">
              <div className="bg-orange-500 p-1.5 rounded-full shrink-0">
                <User size={16} className="text-white" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs text-purple-200">Usuário</span>
                <span className="text-sm font-bold truncate text-white" title={userName}>
                  {userName}
                </span>
              </div>
            </div>
          )}

          {hasToken && (
            <SidebarLink href="/gestao/perfil" icon={UserCog} label="Meu Perfil" ativo={ativo === 'perfil'} collapsed={sidebarCollapsed} />
          )}

          {hasToken && (
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-all border border-transparent hover:border-red-500/30 ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              <LogOut size={20} />
              {!sidebarCollapsed && <span className="font-medium">Logout</span>}
            </button>
          )}
        </div>
      </aside>

      {/* Área principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}