"use client";

import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";

import { SPOTS, Spot } from "@/lib/data";

export function SpotsCarousel() {
    const [emblaRef] = useEmblaCarousel({ align: "start", loop: false, dragFree: true });

    return (
        <div className="w-full overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6 pl-4 md:pl-24 py-10">
                {SPOTS.map((spot: Spot, index: number) => (
                    <Link href={`/places/${spot.id}`} key={spot.id} className="flex-[0_0_85%] md:flex-[0_0_350px]">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-500 will-change-transform"
                        >
                            <Image
                                src={spot.image}
                                alt={spot.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                            <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                <span className="text-xs font-bold text-white">{spot.rating}</span>
                            </div>

                            <div className="absolute bottom-0 left-0 w-full p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <p className="text-secondary font-medium text-sm mb-1">{spot.type}</p>
                                <h3 className="text-2xl font-bold mb-3">{spot.name}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {spot.vibe.map((v) => (
                                        <Badge key={v} variant="outline" className="border-white/30 text-white hover:bg-white/20">
                                            {v}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
