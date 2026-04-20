"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { CITIES } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Clock, Users, ArrowUpRight, ChevronDown, X, Loader2, Calendar, UserPlus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-context";

// Define interfaces locally or import from a shared types file if available
// Using 'any' for now to match the flexibility of the previous implementation, 
// but ideally should match Mongoose schemas.
interface MeetupsClientProps {
    initialMeetups: any[];
    initialGroups: any[];
}

function MeetupsPageContent({ initialMeetups, initialGroups }: MeetupsClientProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, openAuthModal } = useAuth();

    // Initial State from URL
    const initialType = (searchParams.get("type") as "all" | "events" | "groups") || "all";

    const [search, setSearch] = useState("");
    const [isLocating, setIsLocating] = useState(false);
    const [showTrending, setShowTrending] = useState(false);
    const [maxDistance, setMaxDistance] = useState<string>("all");
    const [filterType, setFilterType] = useState<"all" | "events" | "groups">(initialType);

    // Sync URL with State
    useEffect(() => {
        const typeParam = searchParams.get("type") as "all" | "events" | "groups";
        if (typeParam && ["all", "events", "groups"].includes(typeParam)) {
            setFilterType(typeParam);
        } else {
            setFilterType("all");
        }
    }, [searchParams]);

    const updateFilterType = (type: "all" | "events" | "groups") => {
        setFilterType(type);
        const params = new URLSearchParams(searchParams.toString());
        if (type === "all") {
            params.delete("type");
        } else {
            params.set("type", type);
        }
        router.push(`/meetups?${params.toString()}`, { scroll: false });
    };

    // Autocomplete State
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Custom Dropdown State
    const [showDistanceDropdown, setShowDistanceDropdown] = useState(false);
    const distanceDropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (distanceDropdownRef.current && !distanceDropdownRef.current.contains(event.target as Node)) {
                setShowDistanceDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);

        if (value.length > 0) {
            const filtered = CITIES.filter(city =>
                city.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const selectSuggestion = (city: string) => {
        setSearch(city);
        setShowSuggestions(false);
    };

    const handleUseMyLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );

                    if (!response.ok) throw new Error("Failed to fetch location");

                    const data = await response.json();
                    const address = data.address;
                    const userCity = address.city || address.town || address.village || address.county || "Unknown Location";
                    const stateCode = address.state_code || "";
                    const formattedLocation = stateCode ? `${userCity}, ${stateCode.toUpperCase()}` : userCity;

                    setSearch(formattedLocation);
                    setShowSuggestions(false);
                } catch (error) {
                    console.error("Error detecting location", error);
                    alert("Unable to retrieve your location details");
                } finally {
                    setIsLocating(false);
                }
            },
            (error) => {
                console.error("Error detecting location", error);
                setIsLocating(false);
                let errorMessage = "Unable to retrieve your location";
                if (error.code === error.PERMISSION_DENIED) {
                    errorMessage = "Location permission denied. Please enable it in your browser settings.";
                }
                alert(errorMessage);
            }
        );
    };

    const handleResetFilters = () => {
        setSearch("");
        setShowTrending(false);
        setMaxDistance("all");
        updateFilterType("all");
        setShowSuggestions(false);
    };

    const isFiltered = search !== "" || showTrending || maxDistance !== "all" || filterType !== "all";

    const filteredMeetups = initialMeetups.filter((meetup) => {
        if (filterType === "groups") return false;

        const matchesSearch =
            meetup.location.toLowerCase().includes(search.toLowerCase()) ||
            meetup.address?.toLowerCase().includes(search.toLowerCase()) ||
            meetup.title.toLowerCase().includes(search.toLowerCase());
        const matchesTrending = showTrending ? meetup.isTrending : true;

        let matchesDistance = true;
        if (maxDistance !== "all") {
            // @ts-ignore
            if (meetup.distance) {
                // @ts-ignore
                matchesDistance = meetup.distance <= parseInt(maxDistance);
            }
        }

        return matchesSearch && matchesTrending && matchesDistance;
    });

    const filteredGroups = initialGroups.filter((group) => {
        if (filterType === "events") return false;

        const matchesSearch =
            group.location.toLowerCase().includes(search.toLowerCase()) ||
            group.name.toLowerCase().includes(search.toLowerCase()) ||
            group.category.toLowerCase().includes(search.toLowerCase());

        return matchesSearch;
    });

    const getDistanceLabel = (val: string) => {
        if (val === "all") return "Any Distance";
        return `Within ${val}km`;
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            <main className="container mx-auto px-4 pt-40 pb-20">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black mb-6">Find Your Vibe</h1>
                    <p className="text-xl text-muted-foreground mb-8">Discover meetups, groups, and communities near you.</p>

                    <div className="bg-white/80 backdrop-blur-xl border p-4 rounded-[2rem] shadow-xl max-w-2xl mx-auto z-20 relative">
                        <div className="relative flex gap-2 mb-4">
                            <div className="relative flex-1 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
                                <Input
                                    value={search}
                                    onChange={handleSearchChange}
                                    onFocus={() => search && setShowSuggestions(true)}
                                    placeholder="Search events, groups, or locations..."
                                    className="pl-12 h-14 rounded-full text-lg shadow-sm border-gray-200 focus-visible:ring-primary bg-white"
                                    autoComplete="off"
                                />

                                <AnimatePresence>
                                    {showSuggestions && suggestions.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border border-gray-200 rounded-3xl shadow-xl max-h-60 overflow-y-auto overflow-hidden py-2"
                                        >
                                            {suggestions.map((city, index) => (
                                                <div
                                                    key={index}
                                                    className="px-6 py-3 hover:bg-primary/5 cursor-pointer text-base flex items-center gap-3 transition-colors text-left"
                                                    onClick={() => selectSuggestion(city)}
                                                >
                                                    <MapPin className="w-4 h-4 text-muted-foreground" />
                                                    {city}
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-14 w-14 rounded-full aspect-square shrink-0 bg-white hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all"
                                    onClick={handleUseMyLocation}
                                    disabled={isLocating}
                                    title="Use my location"
                                >
                                    {isLocating ? <Loader2 className="w-5 h-5 animate-spin text-primary" /> : <MapPin className="w-5 h-5" />}
                                </Button>

                                <AnimatePresence>
                                    {filterType === "groups" && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8, width: 0 }}
                                            animate={{ opacity: 1, scale: 1, width: "auto" }}
                                            exit={{ opacity: 0, scale: 0.8, width: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <Link href="/create-group">
                                                <Button className="h-14 px-6 rounded-full bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 shrink-0 whitespace-nowrap">
                                                    <UserPlus className="w-5 h-5 mr-2" />
                                                    Create Group
                                                </Button>
                                            </Link>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            {/* Type Toggle */}
                            <div className="bg-gray-100 p-1 rounded-full flex relative">
                                <button
                                    onClick={() => updateFilterType("all")}
                                    className={cn(
                                        "px-4 py-1.5 rounded-full text-sm font-medium transition-all relative z-10",
                                        filterType === "all" ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => updateFilterType("events")}
                                    className={cn(
                                        "px-4 py-1.5 rounded-full text-sm font-medium transition-all relative z-10",
                                        filterType === "events" ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    Events
                                </button>
                                <button
                                    onClick={() => updateFilterType("groups")}
                                    className={cn(
                                        "px-4 py-1.5 rounded-full text-sm font-medium transition-all relative z-10",
                                        filterType === "groups" ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    Groups
                                </button>
                            </div>

                            <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block" />

                            <Button
                                variant={showTrending ? "default" : "outline"}
                                onClick={() => setShowTrending(!showTrending)}
                                className={cn(
                                    "rounded-full h-10 px-5 transition-all text-sm font-medium",
                                    showTrending ? "ring-2 ring-primary ring-offset-2" : "hover:border-primary/50"
                                )}
                            >
                                <ArrowUpRight className="w-4 h-4 mr-2" />
                                Trending
                            </Button>

                            {/* Custom Distance Dropdown */}
                            <div className="relative" ref={distanceDropdownRef}>
                                <button
                                    onClick={() => setShowDistanceDropdown(!showDistanceDropdown)}
                                    className={cn(
                                        "flex items-center gap-2 bg-white px-5 py-2 rounded-full border transition-all text-sm font-medium hover:border-primary/50",
                                        maxDistance !== "all" && "border-primary text-primary bg-primary/5"
                                    )}
                                >
                                    <span className="text-muted-foreground">Distance:</span>
                                    <span className="font-semibold text-foreground">{getDistanceLabel(maxDistance).replace("Within ", "")}</span>
                                    <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", showDistanceDropdown && "rotate-180")} />
                                </button>

                                <AnimatePresence>
                                    {showDistanceDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white border rounded-2xl shadow-xl z-50 p-1.5 flex flex-col gap-1"
                                        >
                                            {[
                                                { label: "Any Distance", value: "all" },
                                                { label: "Within 1km", value: "1" },
                                                { label: "Within 3km", value: "3" },
                                                { label: "Within 5km", value: "5" },
                                                { label: "Within 10km", value: "10" },
                                            ].map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => {
                                                        setMaxDistance(option.value);
                                                        setShowDistanceDropdown(false);
                                                    }}
                                                    className={cn(
                                                        "w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors",
                                                        maxDistance === option.value
                                                            ? "bg-primary/10 text-primary font-semibold"
                                                            : "hover:bg-gray-50 text-foreground"
                                                    )}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Reset Button */}
                            {isFiltered && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleResetFilters}
                                        className="h-10 px-3 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                    >
                                        <X className="w-4 h-4 mr-1.5" />
                                        Clear
                                    </Button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Results Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Render Meetups (Events) */}
                    {filteredMeetups.map((meetup) => (
                        <Link href={`/meetup/${meetup.id}`} key={`meetup-${meetup.id}`} className="group block h-full">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col relative"
                            >
                                {/* Trending Badge */}
                                {/* @ts-ignore - we know isTrending exists */}
                                {meetup.isTrending && (
                                    <div className="absolute top-4 left-4 z-10 bg-primary/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                                        <ArrowUpRight className="w-3 h-3" /> Trending
                                    </div>
                                )}

                                <div className="relative h-64 overflow-hidden">
                                    <Image
                                        src={meetup.image}
                                        alt={meetup.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        unoptimized
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm text-foreground">
                                        Event
                                    </div>

                                    {/* Distance Badge (Mock) */}
                                    {/* @ts-ignore */}
                                    {meetup.distance && (
                                        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-medium text-white flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {/* @ts-ignore */}
                                            {meetup.distance}km away
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="mb-4">
                                        <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> {meetup.time}
                                        </p>
                                        <h3 className="text-2xl font-bold leading-tight mb-2 group-hover:text-primary transition-colors">{meetup.title}</h3>
                                        <p className="text-muted-foreground text-sm flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4" /> {meetup.location}
                                        </p>
                                    </div>

                                    <p className="text-muted-foreground text-sm line-clamp-2 mb-6">
                                        {meetup.description}
                                    </p>

                                    <div className="mt-auto pt-6 border-t flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                            <Users className="w-4 h-4" /> {meetup.attendees} going
                                        </div>
                                        <div className="w-10 h-10 rounded-full border flex items-center justify-center bg-gray-50 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                            <ArrowUpRight className="w-5 h-5 transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}

                    {/* Render Groups */}
                    {filteredGroups.map((group) => (
                        <div key={`group-${group.id}`} className="group block h-full">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col relative"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <Image
                                        src={group.image}
                                        alt={group.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        unoptimized
                                    />
                                    <div className="absolute top-4 right-4 bg-blue-100 text-blue-700 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                        Group
                                    </div>
                                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white">
                                        {group.category}
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="mb-4">
                                        <h3 className="text-2xl font-bold leading-tight mb-2">{group.name}</h3>
                                        <p className="text-muted-foreground text-sm flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4" /> {group.location}
                                        </p>
                                    </div>

                                    <p className="text-muted-foreground text-sm line-clamp-2 mb-6">
                                        {group.description}
                                    </p>

                                    {/* Group stats/Next Event */}
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {group.nextEvent && (
                                            <Badge variant="secondary" className="bg-orange-50 text-orange-700 hover:bg-orange-100 border-none">
                                                Next: {group.nextEvent}
                                            </Badge>
                                        )}
                                        {group.tags.map((tag: any) => (
                                            <Badge key={tag} variant="outline" className="text-gray-500">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>

                                    <div className="mt-auto pt-6 border-t flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                            <Users className="w-4 h-4" /> {group.members.toLocaleString()} members
                                        </div>
                                        <Button
                                            size="sm"
                                            className="rounded-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
                                            onClick={() => {
                                                if (!user) {
                                                    openAuthModal({ defaultTab: "signup", title: "Sign up to join this group" });
                                                } else {
                                                    // Handle join logic (e.g., API call) - Placeholder for now
                                                    alert(`Joined ${group.name}!`);
                                                }
                                            }}
                                        >
                                            <UserPlus className="w-4 h-4" /> Join
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    ))}

                    {filteredMeetups.length === 0 && filteredGroups.length === 0 && (
                        <div className="col-span-full text-center py-24 text-muted-foreground bg-white/50 rounded-[3rem] border border-dashed border-gray-200">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="w-8 h-8 opacity-40" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-3">No results found</h3>
                            <p className="mb-8 max-w-sm mx-auto">We couldn't find any events or groups matching your criteria.</p>
                            <Button
                                variant="outline"
                                onClick={handleResetFilters}
                                className="rounded-full h-12 px-8 shadow-sm hover:shadow-md transition-all"
                            >
                                Clear all filters
                            </Button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default function MeetupsClient(props: MeetupsClientProps) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>}>
            <MeetupsPageContent {...props} />
        </Suspense>
    );
}
