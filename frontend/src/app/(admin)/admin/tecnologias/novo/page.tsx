'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from 'lucide-react';

export default function NovaTecnologia() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // extrai os campos específicos de tecnologia
    const dadosTecnologia = {
      nome: formData.get('nome'),
      tipo: formData.get('tipo'),
      dataDeposito: formData.get('dataDeposito'),
      instituicao: formData.get('instituicao'),
      inventores: formData.get('inventores'),
      resumo: formData.get('resumo'),
    };

    console.log('dados da tecnologia para a api:', dadosTecnologia);

    // simula delay da rede
    setTimeout(() => {
      setIsLoading(false);
      router.push('/admin/tecnologias');
    }, 1000);
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
          <h1 className="text-2xl font-bold text-slate-900">Nova Tecnologia</h1>
          <p className="text-sm text-slate-500">Cadastre uma nova patente, desenho industrial ou programa de computador.</p>
        </div>
      </div>

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
            {/* input type date já traz o calendário nativo do navegador */}
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
            <Button className="bg-red-500 text-white hover:bg-red-800 hover:text-white" type="button" variant="ghost">Cancelar</Button>
          </Link>
          <Button 
            type="submit" 
            className="bg-purple-700 hover:bg-purple-800 text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Salvando...' : (
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