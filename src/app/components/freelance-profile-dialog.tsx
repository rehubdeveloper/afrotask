'use client'
import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useUser } from '@/app/contexts/UserContext'
import toast from 'react-hot-toast'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface FreelanceProfileDialogProps {
    user: any;
    refetchUser: () => void;
}

const FreelanceProfileDialog: React.FC<FreelanceProfileDialogProps> = ({ user, refetchUser }) => {
    const [profile, setProfile] = useState<any>(null);
    const [newSkill, setNewSkill] = useState('');
    const [newPortfolioLink, setNewPortfolioLink] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (user) {
            setProfile(user);
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    const addSkill = () => {
        if (newSkill.trim() !== '') {
            setProfile((prev: any) => ({
                ...prev,
                skills: [...(prev.skills || []), newSkill.trim()]
            }));
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setProfile((prev: any) => ({
            ...prev,
            skills: prev.skills.filter((skill: string) => skill !== skillToRemove)
        }));
    };

    const addPortfolioLink = () => {
        if (newPortfolioLink.trim() !== '') {
            setProfile((prev: any) => ({
                ...prev,
                portfolio_links: [...(prev.portfolio_links || []), newPortfolioLink.trim()]
            }));
            setNewPortfolioLink('');
        }
    };

    const removePortfolioLink = (linkToRemove: string) => {
        setProfile((prev: any) => ({
            ...prev,
            portfolio_links: prev.portfolio_links.filter((link: string) => link !== linkToRemove)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const toastId = toast.loading('Updating profile...');
        try {
            const token = localStorage.getItem('trustwork_token');
            const payload = {
                skills: profile.skills || [],
                github_profile: profile.github_profile || '',
                portfolio_links: profile.portfolio_links || [],
                experience_description: profile.experience_description || '',
                education: profile.education || ''
            };
            const response = await fetch('/api/freelance-profile', {
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
                        <Label htmlFor="github_profile" className='mb-2'>GitHub Profile</Label>
                        <Input id="github_profile" name="github_profile" value={profile.github_profile || ''} onChange={handleInputChange} />
                    </div>
                    <div>
                        <Label htmlFor="experience_description" className='mb-2'>Experience Description</Label>
                        <Textarea id="experience_description" name="experience_description" value={profile.experience_description || ''} onChange={handleInputChange} />
                    </div>
                    <div>
                        <Label htmlFor="education" className='mb-2'>Education</Label>
                        <Input id="education" name="education" value={profile.education || ''} onChange={handleInputChange} />
                    </div>
                    <div>
                        <Label className='mb-2'>Skills</Label>
                        <div className="flex flex-wrap gap-2">
                            {profile.skills?.map((skill: string) => (
                                <Badge key={skill} variant="secondary">
                                    {skill}
                                    <button type="button" onClick={() => removeSkill(skill)} className="ml-2 text-red-500">x</button>
                                </Badge>
                            ))}
                        </div>
                        <div className="flex gap-2 mt-2">
                            <Input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Add a new skill" />
                            <Button type="button" onClick={addSkill}>Add Skill</Button>
                        </div>
                    </div>
                    <div>
                        <Label className='mb-2'>Portfolio Links</Label>
                        <div className="flex flex-col gap-2">
                            {profile.portfolio_links?.map((link: string) => (
                                <div key={link} className="flex items-center gap-2">
                                    <Input value={link} readOnly />
                                    <Button type="button" variant="destructive" onClick={() => removePortfolioLink(link)}>Remove</Button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2 mt-2">
                            <Input value={newPortfolioLink} onChange={(e) => setNewPortfolioLink(e.target.value)} placeholder="Add a new portfolio link" />
                            <Button type="button" onClick={addPortfolioLink}>Add Link</Button>
                        </div>
                    </div>
                    <Button type="submit">Save Changes</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default FreelanceProfileDialog;
