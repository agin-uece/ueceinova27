"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Save, AlertCircle, ArrowLeft, Loader2, FileText, Info } from "lucide-react";
import Link from "next/link";
import { useSecureAction } from "@/hooks/useSecureAction";
import { FormGroup } from "@/components/ui/FormGroup";

const NATUREZAS = ["PATENTE", "SOFTWARE", "DESENHO_INDUSTRIAL"];

const TIPOS_PROTECAO_POR_NATUREZA: Record<string, string[]> = {
  PATENTE: ["PATENTE_MODELO_UTILIDADE", "PATENTE_INVENCAO"],
  SOFTWARE: ["PROGRAMA_COMPUTADOR"],
  DESENHO_INDUSTRIAL: ["DESENHO_INDUSTRIAL"],
};

const CAMPOS: Record<string, {
  descricao: boolean;
  diferencialTecnologico: boolean;
  inventores: boolean;
  autores: boolean;
  nivelMaturidade: boolean;
}> = {
  PATENTE: {
    descricao: true,
    diferencialTecnologico: true,
    inventores: true,
    autores: false,
    nivelMaturidade: true,
  },
  SOFTWARE: {
    descricao: true,
    diferencialTecnologico: true,
    inventores: false,
    autores: true,
    nivelMaturidade: false,
  },
  DESENHO_INDUSTRIAL: {
    descricao: false,
    diferencialTecnologico: false,
    inventores: false,
    autores: true,
    nivelMaturidade: false,
  },
};

function FormularioEdicaoProtecao() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const protecaoId = searchParams.get("id");

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [erro, setErro] = useState("");

  const { execute, isProcessing: isSaving } = useSecureAction();

  const [inventoresStr, setInventoresStr] = useState("");
  const [autoresStr, setAutoresStr] = useState("");

  const [formData, setFormData] = useState({
    nome: "",
    resumo: "",
    natureza: "PATENTE",
    tipos: [] as string[],
    nivelMaturidade: "",
    status: "",
    titular: "",
    diferencialTecnologico: "",
    numeroProtocolo: "",
    aplicacao: "",
    area: "",
    infoExtra: "",
  });

  const campos = CAMPOS[formData.natureza] ?? CAMPOS["PATENTE"];
  const tiposDisponiveis = TIPOS_PROTECAO_POR_NATUREZA[formData.natureza] || [];

  useEffect(() => {
    if (!protecaoId) return;

    const checkAuthAndFetchData = async () => {
      const userDataStr = localStorage.getItem("userData");
      const token = localStorage.getItem("userToken");

      if (!userDataStr || !token) { router.push("/login"); return; }

      const userData = JSON.parse(userDataStr);
      if (userData.role !== "ADMIN") { router.push("/gestao"); return; }

      setIsAuthorized(true);

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/protecoes/${protecaoId}`);
        if (res.ok) {
          const data = await res.json();

          setFormData({
            nome: data.nome || "",
            resumo: data.resumo || "",
            natureza: data.natureza || "PATENTE",
            tipos: data.tipos || [],
            nivelMaturidade: data.nivelMaturidade || "",
            status: data.status || "",
            titular: data.titular || "",
            diferencialTecnologico: data.diferencialTecnologico || "",
            numeroProtocolo: data.numeroProtocolo || "",
            aplicacao: data.aplicacao || "",
            area: data.area || "",
            infoExtra: data.infoExtra || "",
          });

          if (Array.isArray(data.inventores)) setInventoresStr(data.inventores.join(", "));
          if (Array.isArray(data.autores)) setAutoresStr(data.autores.join(", "));
        } else {
          setErro("Proteção não encontrada.");
        }
      } catch {
        setErro("Falha ao carregar os dados.");
      } finally {
        setIsFetching(false);
      }
    };

    checkAuthAndFetchData();
  }, [protecaoId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNaturezaChange = (natureza: string) => {
    const tiposValidos = TIPOS_PROTECAO_POR_NATUREZA[natureza] || [];
    setFormData(prev => ({
      ...prev,
      natureza,
      tipos: prev.tipos.filter((t: string) => tiposValidos.includes(t)),
    }));
  };

  const handleTipoToggle = (tipo: string) => {
    setFormData(prev => ({
      ...prev,
      tipos: prev.tipos.includes(tipo)
        ? prev.tipos.filter((t: string) => t !== tipo)
        : [...prev.tipos, tipo],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    const payload = {
      ...formData,
      inventores: campos.inventores
        ? inventoresStr.split(",").map((i: string) => i.trim()).filter((i: string) => i !== "")
        : [],
      autores: campos.autores
        ? autoresStr.split(",").map((a: string) => a.trim()).filter((a: string) => a !== "")
        : [],
    };

    const result = await execute((pin?: string) => {
      const token = localStorage.getItem("userToken");
      return fetch(`${process.env.NEXT_PUBLIC_API_URL}/protecoes/${protecaoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` }),
          ...(pin && { "X-MFA-PIN": pin }),
        },
        body: JSON.stringify(payload),
      });
    });

    if (result.success) {
      
    } else if (result.error) {
      try {
        const erroJson = JSON.parse(result.error);
        setErro(erroJson.erro || erroJson.message || result.error);
      } catch {
        setErro(result.error);
      }
    }
  };

  if (!protecaoId || !isAuthorized) return null;

  if (isFetching) return (
    <div className="flex flex-col items-center justify-center py-20 text-purple-600 gap-4">
      <Loader2 size={40} className="animate-spin" />
      <p className="font-medium">Carregando dados da proteção...</p>
    </div>
  );

  const inputClass = "w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all";

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      <div className="flex items-center gap-4">
        <Link href="/protecoes/pesquisar" className="p-2 bg-white rounded-xl shadow-sm hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-2 italic uppercase">
            <Shield className="text-purple-600" size={32} /> Editar Proteção
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Registro #{protecaoId}</p>
        </div>
      </div>

      {erro && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 border border-red-100">
          <AlertCircle size={20} /> <p className="font-bold text-sm">{erro}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-8">

        {/* NATUREZA */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
            <Shield size={20} className="text-purple-600" /> Natureza da Proteção
          </h3>
          <div className="flex flex-wrap gap-3">
            {NATUREZAS.map(nat => (
              <button
                key={nat}
                type="button"
                onClick={() => handleNaturezaChange(nat)}
                className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all border-2 ${formData.natureza === nat
                    ? "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-100"
                    : "bg-gray-50 border-gray-200 text-gray-500 hover:border-purple-300 hover:text-purple-600"
                  }`}
              >
                {nat.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>

        {/* CAMPOS PRINCIPAIS */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
            <FileText size={20} className="text-purple-600" /> Informações Principais
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Título */}
            <div className="col-span-2">
              <FormGroup label="Título *">
                <input
                  required
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className={inputClass}
                />
              </FormGroup>
            </div>

            {/* Tipo de Proteção */}
            <div className="col-span-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
                Tipo de Proteção
              </label>
              <div className="flex flex-wrap gap-3">
                {tiposDisponiveis.map((tipo: string) => (
                  <label
                    key={tipo}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all cursor-pointer ${formData.tipos.includes(tipo)
                        ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-100"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={formData.tipos.includes(tipo)}
                      onChange={() => handleTipoToggle(tipo)}
                    />
                    <span className="text-xs font-bold uppercase tracking-tighter">
                      {tipo.replace(/_/g, " ")}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Descrição */}
            {campos.descricao && (
              <div className="col-span-2">
                <FormGroup label="Descrição">
                  <textarea
                    name="resumo"
                    rows={3}
                    value={formData.resumo}
                    onChange={handleChange}
                    className={`${inputClass} resize-none`}
                  />
                </FormGroup>
              </div>
            )}

            {/* Diferencial Tecnológico */}
            {campos.diferencialTecnologico && (
              <div className="col-span-2">
                <FormGroup label="Diferencial Tecnológico">
                  <textarea
                    name="diferencialTecnologico"
                    rows={3}
                    value={formData.diferencialTecnologico}
                    onChange={handleChange}
                    className={`${inputClass} resize-none`}
                  />
                </FormGroup>
              </div>
            )}

            {/* Titular */}
            <FormGroup label="Titular">
              <input
                type="text"
                name="titular"
                value={formData.titular}
                onChange={handleChange}
                className={inputClass}
              />
            </FormGroup>

            {/* Inventores */}
            {campos.inventores && (
              <FormGroup label="Inventores (separados por vírgula)">
                <input
                  type="text"
                  placeholder="Ex: João Silva, Maria Souza"
                  value={inventoresStr}
                  onChange={(e) => setInventoresStr(e.target.value)}
                  className={inputClass}
                />
              </FormGroup>
            )}

            {/* Autor(es) */}
            {campos.autores && (
              <FormGroup label="Autor(es) (separados por vírgula)">
                <input
                  type="text"
                  placeholder="Ex: João Silva, Maria Souza"
                  value={autoresStr}
                  onChange={(e) => setAutoresStr(e.target.value)}
                  className={inputClass}
                />
              </FormGroup>
            )}

            {/* Nº do Processo */}
            <FormGroup label="Nº do Processo">
              <input
                type="text"
                name="numeroProtocolo"
                value={formData.numeroProtocolo}
                onChange={handleChange}
                className={inputClass}
              />
            </FormGroup>

            {/* Nível de Maturidade */}
            {campos.nivelMaturidade && (
              <FormGroup label="Nível de Maturidade">
                <input
                  type="text"
                  name="nivelMaturidade"
                  value={formData.nivelMaturidade}
                  onChange={handleChange}
                  className={inputClass}
                />
              </FormGroup>
            )}

            {/* Status */}
            <FormGroup label="Status">
              <input
                type="text"
                name="status"
                placeholder="Ex: Concedida"
                value={formData.status}
                onChange={handleChange}
                className={inputClass}
              />
            </FormGroup>

            {/* Área */}
            <FormGroup label="Área">
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleChange}
                className={inputClass}
              />
            </FormGroup>

            {/* Aplicação */}
            <FormGroup label="Aplicação">
              <input
                type="text"
                name="aplicacao"
                value={formData.aplicacao}
                onChange={handleChange}
                className={inputClass}
              />
            </FormGroup>

          </div>
        </div>

        {/* INFORMAÇÕES ADICIONAIS */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
            <Info size={20} className="text-purple-600" /> Informações Adicionais
          </h3>
          <FormGroup label="Informação Extra">
            <textarea
              name="infoExtra"
              rows={3}
              value={formData.infoExtra}
              onChange={handleChange}
              className={`${inputClass} resize-none`}
            />
          </FormGroup>
        </div>

        <div className="pt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-3 bg-purple-700 hover:bg-purple-800 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-purple-100 transition-all disabled:opacity-50"
          >
            {isSaving
              ? <><Loader2 className="animate-spin" size={20} /> Atualizando...</>
              : <><Save size={20} /> Atualizar Proteção</>
            }
          </button>
        </div>

      </form>
    </div>
  );
}

export default function EditarProtecaoPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-6 lg:px-8">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center py-20 text-purple-600 gap-4">
          <Loader2 size={40} className="animate-spin" />
          <p className="font-medium">Carregando a tela de edição...</p>
        </div>
      }>
        <FormularioEdicaoProtecao />
      </Suspense>
    </main>
  );
}