"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Heart, Search, Filter, MessageCircle, Star } from "lucide-react";
import Image from "next/image";

interface FeatureDemoModalProps {
    isOpen: boolean;
    onClose: () => void;
    feature: string | null;
}

export function FeatureDemoModal({ isOpen, onClose, feature }: FeatureDemoModalProps) {
    if (!feature) return null;

    const renderContent = () => {
        switch (feature) {
            case "Place Discovery":
            case "Discover Places":
                return (
                    <div className="space-y-4">
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200 cursor-pointer">☕ Cozy Cafe</Badge>
                            <Badge variant="outline" className="cursor-pointer">🍸 Rooftop Bar</Badge>
                            <Badge variant="outline" className="cursor-pointer">🎨 Art Gallery</Badge>
                            <Badge variant="outline" className="cursor-pointer">🌳 Park</Badge>
                        </div>
                        <div className="relative h-64 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                            {/* Mock Map UI */}
                            <div className="absolute inset-0 bg-slate-100 opacity-50 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]" />

                            {/* Pins */}
                            <div className="absolute top-1/4 left-1/4 animate-bounce hover:scale-110 transition-transform cursor-pointer">
                                <div className="bg-primary text-white p-2 rounded-full shadow-lg">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white text-xs px-2 py-1 rounded shadow-md whitespace-nowrap font-medium"> The Nook Cafe</div>
                            </div>

                            <div className="absolute bottom-1/3 right-1/3 hover:scale-110 transition-transform cursor-pointer">
                                <div className="bg-secondary text-secondary-foreground p-2 rounded-full shadow-lg">
                                    <Users className="w-5 h-5" />
                                </div>
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white text-xs px-2 py-1 rounded shadow-md whitespace-nowrap font-medium"> Tech Mixer (5 ppl)</div>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground text-center">
                            Actual interface will feature a live map with real-time vibe checks.
                        </p>
                    </div>
                );

            case "Vibe Matching":
            case "Join Meetups":
                return (
                    <div className="space-y-4">
                        <div className="p-4 border rounded-xl bg-white shadow-sm flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                                JD
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-lg">John Doe</h4>
                                        <p className="text-sm text-muted-foreground">Software Engineer • 26</p>
                                    </div>
                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200">95% Match</Badge>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <Badge variant="outline" className="text-xs">🎵 Jazz</Badge>
                                    <Badge variant="outline" className="text-xs">⛰️ Hiking</Badge>
                                    <Badge variant="outline" className="text-xs">☕ Coffee</Badge>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <Button className="w-full bg-primary hover:bg-primary/90">Request to Connect</Button>
                        </div>
                    </div>
                );

            case "Saved Spots":
            case "Build Community":
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="border rounded-xl overflow-hidden shadow-sm">
                                <div className="h-24 bg-gray-200 animate-pulse" />
                                <div className="p-3">
                                    <div className="flex justify-between">
                                        <h5 className="font-semibold text-sm">Hidden Loft</h5>
                                        <Heart className="w-4 h-4 fill-primary text-primary" />
                                    </div>
                                    <div className="flex items-center gap-1 mt-1">
                                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                        <span className="text-xs text-muted-foreground">4.8 (120)</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );

            default:
                return (
                    <div className="py-8 text-center">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground">Detailed preview for <strong>{feature}</strong> is coming soon!</p>
                        <Button className="mt-4" onClick={onClose} variant="outline">Close</Button>
                    </div>
                );
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <span className="bg-primary/10 p-1.5 rounded-lg text-primary">
                            {/* Icon could be dynamic but simple is fine */}
                            ✨
                        </span>
                        Demo: {feature}
                    </DialogTitle>
                    <DialogDescription>
                        Preview of how this feature works in the Vibe & Meet app.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-2">
                    {renderContent()}
                </div>
            </DialogContent>
        </Dialog>
    );
}
