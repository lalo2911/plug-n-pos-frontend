import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Building2, MapPin, Phone, Save, Loader2 } from "lucide-react";

const BusinessForm = ({ businessData, handleChange, handleSubmit, updateBusiness, isLoading, error }) => {
    return (
        <Card className="md:col-span-2">
            <CardHeader className="mt-4">
                <CardTitle className="flex items-center">
                    <Building2 className="mr-2 h-5 w-5" />
                    Información del Negocio
                </CardTitle>
                <CardDescription>Actualiza los datos básicos de tu negocio</CardDescription>
            </CardHeader>
            <CardContent className="mb-4">
                {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-red-500">Error al cargar los datos del negocio</div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre del negocio</Label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="name"
                                    name="name"
                                    className="pl-10"
                                    value={businessData.name}
                                    onChange={handleChange}
                                    placeholder="Nombre de tu negocio"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Dirección</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Textarea
                                    id="address"
                                    name="address"
                                    className="pl-10 min-h-[80px] resize-none"
                                    value={businessData.address}
                                    onChange={handleChange}
                                    placeholder="Dirección de tu negocio"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="phone"
                                    name="phone"
                                    className="pl-10"
                                    value={businessData.phone}
                                    onChange={handleChange}
                                    placeholder="Teléfono de contacto"
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={updateBusiness.isPending}>
                            {updateBusiness.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" /> Guardar Cambios
                                </>
                            )}
                        </Button>
                    </form>
                )}
            </CardContent>
        </Card>
    );
};

export default BusinessForm;
