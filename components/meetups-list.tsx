import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, ArrowUpRight, Users } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { MEETUPS } from "@/lib/data";

export function MeetupsList() {
    const [activeId, setActiveId] = useState(MEETUPS[0].id);

    return (
        <div className="flex flex-col lg:flex-row gap-12 lg:h-[600px]">
            {/* Left: List */}
            <div className="flex-1 flex flex-col justify-center space-y-2">
                {MEETUPS.map((meetup) => (
                    <Link href={`/meetup/${meetup.id}`} key={meetup.id} className="block">
                        <div
                            onMouseEnter={() => setActiveId(meetup.id)}
                            className="group relative p-6 cursor-pointer border-b border-gray-100 last:border-0 hover:bg-muted/30 transition-colors rounded-xl"
                        >
                            <div className="flex justify-between items-start md:items-center relative z-10">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2 text-muted-foreground text-sm font-medium uppercase tracking-wider">
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {meetup.time}</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {meetup.location}</span>
                                    </div>
                                    <h3 className={cn(
                                        "text-3xl md:text-5xl font-bold transition-colors duration-300",
                                        activeId === meetup.id ? "text-primary" : "text-gray-300 group-hover:text-gray-500"
                                    )}>
                                        {meetup.title}
                                    </h3>
                                </div>

                                <div className="flex flex-col items-end gap-2 pl-4">
                                    <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:rotate-45 transition-transform duration-300 bg-white">
                                        <ArrowUpRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            {/* Quick stats showing on active only */}
                            <motion.div
                                initial={false}
                                animate={{ height: activeId === meetup.id ? "auto" : 0, opacity: activeId === meetup.id ? 1 : 0 }}
                                className="overflow-hidden"
                            >
                                <div className="pt-4 flex items-center gap-4">
                                    <Badge variant="secondary" className="bg-white border">
                                        <Users className="w-3 h-3 mr-1" /> {meetup.attendees} Going
                                    </Badge>
                                    {meetup.tags.map(tag => (
                                        <Badge key={tag} variant="outline" className="text-muted-foreground">{tag}</Badge>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Right: Sticky Image Preview */}
            <div className="hidden lg:block w-[450px] relative h-full">
                <div className="sticky top-0 w-full h-full rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                    <AnimatePresence mode="popLayout">
                        {MEETUPS.map((meetup) => (
                            meetup.id === activeId && (
                                <motion.div
                                    key={meetup.id}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="absolute inset-0 w-full h-full"
                                >
                                    <Image
                                        src={meetup.image}
                                        alt={meetup.title}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                    {/* Overlay info */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                </motion.div>
                            )
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
