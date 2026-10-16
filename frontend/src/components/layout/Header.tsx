'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, ArrowLeft } from 'lucide-react';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const userString = localStorage.getItem("userData");

    setIsLoggedIn(!!token);

    if (userString) {
      try {
        const userObj = JSON.parse(userString);
        if (userObj.nome) {
          const nomeAmigavel = userObj.nome.includes('@')
            ? userObj.nome.split('@')[0]
            : userObj.nome.split(' ')[0];

          setUserName(nomeAmigavel);
        }
      } catch (error) {
        console.error("Erro ao ler dados do usuário do localStorage:", error);
      }
    }
  }, []);

  return (
    <header className="bg-purple-900/80 backdrop-blur-md fixed top-0 left-0 w-full z-50">
      <div className="w-full px-4 md:px-10 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/" onClick={closeMenu}>
            <Image
              src="/imagens/Marca_horizontal.png"
              alt="Logo AGIN"
              width={120}
              height={48}
              className="h-12 w-auto"
              style={{ width: 'auto', height: 'auto' }}
              priority
            />
          </Link>
        </div>

        {/* Desktop */}
        <nav className="hidden md:flex items-center space-x-8 text-white font-medium text-sm">
          {isLoggedIn && (
            <Link href="/" className="flex items-center gap-2 text-purple-200 hover:text-white transition-colors">
              <ArrowLeft size={16} />
              Voltar ao Início
            </Link>
          )}

          {isLoggedIn ? (
            <Link href="/gestao" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-purple-300 uppercase tracking-widest leading-none">Bem-vindo(a)</span>
                <span className="text-sm font-bold text-white leading-tight capitalize">
                  {userName || "Usuário"}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-700 border border-purple-500 flex items-center justify-center text-white font-black uppercase shadow-inner">
                {userName ? userName.charAt(0) : <User size={18} />}
              </div>
            </Link>
          ) : (
            <Link href="/login" className="px-5 py-2 bg-purple-700 hover:bg-purple-600 rounded-full transition-colors font-bold">
              Acessar Plataforma
            </Link>
          )}
        </nav>

        {/* Botão hambúrguer (mobile) */}
        <button
          onClick={toggleMenu}
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-white focus:outline-none"
        >
          {isMobileMenuOpen ? (
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Menu mobile — apenas lógica de autenticação */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-purple-900 bg-opacity-95 text-white w-full absolute top-full left-0 z-40 border-t border-purple-800">
          <div className="px-4 pt-2 pb-4">
            {isLoggedIn ? (
              <Link href="/gestao" onClick={closeMenu} className="flex items-center gap-3 px-3 py-3 rounded hover:bg-purple-800">
                <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-white font-black uppercase">
                  {userName ? userName.charAt(0) : <User size={14} />}
                </div>
                <span className="text-sm font-bold text-white capitalize">Meu Painel ({userName})</span>
              </Link>
            ) : (
              <Link href="/login" onClick={closeMenu} className="block px-3 py-3 rounded bg-purple-700 hover:bg-purple-600 text-sm font-bold text-center">
                Acessar Plataforma
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
