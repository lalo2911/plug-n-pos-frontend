import { CardContent } from "@/components/ui/card";
import { Store, Users } from "lucide-react";

function RoleSelection({ selectedRole, onRoleSelect }) {
    return (
        <CardContent className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                    className={`cursor-pointer p-6 border rounded-lg transition-all hover:border-black hover:bg-gray-100`}
                    onClick={() => onRoleSelect('owner')}
                >
                    <div className="flex items-center justify-center mb-4">
                        <Store size={48} />
                    </div>
                    <h3 className="text-xl font-medium text-center">Dueño del negocio</h3>
                    <p className="text-gray-500 text-center mt-2">
                        Acceso completo a todas las funciones y configuraciones del sistema
                    </p>
                </div>

                <div
                    className={`cursor-pointer p-6 border rounded-lg transition-all hover:border-blue-900 hover:bg-blue-50`}
                    onClick={() => onRoleSelect('employee')}
                >
                    <div className="flex items-center justify-center mb-4">
                        <Users size={48} />
                    </div>
                    <h3 className="text-xl font-medium text-center">Empleado</h3>
                    <p className="text-gray-500 text-center mt-2">
                        Acceso a funciones básicas para la operación diaria
                    </p>
                </div>
            </div>
        </CardContent>
    );
}

export default RoleSelection;