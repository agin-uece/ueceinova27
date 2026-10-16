"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Gamepad2, Beaker, Users, Rocket, Shield, Wrench,
  Search, PlusCircle, LayoutDashboard
} from "lucide-react";
import { HeroSearch } from "@/components/features/HeroSearch";

export default function GerenciarConteudoPage() {
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const userDataStr = localStorage.getItem("userData");
    if (userDataStr) {
      const role = JSON.parse(userDataStr).role || "";
      setUserRole(role.toUpperCase()); // Normalizando para evitar erro de caixa alta/baixa
    }
  }, []);

  const modulos = [
    {
      titulo: "Jogos", icone: Gamepad2, cor: "text-purple-500", corBg: "bg-purple-50",
      linkPesquisar: "/jogos/pesquisar", linkCadastrar: "/admin/jogos/cadastrar",
      permitidoProfessor: true
    },
    {
      titulo: "Laboratórios", icone: Beaker, cor: "text-blue-500", corBg: "bg-blue-50",
      linkPesquisar: "/laboratorios/pesquisar", linkCadastrar: "/admin/laboratorios/cadastrar",
      permitidoProfessor: true
    },
    {
      titulo: "Pessoas", icone: Users, cor: "text-green-500", corBg: "bg-green-50",
      linkPesquisar: "/pessoas/pesquisar", linkCadastrar: "/admin/pessoas/cadastrar",
      permitidoProfessor: true
    },
    {
      titulo: "Startups/Empresas", icone: Rocket, cor: "text-red-500", corBg: "bg-red-50",
      linkPesquisar: "/startups/pesquisar", linkCadastrar: "/admin/startups/cadastrar",
      permitidoProfessor: false
    },
    {
      titulo: "Proteções (PI)", icone: Shield, cor: "text-yellow-500", corBg: "bg-yellow-50",
      linkPesquisar: "/protecoes/pesquisar", linkCadastrar: "/admin//protecoes/cadastrar",
      permitidoProfessor: false
    },
    {
      titulo: "Serviços", icone: Wrench, cor: "text-cyan-500", corBg: "bg-cyan-50",
      linkPesquisar: "/servicos/pesquisar", linkCadastrar: "/admin/servicos/cadastrar",
      permitidoProfessor: false
    },
  ];

  // Lógica para verificar se o botão "Novo" deve aparecer
  const podeCadastrar = (modulo: typeof modulos[0]) => {
    if (modulo.permitidoProfessor) return true; // logado ou não
    if (userRole === "ADMIN") return true;
    return false;
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
          <LayoutDashboard size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Gerenciar Conteúdos</h1>
          <p className="text-gray-500 text-sm">Acesse e administre os módulos da plataforma.</p>
        </div>
      </div>
      <div className="-mt-4">
        <HeroSearch />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {modulos.map((mod, index) => {
          const liberado = podeCadastrar(mod);

          return (
            <div key={index} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 ${mod.corBg} ${mod.cor} rounded-2xl flex items-center justify-center`}>
                  <mod.icone size={28} />
                </div>
                <h4 className="text-lg font-bold text-gray-900">{mod.titulo}</h4>
              </div>

              {/* Ações Dinâmicas baseadas no Cargo */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Link
                  href={mod.linkPesquisar}
                  className={`flex items-center justify-center gap-2 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl font-bold text-xs transition-colors border border-gray-100 uppercase tracking-widest ${!liberado ? 'col-span-2' : ''}`}
                >
                  <Search size={14} /> Pesquisar
                </Link>

                {liberado && (
                  <Link
                    href={mod.linkCadastrar}
                    className="flex items-center justify-center gap-2 py-3 bg-orange-50 hover:bg-orange-500 hover:text-white text-orange-600 rounded-xl font-bold text-xs transition-colors uppercase tracking-widest"
                  >
                    <PlusCircle size={14} /> Novo
                  </Link>
                )}
              </div>

              {!liberado && userRole === "PROFESSOR" && (
                <p className="text-[10px] text-gray-400 text-center italic uppercase">Apenas consulta.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}