import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

const OwnerInfo = ({ businessInfo }) => (
    <Card>
        <CardHeader className="mt-4">
            <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Propietario
            </CardTitle>
            <CardDescription>Información del dueño del negocio</CardDescription>
        </CardHeader>
        <CardContent className="mb-4 space-y-4">
            {['owner', 'email', 'noEmployees', 'noCodes'].map((field) => (
                <div key={field}>
                    <p className="text-sm font-medium text-gray-500">{field === 'noEmployees' ? 'Empleados' : field === 'noCodes' ? 'Códigos' : field.charAt(0).toUpperCase() + field.slice(1)}</p>
                    <p>{businessInfo?.[field] || 'No disponible'}</p>
                </div>
            ))}
        </CardContent>
    </Card>
);

export default OwnerInfo;
