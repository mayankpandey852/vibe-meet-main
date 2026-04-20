"use client";

import { useState, useRef } from "react";
import { Navbar } from "@/components/navbar";
import { useAuth } from "@/components/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Camera, Save, User as UserIcon, X, Plus, CheckCircle } from "lucide-react";
import { updateUserProfile } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// Constant options
const RELATIONSHIP_STATUSES = ["Single", "In a relationship", "Married", "Is complicated", "Open relationship", "Prefer not to say"];
const SEXUAL_ORIENTATIONS = ["Heterosexual", "Gay", "Lesbian", "Bisexual", "Pansexual", "Asexual", "Prefer not to say"];
const INTEREST_CATEGORIES = ["Tech", "Art", "Music", "Outdoors", "Food", "Travel", "Gaming", "Sports", "Photography", "Reading", "Movies", "Fitness"];

export default function ProfilePage() {
    const { user, login } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // If no user, redirect (simple client-side check)
    if (!user) {
        // In a real app, middleware handles this. Here we just show a message or redirect.
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Please Log In</h1>
                    <p className="text-muted-foreground">You need to be logged in to view your profile.</p>
                </div>
            </div>
        );
    }

    // Local form state initialized with user data
    const [formData, setFormData] = useState({
        name: user.name || "",
        email: user.email || "", // Read-only typically
        bio: user.bio || "",
        location: user.location || "",
        relationshipStatus: user.relationshipStatus || "",
        sexualOrientation: user.sexualOrientation || "",
        interests: user.interests || [],
        image: user.image || ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setIsSaved(false);
    };

    const toggleInterest = (interest: string) => {
        setFormData(prev => {
            const exists = prev.interests.includes(interest);
            if (exists) {
                return { ...prev, interests: prev.interests.filter(i => i !== interest) };
            } else {
                return { ...prev, interests: [...prev.interests, interest] };
            }
        });
        setIsSaved(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Simple Base64 conversion for demo
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result as string }));
                setIsSaved(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const data = new FormData();
            data.append("email", user.email); // Identify user
            data.append("name", formData.name);
            data.append("bio", formData.bio);
            data.append("location", formData.location);
            data.append("relationshipStatus", formData.relationshipStatus);
            data.append("sexualOrientation", formData.sexualOrientation);
            data.append("image", formData.image);

            // Send interests as comma-separated string
            data.append("interests", formData.interests.join(","));

            const result = await updateUserProfile(data);

            if (result.success && result.user) {
                login(result.user); // Update global context
                toast.success("Profile updated looks amazing!", {
                    description: "Your changes have been saved successfully.",
                    duration: 4000
                });
                setIsSaved(true);
                setTimeout(() => setIsSaved(false), 3000);
            } else {
                toast.error(result.error || "Failed to update profile.");
            }
        } catch (error) {
            console.error(error);
            toast.error("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">
            <Navbar />

            <main className="pt-32 pb-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8 text-center md:text-left">Your Profile</h1>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Left Column: Avatar & Basic Info */}
                        <div className="md:col-span-1 space-y-6">
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center text-center">
                                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-800 shadow-xl mb-4">
                                        <AvatarImage src={formData.image} className="object-cover" />
                                        <AvatarFallback className="text-4xl bg-primary/10 text-primary font-bold">
                                            {formData.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium">
                                        <Camera className="w-8 h-8" />
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>

                                <h2 className="text-xl font-bold">{formData.name || "Your Name"}</h2>
                                <p className="text-muted-foreground text-sm mb-4">{user.email}</p>

                                <div className="w-full pt-4 border-t border-gray-100/50 dark:border-gray-800/50 flex flex-wrap gap-2 justify-center">
                                    {formData.interests.length > 0 ? (
                                        formData.interests.slice(0, 3).map(tag => (
                                            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                                        ))
                                    ) : (
                                        <span className="text-xs text-muted-foreground">No interests added</span>
                                    )}
                                    {formData.interests.length > 3 && (
                                        <span className="text-xs text-muted-foreground">+{formData.interests.length - 3} more</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Edit Form */}
                        <div className="md:col-span-2">
                            <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                                <form onSubmit={handleSubmit} className="space-y-8">

                                    {/* Personal Details */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold flex items-center gap-2">
                                            <UserIcon className="w-5 h-5 text-primary" /> Personal Details
                                        </h3>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Display Name</Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="rounded-xl"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="location">Location</Label>
                                                <Input
                                                    id="location"
                                                    name="location"
                                                    value={formData.location}
                                                    onChange={handleInputChange}
                                                    placeholder="e.g. New York, NY"
                                                    className="rounded-xl"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="bio">Bio</Label>
                                            <Textarea
                                                id="bio"
                                                name="bio"
                                                value={formData.bio}
                                                onChange={handleInputChange}
                                                placeholder="Tell us a bit about yourself..."
                                                className="rounded-xl min-h-[100px]"
                                            />
                                        </div>
                                    </div>

                                    {/* Demographics */}
                                    <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <h3 className="text-lg font-bold">About You</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="relationshipStatus">Relationship Status</Label>
                                                <div className="relative">
                                                    <select
                                                        id="relationshipStatus"
                                                        name="relationshipStatus"
                                                        value={formData.relationshipStatus}
                                                        onChange={handleInputChange}
                                                        className="w-full h-10 px-3 py-2 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-input appearance-none"
                                                    >
                                                        <option value="">Select status</option>
                                                        {RELATIONSHIP_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                                    </select>
                                                    {/* Custom arrow could go here */}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="sexualOrientation">Sexual Orientation</Label>
                                                <select
                                                    id="sexualOrientation"
                                                    name="sexualOrientation"
                                                    value={formData.sexualOrientation}
                                                    onChange={handleInputChange}
                                                    className="w-full h-10 px-3 py-2 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-input appearance-none"
                                                >
                                                    <option value="">Select orientation</option>
                                                    {SEXUAL_ORIENTATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Interests */}
                                    {/* Interests */}
                                    <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <div>
                                            <h3 className="text-lg font-bold mb-2">Your Vibe</h3>
                                            <p className="text-sm text-muted-foreground mb-3">Categories you identify with.</p>
                                            <div className="flex flex-wrap gap-2">
                                                {formData.interests.length > 0 ? (
                                                    formData.interests.map(interest => (
                                                        <Badge
                                                            key={interest}
                                                            variant="default"
                                                            className="pl-3 pr-1 py-1 text-sm cursor-pointer hover:bg-primary/90 transition-colors flex items-center gap-1 group"
                                                            onClick={() => toggleInterest(interest)}
                                                        >
                                                            {interest}
                                                            <div className="bg-white/20 rounded-full p-0.5 group-hover:bg-white/30 transition-colors">
                                                                <X className="w-3 h-3" />
                                                            </div>
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-muted-foreground italic">No interests selected yet.</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Explore Vibes</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {INTEREST_CATEGORIES.filter(cat => !formData.interests.includes(cat)).map(category => (
                                                    <div
                                                        key={category}
                                                        onClick={() => toggleInterest(category)}
                                                        className="px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-all border bg-background hover:bg-muted border-input text-foreground flex items-center gap-1 group"
                                                    >
                                                        {category}
                                                        <Plus className="w-3 h-3 text-muted-foreground group-hover:text-foreground" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-6 flex items-center justify-end gap-4">
                                        <Button
                                            size="lg"
                                            className={cn("rounded-full px-8 transition-all duration-300", isSaved ? "bg-green-600 hover:bg-green-700 w-40" : "w-40")}
                                            disabled={isLoading}
                                        >
                                            <AnimatePresence mode="wait">
                                                {isLoading ? (
                                                    <motion.div
                                                        key="loading"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="flex items-center"
                                                    >
                                                        <Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...
                                                    </motion.div>
                                                ) : isSaved ? (
                                                    <motion.div
                                                        key="saved"
                                                        initial={{ scale: 0.5, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="flex items-center"
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-2" /> Saved
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        key="idle"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="flex items-center"
                                                    >
                                                        <Save className="w-4 h-4 mr-2" /> Save Changes
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </Button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// Helper for classnames
function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}
