"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronRight, Compass, ShieldCheck, Users, Rocket, Beaker, Gamepad2, Briefcase, UserPlus, FolderPlus } from "lucide-react";

interface User {
  nome: string;
  email: string;
  role: string;
}

interface MenuRouteDTO {
  titulo: string;
  tag: string;
  rota: string;
  icone: string;
}

// Dicionário para transformar a string que vem do backend no componente de ícone real
const ICONS_MAP: Record<string, any> = {
  ShieldCheck,
  Users,
  Rocket,
  Beaker,
  Gamepad2,
  Briefcase,
  UserPlus,
  FolderPlus
};

export default function GestaoDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const [busca, setBusca] = useState("");
  // NOVO ESTADO: Guarda a lista completa que vem do backend
  const [rotasPermitidas, setRotasPermitidas] = useState<MenuRouteDTO[]>([]);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // EFEITO ÚNICO: Roda apenas 1 vez quando a tela carrega
  useEffect(() => {
    const userDataStr = localStorage.getItem("userData");
    const token = localStorage.getItem("userToken");
    if (userDataStr) setUser(JSON.parse(userDataStr));

    const carregarRotas = async () => {
      try {
        // Busca a lista completa SEM passar o parâmetro 'q'
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/permitidas`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setRotasPermitidas(data); // Salva no state para sempre
        }
      } catch (error) {
        console.error("Erro ao buscar rotas:", error);
      } finally {
        setIsLoading(false); // Terminou de carregar
      }
    };

    carregarRotas();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMostrarDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []); // <-- Array vazio garante que só roda 1 vez!


  // FILTRO LOCAL: Acontece instantaneamente na memória do navegador
  const opcoesFiltradas = rotasPermitidas.filter(opcao => {
    const termo = busca.toLowerCase();
    return opcao.titulo.toLowerCase().includes(termo) || opcao.tag.toLowerCase().includes(termo);
  });

  const handleSelecionarOpcao = (route: string) => {
    setMostrarDropdown(false);
    setBusca("");
    router.push(route);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (opcoesFiltradas.length > 0) {
      handleSelecionarOpcao(opcoesFiltradas[0].rota);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-10 space-y-8">
      {/* SEÇÃO BOAS VINDAS */}
      <section className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-gray-900 mb-2">
            {user ? `Olá, ${user.nome}! 👋` : "Bem-vindo ao Inova27! 👋"}
          </h2>
          <p className="text-gray-500">
            {user ? "Seja bem-vindo(a) à plataforma da Inova27. Utilize o menu lateral para navegar." : "Explore os conteúdos da plataforma ou faça login para acessar mais recursos."}
          </p>
        </div>
        <div className="relative z-10 flex flex-col items-start md:items-end gap-2">
          {user ? (
            <>
              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${user.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                Perfil: {user.role}
              </span>
              <p className="text-sm font-medium text-gray-400">{user.email}</p>
            </>
          ) : (
            <a href="/login" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-widest rounded-full transition-colors">
              Fazer Login
            </a>
          )}
        </div>
      </section>

      {/* BARRA DE BUSCA RÁPIDA */}
      <section className="bg-white px-8 py-16 sm:px-12 rounded-[32px] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center relative overflow-visible">
        <div className="bg-orange-100 p-4 rounded-full text-orange-600 mb-6">
          <Compass size={32} />
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-2">Para onde você quer ir?</h3>
        <p className="text-gray-500 text-sm mb-8">Digite o que você procura para acessar atalhos do sistema.</p>

        <div className="w-full max-w-2xl relative" ref={dropdownRef}>
          <form onSubmit={handleSubmit} className="relative z-20">
            <div className="relative flex items-center bg-gray-50 border-2 border-gray-100 rounded-[24px] p-2 focus-within:border-orange-500 focus-within:bg-white transition-all shadow-sm hover:shadow-md">
              <Search className="text-gray-400 ml-4 shrink-0" size={24} />
              <input
                type="text"
                value={busca}
                onChange={(e) => { setBusca(e.target.value); setMostrarDropdown(true); }}
                onFocus={() => setMostrarDropdown(true)}
                disabled={isLoading}
                placeholder={isLoading ? "Carregando atalhos..." : "Ex: Startups, Laboratórios, Novo cadastro..."}
                className="w-full bg-transparent outline-none px-4 py-4 text-gray-700 text-lg placeholder-gray-400 disabled:opacity-50"
              />
              <button type="submit" disabled={isLoading} className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-xl font-black tracking-widest uppercase text-xs transition-colors shrink-0">
                Acessar
              </button>
            </div>
          </form>

          {/* DROPDOWN COM O FILTRO LOCAL E ÍCONES DINÂMICOS */}
          {mostrarDropdown && busca.length > 0 && !isLoading && (
            <div className="absolute top-[110%] left-0 right-0 bg-white border-2 border-gray-100 rounded-[24px] shadow-2xl overflow-hidden z-30 animate-in fade-in zoom-in-95 duration-200 text-left">
              {opcoesFiltradas.length > 0 ? (
                <ul className="max-h-80 overflow-y-auto py-2">
                  {opcoesFiltradas.map((opcao, index) => {
                    // Pega o ícone certo baseado no nome ou usa um padrão se falhar
                    const Icone = ICONS_MAP[opcao.icone] || ChevronRight;

                    return (
                      <li key={index}>
                        <button
                          type="button"
                          onClick={() => handleSelecionarOpcao(opcao.rota)}
                          className="w-full px-6 py-4 hover:bg-orange-50 flex items-center gap-4 group transition-colors border-b border-gray-50 last:border-0"
                        >
                          <div className="w-10 h-10 shrink-0 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                            <Icone size={20} />
                          </div>
                          <div className="flex-1 text-left">
                            <span className="block text-sm font-bold text-gray-800 group-hover:text-orange-700 transition-colors">
                              {opcao.titulo}
                            </span>
                            <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">
                              {opcao.tag}
                            </span>
                          </div>
                          <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-orange-500 group-hover:bg-orange-500 transition-colors">
                            <ChevronRight size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="px-6 py-10 text-center text-gray-500">
                  <Search size={32} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-sm font-medium">Nenhum atalho encontrado para "<span className="font-bold text-gray-900">{busca}</span>".</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}