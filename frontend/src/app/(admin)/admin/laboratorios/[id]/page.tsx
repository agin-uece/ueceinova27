'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from 'lucide-react';

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
  const router = useRouter();
  const params = useParams(); // captura o ID da URL
  const [isLoading, setIsLoading] = useState(false);
  const [laboratorio, setLaboratorio] = useState<any>(null);

  useEffect(() => {
    // procura o laboratório na base em q o ID seja igual ao da URL
    const labEncontrado = laboratoriosDB.find(l => l.id === params.id);
    if (labEncontrado) {
      setLaboratorio(labEncontrado);
    }
  }, [params.id]);

  // loading se o laboratório não for encontrado 
  if (!laboratorio) {
    return <div className="p-8 text-center text-slate-500">Carregando dados do laboratório...</div>;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

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

    setTimeout(() => {
      setIsLoading(false);
      router.push('/admin/laboratorios');
    }, 1000);
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
            <Button className="bg-red-500 text-white hover:bg-red-800 hover:text-white" type="button" variant="ghost">Cancelar</Button>
          </Link>
          <Button 
            type="submit" 
            className="bg-purple-700 hover:bg-purple-800 text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Atualizando...' : (
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