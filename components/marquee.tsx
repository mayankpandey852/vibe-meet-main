"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MarqueeProps {
    items: string[];
    direction?: "left" | "right";
    speed?: number;
    className?: string;
}

export function Marquee({ items, direction = "left", speed = 20, className }: MarqueeProps) {
    return (
        <div className={cn("overflow-hidden flex bg-black text-white py-6", className)}>
            <motion.div
                className="flex whitespace-nowrap gap-12"
                animate={{
                    x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
                }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: speed,
                }}
            >
                {[...items, ...items, ...items, ...items].map((item, i) => ( // Repeat 4 times for seamless loop
                    <span key={i} className="text-4xl md:text-6xl font-black uppercase tracking-tighter opacity-80 hover:opacity-100 transition-opacity cursor-default">
                        {item} <span className="text-primary mx-4">•</span>
                    </span>
                ))}
            </motion.div>
        </div>
    );
}
