'use client'
import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useUser } from '@/app/contexts/UserContext'
import toast from 'react-hot-toast'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface ClientProfileDialogProps {
    user: any;
    refetchUser: () => void;
}

const ClientProfileDialog: React.FC<ClientProfileDialogProps> = ({ user, refetchUser }) => {
    const [profile, setProfile] = useState<any>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (user) {
            setProfile(user);
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile((prev: any) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile((prev: any) => ({
            ...prev,
            user: {
                ...prev.user,
                [name]: value
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const toastId = toast.loading('Updating profile...');
        try {
            const token = localStorage.getItem('trustwork_token');
            const payload = {
                company_name: profile.company_name || '',
                location: profile.location || ''
            };
            const response = await fetch('/api/client-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify(payload)
            });
            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || 'Failed to update profile.', { id: toastId });
            } else {
                toast.success('Profile updated successfully!', { id: toastId });
                await refetchUser();
                setIsOpen(false);
            }
        } catch (error) {
            toast.error('An error occurred.', { id: toastId });
        }
    };

    if (!profile) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>Edit Profile</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="first_name" className='mb-2'>First Name</Label>
                        <Input id="first_name" name="first_name" value={profile.user?.first_name || ''} onChange={handleUserInputChange} />
                    </div>
                    <div>
                        <Label htmlFor="last_name" className='mb-2'>Last Name</Label>
                        <Input id="last_name" name="last_name" value={profile.user?.last_name || ''} onChange={handleUserInputChange} />
                    </div>
                    <div>
                        <Label htmlFor="email" className='mb-2'>Email</Label>
                        <Input id="email" name="email" type="email" value={profile.user?.email || ''} onChange={handleUserInputChange} />
                    </div>
                    <div>
                        <Label htmlFor="company_name" className='mb-2'>Company Name</Label>
                        <Input id="company_name" name="company_name" value={profile.company_name || ''} onChange={handleInputChange} />
                    </div>
                    <div>
                        <Label htmlFor="location" className='mb-2'>Location</Label>
                        <Input id="location" name="location" value={profile.location || ''} onChange={handleInputChange} />
                    </div>
                    <Button type="submit">Save Changes</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ClientProfileDialog;
