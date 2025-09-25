'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Clock, AlertCircle, Github, ExternalLink, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useUser } from '../contexts/UserContext'
import toast from 'react-hot-toast';

const Verification = () => {
    const { signupPayload, updateSignupPayload, signIn, user, isLoading, refetchUser } = useUser()
    const router = useRouter()
    const [submissionComplete, setSubmissionComplete] = useState(false)
    const [formData, setFormData] = useState({
        // Freelancer fields
        skills: '',
        github_profile: '',
        portfolio_links: '',
        experience_description: '',
        education: '',

        // Client fields
        company_name: '',
        location: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    // Determine user role: from signupPayload (new users) or current user (existing users)
    const getUserRole = () => {
        if (signupPayload?.role) {
            return signupPayload.role; // New user going through signup flow
        }
        if (user?.user_type) {
            return user.user_type; // Existing user reapplying
        }
        // Fallback: try to get role from localStorage
        try {
            const savedUser = localStorage.getItem('trustwork_user');
            if (savedUser) {
                const userData = JSON.parse(savedUser);
                return userData.user_type;
            }
        } catch (error) {
            console.error('Failed to parse saved user data:', error);
        }
        return null;
    }

    const userRole = getUserRole();

    // Redirect if no role is determined or if user is already verified
    useEffect(() => {
        // Don't run checks while user data is still loading
        if (isLoading) {
            return;
        }

        // If we have signupPayload, we're in the new user flow - no need to check user
        if (signupPayload?.role) {
            return;
        }

        // If we don't have signupPayload and no user data, redirect to signup
        if (!user) {
            toast.error('Please sign in to access verification.');
            router.push('/signin');
            return;
        }

        // If user is already verified, redirect to dashboard
        if (user.is_verified) {
            toast.success('Your account is already verified!');
            router.push('/dashboard');
            return;
        }
    }, [userRole, user, router, isLoading, signupPayload]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        // Clear error when user starts typing
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            })
        }
    }

    const validateFreelancerForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.skills.trim()) {
            newErrors.skills = 'Skills are required'
        }

        if (!formData.experience_description.trim()) {
            newErrors.experience_description = 'Experience description is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const validateClientForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.company_name.trim()) {
            newErrors.company_name = 'Company name is required'
        }

        if (!formData.location.trim()) {
            newErrors.location = 'Location is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const isValid = userRole === 'freelancer'
            ? validateFreelancerForm()
            : validateClientForm()

        if (!isValid) return

        setIsSubmitting(true)
        setErrors({})

        let finalPayload;
        let endpoint;

        if (user) {
            // Existing user reapplying - use profile update endpoint
            if (userRole === 'freelancer') {
                finalPayload = {
                    skills: formData.skills.split(',').map((s: string) => s.trim()).filter(Boolean),
                    github_profile: formData.github_profile,
                    portfolio_links: formData.portfolio_links.split('\n').map((s: string) => s.trim()).filter(Boolean),
                    experience_description: formData.experience_description,
                    education: formData.education,
                };
                endpoint = '/api/freelance-profile';
            } else {
                finalPayload = {
                    company_name: formData.company_name,
                    location: formData.location,
                };
                endpoint = '/api/client-profile';
            }
        } else {
            // New user signup
            const { role, ...restOfPayload } = signupPayload || {};
            finalPayload = { ...restOfPayload };

            if (userRole === 'freelancer') {
                finalPayload = {
                    ...finalPayload,
                    skills: formData.skills.split(',').map((s: string) => s.trim()).filter(Boolean),
                    github_profile: formData.github_profile,
                    portfolio_links: formData.portfolio_links.split('\n').map((s: string) => s.trim()).filter(Boolean),
                    experience_description: formData.experience_description,
                    education: formData.education,
                }
            } else {
                finalPayload = {
                    ...finalPayload,
                    company_name: formData.company_name,
                    location: formData.location,
                }
            }

            endpoint = userRole === 'freelancer' ? '/api/freelancer-signup' : '/api/client-signup';
        }

        try {
            const method = user ? 'PUT' : 'POST'; // PUT for existing users, POST for new signups
            const res = await fetch(endpoint, {
                method: method,
                headers: { 
                    'Content-Type': 'application/json',
                    ...(user && { 'Authorization': `Token ${localStorage.getItem('trustwork_token')}` })
                },
                body: JSON.stringify(finalPayload),
            });

            const data = await res.json();

            if (!res.ok) {
                const newErrors: Record<string, string> = {};
                if (typeof data === 'object' && data !== null) {
                    Object.keys(data).forEach(key => {
                        const errorMessage = Array.isArray(data[key]) ? data[key].join(' ') : String(data[key]);
                        newErrors[key] = errorMessage;
                        const fieldName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        toast.error(`${fieldName}: ${errorMessage}`);
                    });
                } else {
                    toast.error('An unexpected error occurred.');
                }
                setErrors(newErrors);
                return;
            }

            // Success handling
            if (user) {
                // Existing user - profile updated
                toast.success(data.message || 'Profile updated successfully! Please wait for admin review.');
                // Refresh user data immediately
                setTimeout(async () => {
                    await refetchUser();
                    router.push('/dashboard');
                }, 1500);
            } else {
                // New user - account created
                toast.success(data.message || 'Account created successfully!');
                await signIn(data);
                setSubmissionComplete(true);
                setTimeout(() => {
                    router.push('/dashboard');
                }, 2000);
            }

            // Clear the payload from context/localStorage
            updateSignupPayload(null);

        } catch (error) {
            console.error('Verification submission failed', error);
            toast.error('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }

    // Show loading state while user data is being fetched
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading verification form...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.back()}
                        className="flex items-center space-x-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                    </Button>
                </div>
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-green-500 mb-4">Account <span className="text-amber-400">Verification</span></h1>
                    <p className="text-gray-600">
                        Complete your verification to access all AfroTask features
                    </p>
                </div>

                {submissionComplete ? (
                    <Card>
                        <CardHeader className="text-center">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Clock className="w-8 h-8 text-orange-500" />
                            </div>
                            <CardTitle className="text-xl text-orange-600">Verification Under Review</CardTitle>
                            <CardDescription>
                                Your verification request has been submitted and is being processed by our team.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                                <p className="text-orange-700 text-sm">
                                    <strong>What happens next?</strong><br />
                                    Our verification team will review your information within 24-48 hours.
                                    You'll receive an email notification once the review is complete. You can now sign in to your account.
                                </p>
                            </div>
                            <div className="mt-6 text-center">
                                <Button onClick={() => router.push('/signin')} className="cursor-pointer bg-green-500 hover:bg-green-600">
                                    Go to Sign In
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {userRole === 'freelancer' ? 'Freelancer' : 'Client'} Verification
                            </CardTitle>
                            <CardDescription>
                                Please provide the following information to verify your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {userRole === 'freelancer' ? (
                                    <>
                                        <div>
                                            <Label htmlFor="skills">Skills *</Label>
                                            <Input
                                                id="skills"
                                                name="skills"
                                                value={formData.skills}
                                                onChange={handleChange}
                                                placeholder="e.g., React, Node.js, Python, Design"
                                                className={`${errors.skills ? 'border-red-500' : ''} mt-2`}
                                            />
                                            <p className="text-sm text-gray-500 mt-1">Separate skills with commas</p>
                                            {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="github_profile">GitHub Profile</Label>
                                            <div className="relative mt-2">
                                                <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                <Input
                                                    id="github_profile"
                                                    name="github_profile"
                                                    value={formData.github_profile}
                                                    onChange={handleChange}
                                                    placeholder="https://github.com/yourusername"
                                                    className="pl-10"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="portfolio_links">Portfolio Links</Label>
                                            <Textarea
                                                id="portfolio_links"
                                                name="portfolio_links"
                                                value={formData.portfolio_links}
                                                onChange={handleChange}
                                                placeholder="https://yourportfolio.com&#10;https://dribbble.com/yourusername&#10;https://behance.net/yourusername"
                                                rows={4}
                                                className='mt-2'
                                            />
                                            <p className="text-sm text-gray-500 mt-1">One link per line</p>
                                        </div>

                                        <div>
                                            <Label htmlFor="experience_description">Experience Description *</Label>
                                            <Textarea
                                                id="experience_description"
                                                name="experience_description"
                                                value={formData.experience_description}
                                                onChange={handleChange}
                                                placeholder="Describe your professional experience, notable projects, and expertise..."
                                                rows={4}
                                                className={`${errors.experience_description ? 'border-red-500' : ''} mt-2`}
                                            />
                                            {errors.experience_description && <p className="text-red-500 text-sm mt-1">{errors.experience_description}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="education">Education</Label>
                                            <Input
                                                id="education"
                                                name="education"
                                                value={formData.education}
                                                onChange={handleChange}
                                                placeholder="e.g., B.Sc. in Computer Science"
                                                className="mt-2"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <Label htmlFor="company_name" className='mb-2'>Company/Organization Name *</Label>
                                            <Input
                                                id="company_name"
                                                name="company_name"
                                                value={formData.company_name}
                                                onChange={handleChange}
                                                placeholder="Your company or organization name"
                                                className={`${errors.company_name ? 'border-red-500' : ''} mt-2`}
                                            />
                                            {errors.company_name && <p className="text-red-500 text-sm mt-1">{errors.company_name}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="location" className='mb-2'>Location *</Label>
                                            <Input
                                                id="location"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleChange}
                                                placeholder="e.g., New York, USA"
                                                className={`${errors.location ? 'border-red-500' : ''} mt-2`}
                                            />
                                            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                                        </div>
                                    </>
                                )}

                                {errors.form && <p className="text-red-500 text-sm mb-4 text-center">{errors.form}</p>}

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h4 className="font-medium text-blue-900 mb-2">Verification Process</h4>
                                    <p className="text-blue-700 text-sm">
                                        Our team will review your information within 24-48 hours. You'll receive an email
                                        notification once your verification is complete.
                                    </p>
                                </div>

                                <Button type="submit" className="w-full bg-green-500 hover:bg-green-600" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Submitting...
                                        </>
                                    ) : 'Submit for Verification'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

export default Verification
