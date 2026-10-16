import Link from "next/link";
import { FileText, User, Calendar, Edit, Trash2 } from "lucide-react";
import { Protecao } from "@/types";

interface ProtecaoCardProps {
    protecao: Protecao;
    userRole: string;
    onDelete: (id: number) => void;
}

export function ProtecaoCard({ protecao, userRole, onDelete }: ProtecaoCardProps) {
    return (
        <div className="bg-white rounded-[32px] border border-gray-200 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all group flex flex-col shadow-sm p-6 relative">
            <Link href={`/entidades?tipo=protecoes&id=${protecao.id}`} className="flex flex-col flex-1">
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 shrink-0 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center p-2 shadow-sm text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                        <FileText size={28} />
                    </div>

                    <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-2">
                            {protecao.natureza && (
                                <span className="inline-block px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter bg-purple-100 text-purple-700">
                                    {protecao.natureza.replace(/_/g, " ")}
                                </span>
                            )}
                            {protecao.status && (
                                <span className="inline-block px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter bg-green-100 text-green-700 border border-green-200">
                                    {protecao.status}
                                </span>
                            )}
                        </div>
                        <h3 className="text-lg font-black text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2 leading-tight">
                            {protecao.nome}
                        </h3>
                    </div>
                </div>

                <div className="flex-1 flex flex-col">
                    <p className="text-xs text-gray-500 font-medium line-clamp-3 mb-4">
                        {protecao.resumo || "Nenhum resumo disponível para esta proteção."}
                    </p>

                    <div className="mt-auto flex flex-col gap-2">
                        {protecao.titular && (
                            <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                                <User size={14} className="text-purple-500" />
                                <span className="text-[10px] font-black uppercase line-clamp-1">{protecao.titular}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                            <Calendar size={14} className="text-purple-500" />
                            <span className="text-[10px] font-black uppercase line-clamp-1">
                                {protecao.dataDeposito ? `Depósito: ${new Date(protecao.dataDeposito).toLocaleDateString('pt-BR')}` : "Data não informada"}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>

            {userRole === "ADMIN" && (
                <div className="border-t border-gray-100 pt-4 mt-6 flex items-center justify-end gap-2">
                    <Link href={`/admin/protecoes/editar?id=${protecao.id}`} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                        <Edit size={16} />
                    </Link>
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            if (protecao.id) {
                                onDelete(protecao.id);
                            }
                        }} className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm">
                        <Trash2 size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}