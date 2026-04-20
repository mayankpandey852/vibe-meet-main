"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthModal } from "@/components/auth-modal";

interface User {
    name: string;
    email: string;
    image?: string;
    bio?: string;
    relationshipStatus?: string;
    sexualOrientation?: string;
    interests?: string[];
    location?: string;
    myMeetups?: { id: number; joinedAt: string }[];
    savedMeetups?: number[];
    myGroups?: { id: number; status: 'member' | 'pending'; joinedAt: string }[];
    settings?: {
        newsletter: boolean;
        activityNotifications: boolean;
        privacy: 'public' | 'friends' | 'private';
    };
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    openAuthModal: (options?: { defaultTab?: "login" | "signup"; title?: string }) => void;
    closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTab, setModalTab] = useState<"login" | "signup">("login");
    const [modalTitle, setModalTitle] = useState<string | undefined>(undefined);

    // Persist login state (Simplified for this task)
    useEffect(() => {
        const initAuth = async () => {
            const stored = localStorage.getItem("vibe_meet_user");
            if (stored) {
                const parsedUser = JSON.parse(stored);
                // Optimistic set
                setUser(parsedUser);

                // Re-fetch from server to ensure fresh data (settings, profile changes)
                // In a real app, this would use a session token/cookie
                try {
                    // Dynamically import to avoid circular dependency issues if any
                    const { getCurrentUser } = await import("@/lib/actions");
                    const result = await getCurrentUser(parsedUser.email);
                    if (result.success && result.user) {
                        setUser(result.user);
                        localStorage.setItem("vibe_meet_user", JSON.stringify(result.user));
                    }
                } catch (error) {
                    console.error("Failed to refresh user session:", error);
                }
            }
        };
        initAuth();
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem("vibe_meet_user", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("vibe_meet_user");
    };

    const openAuthModal = (options?: { defaultTab?: "login" | "signup"; title?: string }) => {
        if (options?.defaultTab) setModalTab(options.defaultTab);
        setModalTitle(options?.title);
        setIsModalOpen(true);
    };

    const closeAuthModal = () => {
        setIsModalOpen(false);
        setModalTitle(undefined); // Reset title
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, openAuthModal, closeAuthModal }}>
            {children}
            <AuthModal
                isOpen={isModalOpen}
                onClose={closeAuthModal}
                defaultTab={modalTab}
                customTitle={modalTitle}
            />
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
