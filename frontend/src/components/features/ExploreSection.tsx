import Image from 'next/image';
import Link from 'next/link';
import { Users, Rocket, Beaker, Gamepad2, Briefcase, Mail, ArrowRight } from 'lucide-react'; // Adicionado o ícone Mail

// Array de dados centralizado
const EXPLORE_ITEMS = [
  {
    title: "Talentos e Pesquisadores",
    description: "Conheça as mentes brilhantes e especialistas da UECE que estão impulsionando a pesquisa e a inovação tecnológica.",
    link: "/pessoas/pesquisar",
    icon: Users,
    colSpan: "md:col-span-1 lg:col-span-1"
  },
  {
    title: "Startups e Empresas",
    description: "Explore o ecossistema de negócios, spin-offs e empresas com DNA UECE que transformam pesquisa em impacto no mercado.",
    link: "/startups/pesquisar",
    icon: Rocket,
    colSpan: "md:col-span-1 lg:col-span-1"
  },
  {
    title: "Laboratórios",
    description: "Espaços de pesquisa e infraestrutura de ponta que fortalecem o desenvolvimento científico, acadêmico e social.",
    link: "/laboratorios/pesquisar",
    icon: Beaker,
    colSpan: "md:col-span-1 lg:col-span-1"
  },
  {
    title: "Catálogo de Jogos",
    description: "De jogos de tabuleiro a projetos digitais onde a nossa comunidade atua como criadores, idealizadores ou colaboradores.",
    link: "/jogos/pesquisar",
    icon: Gamepad2,
    colSpan: "md:col-span-1 lg:col-span-1"
  },
  {
    title: "Serviços Oferecidos",
    description: "Conheça o portfólio de serviços tecnológicos e consultorias de alto nível prestados pela nossa comunidade acadêmica.",
    link: "/servicos/pesquisar",
    icon: Briefcase,
    colSpan: "md:col-span-1 lg:col-span-1" // Ajustado para 1 coluna para equilibrar a grade de 6
  },
  {
    title: "Contato e Suporte",
    description: "Fale com a Agência de Inovação (AGIN) para parcerias, dúvidas ou suporte sobre o ecossistema.",
    link: "/contato", 
    icon: Mail,
    colSpan: "md:col-span-1 lg:col-span-1" // O 6º elemento fecha a grade perfeitamente
  }
];

export function ExploreSection() {
  return (
    <div className="flex flex-col w-full">
      
      {/* SEÇÃO PRINCIPAL */}
      <section className="relative w-full py-24 md:py-32 flex flex-col justify-center items-center text-white overflow-hidden">
        
        {/* Imagem de Fundo */}
        <Image 
          src="/imagens/purple.jpg" 
          alt="Pesquisa na UECE" 
          fill
          className="object-cover z-0"
          priority
        />
        
        {/* Overlay escuro para dar contraste */}
        <div className="absolute inset-0 bg-gray-900/80 z-10" />

        {/* CONTEÚDO */}
        <div className="relative z-20 w-full max-w-6xl mx-auto px-6 flex flex-col items-center text-center">
          
          <div className="mb-16">
            <span className="text-orange-400 font-bold tracking-widest uppercase text-sm mb-4 block">Ecossistema Inova27</span>
            <h2 className="text-4xl md:text-5xl font-black drop-shadow-lg text-white">
              Explore nossa rede de inovação
            </h2>
            <p className="text-gray-300 mt-4 max-w-2xl mx-auto text-lg">
              Tudo o que é produzido, desenvolvido e fomentado pela Agência de Inovação da UECE em um só lugar.
            </p>
          </div>

          {/* GRID RESPONSIVO: 1 coluna (mobile) -> 2 colunas (tablet) -> 3 colunas (desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            
            {EXPLORE_ITEMS.map((item, index) => {
              const Icone = item.icon;
              // Para links externos como mailto, não precisamos que o Next.js faça o prefetch
              const isExternal = item.link.startsWith('http') || item.link.startsWith('mailto');

              return (
                <Link 
                  href={item.link} 
                  key={index} 
                  className={`group ${item.colSpan}`}
                  {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <div className="h-full p-8 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg transition-all duration-300 group-hover:bg-white/10 group-hover:border-orange-500/50 group-hover:shadow-orange-500/10 group-hover:-translate-y-1 flex flex-col items-start text-left cursor-pointer relative overflow-hidden">
                    
                    {/* Efeito visual no hover */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-orange-400 mb-6 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                      <Icone size={28} />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-300 leading-relaxed text-sm flex-1 mb-6">
                      {item.description}
                    </p>

                    <div className="mt-auto flex items-center gap-2 text-orange-400 font-bold text-sm uppercase tracking-wider group-hover:text-orange-300 transition-colors">
                      {item.title === "Contato e Suporte" ? "Falar conosco" : "Explorar catálogo"} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}

          </div>

          {/* CALL TO ACTION PARA O PAINEL DE GESTÃO */}
          <div className="mt-16 bg-white/5 border border-white/10 backdrop-blur-md p-8 rounded-3xl w-full max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <h4 className="text-xl font-bold text-white mb-1">Faz parte da UECE?</h4>
              <p className="text-gray-400 text-sm">Cadastre suas pesquisas, laboratórios ou empresas no nosso ecossistema.</p>
            </div>
            <Link 
              href="/login" 
              className="shrink-0 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all duration-200 hover:scale-105"
            >
              Acessar Plataforma
            </Link>
          </div>

        </div>
      </section>

      {/* FOOTER INSTITUCIONAL */}
      <div className="w-full bg-gray-50 py-12 flex flex-col justify-center items-center px-4 border-t border-gray-200">
        <a 
          href="https://www.uece.br/agin/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-purple-800 hover:bg-purple-900 text-white font-bold py-3.5 px-8 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-center"
        >
          Acesse o site oficial da AGIN
        </a>
      </div>
      
    </div>
  );
}