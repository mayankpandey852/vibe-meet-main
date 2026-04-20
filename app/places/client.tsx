"use client";

import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { CITIES } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Star, ChevronDown, X, Loader2, Filter } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { SpotImage } from "@/components/spot-image";

interface PlacesClientProps {
    initialSpots: any[];
}

export default function PlacesClient({ initialSpots }: PlacesClientProps) {
    const [search, setSearch] = useState("");
    const [isLocating, setIsLocating] = useState(false);
    const [selectedType, setSelectedType] = useState<string>("all");
    const [maxDistance, setMaxDistance] = useState<string>("all");

    // UI State for Dropdowns
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);
    const [showDistanceDropdown, setShowDistanceDropdown] = useState(false);

    // Autocomplete State
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const typeDropdownRef = useRef<HTMLDivElement>(null);
    const distanceDropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
                setShowTypeDropdown(false);
            }
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
        setSelectedType("all");
        setMaxDistance("all");
        setShowSuggestions(false);
    };

    const isFiltered = search !== "" || selectedType !== "all" || maxDistance !== "all";

    const filteredSpots = initialSpots.filter((spot: any) => {
        // Search Filter (Location or Name)
        const matchesSearch =
            (spot.location?.toLowerCase() || "").includes(search.toLowerCase()) ||
            spot.name.toLowerCase().includes(search.toLowerCase()) ||
            spot.type.toLowerCase().includes(search.toLowerCase());

        // Type Filter
        const matchesType = selectedType === "all" ? true : spot.type === selectedType;

        // Distance Filter
        let matchesDistance = true;
        if (maxDistance !== "all") {
            if (spot.distance) {
                matchesDistance = spot.distance <= parseInt(maxDistance);
            }
        }

        return matchesSearch && matchesType && matchesDistance;
    });

    const uniqueTypes = Array.from(new Set(initialSpots.map(s => s.type)));

    const getDistanceLabel = (val: string) => {
        if (val === "all") return "Any Distance";
        return `Within ${val}km`;
    };

    const getTypeLabel = (val: string) => {
        if (val === "all") return "All Categories";
        return val as string;
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            <main className="container mx-auto px-4 pt-40 pb-20">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black mb-6">Discover <span className="text-primary">Places</span></h1>
                    <p className="text-xl text-muted-foreground mb-8">Find the perfect vibe for your next hangout, work session, or date.</p>

                    <div className="bg-white/80 backdrop-blur-xl border p-4 rounded-[2rem] shadow-xl max-w-2xl mx-auto z-20 relative">
                        {/* Search Bar Row */}
                        <div className="relative flex gap-2 mb-4">
                            <div className="relative flex-1 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
                                <Input
                                    value={search}
                                    onChange={handleSearchChange}
                                    onFocus={() => search && setShowSuggestions(true)}
                                    placeholder="Search specific places or locations..."
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
                        </div>

                        {/* Filters Row */}
                        <div className="flex flex-wrap items-center justify-center gap-3">

                            {/* Type Dropdown */}
                            <div className="relative" ref={typeDropdownRef}>
                                <button
                                    onClick={() => {
                                        setShowTypeDropdown(!showTypeDropdown);
                                        setShowDistanceDropdown(false);
                                    }}
                                    className={cn(
                                        "flex items-center gap-2 bg-white px-5 py-2.5 rounded-full border transition-all text-sm font-medium hover:border-primary/50",
                                        selectedType !== "all" && "border-primary text-primary bg-primary/5"
                                    )}
                                >
                                    <Filter className="w-4 h-4" />
                                    <span>{getTypeLabel(selectedType)}</span>
                                    <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", showTypeDropdown && "rotate-180")} />
                                </button>

                                <AnimatePresence>
                                    {showTypeDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute top-full left-0 mt-2 w-56 bg-white border rounded-2xl shadow-xl z-50 p-1.5 flex flex-col gap-1 overflow-hidden"
                                        >
                                            <button
                                                onClick={() => {
                                                    setSelectedType("all");
                                                    setShowTypeDropdown(false);
                                                }}
                                                className={cn(
                                                    "w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors",
                                                    selectedType === "all"
                                                        ? "bg-primary/10 text-primary font-semibold"
                                                        : "hover:bg-gray-50 text-foreground"
                                                )}
                                            >
                                                All Categories
                                            </button>
                                            {uniqueTypes.map((type) => (
                                                <button
                                                    key={type as string}
                                                    onClick={() => {
                                                        setSelectedType(type as string);
                                                        setShowTypeDropdown(false);
                                                    }}
                                                    className={cn(
                                                        "w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors",
                                                        selectedType === type
                                                            ? "bg-primary/10 text-primary font-semibold"
                                                            : "hover:bg-gray-50 text-foreground"
                                                    )}
                                                >
                                                    {type as string}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="h-8 w-px bg-gray-200 hidden sm:block" />

                            {/* Distance Dropdown */}
                            <div className="relative" ref={distanceDropdownRef}>
                                <button
                                    onClick={() => {
                                        setShowDistanceDropdown(!showDistanceDropdown);
                                        setShowTypeDropdown(false);
                                    }}
                                    className={cn(
                                        "flex items-center gap-2 bg-white px-5 py-2.5 rounded-full border transition-all text-sm font-medium hover:border-primary/50",
                                        maxDistance !== "all" && "border-primary text-primary bg-primary/5"
                                    )}
                                >
                                    <MapPin className="w-4 h-4" />
                                    <span>{getDistanceLabel(maxDistance).replace("Within ", "")}</span>
                                    <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", showDistanceDropdown && "rotate-180")} />
                                </button>

                                <AnimatePresence>
                                    {showDistanceDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute top-full left-0 mt-2 w-48 bg-white border rounded-2xl shadow-xl z-50 p-1.5 flex flex-col gap-1"
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
                    {filteredSpots.length > 0 ? (
                        filteredSpots.map((spot: any) => (
                            <div key={spot.id} className="group h-full">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col relative cursor-pointer"
                                >
                                    <div className="relative h-64 overflow-hidden bg-gray-100">
                                        <SpotImage src={spot.image} alt={spot.name} />
                                        <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full flex items-center gap-1">
                                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                            <span className="text-xs font-bold text-white shadow-sm">{spot.rating}</span>
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="mb-4">
                                            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">{spot.type}</p>
                                            <h3 className="text-2xl font-bold leading-tight mb-2">{spot.name}</h3>
                                            <p className="text-muted-foreground text-sm flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4" /> {spot.location}
                                                {/* @ts-ignore */}
                                                {spot.distance && <span className="text-xs text-muted-foreground/60">• {spot.distance}km</span>}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mt-auto">
                                            {spot.vibe.map((v: any) => (
                                                <Badge key={v} variant="secondary" className="bg-gray-100 hover:bg-gray-200">
                                                    {v}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-muted-foreground bg-gray-50/50 rounded-[3rem] border border-dashed">
                            <h3 className="text-xl font-bold text-foreground mb-2">No places found</h3>
                            <p>Try adjusting your search filters.</p>
                            <Button
                                variant="outline"
                                onClick={handleResetFilters}
                                className="rounded-full mt-4"
                            >
                                Clear all filters
                            </Button>
                        </div>
                    )}
                </div>
            </main >
        </div >
    );
}
