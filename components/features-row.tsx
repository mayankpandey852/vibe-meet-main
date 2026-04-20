"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { MapPin, Users, Calendar, Bell, MessageCircle, Heart, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const features = [
    {
        title: "Discover Hidden Gems",
        icon: MapPin,
        gradient: "from-violet-500 to-purple-500",
        rotate: "-2deg"
    },
    {
        title: "Real Vibe Matching",
        icon: Users,
        gradient: "from-blue-400 to-cyan-300",
        rotate: "1deg"
    },
    {
        title: "Instant Plans",
        icon: Calendar,
        gradient: "from-amber-400 to-orange-500",
        rotate: "-1.5deg"
    },
    {
        title: "Live Communities",
        icon: MessageCircle,
        gradient: "from-pink-500 to-rose-500",
        rotate: "2deg"
    },
    {
        title: "Smart Alerts",
        icon: Bell,
        gradient: "from-emerald-400 to-green-500",
        rotate: "-1deg"
    },
    {
        title: "Curated Saves",
        icon: Heart,
        gradient: "from-indigo-400 to-blue-500",
        rotate: "1.5deg"
    },
];

export function FeaturesRow({ openDemo }: { openDemo: (feature: string) => void }) {
    return (
        <div className="w-full max-w-[90rem] mx-auto px-4 md:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {features.map((feature, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20, rotate: 0 }}
                        whileInView={{ opacity: 1, y: 0, rotate: feature.rotate }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        onClick={() => openDemo(feature.title)}
                        whileHover={{ scale: 1.02, rotate: 0, zIndex: 10 }}
                        className={cn(
                            "relative w-full h-40 md:h-56 rounded-[1.5rem] p-4 cursor-pointer group flex flex-col items-center justify-center text-center shadow-lg hover:shadow-2xl transition-all duration-300",
                            `bg-gradient-to-br ${feature.gradient}`
                        )}
                    >
                        {/* Shine Effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 pointer-events-none bg-gradient-to-tr from-transparent via-white to-transparent transition-opacity duration-500 rounded-[1.5rem]" />

                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white mb-3 shadow-md group-hover:scale-110 transition-transform duration-300">
                            <feature.icon className="w-5 h-5 md:w-6 md:h-6" />
                        </div>

                        <h3 className="text-sm md:text-base font-bold text-white leading-tight drop-shadow-md px-1">
                            {feature.title}
                        </h3>

                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowUpRight className="w-4 h-4 text-white" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
