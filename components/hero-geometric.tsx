"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from "framer-motion";
import { CTAButton } from "@/components/cta-button";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, MessageCircle, Heart, Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";

export function HeroGeometric() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const yText = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    // Mouse Parallax Logic
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = clientX / innerWidth;
        const y = clientY / innerHeight;
        mouseX.set(x);
        mouseY.set(y);
    };

    return (
        <section
            ref={ref}
            onMouseMove={handleMouseMove}
            className="relative min-h-[100dvh] h-auto flex flex-col justify-center items-center overflow-hidden bg-white py-20 md:py-0"
        >
            {/* 1. Animated Mesh Gradient Background */}
            {/* 1. Animated Mesh Gradient Background (Optimized) */}
            <div className="absolute inset-0 z-0 bg-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(216,180,254,0.3),transparent_50%)] animate-pulse-slow" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(249,168,212,0.3),transparent_50%)] animate-pulse-slow delay-1000" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(191,219,254,0.3),transparent_50%)] animate-pulse-slow delay-700" />

                {/* Noise Overlay */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
            </div>

            <div className="container relative z-10 flex flex-col items-center">

                {/* Floating Elements (Parallax) */}
                <FloatingCard
                    mouseX={mouseX}
                    mouseY={mouseY}
                    depth={20}
                    className="absolute top-[15%] left-[5%] md:left-[10%] z-20 hidden md:block"
                >
                    <div className="bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/40 w-64 rotate-[-6deg]">
                        <div className="flex items-center gap-3 mb-3">
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-bold text-sm">Alex M.</p>
                                <p className="text-xs text-muted-foreground">Nearby • 2m ago</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">🎵 Jazz</span>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">☕ Coffee</span>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                            <span>95% Vibe Match</span>
                            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                        </div>
                    </div>
                </FloatingCard>

                <FloatingCard
                    mouseX={mouseX}
                    mouseY={mouseY}
                    depth={-15}
                    className="absolute bottom-[-150px] right-[5%] md:right-[10%] z-20 hidden md:block"
                >
                    <div className="bg-white/80 backdrop-blur-xl p-3 rounded-2xl shadow-2xl border border-white/40 w-56 rotate-[8deg]">
                        <div className="relative h-32 rounded-xl overflow-hidden mb-3">
                            <Image src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=1000&auto=format&fit=crop" alt="Cafe" fill className="object-cover" unoptimized />
                            <div className="absolute top-2 right-2 bg-white/90 px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> 4.9
                            </div>
                        </div>
                        <p className="font-bold">The Velvet Loft</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <MapPin className="w-3 h-3" /> <span>0.4 mi away</span>
                        </div>
                    </div>
                </FloatingCard>

                <FloatingCard
                    mouseX={mouseX}
                    mouseY={mouseY}
                    depth={40}
                    className="absolute top-[20%] right-[15%] z-0 opacity-60 hidden lg:block"
                >
                    <div className="bg-blue-500 text-white px-6 py-3 rounded-full rounded-bl-none shadow-xl text-lg font-medium rotate-[12deg]">
                        Anyone up for tennis? 🎾
                    </div>
                </FloatingCard>

                {/* Main Content */}
                <motion.div style={{ y: yText, opacity: opacityText }} className="text-center relative z-10 pt-24 md:pt-28">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/5 bg-white/50 backdrop-blur-sm shadow-sm mb-4 animate-fade-in-up">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-semibold text-gray-800">No swiping. Just vibing.</span>
                    </div>

                    <h1 className="text-[10vw] md:text-[5rem] lg:text-[7rem] font-black tracking-tighter leading-[0.85] mb-4 text-foreground select-none">
                        VIBE <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500">&</span><br />
                        MEET.
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-8 font-medium leading-relaxed">
                        The social app for <span className="text-foreground decoration-wavy underline decoration-primary/30">real life</span>. <br />
                        Find your crowd, join the plan, and go.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pb-8">
                        <CTAButton glow size="lg" className="px-8 h-14 text-lg rounded-full shadow-primary/25 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                            Download App
                        </CTAButton>
                    </div>
                </motion.div>
            </div>


        </section>
    );
}

function FloatingCard({ children, mouseX, mouseY, depth, className }: any) {
    const x = useTransform(mouseX, [0, 1], [-depth, depth]);
    const y = useTransform(mouseY, [0, 1], [-depth, depth]);

    return (
        <motion.div style={{ x, y }} className={className}>
            {children}
        </motion.div>
    );
}
