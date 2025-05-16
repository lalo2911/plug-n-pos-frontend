import { useState, useEffect } from 'react';
import PageHeader from '../PageHeader';
import { useBusiness } from '../../../hooks/useBusiness';
import { toast } from "sonner";

import BusinessForm from './BusinessForm';
import OwnerInfo from './OwnerInfo';
import InviteCodes from './InviteCodes';

function BusinessSettings() {
    const [businessData, setBusinessData] = useState({ name: '', address: '', phone: '' });
    const [businessInfo, setBusinessInfo] = useState({ owner: '', email: '', noEmployees: 0, noCodes: 0 });
    const [copiedCode, setCopiedCode] = useState(null);

    const { userBusiness: business, isLoading, error, updateBusiness, generateInviteCode } = useBusiness();

    useEffect(() => {
        if (business) {
            setBusinessData({ name: business.name || '', address: business.address || '', phone: business.phone || '' });
            setBusinessInfo({
                owner: business.owner?.name || '',
                email: business.owner?.email || '',
                noEmployees: business.employees?.length || 0,
                noCodes: business.inviteCodes?.length || 0
            });
        }
    }, [business]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBusinessData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updateData = { ...businessData };
        updateBusiness.mutate(
            { id: business._id, data: updateData },
            {
                onSuccess: () => toast.success("Negocio actualizado", { description: "Los datos han sido actualizados" }),
                onError: (error) => toast.error("Error", {
                    description: error.response?.data?.message || "No se pudo actualizar el negocio",
                })
            }
        );
    };

    const handleGenerateInviteCode = () => {
        generateInviteCode.mutate({}, {
            onSuccess: () => toast.success("Código generado"),
            onError: (error) => toast.error("Error", {
                description: error.response?.data?.message || "No se pudo generar el código",
            })
        });
    };

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 3000);
        toast.success("Código copiado");
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Configuración del Negocio"
                description="Administra la información de tu negocio y códigos de invitación"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <BusinessForm
                    businessData={businessData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    updateBusiness={updateBusiness}
                    isLoading={isLoading}
                    error={error}
                />
                <OwnerInfo businessInfo={businessInfo} />
                <InviteCodes
                    business={business}
                    handleGenerateInviteCode={handleGenerateInviteCode}
                    copyToClipboard={copyToClipboard}
                    generateInviteCode={generateInviteCode}
                    copiedCode={copiedCode}
                />
            </div>
        </div>
    );
}

export default BusinessSettings;
