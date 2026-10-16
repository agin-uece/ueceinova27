// src/app/(admin)/admin/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FlaskConical, Cpu } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Visão Geral</h1>
        <p className="text-slate-500 mt-2">Bem-vindo ao painel de gestão de dados do Inova 27º.</p>
      </div>

      {/* cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Laboratórios Cadastrados</CardTitle>
            <FlaskConical className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            {/* numero fixo por enquanto */}
            <div className="text-3xl font-bold text-slate-900">18</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Tecnologias Cadastradas</CardTitle>
            <Cpu className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            {/* numero fixo por enquanto */}
            <div className="text-3xl font-bold text-slate-900">42</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}