import { useMediaQuery } from "@/hooks/use-media-query"
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ResponsiveModal({
    isOpen,
    setIsOpen,
    title,
    description,
    children,
    footer,
    maxHeight = "90vh",
    scrollable = true,
}) {
    const isMobile = useMediaQuery("(max-width: 768px)")

    if (isMobile) {
        return (
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerContent className="max-h-[95vh] select-none">
                    <DrawerHeader className="text-left">
                        <DrawerTitle>{title}</DrawerTitle>
                        {description && <DrawerDescription>{description}</DrawerDescription>}
                    </DrawerHeader>
                    <div className="flex-1 overflow-y-auto px-4">
                        <div className="py-2 space-y-4 pb-6">{children}</div>
                    </div>
                    {footer && <DrawerFooter className="pt-2">{footer}</DrawerFooter>}
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-2xl select-none" style={{ maxHeight }}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                {scrollable ? (
                    <ScrollArea className="max-h-[60vh]">
                        <div className="space-y-4 py-2 pr-4 pl-1">{children}</div>
                    </ScrollArea>
                ) : (
                    <div className="space-y-4 py-2">{children}</div>
                )}
                {footer && <DialogFooter className="pt-4">{footer}</DialogFooter>}
            </DialogContent>
        </Dialog>
    )
}
