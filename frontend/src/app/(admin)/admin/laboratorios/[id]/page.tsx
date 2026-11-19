'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

import agrarias from '@/data/laboratorios/laboratorios-ciencias-agrarias.json';
import biologicas from '@/data/laboratorios/laboratorios-ciencias-biologicas.json';
import saude from '@/data/laboratorios/laboratorios-ciencias-da-saude.json';
import exatas from '@/data/laboratorios/laboratorios-ciencias-exatas-e-da-terra.json';
import humanas from '@/data/laboratorios/laboratorios-ciencias-humanas.json';
import sociais from '@/data/laboratorios/laboratorios-ciencias-sociais-aplicadas.json';

const laboratoriosDB = [
  ...agrarias.map(lab => ({ ...lab, areaNorm: "Ciências Agrárias" })),
  ...biologicas.map(lab => ({ ...lab, areaNorm: "Ciências Biológicas" })),
  ...saude.map(lab => ({ ...lab, areaNorm: "Ciências da Saúde" })),
  ...exatas.map(lab => ({ ...lab, areaNorm: "Ciências Exatas e da Terra" })),
  ...humanas.map(lab => ({ ...lab, areaNorm: "Ciências Humanas" })),
  ...sociais.map(lab => ({ ...lab, areaNorm: "Ciências Sociais Aplicadas" }))
].map((lab, index) => ({
  ...lab,
  id: lab.id ? `${lab.id}-${index}` : `lab-gerado-${index}`
}));

export default function EditarLaboratorio() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [laboratorio, setLaboratorio] = useState<any>(null);
  const [naoEncontrado, setNaoEncontrado] = useState(false);

  // Estado unificado para banner de sucesso ou erro
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (!params.id) return;

    const idLimpo = decodeURIComponent(params.id as string);
    const labEncontrado = laboratoriosDB.find(l => l.id === idLimpo);

    if (labEncontrado) {
      setLaboratorio(labEncontrado);
    } else {
      setNaoEncontrado(true);
    }
  }, [params.id]);

  if (naoEncontrado) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center space-y-4 bg-white rounded-lg shadow-sm border border-slate-200 mt-10">
        <h2 className="text-xl font-bold text-slate-800">Laboratório não encontrado!</h2>
        <p className="text-slate-500">O registro que você tentou acessar não existe ou o ID está incorreto.</p>
        <Link href="/admin/laboratorios">
          <Button className="bg-purple-700 hover:bg-purple-800 text-white mt-4">
            <ArrowLeft size={16} className="mr-2" />
            Voltar para listagem
          </Button>
        </Link>
      </div>
    );
  }

  if (!laboratorio) {
    return (
      <div className="p-8 flex items-center justify-center gap-2 text-slate-500">
        <Loader2 className="animate-spin text-purple-600" size={20} />
        <span>Carregando dados do laboratório...</span>
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
        id: laboratorio.id,
        nome: formData.get('nome'),
        area: formData.get('area'),
        natureza: formData.get('natureza'),
        vinculado: formData.get('vinculado'),
        descricao: formData.get('descricao'),
      };

      console.log('dados atualizados (PUT/PATCH para a api):', dadosAtualizados);

      // Simulação da atualização (quando integrar com a API real, trocar pelo execute do useSecureAction)
      await new Promise((resolve) => setTimeout(resolve, 600));

      setFeedback({
        type: "success",
        message: "Laboratório atualizado com sucesso!"
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      setFeedback({
        type: "error",
        message: error?.message || "Erro ao atualizar o laboratório. Tente novamente."
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/laboratorios">
          <Button variant="outline" size="icon" className="border-slate-200">
            <ArrowLeft size={18} className="text-slate-600" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Editar Laboratório</h1>
          <p className="text-sm text-slate-500">Atualize as informações do laboratório selecionado.</p>
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
            <Label htmlFor="nome">Nome do Laboratório</Label>
            <Input
              id="nome"
              name="nome"
              defaultValue={laboratorio.nome}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="area">Área do Conhecimento</Label>
            <Input
              id="area"
              name="area"
              defaultValue={laboratorio.areaNorm}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="natureza">Natureza</Label>
            <Input
              id="natureza"
              name="natureza"
              defaultValue={laboratorio.natureza}
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="vinculado">Instituição/Centro Vinculado</Label>
            <Input
              id="vinculado"
              name="vinculado"
              defaultValue={laboratorio.vinculado}
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="descricao">Descrição Breve</Label>
            <Textarea
              id="descricao"
              name="descricao"
              defaultValue={laboratorio.descricao}
              className="min-h-[120px]"
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
          <Link href="/admin/laboratorios">
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