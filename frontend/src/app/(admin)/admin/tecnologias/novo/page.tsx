"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useSecureAction } from "@/hooks/useSecureAction";

export default function NovaTecnologia() {
  const router = useRouter();
  const { execute, isProcessing: isLoading } = useSecureAction();

  // Estados para banner de erro no topo e modal de sucesso de 5s
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);

    const dadosTecnologia = {
      nome: formData.get("nome"),
      tipo: formData.get("tipo"),
      dataDeposito: formData.get("dataDeposito") || null,
      instituicao: formData.get("instituicao"),
      inventores: formData.get("inventores"),
      resumo: formData.get("resumo"),
    };

    const fetchCriar = async (pin?: string) => {
      const token = localStorage.getItem("userToken");
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      if (token) headers.append("Authorization", `Bearer ${token}`);
      if (pin) headers.append("X-MFA-PIN", pin);

      return fetch(`${process.env.NEXT_PUBLIC_API_URL}/tecnologias`, {
        method: "POST",
        headers,
        body: JSON.stringify(dadosTecnologia),
      });
    };

    const onSucesso = () => {
      setCountdown(5);
      setShowSuccessModal(true);
    };

    const result = await execute(fetchCriar, onSucesso);

    if (!result.success && result.error) {
      let mensagem = result.error;
      try {
        const erroJson = JSON.parse(result.error);
        mensagem = erroJson.erro || erroJson.message || result.error;
      } catch {}

      setErrorMessage(
        typeof mensagem === "string"
          ? mensagem
          : "Ocorreu um erro ao salvar a tecnologia. Verifique os dados e tente novamente."
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Controla a contagem regressiva de 5 segundos e o redirecionamento
  useEffect(() => {
    if (!showSuccessModal) return;

    if (countdown <= 0) {
      router.push("/admin/tecnologias");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [showSuccessModal, countdown, router]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 relative">
      {/* MODAL DE SUCESSO (5 SEGUNDOS) */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gray-100 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tight">
                Tecnologia Cadastrada!
              </h2>
              <p className="text-sm text-gray-500">
                A tecnologia foi registrada com sucesso e já está disponível na plataforma.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Redirecionando em <span className="text-emerald-600 text-sm">{countdown}s</span>...
              </p>
            </div>

            <button
              onClick={() => router.push("/admin/tecnologias")}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-colors"
            >
              Ir para listagem agora
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <Link href="/admin/tecnologias">
          <Button variant="outline" size="icon" className="border-slate-200">
            <ArrowLeft size={18} className="text-slate-600" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Nova Tecnologia</h1>
          <p className="text-sm text-slate-500">Cadastre uma nova patente, desenho industrial ou programa de computador.</p>
        </div>
      </div>

      {/* Banner de Erro */}
      {errorMessage && (
        <div className="p-4 rounded-xl flex items-center gap-3 border bg-red-50 border-red-200 text-red-800">
          <AlertCircle size={22} className="text-red-600 shrink-0" />
          <span className="text-sm font-medium">{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="nome">Nome da Tecnologia / Título</Label>
            <Input
              id="nome"
              name="nome"
              placeholder="Ex: Método de Síntese de Chalconas..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Tecnologia</Label>
            <select
              id="tipo"
              name="tipo"
              required
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Selecione um tipo...</option>
              <option value="Desenho Industrial">Desenho Industrial</option>
              <option value="Patente de Invenção">Patente de Invenção</option>
              <option value="Patente de Modelo de Utilidade">Patente de Modelo de Utilidade</option>
              <option value="Programa de Computador">Programa de Computador</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataDeposito">Data de Depósito</Label>
            <Input
              id="dataDeposito"
              name="dataDeposito"
              type="date"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="instituicao">Instituição Vinculada</Label>
            <Input
              id="instituicao"
              name="instituicao"
              placeholder="Ex: Universidade Estadual do Ceará"
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="inventores">Inventores (Separados por vírgula)</Label>
            <Input
              id="inventores"
              name="inventores"
              placeholder="Ex: João, Maria, José..."
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="resumo">Resumo da Tecnologia</Label>
            <Textarea
              id="resumo"
              name="resumo"
              placeholder="Descreva brevemente do que se trata a tecnologia..."
              className="min-h-[120px]"
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
          <Link href="/admin/tecnologias">
            <Button className="bg-red-500 text-white hover:bg-red-800 hover:text-white" type="button" variant="ghost">
              Cancelar
            </Button>
          </Link>
          <Button
            type="submit"
            className="bg-purple-700 hover:bg-purple-800 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={16} />
                Salvando...
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Salvar Tecnologia
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}