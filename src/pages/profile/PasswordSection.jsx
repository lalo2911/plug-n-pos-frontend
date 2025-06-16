import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, AlertCircle } from "lucide-react";

export function PasswordSection({ register, errors, watchPassword, reset, watch }) {
    const [showPasswordFields, setShowPasswordFields] = useState(false);

    const handlePasswordToggle = useCallback(() => {
        setShowPasswordFields(prev => !prev);
        if (!showPasswordFields) {
            reset({
                ...watch(),
                currentPassword: '',
                password: '',
                confirmPassword: '',
            });
        }
    }, [showPasswordFields, reset, watch]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Seguridad
                </h3>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handlePasswordToggle}
                >
                    {showPasswordFields ? 'Cancelar cambio' : 'Cambiar contraseña'}
                </Button>
            </div>

            {showPasswordFields && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">
                            Contraseña Actual *
                        </Label>
                        <Input
                            id="currentPassword"
                            type="password"
                            placeholder="Tu contraseña actual"
                            {...register('currentPassword', {
                                required: watchPassword && watchPassword.length > 0
                                    ? 'Debes ingresar tu contraseña actual'
                                    : false
                            })}
                            className="transition-all duration-200 focus:ring-2"
                        />
                        {errors.currentPassword && (
                            <p className="text-sm text-destructive flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.currentPassword.message}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Nueva Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Nueva contraseña"
                                {...register('password')}
                                className="transition-all duration-200 focus:ring-2"
                            />
                            {errors.password && (
                                <p className="text-sm text-destructive flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirma tu nueva contraseña"
                                {...register('confirmPassword')}
                                className="transition-all duration-200 focus:ring-2"
                            />
                            {errors.confirmPassword && (
                                <p className="text-sm text-destructive flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}