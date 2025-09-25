'use client'
import { useUser } from "@/app/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "./loading";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { isAuthenticated, isLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/signin');
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return <div><Loading /></div>;
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div suppressHydrationWarning={true}>
            <section>
                {children}
            </section>
        </div>
    )
}
