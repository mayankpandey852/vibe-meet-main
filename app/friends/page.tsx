"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Sparkles, MessageCircle, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChatWindow } from "@/components/chat-window";
import { SwipeCard } from "@/components/swipe-card";
import { ProfileModal } from "@/components/profile-modal";

// Mock Data: My Friends
const MY_FRIENDS = [
    {
        id: 101,
        name: "Alice Freeman",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
        location: "San Francisco, CA",
        status: "online",
        lastMessage: "See you at the meetup!"
    },
    {
        id: 102,
        name: "Bob Chen",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        location: "Oakland, CA",
        status: "offline",
        lastMessage: "Sounds good."
    },
    {
        id: 103,
        name: "Carol Danvers",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
        location: "San Jose, CA",
        status: "online",
        lastMessage: "Can't wait!"
    }
];

// Mock Data: Suggested Swipe Deck
const SWIPE_DECK = [
    {
        id: 1,
        name: "Sarah Chen",
        age: 24,
        images: [
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
            "https://images.unsplash.com/photo-1521017432531-fbd92d768814"
        ],
        location: "San Francisco, CA",
        bio: "Coffee enthusiast and amateur photographer. Love hiking on weekends! 🌲📸",
        interests: ["Hiking", "Photography", "Coffee"],
        match: 95,
        job: "UX Designer",
        school: "UC Berkeley"
    },
    {
        id: 2,
        name: "Marcus Johnson",
        age: 28,
        images: [
            "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
        ],
        location: "New York, NY",
        bio: "Tech founder building the next big thing. Jazz lover by night. 🎷💻",
        interests: ["Tech", "Startups", "Jazz"],
        match: 88,
        job: "Founder @ FinTech",
        school: "NYU"
    },
    {
        id: 3,
        name: "Emma Wilson",
        age: 26,
        images: [
            "https://images.unsplash.com/photo-1517841905240-472988babdf9",
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1"
        ],
        location: "London, UK",
        bio: "Art history student exploring the world one museum at a time. 🎨✈️",
        interests: ["Art", "Museums", "Travel"],
        match: 82,
        school: "Royal College of Art"
    },
    {
        id: 4,
        name: "David Smith",
        age: 30,
        images: [
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
        ],
        location: "Chicago, IL",
        bio: "Architecture lover and marathon runner. Always down for a run or a slice of deep dish. 🏃‍♂️🍕",
        interests: ["Architecture", "Running", "Pizza"],
        match: 75,
        job: "Architect"
    }
];

export default function FriendsPage() {
    const [activeTab, setActiveTab] = useState<"friends" | "discover">("discover");
    const [activeChatFriend, setActiveChatFriend] = useState<any>(null);
    const [activeProfile, setActiveProfile] = useState<any>(null);

    // Swipe State
    const [deck, setDeck] = useState(SWIPE_DECK);

    const openChat = (friend: any) => {
        setActiveChatFriend(friend);
    };

    const handleSwipe = (id: number, direction: "left" | "right") => {
        console.log(`Swiped ${direction} on ${id}`);
        // Remove card from deck
        setDeck(prev => prev.filter(p => p.id !== id));

        if (direction === "right") {
            // Here you would trigger the friend request API
            // toast.success("Request sent!");
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground overflow-hidden">
            <Navbar />

            <main className="pt-28 pb-20 px-4 h-screen flex flex-col">
                <div className="container mx-auto max-w-5xl flex flex-col h-full">

                    {/* Navigation Tabs - Reduced margin for better fit */}
                    <div className="flex justify-center mb-6 shrink-0">
                        <div className="bg-gray-100 dark:bg-gray-900 p-1.5 rounded-full flex gap-1">
                            <button
                                onClick={() => setActiveTab("friends")}
                                className={cn(
                                    "px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all",
                                    activeTab === "friends"
                                        ? "bg-white dark:bg-black text-primary shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Users className="w-4 h-4" /> My Friends
                                <Badge variant="secondary" className="ml-1 h-5 px-1.5 bg-primary/10 text-primary">
                                    {MY_FRIENDS.length}
                                </Badge>
                            </button>
                            <button
                                onClick={() => setActiveTab("discover")}
                                className={cn(
                                    "px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all",
                                    activeTab === "discover"
                                        ? "bg-white dark:bg-black text-primary shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Sparkles className="w-4 h-4" /> Find New
                            </button>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === "friends" ? (
                            <motion.div
                                key="friends"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-1 overflow-y-auto"
                            >
                                <div className="space-y-6">
                                    <div className="max-w-md mx-auto md:max-w-full">
                                        <Input placeholder="Search friends..." className="mb-6 rounded-full" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {MY_FRIENDS.map((friend) => (
                                            <div key={friend.id} className="bg-white dark:bg-gray-900 rounded-3xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => openChat(friend)}>
                                                <div className="relative shrink-0">
                                                    <Avatar className="w-14 h-14 border border-gray-100">
                                                        <AvatarImage src={friend.image} alt={friend.name} />
                                                        <AvatarFallback>{friend.name[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <span className={cn(
                                                        "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-black",
                                                        friend.status === "online" ? "bg-green-500" : "bg-gray-300"
                                                    )} />
                                                </div>
                                                <div className="flex-1 min-w-0 text-left">
                                                    <h3 className="font-bold text-base truncate">{friend.name}</h3>
                                                    <p className="text-xs text-muted-foreground truncate">{friend.lastMessage}</p>
                                                </div>
                                                <Button size="icon" variant="ghost" className="rounded-full text-primary hover:bg-primary/10 shrink-0">
                                                    <MessageCircle className="w-5 h-5" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="discover"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex-1 flex flex-col items-center justify-center relative"
                            >
                                <div className="relative w-full max-w-sm h-[600px]">
                                    {deck.map((person, index) => {
                                        // Only render the top two cards for performance
                                        if (index > 1) return null;

                                        return (
                                            <SwipeCard
                                                key={person.id}
                                                person={person}
                                                onSwipe={(dir) => handleSwipe(person.id, dir)}
                                                onViewProfile={() => setActiveProfile(person)}
                                                style={{ zIndex: deck.length - index }}
                                            />
                                        );
                                    })}

                                    {deck.length === 0 && (
                                        <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                <Users className="w-10 h-10 text-gray-400" />
                                            </div>
                                            <h3 className="text-2xl font-bold mb-2">No more profiles!</h3>
                                            <p className="text-muted-foreground mb-6">Check back later for more potential vibes.</p>
                                            <Button onClick={() => setDeck(SWIPE_DECK)} variant="outline">
                                                Reset Deck (Demo)
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {deck.length > 0 && (
                                    <p className="text-center text-sm text-muted-foreground mt-8 animate-pulse">
                                        Swipe Right to Connect • Left to Pass
                                    </p>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </main>

            {activeChatFriend && (
                <ChatWindow
                    friend={activeChatFriend}
                    onClose={() => setActiveChatFriend(null)}
                />
            )}

            <ProfileModal
                person={activeProfile}
                isOpen={!!activeProfile}
                onClose={() => setActiveProfile(null)}
            />

        </div>
    );
}
