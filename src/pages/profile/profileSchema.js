import { z } from 'zod';

export const profileSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Correo electrónico inválido'),
    currentPassword: z.string().optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.password && data.password.length > 0) {
        if (data.password.length < 6) {
            ctx.addIssue({
                code: z.ZodIssueCode.too_small,
                minimum: 6,
                type: "string",
                inclusive: true,
                path: ["password"],
                message: "La nueva contraseña debe tener al menos 6 caracteres"
            });
        }

        if (!data.confirmPassword || data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["confirmPassword"],
                message: "Las contraseñas no coinciden"
            });
        }
    }
});