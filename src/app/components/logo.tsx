"use client"

import { Shield, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface LogoProps {
    forceText?: boolean // force text on all screen sizes
    className?: string
}

export default function Logo({ forceText = false, className }: LogoProps) {
    return (
        <div className={cn("flex items-center gap-3", className)}>
            {/* Logo Icon */}
            <div className="relative w-12 h-12 flex items-center justify-center">
                {/* Background with African-inspired geometric pattern */}
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-lg transform -rotate-6 shadow-md opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 rounded-lg transform rotate-6 shadow-lg" />


                {/* Main container */}
                <div className="relative z-10 w-10 h-10 bg-white rounded-md shadow-inner flex items-center justify-center">
                    {/* Shield for security */}
                    <Shield
                        className="w-6 h-6 text-green-600 absolute"
                        strokeWidth={2.5}
                        fill="currentColor"
                        fillOpacity={0.1}
                    />

                    {/* Users icon for freelancers */}
                    <Users
                        className="w-4 h-4 text-amber-600 absolute"
                        strokeWidth={3}
                        style={{ transform: "translateY(1px)" }}
                    />
                </div>
            </div>

            {/* Text Logo */}
            <div
                className={cn(
                    "flex flex-col leading-tight",
                    forceText ? "flex" : "hidden sm:flex"
                )}
            >
                <span className="font-bold text-2xl text-green-600 tracking-tight">
                    Afro<span className="text-amber-600">Task</span>
                </span>
                <span className="text-xs text-gray-500 font-medium tracking-wide -mt-1">
                    Trust First Freelance
                </span>
            </div>
        </div>
    )
}
