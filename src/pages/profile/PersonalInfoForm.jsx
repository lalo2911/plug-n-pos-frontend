import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, AlertCircle } from "lucide-react";

export function PersonalInfoForm({ register, errors, isGoogleAccount }) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Información Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Nombre Completo
                    </Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="Tu nombre"
                        {...register('name')}
                        className="transition-all duration-200 focus:ring-2"
                    />
                    {errors.name && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.name.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Correo Electrónico
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="nombre@ejemplo.com"
                        {...register('email')}
                        disabled={isGoogleAccount}
                        className="transition-all duration-200 focus:ring-2"
                    />
                    {errors.email && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.email.message}
                        </p>
                    )}
                    {isGoogleAccount && (
                        <p className="text-xs text-muted-foreground">
                            El correo no se puede cambiar para cuentas de Google
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}