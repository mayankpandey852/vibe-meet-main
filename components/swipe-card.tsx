"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { X, Check, MapPin, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Person {
    id: number;
    name: string;
    images: string[];
    location: string;
    interests: string[];
    match: number;
    age: number;
    bio: string;
}

interface SwipeCardProps {
    person: Person;
    onSwipe: (direction: "left" | "right") => void;
    onViewProfile?: () => void;
    style?: any;
}

export function SwipeCard({ person, onSwipe, onViewProfile, style }: SwipeCardProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-30, 30]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

    // Color overlays for swipe feedback
    const likeOpacity = useTransform(x, [10, 150], [0, 1]);
    const nopeOpacity = useTransform(x, [-10, -150], [0, 1]);

    const handleDragEnd = (event: any, info: PanInfo) => {
        if (info.offset.x > 100) {
            onSwipe("right");
        } else if (info.offset.x < -100) {
            onSwipe("left");
        }
    };

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentImageIndex < person.images.length - 1) {
            setCurrentImageIndex(prev => prev + 1);
        }
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentImageIndex > 0) {
            setCurrentImageIndex(prev => prev - 1);
        }
    };

    return (
        <motion.div
            style={{ x, rotate, opacity, ...style }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className="absolute top-0 w-full max-w-sm h-[600px] bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden cursor-grab active:cursor-grabbing"
            whileDrag={{ scale: 1.05 }}
        >
            {/* Swipe Feedback Overlays */}
            <motion.div style={{ opacity: likeOpacity }} className="absolute top-8 left-8 z-20 transform -rotate-12 border-4 border-green-500 rounded-lg px-4 py-1">
                <span className="text-4xl font-bold text-green-500 uppercase">Like</span>
            </motion.div>
            <motion.div style={{ opacity: nopeOpacity }} className="absolute top-8 right-8 z-20 transform rotate-12 border-4 border-red-500 rounded-lg px-4 py-1">
                <span className="text-4xl font-bold text-red-500 uppercase">Nope</span>
            </motion.div>

            {/* Image Section */}
            <div className="relative h-3/5 w-full bg-gray-100">
                <Image
                    src={person.images[currentImageIndex]}
                    alt={person.name}
                    fill
                    className="object-cover pointer-events-none"
                />

                {/* Image Navigation */}
                <div className="absolute inset-x-0 top-0 h-full flex justify-between items-center px-2">
                    {currentImageIndex > 0 && (
                        <button onClick={prevImage} className="p-1 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                    )}
                    <div className="flex-1" /> {/* Spacer */}
                    {currentImageIndex < person.images.length - 1 && (
                        <button onClick={nextImage} className="p-1 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors">
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    )}
                </div>

                {/* Progress Indicators */}
                <div className="absolute top-4 inset-x-4 flex gap-1">
                    {person.images.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-colors ${i === currentImageIndex ? 'bg-white' : 'bg-white/30'}`}
                        />
                    ))}
                </div>

                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-6 pt-20 text-white">
                    <h2 className="text-3xl font-bold flex items-center gap-2">
                        {person.name}, {person.age}
                        <Badge className="bg-green-500 text-white border-0">{person.match}% Match</Badge>
                    </h2>
                    <p className="text-xs text-white/70 mt-1 flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full border border-white/50 flex items-center justify-center text-[10px]">i</span> Tap for more info
                    </p>
                </div>
            </div>

            {/* Info Section */}
            <div
                className="p-6 h-2/5 flex flex-col justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                onClick={(e) => {
                    // Prevent default or propagation if necessary, but we want this specific area to trigger profile
                    if (onViewProfile) onViewProfile();
                }}
            >
                <div>
                    <div className="flex items-center text-muted-foreground mb-4">
                        <MapPin className="w-4 h-4 mr-1" />
                        {person.location}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                        {person.bio}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {person.interests.map(interest => (
                            <Badge key={interest} variant="secondary" className="px-2 py-1">
                                {interest}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Action Buttons (Visual only, drag triggers action) */}
                <div className="flex justify-center gap-6 mt-4">
                    <Button variant="outline" size="icon" className="w-14 h-14 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 shadow-sm" onClick={() => onSwipe("left")}>
                        <X className="w-8 h-8" />
                    </Button>
                    <Button variant="outline" size="icon" className="w-14 h-14 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600 shadow-sm" onClick={() => onSwipe("right")}>
                        <Check className="w-8 h-8" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
