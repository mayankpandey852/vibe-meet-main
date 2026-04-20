"use client";

import { SectionContainer } from "@/components/section-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
    return (
        <SectionContainer className="max-w-2xl py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
                <p className="text-muted-foreground">
                    Have questions, feedback, or partnership ideas? We'd love to hear from you.
                </p>
            </div>

            <form className="space-y-6 bg-card p-8 rounded-2xl border shadow-sm" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Your name" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="your@email.com" required />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="What can we help you with?" required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Type your message here..." className="min-h-[150px]" required />
                </div>

                <Button className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 text-white rounded-full">
                    Send Message
                </Button>
            </form>
        </SectionContainer>
    );
}
