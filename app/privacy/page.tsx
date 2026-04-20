import { SectionContainer } from "@/components/section-container";

export default function PrivacyPage() {
    return (
        <SectionContainer className="max-w-3xl py-20">
            <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
            <div className="prose prose-gray max-w-none">
                <p className="lead">
                    Last updated: {new Date().toLocaleDateString()}
                </p>
                <p>
                    At Vibe & Meet, we take your privacy seriously. This Privacy Policy explains how we collect, use, and share your personal information when you use our platform.
                </p>

                <h2>1. Information We Collect</h2>
                <p>
                    We collect information you provide directly to us, such as when you create an account, update your profile, join a meetup, or communicate with us. This may include your name, email address, profile photo, and interests.
                </p>

                <h2>2. How We Use Your Information</h2>
                <p>
                    We use your information to:
                </p>
                <ul>
                    <li>Provide, maintain, and improve our services.</li>
                    <li>Match you with relevant meetups and places.</li>
                    <li>Send you technical notices and support messages.</li>
                    <li>Respond to your comments and questions.</li>
                </ul>

                <h2>3. Location Information</h2>
                <p>
                    With your consent, we may collect information about your actual location to provide location-based features, such as finding meetups near you.
                </p>

                <h2>4. Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy, please contact us at privacy@vibeandmeet.com.
                </p>
            </div>
        </SectionContainer>
    );
}
