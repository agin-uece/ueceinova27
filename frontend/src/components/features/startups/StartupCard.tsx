import Link from "next/link";
import { Rocket, Briefcase, Calendar, Edit, Trash2 } from "lucide-react";
import { Startup } from "@/types"; // Importando a tipagem que criamos na Fase 1

interface StartupCardProps {
    startup: Startup;
    userRole: string;
    onDelete: (id: number) => void;
}

export function StartupCard({ startup, userRole, onDelete }: StartupCardProps) {
    const defaultImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRO1HxPlq-7dE9Qk7GSDm7CvcVHhtgaS1c5pw&s";

    return (
        <div className="bg-white rounded-[32px] border border-gray-250 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all group flex flex-col shadow-sm p-6">
            <Link href={`/entidades?tipo=startups&id=${startup.id}`} className="flex flex-col flex-1">

                {/* CABEÇALHO DO CARD */}
                <div className="flex items-start gap-4 mb-4">
                    {/* Imagem Pequena (Logo) com Fallback */}
                    <div className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-white border border-gray-100 flex items-center justify-center p-2 shadow-sm">
                        <img
                            src={startup.logo || defaultImage}
                            alt={startup.nome}
                            onError={(e) => { e.currentTarget.src = defaultImage; }}
                            className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500 rounded-xl"
                        />
                    </div>

                    {/* Badges e Título */}
                    <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-2">
                            {startup.status && (
                                <span className={`inline-block px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter
                                    ${startup.status === "INTEGRADA" ? "bg-green-100 text-green-600" :
                                        startup.status === "ASSOCIADA" ? "bg-blue-100 text-blue-600" :
                                            "bg-red-100 text-red-600"}`}
                                >
                                    {startup.status}
                                </span>
                            )}
                        </div>
                        <h3 className="text-lg font-black text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-tight">
                            {startup.nome}
                        </h3>
                    </div>
                </div>

                {/* INFORMAÇÕES DE CORPO */}
                <div className="flex-1 flex flex-col">
                    <p className="text-xs text-gray-500 font-medium line-clamp-3 mb-4">
                        {startup.descricao || "Nenhum pitch disponível."}
                    </p>

                    <div className="mt-auto flex flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 text-gray-500 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                            <Briefcase size={14} className="text-red-500" />
                            <span className="text-[10px] font-black uppercase line-clamp-1">{startup.area || "Geral"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                            <Calendar size={14} className="text-red-500" />
                            <span className="text-[10px] font-black uppercase line-clamp-1">
                                {startup.dataFundacao ? `Desde ${new Date(startup.dataFundacao).getFullYear()}` : "Data não informada"}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>

            {/* AÇÕES ADMIN */}
            {userRole === "ADMIN" && (
                <div className="border-t border-gray-100 pt-4 mt-6 flex items-center justify-end gap-2">
                    <Link href={`/admin/startups/editar?id=${startup.id}`} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                        <Edit size={16} />
                    </Link>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            if (startup.id) {
                                onDelete(startup.id);
                            }
                        }}
                        className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}