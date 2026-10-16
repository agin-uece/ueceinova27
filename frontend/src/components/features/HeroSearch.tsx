"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function HeroSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/buscarIA?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="w-full flex justify-center py-8">
      <form 
        onSubmit={handleSearch} 
        className="flex w-full max-w-3xl relative items-center bg-white border border-gray-200 rounded-full shadow-sm focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-transparent transition-all"
      >
        <Search className="absolute left-5 text-gray-400" size={20} />
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ex: Pesquise por tags dos módulos, áreas, tecnologias..."
          className="w-full pl-14 pr-4 py-4 rounded-l-full text-gray-800 focus:outline-none bg-transparent placeholder-gray-400"
        />
        
        <button
          type="submit"
          className="bg-orange-500 text-white font-bold px-8 py-4 rounded-full hover:bg-orange-600 transition-colors cursor-pointer absolute right-0 top-0 bottom-0 m-1"
        >
          Buscar
        </button>
      </form>
    </div>
  );
};