"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { MapPin, Users, Calendar, Bell, MessageCircle, Heart, ArrowUpRight } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const features = [
    {
        title: "Discover Hidden Gems",
        description: "Find curated spots that match your vibe perfectly.",
        icon: MapPin,
        className: "md:col-span-2",
        gradient: "from-violet-500 to-purple-500",
    },
    {
        title: "Real Vibe Matching",
        description: "Connect with people who share your energy.",
        icon: Users,
        className: "md:col-span-1",
        gradient: "from-blue-400 to-cyan-300",
    },
    {
        title: "Instant Plans",
        description: "Coordinate meetups in seconds.",
        icon: Calendar,
        className: "md:col-span-1",
        gradient: "from-amber-400 to-orange-500",
    },
    {
        title: "Live Communities",
        description: "Join active groups discussing what matters to you.",
        icon: MessageCircle,
        className: "md:col-span-2",
        gradient: "from-pink-500 to-rose-500",
    },
    {
        title: "Smart Alerts",
        description: "Never miss out when friends are nearby.",
        icon: Bell,
        className: "md:col-span-1",
        gradient: "from-emerald-400 to-green-500",
    },
    {
        title: "Curated Saves",
        description: "Build your personal wishlist of places.",
        icon: Heart,
        className: "md:col-span-2",
        gradient: "from-indigo-400 to-blue-500",
    },
];

export function FeaturesBento({ openDemo }: { openDemo: (feature: string) => void }) {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 perspective-[2000px]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, i) => (
                    <TiltCard key={i} feature={feature} openDemo={openDemo} index={i} />
                ))}
            </div>
        </div>
    );
}

function TiltCard({ feature, openDemo, index }: { feature: any, openDemo: any, index: number }) {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => openDemo(feature.title)}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={cn(
                "relative rounded-[2rem] p-6 cursor-pointer group h-[240px] flex flex-col justify-between overflow-hidden",
                feature.className,
                `bg-gradient-to-br ${feature.gradient}`
            )}
        >
            {/* Shadow Drop */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300 pointer-events-none" />

            {/* Big Arrow BG */}
            <div className="absolute -right-4 -top-4 opacity-20 transform rotate-12 group-hover:scale-110 group-hover:opacity-40 transition-all duration-500">
                <ArrowUpRight className="w-32 h-32 text-black" />
            </div>

            {/* Content */}
            <div className="relative z-10 transform translate-z-20">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6" />
                </div>

                <h3 className="text-2xl font-black text-white leading-tight mb-2 tracking-tight drop-shadow-md">
                    {feature.title}
                </h3>
                <p className="text-white/90 font-medium text-base leading-snug drop-shadow-sm">
                    {feature.description}
                </p>
            </div>

            {/* Shine Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-30 pointer-events-none bg-gradient-to-tr from-transparent via-white to-transparent transition-opacity duration-500" />
        </motion.div>
    );
}
