import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { MfaProvider } from "@/components/providers/MfaProvider";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Inova 27º - Agência de Inovação da UECE',
  description: 'Portal de tecnologias e laboratórios da Universidade Estadual do Ceará.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        
        <MfaProvider>{children}</MfaProvider>

      </body>
    </html>
  );
}