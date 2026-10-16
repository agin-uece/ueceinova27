import Link from "next/link";
import { User, Layers, Edit, Trash2, CheckSquare } from "lucide-react";
import { Laboratorio } from "@/types";

interface LaboratorioCardProps {
    lab: Laboratorio;
    userRole: string;
    showStatus: boolean;
    canValidate: boolean;
    onDelete: (id: number) => void;
    onValidate: (id: number) => void;
}

export function LaboratorioCard({ lab, userRole, showStatus, canValidate, onDelete, onValidate }: LaboratorioCardProps) {
    const defaultImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRO1HxPlq-7dE9Qk7GSDm7CvcVHhtgaS1c5pw&s";

    return (
        <div className="bg-white rounded-[32px] border border-gray-250 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all group flex flex-col shadow-sm p-6">
            <Link href={`/entidades?tipo=laboratorios&id=${lab.id}`} className="flex flex-col flex-1">
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                        <img
                            src={lab.urlFoto || defaultImage}
                            alt={lab.nome}
                            onError={(e) => { e.currentTarget.src = defaultImage; }}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                    <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-2">
                            {lab.naturezas && lab.naturezas.length > 0 && (
                                <span className="inline-block bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter">
                                    {lab.naturezas[0]}
                                </span>
                            )}
                            {showStatus && lab.status && (
                                <span className={`inline-block px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter
                                    ${lab.status === "APROVADO" ? "bg-green-100 text-green-600" :
                                        lab.status === "REJEITADO" ? "bg-red-100 text-red-600" :
                                            "bg-yellow-100 text-yellow-600"}`}
                                >
                                    {lab.status}
                                </span>
                            )}
                        </div>
                        <h3 className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                            {lab.nome}
                        </h3>
                    </div>
                </div>

                <div className="flex-1 flex flex-col">
                    <p className="text-xs text-gray-500 font-medium line-clamp-3 mb-4">
                        {lab.descricao || "Nenhuma descrição disponível."}
                    </p>
                    <div className="mt-auto flex flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 text-gray-500 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                            <User size={14} className="text-blue-500" />
                            <span className="text-[10px] font-black uppercase line-clamp-1">{lab.coordenacao || "Não informado"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                            <Layers size={14} className="text-blue-500" />
                            <span className="text-[10px] font-black uppercase line-clamp-1">{lab.area || "Geral"}</span>
                        </div>
                    </div>
                </div>
            </Link>

            {/* AÇÕES ADMIN / DONO */}
            {(userRole === "ADMIN" || showStatus) && (
                <div className="border-t border-gray-100 pt-4 mt-6 flex items-center justify-end gap-2">
                    {canValidate && (
                        <button
                            title="Validar Projeto"
                            onClick={(e) => { e.preventDefault(); onValidate(lab.id); }}
                            className="p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                        >
                            <CheckSquare size={16} />
                        </button>
                    )}
                    <Link
                        href={`/admin/laboratorios/editar?id=${lab.id}`}
                        title="Editar Projeto"
                        className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    >
                        <Edit size={16} />
                    </Link>
                    <button
                        title="Excluir Projeto"
                        onClick={(e) => { e.preventDefault(); onDelete(lab.id); }}
                        className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}