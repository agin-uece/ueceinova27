'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";

// import dos jsons
import desenhos from '@/data/tecnologias/desenhos-industriais.json';
import invencao from '@/data/tecnologias/patentes-invencao.json';
import utilidade from '@/data/tecnologias/patentes-utilidade.json';
import programas from '@/data/tecnologias/programas-computadores.json';

// array fixo
const tiposDisponiveis = [
  "Desenho Industrial",
  "Patente de Invenção",
  "Patente de Modelo de Utilidade",
  "Programa de Computador"
];

const formatarTexto = (texto?: string) => {
  if (!texto || texto === "-") return "Não informada";
  const limpo = String(texto).trim().replace(/\.$/, '');
  return limpo.charAt(0).toUpperCase() + limpo.slice(1);
};


const tecnologiasData = [
  ...desenhos.map(item => ({ ...item, tipoTecnologia: "Desenho Industrial" })),
  ...invencao.map(item => ({ ...item, tipoTecnologia: "Patente de Invenção" })),
  ...utilidade.map(item => ({ ...item, tipoTecnologia: "Patente de Modelo de Utilidade" })),
  ...programas.map(item => ({ ...item, tipoTecnologia: "Programa de Computador" }))
].map((item, index) => ({
  ...item,
  // proteção contra chaves duplicadas
  id: item.id ? `${item.id}-${index}` : `tec-gerada-${index}`,
  instituicaoNorm: formatarTexto(item.instituicao)
}));

export default function TecnologiasPage() {
  const [buscaTexto, setBuscaTexto] = useState('');
  const [tiposSelecionados, setTiposSelecionados] = useState<string[]>([]);

  const toggleFiltro = (valor: string, listaAtual: string[], setLista: (novaLista: string[]) => void) => {
    if (listaAtual.includes(valor)) {
      setLista(listaAtual.filter(item => item !== valor)); 
    } else {
      setLista([...listaAtual, valor]); 
    }
  };

  const tecnologiasFiltradas = tecnologiasData.filter((item) => {
    const nome = item.nome || '';
    const bateTexto = nome.toLowerCase().includes(buscaTexto.toLowerCase());
    
    // a filtragem de texto e tipo
    const bateTipo = tiposSelecionados.length === 0 || tiposSelecionados.includes(item.tipoTecnologia);
    
    return bateTexto && bateTipo;
  });

  return (
    <div className="w-full flex flex-col min-h-screen bg-gray-50">
      
      <section className="bg-purple-900 text-white pt-24 pb-12 px-6 flex flex-col items-center text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Tecnologias</h1>
        <p className="text-purple-200 mb-8 max-w-3xl">
          Encontre o que procura de forma simples! Digite aqui uma palavra-chave para localizar tecnologias da Universidade. Exemplos: “energia solar”, “biotecnologia”, “laboratório de química”.
        </p>
        
        <div className="flex w-full max-w-xl">
          <input 
            type="text" 
            value={buscaTexto}
            onChange={(e) => setBuscaTexto(e.target.value)}
            placeholder="Pesquise por nome da tecnologia..." 
            className="w-full px-6 py-3 rounded-l-md bg-white text-black focus:outline-none" 
          />
          <button className="bg-orange-600 px-6 py-3 rounded-r-md hover:bg-orange-600 transition-colors">
            Buscar
          </button>
        </div>
      </section>

      <section className="w-full max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-8">
        
        {/* sidebar de filtros */}
        <aside className="w-full md:w-1/3 lg:w-1/4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg text-purple-900">Filtro</h2>
              <button 
                // função de limpar filtros
                onClick={() => { setTiposSelecionados([]); setBuscaTexto(''); }}
                className="text-sm text-gray-500 hover:text-orange-500 transition-colors"
              >
                Limpar filtros
              </button>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3 text-sm">Tipo de Tecnologia</h3>
              <div className="space-y-2">
                {tiposDisponiveis.map(tipo => (
                  <label key={tipo} className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={tiposSelecionados.includes(tipo)}
                      onChange={() => toggleFiltro(tipo, tiposSelecionados, setTiposSelecionados)}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-600">{tipo}</span>
                  </label>
                ))}
              </div>
            </div>
            
          </div>
        </aside>

        {/* listagem de resultados */}
        <main className="w-full md:w-2/3 lg:w-3/4">
          <div className="mb-6 text-gray-600 font-medium">
            {tecnologiasFiltradas.length} resultados encontrados
          </div>

          {/* container com rolagem */}
          <div className="space-y-4 max-h-[90vh] overflow-y-auto pr-2 pb-4">
            {tecnologiasFiltradas.map(item => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  
                  <div>
                    <h3 className="text-xl font-bold text-purple-900 mb-2">{item.nome}</h3>
                    <div className="flex flex-col flex-wrap gap-4 text-sm text-gray-500">
                      
                      <span className="flex items-center gap-1">
                        <span className="font-semibold text-gray-700">Tipo:</span> {item.tipoTecnologia}
                      </span>
                      
                      {item.dataDeposito && (
                        <span className="flex items-center gap-1">
                          <span className="font-semibold text-gray-700">Data de Depósito:</span> {item.dataDeposito}
                        </span>
                      )}
                      
                      <span className="items-center gap-1">
                        <span className="font-semibold text-gray-700">Instituição:</span> {item.instituicaoNorm}
                      </span>
                      
                    </div>
                  </div>

                  <button className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-md font-medium transition-colors w-full md:w-auto whitespace-nowrap">
                    Ver detalhes
                  </button>

                </CardContent>
              </Card>
            ))}

            {tecnologiasFiltradas.length === 0 && (
              <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                Nenhuma tecnologia encontrada com os filtros selecionados.
              </div>
            )}
          </div>
        </main>

      </section>
    </div>
  );
}