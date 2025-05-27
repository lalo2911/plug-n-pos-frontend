import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

function AuthLayout({ title, description, children, footerContent }) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 select-none">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-2 text-center mt-4">
                    <CardTitle className="text-3xl font-bold">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    {children}
                </CardContent>

                {footerContent && (
                    <CardFooter className="flex justify-center mb-4">
                        {footerContent}
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}

export default AuthLayout;