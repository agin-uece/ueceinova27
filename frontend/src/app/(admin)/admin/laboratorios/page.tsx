'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';

// importa os componentes do modal
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import agrarias from '@/data/laboratorios/laboratorios-ciencias-agrarias.json';
import biologicas from '@/data/laboratorios/laboratorios-ciencias-biologicas.json';
import saude from '@/data/laboratorios/laboratorios-ciencias-da-saude.json';
import exatas from '@/data/laboratorios/laboratorios-ciencias-exatas-e-da-terra.json';
import humanas from '@/data/laboratorios/laboratorios-ciencias-humanas.json';
import sociais from '@/data/laboratorios/laboratorios-ciencias-sociais-aplicadas.json';

// renomeado para refletir que é o valor inicial do estado
const laboratoriosDataIniciais = [
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

export default function AdminLaboratorios() {
  const [busca, setBusca] = useState('');
  
  // controla a lista de laboratórios na tela
  const [laboratorios, setLaboratorios] = useState(laboratoriosDataIniciais);

  // filtra com base no estado atual
  const filtrados = laboratorios.filter(lab =>
    (lab.nome || '').toLowerCase().includes(busca.toLowerCase())
  );

  // remove o laboratório da lista visualmente
  const handleDelete = (idParaDeletar: string) => {
    // futura integração com api: await fetch(`/api/laboratorios/${idParaDeletar}`, { method: 'DELETE' })
    setLaboratorios(prev => prev.filter(lab => lab.id !== idParaDeletar));
  };

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Gerenciar Laboratórios</h1>
        <Link href="/admin/laboratorios/novo">
          <Button className="bg-purple-700 hover:bg-purple-800 text-white flex items-center gap-2">
            <Plus size={16} />
            Novo Laboratório
          </Button>
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <Input
          placeholder="Buscar por nome do laboratório..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-semibold text-slate-700">Nome</TableHead>
              <TableHead className="font-semibold text-slate-700">Área</TableHead>
              <TableHead className="font-semibold text-slate-700">Natureza</TableHead>
              <TableHead className="text-right font-semibold text-slate-700">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtrados.length > 0 ? (
              filtrados.map((lab) => (
                <TableRow key={lab.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium text-slate-900 max-w-md truncate" title={lab.nome}>
                    {lab.nome}
                  </TableCell>
                  <TableCell className="text-slate-600">{lab.areaNorm}</TableCell>
                  <TableCell className="text-slate-600">{lab.natureza}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      
                      <Link href={`/admin/laboratorios/${lab.id}`}>
                        <Button variant="outline" size="sm" className="text-white bg-blue-500 hover:bg-blue-700 hover:text-white border-slate-200">
                          Editar <Pencil size={16} />
                        </Button>
                      </Link>

                      {/* modal de exclusão */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-white bg-red-500 hover:bg-red-700 hover:text-white border-slate-200">
                            Excluir <Trash2 size={16} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. Isso removerá permanentemente o <strong>{lab.nome}</strong> dos nossos servidores.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(lab.id)} className="bg-red-600 hover:bg-red-700 text-white">
                              Sim, excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                  Nenhum laboratório encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}