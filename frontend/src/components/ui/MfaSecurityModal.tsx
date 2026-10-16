"use client";

import { useState, useRef, useEffect } from "react";
import { ShieldCheck, X } from "lucide-react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (pin: string) => Promise<void>;
}

export function MfaSecurityModal({ isOpen, onClose, onConfirm }: Props) {
    const [pin, setPin] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const inputs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (isOpen) {
            setPin(["", "", "", "", "", ""]);
            setError("");
            setTimeout(() => inputs.current[0]?.focus(), 50);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const pinString = pin.join("");

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newPin = [...pin];
        newPin[index] = value.slice(-1);
        setPin(newPin);
        setError("");
        if (value && index < 5) inputs.current[index + 1]?.focus();
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !pin[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        const newPin = [...pin];
        text.split("").forEach((char, i) => { newPin[i] = char; });
        setPin(newPin);
        inputs.current[Math.min(text.length, 5)]?.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pinString.length < 6) { setError("Digite os 6 dígitos do código."); return; }
        setLoading(true);
        setError("");
        try {
            await onConfirm(pinString);
            setPin(["", "", "", "", "", ""]);
        } catch (err: any) {
            setError(err.message || "Código inválido. Tente novamente.");
            setPin(["", "", "", "", "", ""]);
            setTimeout(() => inputs.current[0]?.focus(), 50);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden">

                {/* Header amarelo */}
                <div className="px-8 pt-7 pb-8 text-center relative" style={{ backgroundColor: "#f97316" }}>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-colors"
                    >
                        <X size={16} />
                    </button>

                    <div className="mx-auto w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-3 ring-1 ring-white/30">
                        <ShieldCheck size={24} className="text-white" />
                    </div>

                    <h2 className="text-lg font-black text-white uppercase tracking-tight">
                        Validação PIN
                    </h2>
                    <p className="text-white/80 text-xs mt-1 font-medium">
                        Digite o código de 6 dígitos enviados para o seu e-mail
                    </p>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">

                    {/* PIN inputs */}
                    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                        {pin.map((digit, i) => (
                            <input
                                key={i}
                                ref={el => { inputs.current[i] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={e => handleChange(i, e.target.value)}
                                onKeyDown={e => handleKeyDown(i, e)}
                                disabled={loading}
                                className={`w-11 h-14 text-center text-xl font-black rounded-xl border-2 outline-none transition-all
                                    ${digit ? "border-orange-400 bg-orange-50 text-gray-900" : "border-gray-200 bg-gray-50 text-gray-400"}
                                    ${error ? "border-red-400 bg-red-50" : ""}
                                    focus:border-orange-400 focus:bg-orange-50/50 focus:scale-105
                                    disabled:opacity-50`}
                            />
                        ))}
                    </div>

                    {/* Erro */}
                    {error && (
                        <p className="text-red-500 text-xs text-center font-bold">
                            {error}
                        </p>
                    )}

                    {/* Botão confirmar */}
                    <button
                        type="submit"
                        disabled={loading || pinString.length < 6}
                        className="w-full py-4 text-white font-black text-sm uppercase tracking-widest rounded-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
                        style={{ backgroundColor: "#f97316" }}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Validando...
                            </span>
                        ) : "Confirmar"}
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors font-bold uppercase tracking-widest"
                    >
                        Cancelar
                    </button>

                </form>
            </div>
        </div>
    );
}