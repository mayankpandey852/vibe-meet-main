"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { useAuth } from "@/components/auth-context";
import { getUserActivityData } from "@/lib/actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default function MyGroupsPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{ myGroups: any[], userGroups: any[] }>({ myGroups: [], userGroups: [] });

    useEffect(() => {
        const fetchData = async () => {
            if (user?.email) {
                const res = await getUserActivityData(user.email);
                if (res.success) {
                    setData({
                        myGroups: res.myGroups,
                        userGroups: res.userGroups
                    });
                }
            }
            setLoading(false);
        };
        fetchData();
    }, [user]);

    if (!user) return <div className="min-h-screen flex items-center justify-center">Please log in</div>;

    // Filter Logic
    // userGroups contains { id, status }
    // myGroups contains full group objects
    const memberGroups = data.myGroups.filter(g => {
        const relationship = data.userGroups.find((ug: any) => ug.id === g.id);
        return relationship?.status === 'member';
    });

    const pendingGroups = data.myGroups.filter(g => {
        const relationship = data.userGroups.find((ug: any) => ug.id === g.id);
        return relationship?.status === 'pending';
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">
            <Navbar />
            <main className="pt-32 pb-20 px-4 max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">My Groups</h1>

                {loading ? (
                    <div className="flex justify-center p-12"><Loader2 className="animate-spin w-8 h-8" /></div>
                ) : (
                    <Tabs defaultValue="member" className="w-full">
                        <TabsList className="mb-8">
                            <TabsTrigger value="member">Member {memberGroups.length > 0 && `(${memberGroups.length})`}</TabsTrigger>
                            <TabsTrigger value="pending">Pending {pendingGroups.length > 0 && `(${pendingGroups.length})`}</TabsTrigger>
                        </TabsList>

                        <TabsContent value="member">
                            {memberGroups.length === 0 ? <p className="text-muted-foreground p-8 text-center bg-white dark:bg-gray-900 rounded-3xl">You are not a member of any groups.</p> : (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {memberGroups.map((group) => (
                                        <GroupCard key={group.id} group={group} status="member" />
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="pending">
                            {pendingGroups.length === 0 ? <p className="text-muted-foreground p-8 text-center bg-white dark:bg-gray-900 rounded-3xl">No pending requests.</p> : (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {pendingGroups.map((group) => (
                                        <GroupCard key={group.id} group={group} status="pending" />
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                )}
            </main>
        </div>
    );
}

function GroupCard({ group, status }: { group: any, status: 'member' | 'pending' }) {
    return (
        <div className="group block bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-800 relative">
            <div className="relative h-48">
                <Image src={group.image} alt={group.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3">
                    <Badge variant={status === 'member' ? "default" : "secondary"}>
                        {status === 'member' ? "Member" : "Pending"}
                    </Badge>
                </div>
            </div>
            <div className="p-5">
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">{group.name}</h3>
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-gray-100 dark:border-gray-800">
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {group.members || 0} members</span>
                        <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">{group.category}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
