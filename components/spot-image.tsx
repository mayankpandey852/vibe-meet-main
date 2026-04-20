"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";

import { cn } from "@/lib/utils";

export function SpotImage({ src, alt, className }: { src: string, alt: string, className?: string }) {
    const [error, setError] = useState(false);

    if (error) {
        return (
            <div className={cn("w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400", className)}>
                <ImageOff className="w-8 h-8 mb-2" />
                <span className="text-xs">Image unavailable</span>
            </div>
        );
    }

    return (
        <Image
            src={src}
            alt={alt}
            fill
            className={cn("object-cover", className)}
            unoptimized
            onError={() => setError(true)}
        />
    );
}
