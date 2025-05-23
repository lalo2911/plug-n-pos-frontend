import { Button } from "@/components/ui/button";
import { CheckCircle, Copy, X } from "lucide-react";

const InviteCodeItem = ({ code, onCopy, copied, used = false }) => (
    <div className={`flex items-center justify-between p-3 bg-gray-50 rounded-md ${used ? "opacity-70" : ""}`}>
        <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${used ? "bg-gray-200" : "bg-green-100"}`}>
                {used ? <X className="h-4 w-4 text-gray-600" /> : <CheckCircle className="h-4 w-4 text-green-600" />}
            </div>
            <div>
                <p className="font-mono font-medium">{code.code}</p>
                <p className="text-xs text-gray-500">
                    {used ? "Utilizado" : `Generado el ${new Date(code.createdAt).toLocaleDateString('es-MX')}`}
                </p>
            </div>
        </div>
        {!used && (
            <Button variant="ghost" size="sm" onClick={() => onCopy(code.code)}>
                {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
        )}
    </div>
);

export default InviteCodeItem;
