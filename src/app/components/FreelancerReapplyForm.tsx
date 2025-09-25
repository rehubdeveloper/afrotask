'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useUser } from '../contexts/UserContext'
import toast from 'react-hot-toast'

interface FreelancerReapplyFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

const FreelancerReapplyForm = ({ onSuccess, onCancel }: FreelancerReapplyFormProps) => {
    const { refetchUser } = useUser()
    const [formData, setFormData] = useState({
        skills: '',
        github_profile: '',
        portfolio_links: '',
        experience_description: '',
        education: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

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

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.skills.trim()) {
            newErrors.skills = 'Skills are required'
        }

        if (!formData.experience_description.trim()) {
            newErrors.experience_description = 'Experience description is required'
        }

        if (!formData.education.trim()) {
            newErrors.education = 'Education is required'
        }

        if (formData.github_profile && !formData.github_profile.includes('github.com')) {
            newErrors.github_profile = 'Please enter a valid GitHub profile URL'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)
        setErrors({})

        try {
            const token = localStorage.getItem('trustwork_token')
            if (!token) {
                toast.error('Please sign in to reapply')
                return
            }

            const payload = {
                skills: formData.skills.split(',').map((s: string) => s.trim()).filter(Boolean),
                github_profile: formData.github_profile,
                portfolio_links: formData.portfolio_links.split('\n').map((s: string) => s.trim()).filter(Boolean),
                experience_description: formData.experience_description,
                education: formData.education,
            }

            const response = await fetch('/api/freelancer-reapply', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            const data = await response.json()

            if (response.ok) {
                toast.success(data.message || 'Reapplication submitted successfully!')
                await refetchUser()
                onSuccess()
            } else {
                // Handle validation errors
                if (typeof data === 'object' && data !== null) {
                    const newErrors: Record<string, string> = {}
                    Object.keys(data).forEach(key => {
                        const errorMessage = Array.isArray(data[key]) ? data[key].join(' ') : String(data[key])
                        newErrors[key] = errorMessage
                    })
                    setErrors(newErrors)
                } else {
                    toast.error(data.error || 'Failed to submit reapplication')
                }
            }
        } catch (error) {
            console.error('Reapplication error:', error)
            toast.error('An error occurred while submitting reapplication')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-red-600">Freelancer Reapplication</CardTitle>
                <CardDescription>
                    Please provide updated information to improve your application and resubmit for review.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                        {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
                    </div>

                    <div>
                        <Label htmlFor="github_profile">GitHub Profile</Label>
                        <Input
                            id="github_profile"
                            name="github_profile"
                            type="url"
                            value={formData.github_profile}
                            onChange={handleChange}
                            placeholder="https://github.com/username"
                            className={`${errors.github_profile ? 'border-red-500' : ''} mt-2`}
                        />
                        {errors.github_profile && <p className="text-red-500 text-sm mt-1">{errors.github_profile}</p>}
                    </div>

                    <div>
                        <Label htmlFor="portfolio_links">Portfolio Links</Label>
                        <Textarea
                            id="portfolio_links"
                            name="portfolio_links"
                            value={formData.portfolio_links}
                            onChange={handleChange}
                            placeholder="https://portfolio.com&#10;https://behance.net/username"
                            rows={3}
                            className={`${errors.portfolio_links ? 'border-red-500' : ''} mt-2`}
                        />
                        {errors.portfolio_links && <p className="text-red-500 text-sm mt-1">{errors.portfolio_links}</p>}
                    </div>

                    <div>
                        <Label htmlFor="experience_description">Experience Description *</Label>
                        <Textarea
                            id="experience_description"
                            name="experience_description"
                            value={formData.experience_description}
                            onChange={handleChange}
                            placeholder="Describe your professional experience..."
                            rows={5}
                            className={`${errors.experience_description ? 'border-red-500' : ''} mt-2`}
                        />
                        {errors.experience_description && <p className="text-red-500 text-sm mt-1">{errors.experience_description}</p>}
                    </div>

                    <div>
                        <Label htmlFor="education">Education *</Label>
                        <Textarea
                            id="education"
                            name="education"
                            value={formData.education}
                            onChange={handleChange}
                            placeholder="Describe your educational background..."
                            rows={3}
                            className={`${errors.education ? 'border-red-500' : ''} mt-2`}
                        />
                        {errors.education && <p className="text-red-500 text-sm mt-1">{errors.education}</p>}
                    </div>

                    <div className="flex gap-3">
                        <Button 
                            type="submit" 
                            className="flex-1 bg-red-600 hover:bg-red-700" 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Submitting...
                                </>
                            ) : 'Submit Reapplication'}
                        </Button>
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={onCancel}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

export default FreelancerReapplyForm
