"use client";

import { X, MapPin, Sparkles, Briefcase, GraduationCap } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Person {
    id: number;
    name: string;
    age: number;
    images: string[];
    location: string;
    bio: string;
    interests: string[];
    match: number;
    // Add mock additional fields
    job?: string;
    school?: string;
}

interface ProfileModalProps {
    person: Person | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ProfileModal({ person, isOpen, onClose }: ProfileModalProps) {
    if (!person) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            {/* 
               Responsive Layout Constraints:
               - Mobile: max-w-md, h-[90vh], flex-col
               - Desktop: max-w-4xl, h-[600px] (fixed reasonable height), flex-row/grid
            */}
            <DialogContent className="max-w-md md:max-w-5xl w-full p-0 h-[90vh] md:h-[650px] gap-0 rounded-3xl border-0 overflow-hidden flex flex-col md:flex-row bg-background">
                <DialogTitle className="sr-only">Profile of {person.name}</DialogTitle>

                {/* --- LEFT COLUMN: IMAGES (Desktop) / TOP ROW (Mobile) --- */}
                {/* Mobile: h-[45%] | Desktop: w-[50%] h-full, scrollable if many images or fixed? 
                    User requested: "left image main photo, then below some more... gallery"
                    Let's make the left column a scrollable area if needed, or just a flex col.
                */}
                <div className="relative h-[45%] md:h-full md:w-[60%] shrink-0 bg-muted md:overflow-y-auto no-scrollbar group">
                    {/* Desktop: Grid of images? Or Main + Grid underneath? User said "left image main..., below gallery" */}

                    {/* Main Image Container */}
                    <div className="relative w-full h-full md:h-[400px]">
                        <Image
                            src={person.images[0]}
                            alt={person.name}
                            fill
                            className="object-cover object-top"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden" />
                    </div>

                    {/* Desktop Only: Gallery appearing BELOW the main image in the same column */}
                    <div className="hidden md:block p-4 space-y-4">
                        <h4 className="font-semibold text-lg px-2">Gallery</h4>
                        <div className="grid grid-cols-2 gap-3">
                            {person.images.slice(1).map((img, i) => (
                                <div key={i} className="relative aspect-[4/5] rounded-xl overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity cursor-pointer">
                                    <Image
                                        src={img}
                                        alt={`Gallery ${i}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                            {/* Fallback if no extra images? */}
                            {person.images.length === 1 && (
                                <div className="col-span-2 text-center py-10 text-muted-foreground bg-gray-50 rounded-xl border border-dashed">
                                    No other photos
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Only Overlays (Close btn, Name info overlay) */}
                    <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-4 right-4 md:left-4 md:right-auto rounded-full z-20 shadow-md bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm md:bg-white md:text-black md:hover:bg-gray-100"
                        onClick={onClose}
                    >
                        <X className="w-5 h-5" />
                    </Button>

                    {/* Mobile Name Overlay */}
                    <div className="absolute bottom-0 left-0 p-6 text-white w-full z-10 md:hidden">
                        <div className="flex items-end justify-between mb-1 translate-y-2">
                            <div>
                                <h2 className="text-3xl font-bold leading-tight">
                                    {person.name}, {person.age}
                                </h2>
                                <div className="flex items-center text-white/90 text-sm mt-1">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {person.location}
                                </div>
                            </div>
                            <Badge className="bg-green-500 text-white border-0 text-xs px-2 py-0.5 mb-1 shrink-0">
                                {person.match}% Match
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT COLUMN: INFO (Desktop) / BOTTOM ROW (Mobile) --- */}
                <ScrollArea className="flex-1 h-full bg-background border-l border-border/0 md:border-border/50">
                    <div className="p-6 md:p-8 space-y-8">

                        {/* Desktop Header */}
                        <div className="hidden md:block space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-4xl font-extrabold text-foreground tracking-tight">
                                        {person.name}, <span className="text-muted-foreground">{person.age}</span>
                                    </h2>
                                    <div className="flex items-center text-muted-foreground mt-2">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        {person.location}
                                    </div>
                                </div>
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-0 text-sm px-3 py-1">
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    {person.match}% Match
                                </Badge>
                            </div>
                        </div>

                        {/* Bio Section */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">About</h3>
                            <p className="text-lg leading-relaxed text-foreground/90">
                                {person.bio}
                            </p>
                        </div>

                        {/* Details Section */}
                        {(person.job || person.school) && (
                            <div className="flex flex-wrap gap-4 text-sm">
                                {person.job && (
                                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-foreground/80">
                                        <Briefcase className="w-4 h-4 text-primary" />
                                        <span>{person.job}</span>
                                    </div>
                                )}
                                {person.school && (
                                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-foreground/80">
                                        <GraduationCap className="w-4 h-4 text-primary" />
                                        <span>{person.school}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Interests Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Interests</h3>
                            <div className="flex flex-wrap gap-2">
                                {person.interests.map((interest) => (
                                    <Badge
                                        key={interest}
                                        variant="outline"
                                        className="px-4 py-2 text-sm border-gray-200 dark:border-gray-700 font-medium"
                                    >
                                        {interest}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Mobile Only: Gallery Grid at bottom */}
                        {person.images.length > 1 && (
                            <div className="space-y-3 pt-4 border-t border-border md:hidden">
                                <h3 className="text-lg font-semibold">Gallery</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {person.images.slice(1).map((img, i) => (
                                        <div key={i} className="relative aspect-[3/4] rounded-xl overflow-hidden bg-muted">
                                            <Image
                                                src={img}
                                                alt={`${person.name} ${i + 2}`}
                                                fill
                                                className="object-cover hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Space for fixed footer on desktop */}
                        <div className="h-20 md:h-10"></div>
                    </div>
                </ScrollArea>

                {/* Fixed Action Bar */}
                <div className="p-4 md:p-6 border-t bg-background/80 backdrop-blur-md absolute bottom-0 right-0 w-full md:w-[40%] z-30">
                    <div className="flex justify-center gap-4">
                        <Button
                            variant="outline"
                            size="lg"
                            className="rounded-full flex-1 border-2 border-red-500/20 text-red-500 hover:bg-red-50 hover:border-red-500 hover:text-red-600 font-bold h-12"
                            onClick={onClose}
                        >
                            Pass
                        </Button>
                        <Button
                            size="lg"
                            className="rounded-full flex-1 bg-green-500 hover:bg-green-600 text-white font-bold h-12 shadow-lg shadow-green-200/50 dark:shadow-none"
                            onClick={() => {
                                onClose();
                            }}
                        >
                            Like Check
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
