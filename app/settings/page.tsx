"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { useAuth } from "@/components/auth-context";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { updateSettings } from "@/lib/actions";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Lock, ShieldAlert, Loader2, Save, CheckCircle } from "lucide-react";

export default function SettingsPage() {
    const { user, login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    // Initial state from user object
    const [settings, setSettings] = useState<{
        newsletter: boolean;
        activityNotifications: boolean;
        privacy: 'public' | 'friends' | 'private';
    }>({
        newsletter: user?.settings?.newsletter ?? true,
        activityNotifications: user?.settings?.activityNotifications ?? true,
        privacy: user?.settings?.privacy ?? 'public'
    });

    // Update form state when user data is refreshed from server
    useEffect(() => {
        if (user?.settings) {
            setSettings({
                newsletter: user.settings.newsletter ?? true,
                activityNotifications: user.settings.activityNotifications ?? true,
                privacy: user.settings.privacy ?? 'public'
            });
        }
    }, [user]);

    if (!user) return <div className="min-h-screen flex items-center justify-center">Please log in</div>;

    const handleToggle = (key: string) => {
        setSettings(prev => ({ ...prev, [key]: !(prev as any)[key] }));
        setIsSaved(false);
    };

    const handlePrivacyChange = (value: string) => {
        setSettings(prev => ({ ...prev, privacy: value as 'public' | 'friends' | 'private' }));
        setIsSaved(false);
    };

    const handleSave = async () => {
        setIsLoading(true);

        const result = await updateSettings(user.email, settings);

        if (result.success && result.user) {
            login(result.user);
            toast.success("Settings saved!", {
                description: "Your preferences have been updated.",
                duration: 3000
            });
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
        } else {
            toast.error("Failed to save settings.");
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">
            <Navbar />

            <main className="pt-32 pb-20 px-4">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Settings</h1>

                    <div className="space-y-6">
                        {/* Notifications */}
                        <section className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Bell className="w-5 h-5 text-primary" /> Notifications
                            </h2>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Email Newsletter</Label>
                                        <p className="text-sm text-muted-foreground">Receive updates about new features and events.</p>
                                    </div>
                                    <Switch
                                        checked={settings.newsletter}
                                        onCheckedChange={() => handleToggle('newsletter')}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Activity Notifications</Label>
                                        <p className="text-sm text-muted-foreground">Get notified when groups or meetups have updates.</p>
                                    </div>
                                    <Switch
                                        checked={settings.activityNotifications}
                                        onCheckedChange={() => handleToggle('activityNotifications')}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Privacy */}
                        <section className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Lock className="w-5 h-5 text-primary" /> Privacy
                            </h2>

                            <div className="space-y-4">
                                <Label className="text-base">Profile Visibility</Label>
                                <div className="grid gap-3 pt-2">
                                    {['public', 'friends', 'private'].map((option) => (
                                        <div
                                            key={option}
                                            onClick={() => handlePrivacyChange(option)}
                                            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${settings.privacy === option
                                                ? "border-primary bg-primary/5 shadow-sm"
                                                : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                                                }`}
                                        >
                                            <span className="capitalize font-medium">{option}</span>
                                            {settings.privacy === option && <div className="w-3 h-3 bg-primary rounded-full" />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Danger Zone */}
                        <section className="bg-red-50 dark:bg-red-950/10 rounded-[2rem] p-8 shadow-sm border border-red-100 dark:border-red-900/20">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-red-600">
                                <ShieldAlert className="w-5 h-5" /> Danger Zone
                            </h2>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-red-900 dark:text-red-200">Delete Account</h3>
                                    <p className="text-sm text-red-700/80 dark:text-red-300/80">Permanently remove your account and all data.</p>
                                </div>
                                <Button variant="destructive" className="rounded-xl">Delete Account</Button>
                            </div>
                        </section>

                        {/* Save Actions */}
                        <div className="flex items-center justify-end gap-4 pt-4">
                            <Button
                                size="lg"
                                className={cn("rounded-full px-8 transition-all duration-300", isSaved ? "bg-green-600 hover:bg-green-700 w-48" : "w-48")}
                                onClick={handleSave}
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
                                            <CheckCircle className="w-4 h-4 mr-2" /> Preferences Saved
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="idle"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center"
                                        >
                                            <Save className="w-4 h-4 mr-2" /> Save Preferences
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// Helper for classnames (can be removed if imported from utils, but safe to keep for isolation)
function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}
