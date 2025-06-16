import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Loader2 } from "lucide-react";
import { PersonalInfoForm } from './PersonalInfoForm';
import { PasswordSection } from './PasswordSection';

export function ProfileForm({
    form,
    onSubmit,
    mutation,
    watchPassword,
    isLocalAccount,
    isOwner
}) {
    const { register, handleSubmit, formState: { errors }, reset, watch } = form;

    return (
        <Card className="lg:col-span-2">
            <CardHeader className="mt-4">
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Configuración del Perfil
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 mb-4">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <PersonalInfoForm
                        register={register}
                        errors={errors}
                        isGoogleAccount={!isLocalAccount}
                    />

                    {!isOwner && <Separator />}

                    {isLocalAccount && (
                        <PasswordSection
                            register={register}
                            errors={errors}
                            watchPassword={watchPassword}
                            reset={reset}
                            watch={watch}
                        />
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button
                            type="submit"
                            className="flex-1 gap-2"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                'Guardar Cambios'
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}