import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

type ButtonProps = React.ComponentProps<typeof Button>;

interface CTAButtonProps extends ButtonProps {
    children: React.ReactNode;
    withArrow?: boolean;
    glow?: boolean;
}

export function CTAButton({
    children,
    className,
    withArrow = false,
    glow = false,
    variant = "default",
    ...props
}: CTAButtonProps) {
    return (
        <Button
            variant={variant}
            size="lg"
            className={cn(
                "font-semibold rounded-full transition-all duration-300",
                glow && "shadow-[0_0_20px_rgba(106,13,173,0.3)] hover:shadow-[0_0_25px_rgba(106,13,173,0.5)]",
                className
            )}
            {...props}
        >
            {children}
            {withArrow && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
    );
}
