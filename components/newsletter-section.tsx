"use client";

import { ArrowRight, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

import { subscribeNewsletter } from "@/lib/actions";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function NewsletterSection() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    async function handleSubmit(formData: FormData) {
        setStatus("loading");
        const result = await subscribeNewsletter(formData);
        if (result.success) {
            setStatus("success");
        } else {
            setStatus("error");
        }
    }

    return (
        <section className="relative py-24 overflow-hidden bg-blue-600 text-white">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pattern-dots" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-50" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-50" />

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-tight">
                            DON'T MISS THE <br />
                            <span className="text-blue-200">DROP.</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-2xl mx-auto font-medium">
                            We're launching in new cities every month. Join the waitlist to get early access when we land in yours.
                        </p>

                        {status === "success" ? (
                            <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md">
                                <h3 className="text-2xl font-bold mb-2">You're on the list! 🎉</h3>
                                <p className="text-blue-100">Keep an eye on your inbox.</p>
                            </div>
                        ) : (
                            <form
                                className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
                                action={handleSubmit}
                            >
                                <div className="relative flex-1">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600" />
                                    <Input
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="Enter your email"
                                        className="h-14 pl-12 rounded-full border-0 bg-white text-blue-900 placeholder:text-blue-300 text-lg shadow-xl focus-visible:ring-offset-2 focus-visible:ring-blue-300"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    size="lg"
                                    disabled={status === "loading"}
                                    className="h-14 px-8 rounded-full bg-blue-950 text-white hover:bg-blue-900 text-lg font-bold shadow-xl transition-all hover:scale-105 disabled:opacity-70"
                                >
                                    {status === "loading" ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Join List <ArrowRight className="w-5 h-5 ml-2" /></>}
                                </Button>
                            </form>
                        )}

                        <p className="mt-6 text-sm text-blue-200 opacity-80">
                            Join 15,000+ others waiting to vibe. No spam, ever.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Style for the dot pattern if not global */}
            <style jsx>{`
                .pattern-dots {
                    background-image: radial-gradient(currentColor 1px, transparent 1px);
                    background-size: 40px 40px;
                }
            `}</style>
        </section>
    );
}
