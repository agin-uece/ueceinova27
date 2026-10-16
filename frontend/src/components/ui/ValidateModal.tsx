import { ShieldCheck, Loader2, XCircle, CheckCircle } from "lucide-react";

interface ValidateModalProps {
    isOpen: boolean;
    title?: string;
    description?: string;
    onCancel: () => void;
    onValidate: (aprovado: boolean) => void;
    isProcessing?: boolean;
}

export function ValidateModal({
    isOpen,
    title = "Validar Registro",
    description = "Selecione se deseja aprovar ou rejeitar a publicação no acervo.",
    onCancel,
    onValidate,
    isProcessing = false
}: ValidateModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck size={32} />
                </div>
                <h3 className="text-xl font-black text-gray-900 text-center mb-2 uppercase italic tracking-tight">{title}</h3>
                <p className="text-sm text-gray-500 text-center mb-8">{description}</p>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={onCancel} disabled={isProcessing}
                        className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl text-xs uppercase tracking-widest transition-colors"
                    >
                        Cancelar
                    </button>
                    
                    <div className="flex gap-2 flex-1">
                        <button
                            onClick={() => onValidate(false)} disabled={isProcessing}
                            className="flex-1 py-3 bg-yellow-50 text-yellow-600 hover:bg-yellow-500 hover:text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5"
                        >
                            {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />} 
                            {isProcessing ? "" : "Rejeitar"}
                        </button>
                        <button
                            onClick={() => onValidate(true)} disabled={isProcessing}
                            className="flex-1 py-3 bg-green-500 text-white hover:bg-green-600 font-bold rounded-xl text-xs uppercase tracking-widest transition-colors shadow-lg shadow-green-200 flex items-center justify-center gap-1.5"
                        >
                            {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />} 
                            {isProcessing ? "" : "Aprovar"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}