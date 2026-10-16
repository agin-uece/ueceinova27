import { ElementType } from "react";

interface EmptyStateProps {
    icon: ElementType;
    title: string;
    description?: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
    return (
        <div className="bg-white rounded-[60px] p-32 border border-gray-100 text-center shadow-sm">
            <Icon size={64} className="mx-auto text-gray-200 mb-6" />
            <h3 className="text-2xl font-black text-gray-800 italic uppercase">{title}</h3>
            {description && <p className="text-gray-400 text-sm italic mt-2">{description}</p>}
        </div>
    );
}