'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useUser } from '../contexts/UserContext'
import toast from 'react-hot-toast'

interface ClientReapplyFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

const ClientReapplyForm = ({ onSuccess, onCancel }: ClientReapplyFormProps) => {
    const { refetchUser } = useUser()
    const [formData, setFormData] = useState({
        company_name: '',
        location: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)
        setErrors({})

        try {
            const token = localStorage.getItem('trustwork_token')
            if (!token) {
                toast.error('Please sign in to update profile')
                return
            }

            const payload = {
                company_name: formData.company_name,
                location: formData.location,
            }

            const response = await fetch('/api/client-reapply', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            const data = await response.json()

            if (response.ok) {
                toast.success(data.message || 'Profile updated successfully!')
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
                    toast.error(data.error || 'Failed to update profile')
                }
            }
        } catch (error) {
            console.error('Profile update error:', error)
            toast.error('An error occurred while updating profile')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-blue-600">Update Client Profile</CardTitle>
                <CardDescription>
                    Update your company information and location.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="company_name">Company Name *</Label>
                        <Input
                            id="company_name"
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleChange}
                            placeholder="Your Company Name"
                            className={`${errors.company_name ? 'border-red-500' : ''} mt-2`}
                        />
                        {errors.company_name && <p className="text-red-500 text-sm mt-1">{errors.company_name}</p>}
                    </div>

                    <div>
                        <Label htmlFor="location">Location *</Label>
                        <Input
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="City, State, Country"
                            className={`${errors.location ? 'border-red-500' : ''} mt-2`}
                        />
                        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                    </div>

                    <div className="flex gap-3">
                        <Button 
                            type="submit" 
                            className="flex-1 bg-blue-600 hover:bg-blue-700" 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Updating...
                                </>
                            ) : 'Update Profile'}
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

export default ClientReapplyForm
