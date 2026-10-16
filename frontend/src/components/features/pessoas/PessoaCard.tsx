import Link from "next/link";
import { Edit, Trash2, CheckSquare, Building2, GraduationCap } from "lucide-react";

interface Pessoa {
    id: number;
    nome: string;
    email: string;
    papel: string;
    titulacao: string;
    instituicao: string;
    areaPesquisa: string;
    urlFoto: string | null;
    status?: string;
}

interface PessoaCardProps {
    pessoa: Pessoa;
    userRole: string;
    showStatus: boolean;
    canValidate: boolean;
    onDelete: (id: number) => void;
    onValidate: (id: number) => void;
}

export function PessoaCard({ pessoa, userRole, showStatus, canValidate, onDelete, onValidate }: PessoaCardProps) {
    const defaultImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRO1HxPlq-7dE9Qk7GSDm7CvcVHhtgaS1c5pw&s";

    return (
        <div className="bg-white rounded-[32px] border border-gray-200 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all group flex flex-col shadow-sm p-6 h-full relative">
            
            <Link href={`/entidades?tipo=pessoas&id=${pessoa.id}`} className="flex flex-col flex-1">
                <div className="flex items-start gap-4 mb-4">
                    {/* FOTO TAMANHO PADRÃO LABORATÓRIO (w-20 h-20) */}
                    <div className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                        <img 
                            src={pessoa.urlFoto || defaultImage} 
                            alt={pessoa.nome} 
                            onError={(e) => { e.currentTarget.src = defaultImage; }} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                    </div>
                    <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-2">
                            <span className="inline-block bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter">
                                {pessoa.papel?.replace('_', ' ')}
                            </span>
                            {showStatus && pessoa.status && (
                                <span className={`inline-block px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter
                                    ${pessoa.status === "APROVADO" ? "bg-green-100 text-green-600" :
                                        pessoa.status === "REJEITADO" ? "bg-red-100 text-red-600" :
                                            "bg-orange-100 text-orange-600"}`}
                                >
                                    {pessoa.status}
                                </span>
                            )}
                        </div>
                        <h3 className="text-lg font-black text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">
                            {pessoa.nome}
                        </h3>
                    </div>
                </div>

                <div className="flex-1 flex flex-col">
                    <p className="text-xs text-gray-500 font-medium line-clamp-2 mb-4 italic leading-relaxed">
                        {pessoa.areaPesquisa ? `"${pessoa.areaPesquisa}"` : "Área de pesquisa não informada."}
                    </p>
                    <div className="mt-auto space-y-2">
                        <div className="flex items-center gap-1.5 text-gray-500 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 shadow-sm">
                            <Building2 size={14} className="text-indigo-500" />
                            <span className="text-[10px] font-black uppercase truncate">{pessoa.instituicao || "Instituição N/A"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 shadow-sm">
                            <GraduationCap size={14} className="text-indigo-500" />
                            <span className="text-[10px] font-black uppercase truncate">{pessoa.titulacao || "Titulação N/A"}</span>
                        </div>
                    </div>
                </div>
            </Link>

            {/* AÇÕES ADMIN / DONO */}
            {(userRole === "ADMIN" || showStatus) && (
                <div className="border-t border-gray-100 pt-4 mt-6 flex items-center justify-end gap-2 relative z-10">
                    {canValidate && (
                        <button
                            title="Validar Pessoa"
                            onClick={(e) => { e.preventDefault(); onValidate(pessoa.id); }}
                            className="p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                        >
                            <CheckSquare size={16} />
                        </button>
                    )}
                    <Link
                        href={`/admin/pessoas/editar?id=${pessoa.id}`}
                        title="Editar Pessoa"
                        className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                    >
                        <Edit size={16} />
                    </Link>
                    <button
                        title="Excluir Pessoa"
                        onClick={(e) => { e.preventDefault(); onDelete(pessoa.id); }}
                        className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}