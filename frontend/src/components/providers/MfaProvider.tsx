"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { MfaSecurityModal } from "../../components/ui/MfaSecurityModal";
import { CheckCircle2, XCircle } from "lucide-react";

type MfaContextType = {
    openMfa: (onConfirm: (pin: string) => Promise<void>) => void;
    closeMfa: () => void;
    showResult: (tipo: "sucesso" | "erro") => void;
};

const MfaContext = createContext<MfaContextType>({
    openMfa: async () => { },
    closeMfa: () => { },
    showResult: () => { }
});

// Páginas que devem fazer router.back() em vez de reload
const PAGINAS_EDICAO = ["/editar", "/edit"];

function ResultModal({ tipo, onClose }: { tipo: "sucesso" | "erro"; onClose: () => void }) {
    const sucesso = tipo === "sucesso";
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (!sucesso) return;
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev <= 0) { clearInterval(interval); return 0; }
                return prev - 2;
            });
        }, 60);
        const timeout = setTimeout(() => onClose(), 3000);
        return () => { clearInterval(interval); clearTimeout(timeout); };
    }, [sucesso, onClose]);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-xs rounded-3xl shadow-2xl overflow-hidden text-center">
                <div className={`px-8 pt-8 pb-6 ${sucesso ? "bg-green-500" : "bg-red-500"}`}>
                    <div className="mx-auto w-14 h-14 bg-white/20 rounded-full flex items-center justify-center ring-1 ring-white/30">
                        {sucesso
                            ? <CheckCircle2 size={28} className="text-white" />
                            : <XCircle size={28} className="text-white" />
                        }
                    </div>
                </div>
                <div className="px-8 py-6 space-y-4">
                    <h2 className="text-lg font-black uppercase tracking-tight text-gray-900">
                        {sucesso ? "Operação concluída!" : "Falha na operação"}
                    </h2>
                    <p className="text-sm text-gray-400 font-medium">
                        {sucesso
                            ? "A ação foi realizada com sucesso."
                            : "Não foi possível concluir a operação. Tente novamente."
                        }
                    </p>

                    {sucesso && (
                        <div className="space-y-1.5">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                Redirecionando...
                            </p>
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-green-500 rounded-full transition-all duration-75"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <button
                        onClick={onClose}
                        className={`w-full py-3 rounded-2xl font-black text-sm uppercase tracking-widest text-white transition-all ${sucesso ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
                    >
                        Ok
                    </button>
                </div>
            </div>
        </div>
    );
}

export function MfaProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const [isOpen, setIsOpen] = useState(false);
    const [resultado, setResultado] = useState<"sucesso" | "erro" | null>(null);
    const [onConfirmAction, setOnConfirmAction] = useState<((pin: string) => Promise<void>) | null>(null);

    const openMfa = (onConfirm: (pin: string) => Promise<void>) => {
        setOnConfirmAction(() => onConfirm);
        setIsOpen(true);
    };

    const closeMfa = () => {
        setIsOpen(false);
        setOnConfirmAction(null);
    };

    const handleConfirm = async (pin: string) => {
        if (!onConfirmAction) return;
        try {
            await onConfirmAction(pin);
            closeMfa();
            setResultado("sucesso");
        } catch (err) {
            console.error("Erro MFA:", err);
            throw err;
        }
    };

    const handleResultClose = () => {
        setResultado(null);
        setTimeout(() => {
            const isEdicao = PAGINAS_EDICAO.some(p => pathname?.includes(p));
            if (isEdicao) {
                router.back();
            } else {
                window.location.reload();
            }
        }, 300);
    };

    return (
        <MfaContext.Provider value={{ openMfa, closeMfa, showResult: setResultado }}>
            {children}

            <MfaSecurityModal
                isOpen={isOpen}
                onClose={closeMfa}
                onConfirm={handleConfirm}
            />

            {resultado && (
                <ResultModal
                    tipo={resultado}
                    onClose={handleResultClose}
                />
            )}
        </MfaContext.Provider>
    );
}

export const useMfa = () => useContext(MfaContext);