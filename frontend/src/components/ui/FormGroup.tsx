// src/components/ui/FormGroup.tsx

interface FormGroupProps {
    label: string;
    children: React.ReactNode;
    helperText?: string;
}

export function FormGroup({ label, children, helperText }: FormGroupProps) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                {label}
            </label>
            {children}
            {helperText && <span className="text-[10px] text-gray-400 italic ml-1">{helperText}</span>}
        </div>
    );
}