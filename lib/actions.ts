"use server";

import prisma from "@/lib/db";
import { randomBytes, scrypt } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export async function getMeetups() {
    try {
        const meetups = await prisma.meetup.findMany();
        return JSON.parse(JSON.stringify(meetups));
    } catch (error) {
        console.error("Failed to fetch meetups:", error);
        return [];
    }
}

export async function getGroups() {
    try {
        const groups = await prisma.group.findMany();
        return JSON.parse(JSON.stringify(groups));
    } catch (error) {
        console.error("Failed to fetch groups:", error);
        return [];
    }
}

export async function getSpots() {
    try {
        const spots = await prisma.spot.findMany();
        return JSON.parse(JSON.stringify(spots));
    } catch (error) {
        console.error("Failed to fetch spots:", error);
        return [];
    }
}

// Create Actions
export async function createMeetup(data: any) {
    try {
        const { id, ...rest } = data;
        const newMeetup = await prisma.meetup.create({
            data: {
                ...rest,
                // If id is provided and numeric, use it, otherwise let DB autoincrement
                ...(id ? { id: Number(id) } : {}),
            },
        });
        return JSON.parse(JSON.stringify(newMeetup));
    } catch (error) {
        console.error("Failed to create meetup:", error);
        throw error;
    }
}

export async function createGroup(data: any) {
    try {
        const { id, ...rest } = data;
        const newGroup = await prisma.group.create({
            data: {
                ...rest,
                ...(id ? { id: Number(id) } : {}),
            },
        });
        return JSON.parse(JSON.stringify(newGroup));
    } catch (error) {
        console.error("Failed to create group:", error);
        throw error;
    }
}

export async function createSpot(data: any) {
    try {
        const { id, ...rest } = data;
        const newSpot = await prisma.spot.create({
            data: {
                ...rest,
                ...(id ? { id: Number(id) } : {}),
            },
        });
        return JSON.parse(JSON.stringify(newSpot));
    } catch (error) {
        console.error("Failed to create spot:", error);
        throw error;
    }
}

// Authentication Actions
export async function registerUser(formData: FormData) {
    try {
        const name = formData.get("name") as string;
        const email = (formData.get("email") as string)?.toLowerCase();
        const password = formData.get("password") as string;
        const location = formData.get("location") as string;

        if (!email || !password || !name) {
            return { error: "Missing required fields" };
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return { error: "User already exists" };
        }

        // Hash password
        const salt = randomBytes(16).toString("hex");
        const buf = (await scryptAsync(password, salt, 64)) as Buffer;
        const hashedPassword = `${buf.toString("hex")}.${salt}`;

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                location,
            },
        });

        return { success: true, user: { name: newUser.name, email: newUser.email } };

    } catch (error) {
        console.error("Registration error:", error);
        return { error: "Registration failed" };
    }
}

export async function loginUser(formData: FormData) {
    try {
        const email = (formData.get("email") as string)?.toLowerCase();
        const password = formData.get("password") as string;

        if (!email || !password) {
            return { error: "Missing required fields" };
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return { error: "Invalid credentials" };
        }

        const [hashed, salt] = user.password.split(".");
        const buf = (await scryptAsync(password, salt, 64)) as Buffer;

        if (buf.toString("hex") !== hashed) {
            return { error: "Invalid credentials" };
        }

        return { success: true, user: { name: user.name, email: user.email } };

    } catch (error) {
        console.error("Login error:", error);
        return { error: "Login failed" };
    }
}

// Newsletter Action
export async function subscribeNewsletter(formData: FormData) {
    try {
        const email = (formData.get("email") as string)?.toLowerCase();

        if (!email) {
            return { error: "Email is required" };
        }

        await prisma.subscriber.upsert({
            where: { email },
            update: { subscribedAt: new Date() },
            create: { email, subscribedAt: new Date() },
        });

        return { success: true };
    } catch (error) {
        console.error("Newsletter error:", error);
        return { error: "Subscription failed" };
    }
}

// Profile Update Action
export async function updateUserProfile(formData: FormData) {
    try {
        const email = (formData.get("email") as string)?.toLowerCase();
        if (!email) {
            return { error: "User email is required for update" };
        }

        const updates: any = {};

        // Extract fields
        const name = formData.get("name") as string;
        if (name) updates.name = name;

        const location = formData.get("location") as string;
        if (location) updates.location = location;

        const image = formData.get("image") as string;
        if (image) updates.image = image;

        const bio = formData.get("bio") as string;
        if (bio) updates.bio = bio;

        const relationshipStatus = formData.get("relationshipStatus") as string;
        if (relationshipStatus) updates.relationshipStatus = relationshipStatus;

        const sexualOrientation = formData.get("sexualOrientation") as string;
        if (sexualOrientation) updates.sexualOrientation = sexualOrientation;

        // Interests - might come as comma-separated string or multiple entries
        const interestsRaw = formData.get("interests");
        if (interestsRaw) {
            updates.interests = (interestsRaw as string).split(",").map(i => i.trim()).filter(Boolean);
        }

        const updatedUser = await prisma.user.update({
            where: { email },
            data: updates,
        });

        // Return user without password
        const { password, ...userSafe } = updatedUser as any;
        return { success: true, user: JSON.parse(JSON.stringify(userSafe)) };

    } catch (error) {
        console.error("Profile update error:", error);
        return { error: "Failed to update profile" };
    }
}

// User Activity Actions
export async function toggleMeetupJoin(emailInput: string, meetupId: number) {
    try {
        const email = emailInput.toLowerCase();
        if (!email) return { error: "Not authenticated" };

        const user = await prisma.user.findUnique({
            where: { email },
            include: { myMeetups: true },
        });
        if (!user) return { error: "User not found" };

        const existing = user.myMeetups.find((m) => m.meetupId === meetupId);
        let action = "";

        if (existing) {
            await prisma.userMeetup.delete({
                where: {
                    userId_meetupId: {
                        userId: user.id,
                        meetupId: meetupId,
                    },
                },
            });
            action = "removed";
        } else {
            await prisma.userMeetup.create({
                data: {
                    userId: user.id,
                    meetupId: meetupId,
                },
            });
            action = "added";
        }

        const updatedMeetups = await prisma.userMeetup.findMany({
            where: { userId: user.id },
        });

        return { success: true, action, myMeetups: JSON.parse(JSON.stringify(updatedMeetups)) };
    } catch (error) {
        console.error("Toggle join error:", error);
        return { error: "Failed to update" };
    }
}

export async function toggleMeetupSave(emailInput: string, meetupId: number) {
    try {
        const email = emailInput.toLowerCase();
        if (!email) return { error: "Not authenticated" };

        const user = await prisma.user.findUnique({
            where: { email },
            include: { savedMeetups: true },
        });
        if (!user) return { error: "User not found" };

        const existing = user.savedMeetups.find((m) => m.meetupId === meetupId);
        let action = "";

        if (existing) {
            await prisma.userSavedMeetup.delete({
                where: {
                    userId_meetupId: {
                        userId: user.id,
                        meetupId: meetupId,
                    },
                },
            });
            action = "removed";
        } else {
            await prisma.userSavedMeetup.create({
                data: {
                    userId: user.id,
                    meetupId: meetupId,
                },
            });
            action = "added";
        }

        const updatedSaved = await prisma.userSavedMeetup.findMany({
            where: { userId: user.id },
        });
        return { success: true, action, savedMeetups: updatedSaved.map(s => s.meetupId) };
    } catch (error) {
        console.error("Toggle save error:", error);
        return { error: "Failed to update" };
    }
}

export async function joinGroup(emailInput: string, groupId: number) {
    try {
        const email = emailInput.toLowerCase();
        if (!email) return { error: "Not authenticated" };

        const user = await prisma.user.findUnique({
            where: { email },
            include: { myGroups: true },
        });
        if (!user) return { error: "User not found" };

        const existing = user.myGroups.find((g) => g.groupId === groupId);
        if (existing) return { error: "Already joined or pending" };

        const status = Math.random() > 0.5 ? 'member' : 'pending';

        await prisma.userGroup.create({
            data: {
                userId: user.id,
                groupId: groupId,
                status,
            },
        });

        const updatedGroups = await prisma.userGroup.findMany({
            where: { userId: user.id },
        });

        return { success: true, status, myGroups: JSON.parse(JSON.stringify(updatedGroups)) };
    } catch (error) {
        console.error("Join group error:", error);
        return { error: "Failed to join" };
    }
}

export async function getUserActivityData(emailInput: string) {
    try {
        const email = emailInput.toLowerCase();
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                myMeetups: { include: { meetup: true } },
                savedMeetups: { include: { meetup: true } },
                myGroups: { include: { group: true } },
            },
        });
        if (!user) return { error: "User not found" };

        return {
            success: true,
            myMeetups: JSON.parse(JSON.stringify(user.myMeetups.map(m => m.meetup))),
            savedMeetups: JSON.parse(JSON.stringify(user.savedMeetups.map(m => m.meetup))),
            myGroups: JSON.parse(JSON.stringify(user.myGroups.map(g => g.group))),
            userGroups: JSON.parse(JSON.stringify(user.myGroups)) // To get status
        };

    } catch (error) {
        console.error("Fetch activity error:", error);
        return { error: "Failed to fetch data" };
    }
}

export async function updateSettings(emailInput: string, settings: any) {
    try {
        const email = emailInput.toLowerCase();
        if (!email) return { error: "Not authenticated" };

        const updatedUser = await prisma.user.update({
            where: { email },
            data: { settings: settings }, // Prisma handles JSON
        });

        const { password, ...userSafe } = updatedUser as any;
        return { success: true, user: JSON.parse(JSON.stringify(userSafe)) };

    } catch (error) {
        console.error("Update settings error:", error);
        return { error: "Failed to update settings" };
    }
}

export async function getCurrentUser(emailInput: string) {
    try {
        const email = emailInput.toLowerCase();
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return { error: "User not found" };

        const { password, ...userSafe } = user as any;
        return { success: true, user: JSON.parse(JSON.stringify(userSafe)) };
    } catch (error) {
        console.error("Get user error:", error);
        return { error: "Failed to fetch user" };
    }
}

// Notification Actions
export async function getNotifications(emailInput: string) {
    try {
        const email = emailInput.toLowerCase();
        if (!email) return { error: "Not authenticated" };

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return { error: "User not found" };

        const notifications = await prisma.notification.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
        });

        return { success: true, notifications: JSON.parse(JSON.stringify(notifications)) };
    } catch (error) {
        console.error("Get notifications error:", error);
        return { error: "Failed to fetch notifications" };
    }
}

export async function markNotificationRead(notificationId: string) {
    try {
        await prisma.notification.update({
            where: { id: notificationId },
            data: { read: true },
        });
        return { success: true };
    } catch (error) {
        console.error("Mark read error:", error);
        return { error: "Failed to update notification" };
    }
}

export async function markAllNotificationsRead(emailInput: string) {
    try {
        const email = emailInput.toLowerCase();
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return { error: "User not found" };

        await prisma.notification.updateMany({
            where: { userId: user.id, read: false },
            data: { read: true },
        });
        return { success: true };
    } catch (error) {
        console.error("Mark all read error:", error);
        return { error: "Failed to update notifications" };
    }
}

// Internal helper to create notification
export async function createNotification(userId: string, data: { type: string, title: string, message: string, link?: string }) {
    try {
        await prisma.notification.create({
            data: {
                userId,
                ...data
            }
        });
        return { success: true };
    } catch (error) {
        console.error("Create notification error:", error);
        return { error: "Failed to create notification" };
    }
}
