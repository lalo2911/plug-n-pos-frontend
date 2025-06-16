import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, Mail } from "lucide-react";

export function UserInfoCard({ user }) {
    return (
        <Card className="lg:col-span-1 h-fit">
            <CardContent className="p-6 my-4">
                <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-24 w-24 ring-4 ring-primary/10">
                        <AvatarImage
                            src={user?.avatar}
                            alt={user?.name}
                            className="object-cover"
                        />
                        <AvatarFallback className="text-2xl font-semibold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="text-center space-y-2 w-full">
                        <h2 className="text-xl font-semibold">{user?.name}</h2>
                        <p className="text-sm text-muted-foreground break-all">
                            {user?.email}
                        </p>

                        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-full px-3 py-1">
                            {user?.authSource === 'google' ? (
                                <>
                                    <Shield className="h-3 w-3" />
                                    Cuenta de Google
                                </>
                            ) : (
                                <>
                                    <Mail className="h-3 w-3" />
                                    Cuenta local
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
