// src/app/(admin)/admin/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, LogIn, Loader2 } from "lucide-react";

const ROTAS_PROFESSOR = [
  "/admin/jogos",
  "/admin/laboratorios",
  "/admin/pessoas",
];

type AuthStatus = "loading" | "authorized" | "unauthenticated" | "forbidden";

export default function AdminGuardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const userDataStr = localStorage.getItem("userData");

    if (!token || !userDataStr) {
      setStatus("unauthenticated");
      return;
    }

    let role = "";
    try {
      role = (JSON.parse(userDataStr).role || "").toUpperCase();
    } catch {
      setStatus("unauthenticated");
      return;
    }

    if (role === "ADMIN") {
      setStatus("authorized");
      return;
    }

    if (role === "PROFESSOR") {
      const permitido =
        pathname === "/admin" ||
        ROTAS_PROFESSOR.some((rota) => pathname.startsWith(rota));
      setStatus(permitido ? "authorized" : "forbidden");
      return;
    }

    setStatus("forbidden");
  }, [pathname]);

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-700" size={36} />
      </div>
    );
  }

  if (status !== "authorized") {
    const isVisitante = status === "unauthenticated";

    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-10 rounded-[32px] shadow-sm border border-gray-200 text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
            <ShieldAlert size={32} />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-black text-gray-900 uppercase italic tracking-tight">
              Acesso Restrito
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              {isVisitante
                ? "Você precisa estar autenticado para acessar esta página."
                : "Seu perfil não tem permissão para acessar esta área administrativa."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} />
              Voltar
            </button>

            {isVisitante ? (
              <Link
                href="/login"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
              >
                <LogIn size={16} />
                Fazer Login
              </Link>
            ) : (
              <Link
                href="/gestao/conteudo"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
              >
                Ir para Módulos
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}