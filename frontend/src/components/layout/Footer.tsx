import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-purple-900 text-white py-6">
      {/* seção esquerda */}
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm">
        
        <div className="mb-6 md:mb-0 text-center md:text-left max-w-lg">
          <Image 
            src="/imagens/Marca_horizontal.png" 
            alt="Logo AGIN" 
            width={120} 
            height={48}
            className="h-12 mb-3 w-auto mx-auto md:mx-0" 
            style={{ width: 'auto', height: 'auto' }}
          />
          <p className="mb-1"><strong>Agência de Inovação da UECE &copy; {new Date().getFullYear()}. Todos os direitos reservados.</strong></p>
          <p className="text-gray-300 text-xs mt-2">
            Endereço: Av. Dr. Silas Munguba, 1700 - Campus do Itaperi, CEP: 60.714.903, Fortaleza, CE.
          </p>
        </div>

        {/* seção direita */}
        <div className="text-center md:text-right">
          <h4 className="font-semibold mb-2 text-base">Contato</h4>
          <p className="text-gray-300">Email: agin@uece.br</p>
          <p className="text-gray-300">Telefone: (85) 3101.9978</p>
        </div>
        
      </div>
    </footer>
  );
}