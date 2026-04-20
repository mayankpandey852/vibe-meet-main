"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface MotionSectionProps extends Omit<HTMLMotionProps<"section">, "children"> {
    children: React.ReactNode;
    delay?: number;
    viewportAmount?: number;
}

export function MotionSection({
    children,
    delay = 0,
    className,
    viewportAmount = 0.3,
    ...props
}: MotionSectionProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: viewportAmount }}
            transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
            className={cn(className)}
            {...props}
        >
            {children}
        </motion.section>
    );
}
