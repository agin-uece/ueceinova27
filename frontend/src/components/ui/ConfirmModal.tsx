import { AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    description: string;
    onCancel: () => void;
    onConfirm: () => void;
    isProcessing?: boolean;
    confirmText?: string;
    cancelText?: string;
}

export function ConfirmModal({
    isOpen,
    title,
    description,
    onCancel,
    onConfirm,
    isProcessing = false,
    confirmText = "Confirmar",
    cancelText = "Cancelar"
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={32} />
                </div>
                <h3 className="text-xl font-black text-gray-900 text-center mb-2 uppercase italic tracking-tight">{title}</h3>
                <p className="text-sm text-gray-500 text-center mb-8">{description}</p>
                <div className="flex gap-3">
                    <button 
                        onClick={onCancel} 
                        disabled={isProcessing} 
                        className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl text-xs uppercase tracking-widest transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button 
                        onClick={onConfirm} 
                        disabled={isProcessing} 
                        className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-red-200 disabled:opacity-50 transition-colors"
                    >
                        {isProcessing ? <Loader2 size={16} className="animate-spin" /> : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}