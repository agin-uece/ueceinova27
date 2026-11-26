// src/components/ui/FormGroup.tsx

interface FormGroupProps {
    label: string;
    children: React.ReactNode;
    helperText?: string;
    error?: string | null;
}

export function FormGroup({ label, children, helperText, error }: FormGroupProps) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                {label}
            </label>
            {children}
            {error && (
                <span role="alert" className="text-[11px] font-semibold text-red-600 ml-1">
                    {error}
                </span>
            )}
            {helperText && <span className="text-[10px] text-gray-400 italic ml-1">{helperText}</span>}
        </div>
    );
}