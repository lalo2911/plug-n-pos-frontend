import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function FormField({
    id,
    label,
    type = "text",
    placeholder,
    tabIndex,
    register,
    error,
    extraContent
}) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <Label htmlFor={id}>{label}</Label>
                {extraContent}
            </div>
            <Input
                id={id}
                type={type}
                placeholder={placeholder}
                tabIndex={tabIndex}
                {...register}
            />
            {error && (
                <p className="text-sm text-destructive">{error.message}</p>
            )}
        </div>
    );
}

export default FormField;