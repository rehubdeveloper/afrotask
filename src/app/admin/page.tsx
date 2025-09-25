'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../contexts/UserContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminPage() {
    const { user, isLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            console.log('Admin page - User:', user);
            console.log('Admin page - User type:', user?.user_type);
            console.log('Admin page - User email:', user?.email);
            console.log('Admin page - Admin email env:', process.env.NEXT_PUBLIC_ADMIN_EMAIL);
            
            const isAdmin = user?.user_type === 'admin' || user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL || user?.email === 'admin@gmail.com';
            console.log('Admin page - Is admin:', isAdmin);
            
            if (!user || !isAdmin) {
                console.log('Admin page - Redirecting to dashboard');
                router.push('/dashboard');
            } else {
                console.log('Admin page - Redirecting to admin dashboard');
                router.push('/admin/dashboard');
            }
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return null;
}
