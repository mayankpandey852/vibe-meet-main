"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { CTAButton } from "@/components/cta-button";
import { cn } from "@/lib/utils";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu, X, Bell, LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

export function Navbar() {
    return (
        <Suspense fallback={
            <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
                <div className="w-full max-w-5xl flex items-center justify-between px-6 py-3 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-lg border border-white/20">
                    <div className="h-10 w-32 bg-gray-100 rounded-full animate-pulse" />
                </div>
            </header>
        }>
            <NavbarContent />
        </Suspense>
    );
}

function NavbarContent() {
    const [hidden, setHidden] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
        setScrolled(latest > 50);
    });

    // Close mobile menu when path changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname, searchParams]);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMobileMenuOpen]);



    const { user, openAuthModal, logout } = useAuth();


    // Navigation Links
    const links = [
        { name: "Events", href: "/meetups?type=events", isActive: pathname === "/meetups" && (!searchParams.get("type") || searchParams.get("type") === "events") },
        { name: "Places", href: "/places", isActive: pathname === "/places" },
        { name: "Groups", href: "/meetups?type=groups", isActive: pathname === "/meetups" && searchParams.get("type") === "groups" },
        { name: "Friends", href: "/friends", isActive: pathname === "/friends" },
    ];

    return (
        <>
            {/* Global AuthModal is handled in layout/AuthContext */}


            <motion.header
                variants={{
                    visible: { y: 0 },
                    hidden: { y: "-100%" },
                }}
                animate={hidden ? "hidden" : "visible"}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4"
            >
                <div
                    className={cn(
                        "w-full max-w-5xl flex items-center justify-between px-6 py-3 rounded-full transition-all duration-300 border border-transparent relative z-50",
                        scrolled || isMobileMenuOpen
                            ? "bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-lg border-white/20 dark:border-white/10"
                            : "bg-transparent backdrop-blur-0"
                    )}
                >
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group relative z-10">
                        <div className="relative w-12 h-12 md:w-16 md:h-16 overflow-hidden rounded-full shadow-md group-hover:shadow-xl transition-all duration-300 ring-2 ring-white/20">
                            <Image
                                src="/logo.jpg"
                                alt="Vibe & Meet Logo"
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 bg-white/50 backdrop-blur-md p-1.5 rounded-full border border-white/20 shadow-sm">
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 relative",
                                    link.isActive
                                        ? "bg-primary text-white shadow-md"
                                        : "text-muted-foreground hover:text-primary hover:bg-white/60"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Actions */}
                    <div className="relative z-10 hidden md:flex items-center gap-4">
                        {user ? (
                            <>
                                <div className="relative">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-foreground relative rounded-full hover:bg-black/5 dark:hover:bg-white/10 w-10 h-10"
                                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                    >
                                        <Bell className="w-6 h-6" />
                                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-black"></span>
                                    </Button>

                                    <AnimatePresence>
                                        {isNotificationsOpen && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-40 bg-transparent"
                                                    onClick={() => setIsNotificationsOpen(false)}
                                                />
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                    transition={{ duration: 0.1 }}
                                                    className="absolute right-0 top-12 w-80 bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl z-50 overflow-hidden"
                                                >
                                                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50">
                                                        <h3 className="font-semibold text-sm">Notifications</h3>
                                                        <span className="text-xs text-primary font-bold cursor-pointer hover:underline">Mark all read</span>
                                                    </div>
                                                    <div className="max-h-[300px] overflow-y-auto">
                                                        {[1, 2, 3].map((i) => (
                                                            <div key={i} className="p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer flex gap-3">
                                                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                                                                <div>
                                                                    <p className="text-sm font-medium leading-tight mb-1">New meetup near you!</p>
                                                                    <p className="text-xs text-muted-foreground">"Tech Founders Mixer" is happening tomorrow.</p>
                                                                    <p className="text-[10px] text-muted-foreground mt-2">2 hours ago</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="p-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 text-center">
                                                        <Link href="/notifications" onClick={() => setIsNotificationsOpen(false)}>
                                                            <Button variant="ghost" size="sm" className="text-xs w-full h-8">View all notifications</Button>
                                                        </Link>
                                                    </div>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="relative w-12 h-12 rounded-full overflow-hidden cursor-pointer border-2 border-white/20 shadow-sm hover:shadow-md transition-all focus:outline-none"
                                    >
                                        <Avatar className="w-full h-full">
                                            <AvatarImage src={user.image} alt={user.name} />
                                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                {user.name?.charAt(0) || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </button>

                                    <AnimatePresence>
                                        {isProfileOpen && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-40 bg-transparent"
                                                    onClick={() => setIsProfileOpen(false)}
                                                />
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                    transition={{ duration: 0.1 }}
                                                    className="absolute right-0 top-12 w-56 bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl p-2 z-50 overflow-hidden"
                                                >
                                                    <div className="px-3 py-2 text-sm font-semibold border-b border-gray-100 dark:border-gray-800 mb-1">
                                                        {user.name}
                                                        <div className="font-normal text-xs text-muted-foreground">{user.email}</div>
                                                    </div>

                                                    <Link href="/profile" className="block w-full">
                                                        <button className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                                            Profile
                                                        </button>
                                                    </Link>
                                                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-1" />

                                                    <Link href="/profile/meetups" className="block w-full">
                                                        <button className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                                            My Meetups
                                                        </button>
                                                    </Link>
                                                    <Link href="/profile/groups" className="block w-full">
                                                        <button className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                                            My Groups
                                                        </button>
                                                    </Link>

                                                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-1" />

                                                    <Link href="/settings" className="block w-full">
                                                        <button className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                                            Settings
                                                        </button>
                                                    </Link>

                                                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-1" />

                                                    <button
                                                        onClick={() => {
                                                            setIsProfileOpen(false);
                                                            logout();
                                                        }}
                                                        className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 transition-colors flex items-center gap-2"
                                                    >
                                                        <LogOut className="w-4 h-4" /> Log out
                                                    </button>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        ) : (
                            <CTAButton
                                className="rounded-full px-6 h-11 text-base shadow-lg hover:shadow-primary/30"
                                glow
                                onClick={() => openAuthModal({ defaultTab: "signup" })}
                            >
                                Join Now
                            </CTAButton>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden relative z-10 p-2 text-foreground"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </motion.header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: "-100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "-100%" }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed inset-0 z-40 bg-white/95 backdrop-blur-3xl pt-32 px-6 flex flex-col items-center md:hidden"
                    >
                        <nav className="flex flex-col items-center gap-6 w-full max-w-sm">
                            {links.map((link, i) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + i * 0.1 }}
                                    className="w-full"
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={cn(
                                            "block w-full text-center py-4 text-2xl font-bold rounded-2xl transition-all",
                                            link.isActive
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted-foreground hover:text-foreground hover:bg-gray-50"
                                        )}
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}



                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 }}
                                className="w-full mt-4"
                            >
                                {user ? (
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-2xl">
                                            <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                                                <AvatarImage src={user.image} alt={user.name} />
                                                <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                                                    {user.name?.charAt(0) || "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-bold">{user.name}</p>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" className="w-full h-12 rounded-xl justify-start" onClick={logout}>
                                            <LogOut className="w-4 h-4 mr-2" /> Log out
                                        </Button>
                                    </div>
                                ) : (
                                    <CTAButton
                                        className="w-full h-14 text-xl rounded-2xl shadow-xl"
                                        glow
                                        onClick={() => {
                                            openAuthModal({ defaultTab: "signup" });
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        Join Now
                                    </CTAButton>
                                )}
                            </motion.div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
