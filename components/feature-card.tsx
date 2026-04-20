import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    className?: string;
    delay?: number;
    onClick?: () => void;
}

export function FeatureCard({
    icon: Icon,
    title,
    description,
    className,
    onClick,
}: FeatureCardProps) {
    return (
        <Card
            onClick={onClick}
            className={cn(
                "border-none shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white hover:border-primary/20",
                onClick && "cursor-pointer active:scale-95",
                className
            )}
        >
            <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl font-semibold">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                    {description}
                </p>
            </CardContent>
        </Card>
    );
}
