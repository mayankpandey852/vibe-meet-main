"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Twitter, Linkedin, ArrowUpRight, Github } from "lucide-react";
import { Button } from "./ui/button";
import { AuthModal } from "./auth-modal";

export function Footer() {
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [authTab, setAuthTab] = useState<"login" | "signup">("login");

    return (
        <footer className="bg-black text-white pt-24 pb-12 rounded-t-[3rem] mt-12 overflow-hidden relative">
            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} defaultTab={authTab} />
            {/* Background Gradient */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                {/* Top Section: CTA + Brand */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20">
                    <div className="max-w-2xl">
                        <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
                            <div className="relative w-10 h-10 overflow-hidden rounded-full ring-2 ring-white/20 group-hover:ring-primary transition-all">
                                <Image
                                    src="/logo.jpg"
                                    alt="Vibe & Meet Logo"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="font-black text-2xl tracking-tighter">Vibe<span className="text-primary">&</span>Meet</span>
                        </Link>
                        <h2 className="text-5xl md:text-7xl font-bold tracking-tight leading-[0.9] mb-6">
                            Start connecting <br />
                            <span className="text-muted-foreground/60">in the real world.</span>
                        </h2>
                    </div>

                    <div className="flex gap-4">
                        <Button className="rounded-full h-14 px-6 text-base bg-white text-black hover:bg-white/90 flex items-center gap-2">
                            <span className="text-xl"></span> App Store
                        </Button>
                        <Button className="rounded-full h-14 px-6 text-base bg-white/10 text-white hover:bg-white/20 border border-white/20 flex items-center gap-2">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M3.609 1.814L13.792 12 3.61 22.186a2.658 2.658 0 010-20.372zM15.467 13.674l2.454 2.454a.637.637 0 010 .902l-2.43 2.43-1.699-1.699 1.675-4.087zm3.125-6.696l-3.328 3.328-1.571-3.83 1.57-3.832 3.33 3.33a.637.637 0 010 .902v.102zM12.062 10.27L5.352 3.56c-.346-.346-.897-.346-1.243 0L12.062 11.96 12.062 10.27z" />
                            </svg>
                            Google Play
                        </Button>

                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/10 mb-12" />

                {/* Bottom Section: Links */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    {/* Important Links */}
                    <div className="flex flex-wrap gap-8 text-sm font-medium text-muted-foreground">
                        <Link href="/meetups" className="hover:text-white transition-colors">Events</Link>
                        <Link href="/places" className="hover:text-white transition-colors">Places</Link>
                        <Link href="/meetups?type=groups" className="hover:text-white transition-colors">Groups</Link>
                        <button onClick={() => { setAuthTab("signup"); setIsAuthOpen(true); }} className="hover:text-white transition-colors text-left">Create a Group</button>
                        <button onClick={() => { setAuthTab("signup"); setIsAuthOpen(true); }} className="hover:text-white transition-colors text-left">Sign Up</button>
                        <button onClick={() => { setAuthTab("login"); setIsAuthOpen(true); }} className="hover:text-white transition-colors text-left">Login</button>
                        <Link href="/help" className="hover:text-white transition-colors">Help</Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                    </div>

                    {/* Socials */}
                    <div className="flex items-center gap-4">
                        {[Instagram, Twitter, Linkedin, Github].map((Icon, i) => (
                            <Link
                                key={i}
                                href="#"
                                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all hover:scale-110"
                            >
                                <Icon className="w-4 h-4" />
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="mt-12 text-center text-xs text-white/20">
                    &copy; {new Date().getFullYear()} Vibe & Meet. Made with ❤️ for community.
                </div>
            </div>
        </footer>
    );
}
