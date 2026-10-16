import { ElementType } from "react";

interface ResultsHeaderProps {
    icon: ElementType;
    iconClassName?: string;
    total: number;
    label?: string;
}

export function ResultsHeader({ icon: Icon, iconClassName = "text-indigo-600", total, label = "Total de resultados encontradas" }: ResultsHeaderProps) {
    return (
        <div className="flex items-center gap-3 mb-10">
            <Icon className={iconClassName} size={20} />
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                {label}: <span className="text-gray-900 font-black">{total}</span>
            </p>
        </div>
    );
}