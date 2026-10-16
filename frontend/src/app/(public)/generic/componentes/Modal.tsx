import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: ReactNode; // Pode ser string ou HTML (para usar negritos)
    icon?: ReactNode; // O ícone já com as cores (ex: bg-red-100 text-red-600)
    maxWidth?: "sm" | "md" | "lg" | "xl";
    children: ReactNode; // O conteúdo que vai dentro do modal (formulários, botões)
}

export function Modal({ 
    isOpen, 
    onClose, 
    title, 
    description, 
    icon, 
    maxWidth = "md", 
    children 
}: ModalProps) {
    
    // Fecha o modal ao apertar a tecla ESC
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const maxWidthClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            {/* O onClick abaixo fecha o modal se clicar fora (no fundo escuro) */}
            <div className="absolute inset-0" onClick={onClose}></div>
            
            <div className={`relative bg-white rounded-[32px] p-8 w-full shadow-2xl animate-in zoom-in-95 duration-200 ${maxWidthClasses[maxWidth]}`}>
                
                {/* CABEÇALHO DO MODAL (Ícone e Fechar) */}
                <div className={`flex items-start mb-6 ${icon ? "justify-between" : "justify-end"}`}>
                    {icon && (
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0">
                            {icon}
                        </div>
                    )}
                    <button 
                        onClick={onClose} 
                        className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors shrink-0"
                        title="Fechar"
                    >
                        <X size={16} />
                    </button>
                </div>
                
                {/* TÍTULO E DESCRIÇÃO */}
                {(title || description) && (
                    <div className="mb-6">
                        {title && <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">{title}</h3>}
                        {description && <p className="text-sm text-slate-500 font-medium leading-relaxed">{description}</p>}
                    </div>
                )}

                {/* CONTEÚDO INJETADO (Formulários, Botões, etc.) */}
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
}