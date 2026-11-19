'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

// importa os jsons para simular a base de dados
import desenhos from '@/data/tecnologias/desenhos-industriais.json';
import invencao from '@/data/tecnologias/patentes-invencao.json';
import utilidade from '@/data/tecnologias/patentes-utilidade.json';
import programas from '@/data/tecnologias/programas-computadores.json';

// reconstrói a base injetando o tipo correspondente
const tecnologiasDB = [
  ...desenhos.map(item => ({ ...item, tipoTecnologia: "Desenho Industrial" })),
  ...invencao.map(item => ({ ...item, tipoTecnologia: "Patente de Invenção" })),
  ...utilidade.map(item => ({ ...item, tipoTecnologia: "Patente de Modelo de Utilidade" })),
  ...programas.map(item => ({ ...item, tipoTecnologia: "Programa de Computador" }))
].map((item, index) => ({
  ...item,
  id: item.id ? `${item.id}-${index}` : `tec-gerada-${index}`
}));

export default function EditarTecnologia() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [tecnologia, setTecnologia] = useState<any>(null);
  const [naoEncontrado, setNaoEncontrado] = useState(false);

  // Estado unificado para banner de sucesso ou erro
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (!params.id) return;

    const idLimpo = decodeURIComponent(params.id as string);
    const tecEncontrada = tecnologiasDB.find(t => t.id === idLimpo);

    if (tecEncontrada) {
      setTecnologia(tecEncontrada);
    } else {
      setNaoEncontrado(true);
    }
  }, [params.id]);

  if (naoEncontrado) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center space-y-4 bg-white rounded-lg shadow-sm border border-slate-200 mt-10">
        <h2 className="text-xl font-bold text-slate-800">Tecnologia não encontrada!</h2>
        <p className="text-slate-500">O registro que você tentou acessar não existe ou o ID está incorreto.</p>
        <Link href="/admin/tecnologias">
          <Button className="bg-purple-700 hover:bg-purple-800 text-white mt-4">
            <ArrowLeft size={16} className="mr-2" />
            Voltar para listagem
          </Button>
        </Link>
      </div>
    );
  }

  if (!tecnologia) {
    return (
      <div className="p-8 flex items-center justify-center gap-2 text-slate-500">
        <Loader2 className="animate-spin text-purple-600" size={20} />
        <span>Carregando dados da tecnologia...</span>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback(null);

    try {
      const formData = new FormData(e.currentTarget);
      const dadosAtualizados = {
        id: tecnologia.id,
        nome: formData.get('nome'),
        tipo: formData.get('tipo'),
        dataDeposito: formData.get('dataDeposito'),
        instituicao: formData.get('instituicao'),
        inventores: formData.get('inventores'),
        resumo: formData.get('resumo'),
      };

      console.log('dados atualizados (PUT/PATCH):', dadosAtualizados);

      // Simulação da atualização
      await new Promise((resolve) => setTimeout(resolve, 600));

      setFeedback({
        type: "success",
        message: "Tecnologia atualizada com sucesso!"
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      setFeedback({
        type: "error",
        message: error?.message || "Erro ao atualizar a tecnologia. Tente novamente."
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/tecnologias">
          <Button variant="outline" size="icon" className="border-slate-200">
            <ArrowLeft size={18} className="text-slate-600" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Editar Tecnologia</h1>
          <p className="text-sm text-slate-500">Atualize as informações da patente ou programa selecionado.</p>
        </div>
      </div>

      {/* Banner de Feedback (Sucesso ou Erro) */}
      {feedback && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${
          feedback.type === "success"
            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
            : "bg-red-50 border-red-200 text-red-800"
        }`}>
          {feedback.type === "success" ? (
            <CheckCircle2 size={22} className="text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle size={22} className="text-red-600 shrink-0" />
          )}
          <span className="text-sm font-medium">{feedback.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="nome">Nome da Tecnologia / Título</Label>
            <Input
              id="nome"
              name="nome"
              defaultValue={tecnologia.nome}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Tecnologia</Label>
            <select
              id="tipo"
              name="tipo"
              defaultValue={tecnologia.tipoTecnologia}
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
              defaultValue={tecnologia.dataDeposito}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="instituicao">Instituição Vinculada</Label>
            <Input
              id="instituicao"
              name="instituicao"
              defaultValue={tecnologia.instituicao}
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="inventores">Inventores (Separados por vírgula)</Label>
            <Input
              id="inventores"
              name="inventores"
              defaultValue={Array.isArray(tecnologia.inventores) ? tecnologia.inventores.join(', ') : tecnologia.inventores}
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="resumo">Resumo da Tecnologia</Label>
            <Textarea
              id="resumo"
              name="resumo"
              defaultValue={tecnologia.resumo}
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
                Atualizando...
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Atualizar Registro
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}