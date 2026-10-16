import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-2 pt-12 pb-20">
            <button 
                disabled={currentPage === 0} 
                onClick={() => onPageChange(currentPage - 1)} 
                className="p-4 rounded-2xl bg-white border border-gray-200 text-gray-400 hover:text-red-600 disabled:opacity-30 transition-all shadow-sm"
            >
                <ChevronLeft size={24} />
            </button>
            <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => (
                    <button 
                        key={i} 
                        onClick={() => onPageChange(i)} 
                        className={`w-12 h-12 rounded-2xl font-black text-sm transition-all ${
                            currentPage === i 
                            ? "bg-red-600 text-white shadow-xl shadow-red-200" 
                            : "bg-white text-gray-400 hover:bg-gray-50 border border-gray-100 shadow-sm"
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
            <button 
                disabled={currentPage >= totalPages - 1} 
                onClick={() => onPageChange(currentPage + 1)} 
                className="p-4 rounded-2xl bg-white border border-gray-200 text-gray-400 hover:text-red-600 disabled:opacity-30 transition-all shadow-sm"
            >
                <ChevronRight size={24} />
            </button>
        </div>
    );
}