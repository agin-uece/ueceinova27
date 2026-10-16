import Link from "next/link";
import { Users, Mail, Phone, Edit, Trash2 } from "lucide-react";
import { Servico } from "@/types";

interface ServicoCardProps {
    servico: Servico;
    userRole: string;
    onDelete: (id: number) => void;
}

export function ServicoCard({ servico, userRole, onDelete }: ServicoCardProps) {
    const defaultImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRO1HxPlq-7dE9Qk7GSDm7CvcVHhtgaS1c5pw&s";

    return (
        <div className="bg-white rounded-[32px] border-2 border-gray-250 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all group flex flex-col shadow-sm p-6">
            <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 shrink-0 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                    <img
                        src={servico.urlFoto || defaultImage}
                        alt="Imagem Serviço"
                        onError={(e) => { e.currentTarget.src = defaultImage; }}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                </div>

                <div className="flex-1">
                    <div className="inline-block bg-teal-50 text-teal-600 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter mb-2">
                        {servico.areaAtuacao || "Geral"}
                    </div>
                    <div className="flex items-start gap-2 mb-1">
                        <Users size={16} className="text-teal-500 shrink-0" />
                        <h3 className="text-md font-black text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-2 leading-tight">
                            {servico.prestadoresNomes?.length > 0
                                ? servico.prestadoresNomes.join(", ")
                                : "Nenhum prestador vinculado"}
                        </h3>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col">
                <p className="text-xs text-gray-500 font-medium line-clamp-3 mb-6">
                    {servico.descricao || "Sem descrição."}
                </p>

                <div className="mt-auto flex flex-col gap-2">
                    {servico.email && (
                        <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                            <Mail size={14} className="text-teal-500 shrink-0" />
                            <span className="text-[10px] font-bold tracking-widest truncate">{servico.email}</span>
                        </div>
                    )}
                    {servico.telefone && (
                        <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                            <Phone size={14} className="text-teal-500 shrink-0" />
                            <span className="text-[10px] font-bold tracking-widest truncate">{servico.telefone}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* AÇÕES ADMIN */}
            {userRole === "ADMIN" && (
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                    <Link href={`/admin/servicos/editar?id=${servico.id}`} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                        <Edit size={16} />
                    </Link>
                    <button onClick={() => onDelete(servico.id)} className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm">
                        <Trash2 size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}