"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SPOTS, MEETUPS } from "@/lib/data";
import { MapPin, Star, Calendar, ArrowLeft, Plus, Users, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/components/auth-context";

import { SpotImage } from "@/components/spot-image";

export default function PlaceDetailsPage({ params }: { params: Promise<{ id: string }> }) {

    const { id } = use(params);
    const spotId = parseInt(id);
    const spot = SPOTS.find((s) => s.id === spotId);

    // Auth context for handling joins (if strictly needed inline, but linking to meetup page is safer)
    const { user, openAuthModal } = useAuth();

    if (!spot) {
        return notFound();
    }

    // Filter relevant meetups: precise or partial match on location
    const relatedMeetups = MEETUPS.filter(m =>
        m.location === spot.location ||
        m.location.includes(spot.name) ||
        spot.location?.includes(m.location) ||
        (spot.location && m.address && m.address.includes(spot.location))
    );

    // Mock "Interior Photos" by picking other images from data or placeholders
    const galleryImages = [
        spot.image, // Main image
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000",
        "https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=1000"
    ];

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            <main className="pt-32 pb-20">
                <div className="container mx-auto px-4">
                    {/* Back Button */}
                    <Link href="/meetups" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
                        <ArrowLeft className="w-4 h-4" /> Back to Explore
                    </Link>

                    {/* Hero Section */}
                    <div className="grid lg:grid-cols-2 gap-12 mb-16">
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0 text-sm px-3 py-1">
                                    {spot.type}
                                </Badge>
                                <div className="flex items-center gap-1 text-amber-500 font-bold">
                                    <Star className="w-4 h-4 fill-amber-500" />
                                    {spot.rating}
                                </div>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-black">{spot.name}</h1>

                            <div className="flex items-center gap-2 text-muted-foreground text-lg">
                                <MapPin className="w-5 h-5" />
                                {spot.location}
                                {spot.distance && <span className="text-sm bg-gray-100 px-2 py-0.5 rounded-full ml-2">{spot.distance}km away</span>}
                            </div>

                            <div className="flex flex-wrap gap-2 pt-2">
                                {spot.vibe.map((tag) => (
                                    <Badge key={tag} variant="outline" className="px-3 py-1 text-sm">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>

                            <p className="text-lg text-muted-foreground leading-relaxed pt-4">
                                Experience the unique atmosphere of {spot.name}. A perfect destination for
                                {spot.vibe.join(", ").toLowerCase()} lovers.
                                Whether you're looking to meet new people or just enjoy the vibe, this is the place to be.
                            </p>
                        </div>

                        <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl bg-gray-100">
                            <SpotImage
                                src={spot.image}
                                alt={spot.name}
                                className="object-cover"
                            />
                        </div>
                    </div>

                    {/* Gallery Section */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold mb-6">Inside the Vibe</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {galleryImages.map((img, i) => (
                                <div key={i} className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden group bg-gray-100">
                                    <SpotImage
                                        src={img}
                                        alt={`${spot.name} interior ${i + 1}`}
                                        className="transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Location Section */}
                    <div className="mb-16">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            {/* Left: Info */}
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold">Getting There</h2>

                                <div className="p-6 bg-muted/30 rounded-3xl border border-gray-100 space-y-4">
                                    <div>
                                        <h3 className="text-base font-bold mb-1 flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-primary" /> Location
                                        </h3>
                                        <p className="text-muted-foreground">{spot.address || spot.location}</p>
                                    </div>
                                    <div className="pt-4 border-t border-gray-100">
                                        <h3 className="text-base font-bold mb-1">Transit & Parking</h3>
                                        <p className="text-muted-foreground text-sm">Centrally located in {spot.location}. Accessible via public transport. Street parking available nearby.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Map */}
                            <div className="relative h-[250px] rounded-3xl overflow-hidden shadow-lg border border-gray-100">
                                {spot.mapUrl ? (
                                    <iframe
                                        src={spot.mapUrl}
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
                        </div>
                    </div>

                    {/* Meetups Section */}
                    <div className="bg-muted/30 rounded-[3rem] p-8 md:p-12 border border-gray-100">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                                <div>
                                    <h2 className="text-3xl font-bold mb-2">Upcoming Meetups</h2>
                                    <p className="text-muted-foreground">Join others or start your own vibe here.</p>
                                </div>
                                {relatedMeetups.length > 0 && (
                                    <Link href={`/create-meetup?location=${encodeURIComponent(spot.name)}`}>
                                        <Button variant="outline" className="rounded-full h-12 px-6">
                                            <Plus className="w-4 h-4 mr-2" /> Host a Meetup Here
                                        </Button>
                                    </Link>
                                )}
                            </div>

                            {relatedMeetups.length > 0 ? (
                                <div className="grid gap-6">
                                    {relatedMeetups.map((meetup) => (
                                        <div key={meetup.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center gap-6">
                                            <div className="relative w-full md:w-32 h-32 md:h-24 rounded-2xl overflow-hidden shrink-0">
                                                <Image
                                                    src={meetup.image}
                                                    alt={meetup.title}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-2">
                                                    <Calendar className="w-3 h-3" /> {meetup.time}
                                                </div>
                                                <h3 className="text-xl font-bold mb-1">{meetup.title}</h3>
                                                <p className="text-muted-foreground text-sm line-clamp-1">{meetup.description}</p>
                                            </div>

                                            <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-0">
                                                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                                    <Users className="w-4 h-4" /> {meetup.attendees}
                                                </div>
                                                <Link href={`/meetup/${meetup.id}`}>
                                                    <Button className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-6">
                                                        Join Vibe
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 px-6 bg-white rounded-3xl border border-dashed border-gray-200">
                                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                                        <Calendar className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">No meetups scheduled yet</h3>
                                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                                        Be the first to bring the vibe to {spot.name}! Host a meetup and invite others to join you.
                                    </p>
                                    <Link href={`/create-meetup?location=${encodeURIComponent(spot.name)}`}>
                                        <Button size="lg" className="h-14 px-8 rounded-full text-lg shadow-xl shadow-primary/20">
                                            <Plus className="w-5 h-5 mr-2" />
                                            Create Meetup at {spot.name}
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
