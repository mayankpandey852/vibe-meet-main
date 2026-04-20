"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { useAuth } from "@/components/auth-context";
import { getUserActivityData } from "@/lib/actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Loader2, Heart, Clock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function MyMeetupsPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{ myMeetups: any[], savedMeetups: any[] }>({ myMeetups: [], savedMeetups: [] });

    useEffect(() => {
        const fetchData = async () => {
            if (user?.email) {
                const res = await getUserActivityData(user.email);
                if (res.success) {
                    setData({
                        myMeetups: res.myMeetups,
                        savedMeetups: res.savedMeetups
                    });
                }
            }
            setLoading(false);
        };
        fetchData();
    }, [user]);

    if (!user) return <div className="min-h-screen flex items-center justify-center">Please log in</div>;

    // Filter Logic
    const now = new Date();
    // Assuming Meetup has a 'time' string, parsing might be tricky without standard Date object.
    // For this demo, let's assume 'time' is a future string or we just list all in Going for now unless logic is improved.
    // Ideally, we'd parse the date string.

    // Mock parsing or simple separation
    const going = data.myMeetups;
    const saved = data.savedMeetups;
    const past: any[] = []; // In real app, filter where date < now

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">
            <Navbar />
            <main className="pt-32 pb-20 px-4 max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">My Meetups</h1>

                {loading ? (
                    <div className="flex justify-center p-12"><Loader2 className="animate-spin w-8 h-8" /></div>
                ) : (
                    <Tabs defaultValue="going" className="w-full">
                        <TabsList className="mb-8">
                            <TabsTrigger value="going">Going ({going.length})</TabsTrigger>
                            <TabsTrigger value="saved">Favorites ({saved.length})</TabsTrigger>
                            <TabsTrigger value="past">Past</TabsTrigger>
                        </TabsList>

                        <TabsContent value="going">
                            {going.length === 0 ? <p className="text-muted-foreground p-8 text-center bg-white dark:bg-gray-900 rounded-3xl">You haven't joined any meetups yet.</p> : (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {going.map((meetup) => (
                                        <MeetupCard key={meetup.id} meetup={meetup} type="going" />
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="saved">
                            {saved.length === 0 ? <p className="text-muted-foreground p-8 text-center bg-white dark:bg-gray-900 rounded-3xl">No saved meetups.</p> : (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {saved.map((meetup) => (
                                        <MeetupCard key={meetup.id} meetup={meetup} type="saved" />
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="past">
                            <div className="p-8 text-center bg-white dark:bg-gray-900 rounded-3xl text-muted-foreground">
                                No past meetups found.
                            </div>
                        </TabsContent>
                    </Tabs>
                )}
            </main>
        </div>
    );
}

function MeetupCard({ meetup, type }: { meetup: any, type: string }) {
    return (
        <Link href={`/places/${meetup.id}`} className="group block bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-800">
            <div className="relative h-48">
                <Image src={meetup.image} alt={meetup.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    {type === "going" ? "Going" : "Saved"}
                </div>
            </div>
            <div className="p-5">
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">{meetup.title}</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> {meetup.time}
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> {meetup.location}
                    </div>
                </div>
            </div>
        </Link>
    );
}
