"use client";

import { useState, useEffect, useRef } from "react";
import { X, Send, Minimize2, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    id: number;
    text: string;
    sender: "me" | "them";
    time: string;
}

interface ChatWindowProps {
    friend: {
        id: number;
        name: string;
        image: string;
        status: string;
    } | null;
    onClose: () => void;
}

export function ChatWindow({ friend, onClose }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hey! How are you?", sender: "them", time: "10:00 AM" },
        { id: 2, text: "I'm doing great, thanks! fast-paced day.", sender: "me", time: "10:05 AM" },
        { id: 3, text: "Want to catch up later?", sender: "them", time: "10:06 AM" }
    ]);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const newMessage: Message = {
            id: Date.now(),
            text: inputValue,
            sender: "me",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newMessage]);
        setInputValue("");

        // Mock reply
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "Sounds like a plan! 👍",
                sender: "them",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        }, 1500);
    };

    if (!friend) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="fixed bottom-4 right-4 w-80 md:w-96 h-[500px] bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="p-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-black">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Avatar className="w-10 h-10 border border-gray-100">
                                <AvatarImage src={friend.image} />
                                <AvatarFallback>{friend.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-black rounded-full"></span>
                        </div>
                        <div>
                            <h3 className="font-bold text-sm leading-none">{friend.name}</h3>
                            <span className="text-xs text-muted-foreground">Active now</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={onClose}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/50">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.sender === "me"
                                    ? "bg-blue-600 text-white rounded-br-none"
                                    : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-bl-none"
                                    }`}
                            >
                                <p>{msg.text}</p>
                                <p className={`text-[10px] mt-1 opacity-70 ${msg.sender === "me" ? "text-blue-100" : "text-muted-foreground"}`}>
                                    {msg.time}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 bg-white dark:bg-black border-t border-gray-100 dark:border-gray-800">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSend();
                        }}
                        className="flex gap-2"
                    >
                        <Input
                            placeholder="Type a message..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="rounded-full bg-gray-50 dark:bg-gray-900 border-0 focus-visible:ring-1 focus-visible:ring-blue-500"
                        />
                        <Button type="submit" size="icon" className="rounded-full bg-blue-600 hover:bg-blue-700 shrink-0">
                            <Send className="w-4 h-4" />
                        </Button>
                    </form>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
