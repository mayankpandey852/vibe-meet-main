"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Chrome, Apple, MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CITIES } from "@/lib/data";

import { registerUser, loginUser } from "@/lib/actions";
import { useAuth } from "@/components/auth-context";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultTab?: "login" | "signup";
    customTitle?: string;
}

export function AuthModal({ isOpen, onClose, defaultTab = "login", customTitle }: AuthModalProps) {
    const { login } = useAuth();
    const [location, setLocation] = useState("");
    const [isLocating, setIsLocating] = useState(false);
    const [isAgeVerified, setIsAgeVerified] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Auth State
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async (formData: FormData) => {
        setStatus("loading");
        const result = await loginUser(formData);
        if (result.success && result.user) {
            login(result.user as any); // Type assertion if needed, or update User type
            setStatus("success");
            setTimeout(onClose, 1500); // Close after success
        } else {
            setStatus("error");
            setErrorMessage(result.error || "Login failed");
        }
    };

    const handleSignup = async (formData: FormData) => {
        setStatus("loading");
        // Append location manually if needed, or rely on hidden input
        const result = await registerUser(formData);
        if (result.success && result.user) {
            login(result.user as any);
            setStatus("success");
            setTimeout(onClose, 1500);
        } else {
            setStatus("error");
            setErrorMessage(result.error || "Registration failed");
        }
    };

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocation(value);

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
        setLocation(city);
        setShowSuggestions(false);
    };

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    setLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)} (Detected)`);
                } catch (error) {
                    console.error(error);
                } finally {
                    setIsLocating(false);
                }
            },
            (error) => {
                console.error("Error detecting location", error);
                setIsLocating(false);
            }
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                setStatus("idle");
                setErrorMessage("");
            }
            onClose();
        }}>
            <DialogContent className="sm:max-w-4xl rounded-[2rem] p-0 overflow-hidden gap-0">
                <div className="grid md:grid-cols-2 h-full">
                    {/* Left Column: Branding */}
                    <div className="bg-muted/50 p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-background/10 z-0" />
                        <div className="relative z-10 space-y-4">
                            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                                <MapPin className="w-8 h-8 text-primary" />
                            </div>
                            <DialogTitle className="text-3xl font-bold">Vibe & Meet</DialogTitle>
                            <DialogDescription className="text-lg max-w-[250px] mx-auto">
                                Discover your next adventure and meet amazing people.
                            </DialogDescription>
                        </div>
                    </div>

                    {/* Right Column: Forms */}
                    <div className="p-8 flex flex-col justify-center">
                        <DialogHeader className="mb-6 md:hidden">
                            <DialogTitle className="text-2xl font-bold text-center">Welcome</DialogTitle>
                        </DialogHeader>

                        {customTitle && (
                            <div className="mb-6 text-center">
                                <h2 className="text-2xl font-bold text-foreground">{customTitle}</h2>
                            </div>
                        )}

                        {status === "success" ? (
                            <div className="text-center py-12 space-y-4">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-8 h-8">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold">Success!</h3>
                                <p className="text-muted-foreground">You are now authenticated.</p>
                            </div>
                        ) : (
                            <Tabs defaultValue={defaultTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-6">
                                    <TabsTrigger value="login">Login</TabsTrigger>
                                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                                </TabsList>

                                {status === "error" && (
                                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-4 text-center">
                                        {errorMessage}
                                    </div>
                                )}

                                <TabsContent value="login">
                                    <form action={handleLogin} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input name="email" id="email" type="email" required placeholder="hello@example.com" className="rounded-xl" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Password</Label>
                                            <Input name="password" id="password" type="password" required className="rounded-xl" />
                                        </div>
                                        <Button className="w-full rounded-xl" size="lg" disabled={status === "loading"}>
                                            {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                            Log In
                                        </Button>
                                    </form>
                                </TabsContent>

                                <TabsContent value="signup">
                                    <form action={handleSignup} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input name="name" id="name" type="text" required placeholder="John Doe" className="rounded-xl" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="signup-email">Email</Label>
                                            <Input name="email" id="signup-email" type="email" required placeholder="hello@example.com" className="rounded-xl" />
                                        </div>

                                        {/* Location Input with Autocomplete */}
                                        <div className="space-y-2 relative">
                                            <Label htmlFor="location">City / Location</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    id="location"
                                                    value={location}
                                                    onChange={handleLocationChange}
                                                    onFocus={() => location && setShowSuggestions(true)}
                                                    placeholder="Type to search..."
                                                    className="rounded-xl flex-1"
                                                    autoComplete="off"
                                                />
                                                {/* Hidden input to send location in FormData */}
                                                <input type="hidden" name="location" value={location} />

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    className="rounded-xl aspect-square"
                                                    onClick={handleDetectLocation}
                                                    disabled={isLocating}
                                                >
                                                    {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                                                </Button>
                                            </div>
                                            {/* Suggestions Dropdown */}
                                            {showSuggestions && suggestions.length > 0 && (
                                                <div className="absolute top-full left-0 right-12 z-50 mt-1 bg-white border rounded-xl shadow-lg max-h-40 overflow-y-auto">
                                                    {suggestions.map((city, index) => (
                                                        <div
                                                            key={index}
                                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                                            onClick={() => selectSuggestion(city)}
                                                        >
                                                            {city}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="signup-password">Password</Label>
                                            <Input name="password" id="signup-password" type="password" required className="rounded-xl" />
                                        </div>

                                        {/* Age Verification Checkbox */}
                                        <div className="flex items-center space-x-2 py-2">
                                            <Checkbox
                                                id="age-verify"
                                                checked={isAgeVerified}
                                                onCheckedChange={(c) => setIsAgeVerified(c as boolean)}
                                            />
                                            <Label
                                                htmlFor="age-verify"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                I confirm I am 18 years or older
                                            </Label>
                                        </div>

                                        <Button className="w-full rounded-xl" size="lg" disabled={!isAgeVerified || status === "loading"}>
                                            {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                            Create Account
                                        </Button>
                                    </form>
                                </TabsContent>
                            </Tabs>
                        )}

                        {!status.includes("success") && (
                            <>
                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Button variant="outline" className="rounded-xl h-11">
                                        <Chrome className="mr-2 h-4 w-4" /> Google
                                    </Button>
                                    <Button variant="outline" className="rounded-xl h-11">
                                        <Apple className="mr-2 h-4 w-4" /> Apple
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
