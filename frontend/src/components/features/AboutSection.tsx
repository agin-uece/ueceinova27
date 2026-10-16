export function AboutSection() {
  return (
    <section id="sobre" className="w-full bg-gray-50 py-16 md:py-24 px-6">
      
      {/* divide em 2 no pc e em cima e empilha no mobile */}
      <div className="max-w-7xl mx-auto grid p-10 grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        <div className="space-y-6 text-justify text-gray-700">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-left">
            <span className="text-purple-700">Sobre</span><br />
            o Inova 27°
          </h2>
          
          <p>
            O Inova 27° é um portal desenvolvido pela Agência de Inovação da Universidade Estadual do Ceará (AGIN/UECE) para facilitar o acesso às informações sobre as tecnologias e laboratórios da universidade. Aqui, qualquer pessoa pode realizar uma busca simples e encontrar soluções, competências e estruturas disponíveis para pesquisa, desenvolvimento e inovação. 
          </p>
          <p>
            Inspirado na temperatura média do Ceará, o Inova 27° reflete o calor humano, a energia e a vitalidade que caracterizam o ecossistema de conhecimento e empreendedorismo da UECE.  
          </p>
          <p>
            A AGIN/UECE foi oficialmente lançada em 5 de maio de 2023, absorvendo as atribuições do antigo Núcleo de Inovação Tecnológica (NIT), conforme a Resolução nº 1170/2023 – CD. Sua missão é impulsionar a cultura e as práticas inovadoras na universidade, articulando iniciativas de inovação e empreendedorismo, conectando pesquisadores, empresas e instituições parceiras, e promovendo a transferência de conhecimento e tecnologia. 
          </p>
          <p>
            O Inova 27° é um espaço exclusivo para aproximar a universidade da sociedade e do setor produtivo, promovendo a visibilidade das pesquisas, estimulando novas parcerias e fomentando soluções inovadoras que gerem impacto positivo acadêmico, científico, tecnológico e econômico.
          </p>
        </div>

        <div className="w-full flex justify-center">
          <iframe 
            className="w-full max-w-xl aspect-video rounded-2xl shadow-xl transition-transform duration-300" 
            src="https://www.youtube.com/embed/-PMnAA-yQjc" 
            title="YouTube video player" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowFullScreen
          />
        </div>

      </div>
    </section>
  );
}