"use client";

import { MEETUPS } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { CTAButton } from "@/components/cta-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, MapPin, Users, Share2, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, use } from "react";
import { useAuth } from "@/components/auth-context";

export default function MeetupPage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap params using React.use()
    const { id } = use(params);
    const meetupId = parseInt(id);
    const meetup = MEETUPS.find((m) => m.id === meetupId);

    const { user, openAuthModal } = useAuth();
    // const [isAuthOpen, setIsAuthOpen] = useState(false); // Removed local state

    if (!meetup) {
        return notFound();
    }

    return (
        <>
            <Navbar />
            {/* AuthModal is now global in AuthProvider */}

            <main className="min-h-screen bg-background pt-24 pb-12">
                {/* Back Button */}
                <div className="container mx-auto px-4 mb-6">
                    <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>
                </div>

                <div className="container mx-auto px-4">
                    {/* Hero Section */}
                    <div className="relative w-full aspect-[21/9] md:aspect-[21/8] rounded-[2rem] overflow-hidden shadow-2xl mb-12">
                        <Image
                            src={meetup.image}
                            alt={meetup.title}
                            fill
                            className="object-cover"
                            priority
                            unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                        <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 text-white">
                            <div className="flex gap-2 mb-4">
                                {meetup.tags?.map(tag => (
                                    <Badge key={tag} className="bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30">{tag}</Badge>
                                ))}
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black mb-2">{meetup.title}</h1>
                            <p className="text-xl text-white/90 font-medium flex items-center gap-2">
                                <MapPin className="w-5 h-5" /> {meetup.location}
                            </p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Left Column: Details */}
                        <div className="lg:col-span-2 space-y-12">

                            {/* Quick Info Bar */}
                            <div className="flex flex-wrap gap-6 md:gap-12 p-6 bg-muted/30 rounded-3xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground font-bold uppercase">Time</p>
                                        <p className="font-semibold">{meetup.time}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground font-bold uppercase">Attendees</p>
                                        <p className="font-semibold">{meetup.attendees} Going</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground font-bold uppercase">Date</p>
                                        <p className="font-semibold">This Weekend</p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h2 className="text-2xl font-bold mb-6">About this Vibe</h2>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    {meetup.description || "Join us for an amazing time to connect with like-minded people. This event is created to foster community and good vibes. Don't miss out!"}
                                </p>
                            </div>

                            {/* Attendees Preview */}
                            <div>
                                <h2 className="text-2xl font-bold mb-6">Who's Going</h2>
                                <div className="flex -space-x-4 overflow-hidden py-4 pl-2">
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <Avatar key={i} className="border-4 border-background w-14 h-14">
                                            <AvatarImage src={`https://i.pravatar.cc/150?u=${meetup.id + i}`} />
                                            <AvatarFallback>U{i}</AvatarFallback>
                                        </Avatar>
                                    ))}
                                    <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center border-4 border-background text-sm font-bold text-muted-foreground">
                                        +{meetup.attendees - 6}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Sticky Sidebar with CTA & Map */}
                        <div className="relative">
                            <div className="sticky top-32 space-y-6">
                                {/* CTA Card */}
                                <div className="p-8 rounded-3xl border border-gray-100 shadow-xl bg-white text-center space-y-6">
                                    <h3 className="text-2xl font-bold">Ready to join?</h3>
                                    <p className="text-muted-foreground">Secure your spot now. It's free!</p>

                                    <CTAButton
                                        glow
                                        className="w-full text-lg h-14"
                                        onClick={() => {
                                            if (!user) {
                                                openAuthModal({ defaultTab: "signup", title: "Sign up to attend this event" });
                                            } else {
                                                alert("You have joined this meetup!");
                                            }
                                        }}
                                    >
                                        Join This Meetup
                                    </CTAButton>

                                    <Link href="/meetups" className="block w-full">
                                        <Button variant="outline" className="w-full h-14 rounded-full font-semibold text-lg hover:bg-gray-50 border-2">
                                            Browse More Meetups
                                        </Button>
                                    </Link>

                                    <div className="pt-4 border-t">
                                        <Button variant="ghost" className="w-full gap-2 text-muted-foreground">
                                            <Share2 className="w-4 h-4" /> Share Event
                                        </Button>
                                    </div>
                                </div>

                                {/* Map Card */}
                                <div className="rounded-3xl overflow-hidden border border-gray-100 shadow-lg h-[300px] relative">
                                    {meetup.mapUrl ? (
                                        <iframe
                                            src={meetup.mapUrl}
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                                            Map Placeholder
                                        </div>
                                    )}
                                </div>
                                <p className="text-center text-sm text-muted-foreground font-medium">
                                    <MapPin className="w-3 h-3 inline mr-1" />
                                    {meetup.address || meetup.location}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
