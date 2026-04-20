"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CTAButton } from "@/components/cta-button";
import { SectionContainer } from "@/components/section-container";
import { FeatureCard } from "@/components/feature-card";
import { Badge } from "@/components/ui/badge";
import { MotionSection } from "@/components/motion-section";
import { FeatureDemoModal } from "@/components/feature-demo-modal";
import { SmoothScroll } from "@/components/smooth-scroll";
import { SpotsCarousel } from "@/components/spots-carousel";
import { Marquee } from "@/components/marquee";
import { MeetupsList } from "@/components/meetups-list";
import { FeaturesRow } from "@/components/features-row";
import { HeroGeometric } from "@/components/hero-geometric";
import { TrustSection } from "@/components/trust-section";
import { NewsletterSection } from "@/components/newsletter-section";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Users,
  Calendar,
  MessageCircle,
  ShieldCheck,
  Bell,
  Heart,
  Search,
  CheckCircle2,
  ArrowRight,
  Clock,
} from "lucide-react";

export default function Home() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const openDemo = (feature: string) => setActiveFeature(feature);
  const closeDemo = () => setActiveFeature(null);

  return (
    <SmoothScroll>
      <div className="flex flex-col gap-0 bg-background overflow-x-hidden">
        <FeatureDemoModal isOpen={!!activeFeature} onClose={closeDemo} feature={activeFeature} />

        {/* 1) Hero Section - Geometric Style */}
        <HeroGeometric />

        {/* 2) Best Happening Spots (Carousel) */}
        <section className="py-24 bg-white relative">
          <div className="container mx-auto px-4 md:px-24 mb-12 flex justify-between items-end">
            <div>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4">Trending <br /><span className="text-primary italic">Spots</span></h2>
              <p className="text-xl text-muted-foreground">Curated venues with the best vibes this week.</p>
            </div>
            <Link href="/places">
              <CTAButton variant="outline" className="hidden md:flex rounded-full">View All Places</CTAButton>
            </Link>
          </div>

          <SpotsCarousel />
        </section>

        {/* 3) Upcoming Meetups (List) */}
        <section className="py-24 bg-muted/30">
          <SectionContainer>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Upcoming <span className="text-primary italic">Vibes</span></h2>
              <p className="text-muted-foreground text-lg">Join a plan and show up. It's that simple.</p>
            </div>

            <MeetupsList />

            <div className="mt-12 text-center">
              <Link href="/meetups">
                <CTAButton className="min-w-[200px]">Find More Meetups</CTAButton>
              </Link>
            </div>
          </SectionContainer>
        </section>

        {/* 4) Cities We Operate In (Marquee) */}
        <div className="py-12 bg-black">
          <Marquee items={["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Pune", "Chennai", "Jaipur", "Goa"]} />
        </div>

        {/* ... Rest of the sections reused ... */}

        {/* Features Grid (Reused) */}
        {/* Features Grid (Custom Width) */}
        <section id="features" className="py-12 md:py-24 w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Built for Connection</h2>
          </div>
          <FeaturesRow openDemo={openDemo} />
        </section>

        <TrustSection />
        <NewsletterSection />
      </div>
    </SmoothScroll>
  );
}
