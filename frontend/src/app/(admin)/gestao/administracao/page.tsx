"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, UserCheck, UserPlus, ShieldAlert, Trash2 } from "lucide-react";

export default function AdministracaoPage() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const userDataStr = localStorage.getItem("userData");
        if (userDataStr) {
            const user = JSON.parse(userDataStr);
            if (user.role === "ADMIN") setIsAuthorized(true);
            else router.push("/gestao");
        } else {
            router.push("/login");
        }
    }, [router]);

    if (!isAuthorized) return null;

    return (
        <div className="max-w-6xl mx-auto px-8 py-10">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                    <Shield size={28} />
                </div>
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900">Administração de Sistema</h1>
                    <p className="text-gray-500 text-sm">Gestão de acessos e configurações globais.</p>
                </div>
            </div>

            {/* Aqui foi alterado para grid-cols-1 md:grid-cols-2 para forçar o layout 2x2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-red-100 hover:shadow-lg transition-shadow flex flex-col">
                    <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-6">
                        <UserCheck size={28} />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Validar Novos Usuários</h4>
                    <p className="text-sm text-gray-500 mb-8 flex-1">Aprove ou rejeite o acesso de novos pesquisadores que se registraram na plataforma.</p>
                    <Link href="/gestao/usuarios" className="block w-full text-center py-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all">
                        Acessar Lista
                    </Link>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-red-100 hover:shadow-lg transition-shadow flex flex-col">
                    <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-6">
                        <UserPlus size={28} />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Novo Usuário</h4>
                    <p className="text-sm text-gray-500 mb-8 flex-1">Cadastre diretamente um novo usuário (Professor ou Administrador) com privilégios específicos.</p>
                    <Link href="/gestao/usuarios/novo-admin" className="block w-full text-center py-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all">
                        Cadastrar Usuário
                    </Link>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-red-100 hover:shadow-lg transition-shadow flex flex-col">
                    <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-6">
                        <ShieldAlert size={28} />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Central de Aprovações</h4>
                    <p className="text-sm text-gray-500 mb-8 flex-1">Avalie, aprove ou rejeite as solicitações de cadastro, edição e exclusão de itens feitas pelos proprietários.</p>
                    <Link href="/gestao/administracao/aprovacoes" className="block w-full text-center py-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all">
                        Acessar Fila
                    </Link>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-red-100 hover:shadow-lg transition-shadow flex flex-col">
                    <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-6">
                        <Trash2 size={28} />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Exclusão de Registros</h4>
                    <p className="text-sm text-gray-500 mb-8 flex-1">Remova permanentemente registros de qualquer entidade do sistema com controle administrativo.</p>
                    <Link href="/gestao/administracao/exclusoes" className="block w-full text-center py-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all">
                        Gerenciar Registros
                    </Link>
                </div>

            </div>
        </div>
    );
}