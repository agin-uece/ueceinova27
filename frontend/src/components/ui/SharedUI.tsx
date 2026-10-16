import { LucideIcon } from "lucide-react";

export const InfoItem = ({ icon: Icon, label, value, colorClass = "text-blue-600" }: { icon: LucideIcon | any, label: string, value: any, colorClass?: string }) => {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
            <div className={`p-2 bg-white rounded-lg shadow-sm ${colorClass}`}>
                <Icon size={18} />
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
                <p className="text-sm text-gray-800 font-medium">{value}</p>
            </div>
        </div>
    );
};

export const Tag = ({ children, color = "bg-gray-100 text-gray-600 border-gray-200" }: { children: React.ReactNode, color?: string }) => (
    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${color}`}>
        {children}
    </span>
);

export const SectionHeader = ({ icon: Icon, title, colorClass }: { icon: LucideIcon | any, title: string, colorClass: string }) => (
    <div className="flex items-center gap-3 mb-6 px-2">
        <div className={`p-2.5 rounded-xl ${colorClass}`}><Icon size={20} /></div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
    </div>
);