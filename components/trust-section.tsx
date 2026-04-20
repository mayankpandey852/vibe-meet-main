"use client";

import { ShieldCheck, UserCheck, MapPin, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { SectionContainer } from "@/components/section-container";

const safetyFeatures = [
    {
        title: "Verified Identity",
        description: "No bots, no fakes. We verify every profile to ensure you're connecting with real people.",
        icon: UserCheck
    },
    {
        title: "Public Venues Only",
        description: "All meetups start in verified, public locations. We partner with safe, popular local spots.",
        icon: MapPin
    },
    {
        title: "Community Watch",
        description: "Our 24/7 moderation team and active community reporting keep the vibe safe and positive.",
        icon: Eye
    }
];

export function TrustSection() {
    return (
        <section className="bg-white py-24 border-t border-slate-100">
            <SectionContainer>
                <div className="flex flex-col md:flex-row items-center gap-16">
                    {/* Left: Main Heading & Badge */}
                    <div className="flex-1 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-bold text-sm mb-6">
                                <ShieldCheck className="w-4 h-4" />
                                <span>Safety First</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight mb-6">
                                RELAX,<br />
                                IT'S <span className="text-blue-600">VERIFIED.</span>
                            </h2>
                            <p className="text-lg text-slate-600 text-pretty max-w-lg mx-auto md:mx-0">
                                We've built safety into every pixel. From public-only meetups to verified profiles, we take care of the heavy lifting so you can just vibe.
                            </p>
                        </motion.div>
                    </div>

                    {/* Right: Feature Grid */}
                    <div className="flex-1 w-full">
                        <div className="grid gap-6">
                            {safetyFeatures.map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-xl transition-all duration-300 group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-110 transition-transform">
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900 mb-1">{feature.title}</h3>
                                        <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </SectionContainer>
        </section>
    );
}
