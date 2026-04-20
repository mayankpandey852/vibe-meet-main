"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { useAuth } from "@/components/auth-context";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle, Info, UserPlus, Calendar, MailOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { getNotifications, markAllNotificationsRead, markNotificationRead } from "@/lib/actions";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Notification {
    _id: string;
    type: "welcome" | "meetup_join" | "group_invite" | "system" | "reminder";
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
    link?: string;
}

export default function NotificationsPage() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user?.email) {
            fetchNotifications();
        }
    }, [user?.email]);

    const fetchNotifications = async () => {
        if (!user?.email) return;
        const res = await getNotifications(user.email);
        if (res.success && res.notifications) {
            setNotifications(res.notifications);
        }
        setIsLoading(false);
    };

    const handleMarkAllRead = async () => {
        if (!user?.email) {
            toast.error("User not authenticated");
            return;
        }

        toast.info("Clearing notifications...");

        // Optimistic update
        setNotifications([]);

        const res = await markAllNotificationsRead(user.email);
        if (res.success) {
            toast.success("All notifications marked as read");
        } else {
            toast.error("Failed to update notifications");
            fetchNotifications(); // Revert on error
        }
    };

    const handleMarkRead = async (id: string) => {
        // Optimistic update
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));

        await markNotificationRead(id);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "welcome": return <Info className="w-5 h-5 text-blue-500" />;
            case "meetup_join": return <Calendar className="w-5 h-5 text-green-500" />;
            case "group_invite": return <UserPlus className="w-5 h-5 text-purple-500" />;
            case "reminder": return <Bell className="w-5 h-5 text-orange-500" />;
            default: return <MailOpen className="w-5 h-5 text-gray-500" />;
        }
    };

    if (!user) return <div className="min-h-screen flex items-center justify-center">Please log in to view notifications</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">
            <Navbar />

            <main className="pt-32 pb-20 px-4 min-h-screen">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <div className="bg-primary/10 p-3 rounded-2xl">
                                <Bell className="w-8 h-8 text-primary" />
                            </div>
                            Notifications
                        </h1>

                        {notifications.some(n => !n.read) && (
                            <Button variant="ghost" onClick={handleMarkAllRead} className="text-primary hover:text-primary/80 hover:bg-primary/5">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Mark all read
                            </Button>
                        )}
                    </div>

                    <div className="space-y-4">
                        {isLoading ? (
                            // Skeleton loading
                            [1, 2, 3].map((i) => (
                                <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 animate-pulse">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                                            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : notifications.length > 0 ? (
                            <AnimatePresence>
                                {notifications.map((notification) => (
                                    <motion.div
                                        key={notification._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, height: 0 }}
                                        onClick={() => !notification.read && handleMarkRead(notification._id)}
                                        className={cn(
                                            "relative group bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border transition-all duration-200 hover:shadow-md cursor-pointer",
                                            notification.read
                                                ? "border-gray-100 dark:border-gray-800 opacity-75 hover:opacity-100"
                                                : "border-primary/20 shadow-primary/5 bg-primary/[0.02]"
                                        )}
                                    >
                                        {!notification.read && (
                                            <span className="absolute top-5 right-5 w-2.5 h-2.5 bg-primary rounded-full animate-pulse" />
                                        )}

                                        <div className="flex gap-4">
                                            <div className={cn(
                                                "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                                                notification.read ? "bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-black shadow-sm"
                                            )}>
                                                {getIcon(notification.type)}
                                            </div>

                                            <div className="flex-1 pr-6">
                                                <h3 className={cn("font-bold mb-1", notification.read ? "text-gray-700 dark:text-gray-300" : "text-foreground")}>
                                                    {notification.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                                                    {notification.message}
                                                </p>

                                                <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                                                    <span>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</span>
                                                    {notification.link && (
                                                        <Link href={notification.link} className="text-primary hover:underline z-10" onClick={(e) => e.stopPropagation()}>
                                                            View details
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        ) : (
                            <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">No notifications yet</h3>
                                <p className="text-muted-foreground">We'll let you know when something happens.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
