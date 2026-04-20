import { SectionContainer } from "@/components/section-container";

export default function TermsPage() {
    return (
        <SectionContainer className="max-w-3xl py-20">
            <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
            <div className="prose prose-gray max-w-none">
                <p className="lead">
                    Last updated: {new Date().toLocaleDateString()}
                </p>
                <p>
                    Please read these Terms of Service clearly before using Vibe & Meet.
                </p>

                <h2>1. Acceptance of Terms</h2>
                <p>
                    By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service.
                </p>

                <h2>2. Community Guidelines</h2>
                <p>
                    You agree to use Vibe & Meet only for lawful purposes and in accordance with our Community Guidelines. You agree not to:
                </p>
                <ul>
                    <li>Harass, abuse, or harm another person.</li>
                    <li>Use the service for any illegal purpose.</li>
                    <li>Spam or solicit other users.</li>
                </ul>

                <h2>3. Termination</h2>
                <p>
                    We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                </p>

                <h2>4. Changes</h2>
                <p>
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
                </p>
            </div>
        </SectionContainer>
    );
}
