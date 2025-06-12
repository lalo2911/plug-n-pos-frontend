import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useProfile } from '@/hooks/useProfile';
import { UserInfoCard } from './UserInfoCard';
import { ProfileForm } from './ProfileForm';

function Profile() {
    const {
        form,
        updateProfileMutation,
        onSubmit,
        watchPassword,
        currentUser
    } = useProfile();

    // Verificar si el usuario es owner
    const isOwner = currentUser?.role === 'owner';

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Botón de regreso */}
            {!isOwner && (
                <div className="mb-6">
                    <Button variant="ghost" asChild className="gap-2">
                        <Link to="/">
                            <ArrowLeft className="h-4 w-4" />
                            Regresar
                        </Link>
                    </Button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <UserInfoCard user={currentUser} />

                <ProfileForm
                    form={form}
                    onSubmit={onSubmit}
                    mutation={updateProfileMutation}
                    watchPassword={watchPassword}
                    isLocalAccount={currentUser?.authSource === 'local'}
                    isOwner={isOwner}
                />
            </div>
        </div>
    );
}

export default Profile;