'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { DollarSign, Clock, FileText, Star, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUser } from '../contexts/UserContext'
import { useUI } from '../contexts/UIContext'

interface FormData {
    title: string;
    category: string;
    description: string;
    price: string;
    deliveryTime: string;
    tags: string;
    features: string[];
    requirements: string;
    serviceImages: File[];
}

interface Errors {
    [key: string]: string;
}

const OfferService = () => {
    const { user } = useUser()
    const { showRestrictedModal } = useUI()
    const router = useRouter()
    const [formData, setFormData] = useState<FormData>({
        title: '',
        category: '',
        description: '',
        price: '',
        deliveryTime: '',
        tags: '',
        features: ['', '', ''],
        requirements: '',
        serviceImages: []
    })
    const [errors, setErrors] = useState<Errors>({})

    useEffect(() => {
        // Check if user is approved to offer services
        if (!user || user.role !== 'freelancer' || user.status !== 'approved') {
            showRestrictedModal('offering services')
            router.push('/dashboard')
        }
    }, [user, showRestrictedModal, router])

    const categories = [
        'Programming & Tech',
        'Graphics & Design',
        'Digital Marketing',
        'Writing & Translation',
        'Video & Animation',
        'Music & Audio',
        'Business',
        'Finance'
    ]

    const deliveryOptions = [
        '1 day',
        '2 days',
        '3 days',
        '1 week',
        '2 weeks',
        '3 weeks',
        '1 month'
    ]

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

    const handleSelectChange = (name: string, value: string) => {
        setFormData({
            ...formData,
            [name]: value
        })
        // Clear error when user makes selection
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            })
        }
    }

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...formData.features]
        newFeatures[index] = value
        setFormData({
            ...formData,
            features: newFeatures
        })
    }

    const validateForm = () => {
        const newErrors: Errors = {}

        if (!formData.title.trim()) {
            newErrors.title = 'Service title is required'
        }

        if (!formData.category) {
            newErrors.category = 'Category is required'
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Service description is required'
        } else if (formData.description.trim().length < 100) {
            newErrors.description = 'Description must be at least 100 characters'
        }

        if (!formData.price) {
            newErrors.price = 'Price is required'
        } else if (isNaN(Number(formData.price)) || parseFloat(formData.price) <= 0) {
            newErrors.price = 'Price must be a valid positive number'
        }

        if (!formData.deliveryTime) {
            newErrors.deliveryTime = 'Delivery time is required'
        }

        if (!formData.tags.trim()) {
            newErrors.tags = 'Tags are required'
        }

        // Check if at least one feature is filled
        const filledFeatures = formData.features.filter(f => f.trim())
        if (filledFeatures.length === 0) {
            newErrors.features = 'At least one feature is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        // In a real app, this would submit to an API
        console.log('Service created:', formData)

        // Show success message and redirect
        alert('Service created successfully!')
        router.push('/dashboard')
    }

    // If user is not approved, don't render the form
    if (!user || user.role !== 'freelancer' || user.status !== 'approved') {
        return null
    }

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files)
            setFormData(prev => ({
                ...prev,
                serviceImages: [...prev.serviceImages, ...files]
            }))
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Create a New Service</h1>
                    <p className="text-gray-600 mt-2">
                        Showcase your skills and attract clients with a compelling service offering
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Service Details</CardTitle>
                                <CardDescription>
                                    Create a detailed description of your service to attract the right clients
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <Label htmlFor="title">Service Title *</Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="e.g., I will create a modern React website for your business"
                                            className={`mt-2 ${errors.title ? 'border-red-500' : ''}`}
                                        />
                                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="category">Category *</Label>
                                        <Select onValueChange={(value) => handleSelectChange('category', value)}>
                                            <SelectTrigger className={`mt-2 ${errors.category ? 'border-red-500' : ''}`}>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category} value={category}>
                                                        {category}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="description">Service Description *</Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Describe your service in detail. What will you deliver? What makes your service unique? Include your process and what clients can expect..."
                                            rows={6}
                                            className={`mt-2 ${errors.description ? 'border-red-500' : ''}`}
                                        />
                                        <p className="text-sm text-gray-500 mt-1">
                                            {formData.description.length}/100 characters minimum
                                        </p>
                                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="price">Starting Price (USD) *</Label>
                                            <div className="relative mt-2">
                                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                <Input
                                                    id="price"
                                                    name="price"
                                                    type="number"
                                                    value={formData.price}
                                                    onChange={handleChange}
                                                    placeholder="50"
                                                    className={`pl-10 ${errors.price ? 'border-red-500' : ''}`}
                                                />
                                            </div>
                                            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="deliveryTime">Delivery Time *</Label>
                                            <Select onValueChange={(value) => handleSelectChange('deliveryTime', value)}>
                                                <SelectTrigger className={`mt-2 ${errors.deliveryTime ? 'border-red-500' : ''}`}>
                                                    <SelectValue placeholder="Select delivery time" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {deliveryOptions.map((option) => (
                                                        <SelectItem key={option} value={option}>
                                                            {option}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.deliveryTime && <p className="text-red-500 text-sm mt-1">{errors.deliveryTime}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="tags">Tags *</Label>
                                        <Input
                                            id="tags"
                                            name="tags"
                                            value={formData.tags}
                                            onChange={handleChange}
                                            placeholder="e.g., react, website, frontend, responsive, modern"
                                            className={`mt-2 ${errors.tags ? 'border-red-500' : ''}`}
                                        />
                                        <p className="text-sm text-gray-500 mt-1">Separate tags with commas (helps clients find your service)</p>
                                        {errors.tags && <p className="text-red-500 text-sm mt-1">{errors.tags}</p>}
                                    </div>

                                    <div>
                                        <Label>What's Included *</Label>
                                        <div className="space-y-2 mt-2">
                                            {formData.features.map((feature, index) => (
                                                <Input
                                                    key={index}
                                                    value={feature}
                                                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                                                    placeholder={`Feature ${index + 1} (e.g., Responsive design, Source code, 2 revisions)`}
                                                />
                                            ))}
                                        </div>
                                        {errors.features && <p className="text-red-500 text-sm mt-1">{errors.features}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="requirements">Requirements from Client</Label>
                                        <Textarea
                                            id="requirements"
                                            name="requirements"
                                            value={formData.requirements}
                                            onChange={handleChange}
                                            placeholder="What do you need from the client to get started? (e.g., Brand guidelines, content, specific requirements...)"
                                            rows={3}
                                            className='mt-2'
                                        />
                                    </div>

                                    <div>
                                        <Label>Service Images</Label>
                                        <div className="border-2 mt-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-600 mb-2">Upload images to showcase your work</p>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                id="image-upload"
                                            />
                                            <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('image-upload')?.click()}>
                                                Choose Files
                                            </Button>
                                            <p className="text-xs text-gray-500 mt-2">
                                                Upload up to 5 images (JPG, PNG, max 5MB each)
                                            </p>
                                        </div>
                                        {formData.serviceImages.length > 0 && (
                                            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                {formData.serviceImages.map((file, index) => (
                                                    <div key={index} className="relative">
                                                        <img
                                                            src={URL.createObjectURL(file)}
                                                            alt={`preview ${index}`}
                                                            className="w-full h-full object-cover rounded-lg"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex space-x-4">
                                        <Button type="submit" className="bg-green-500 hover:bg-green-600">
                                            Create Service
                                        </Button>
                                        <Button type="button" variant="outline" onClick={() => router.push('/dashboard')}>
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Tips Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Star className="w-5 h-5 text-yellow-500" />
                                    <span>Tips for Success</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="text-sm">
                                    <h4 className="font-medium text-gray-900 mb-1">Use action words</h4>
                                    <p className="text-gray-600">Start with "I will..." to be clear about what you offer</p>
                                </div>
                                <div className="text-sm">
                                    <h4 className="font-medium text-gray-900 mb-1">Be specific</h4>
                                    <p className="text-gray-600">Detail exactly what clients will receive</p>
                                </div>
                                <div className="text-sm">
                                    <h4 className="font-medium text-gray-900 mb-1">Competitive pricing</h4>
                                    <p className="text-gray-600">Research similar services to price competitively</p>
                                </div>
                                <div className="text-sm">
                                    <h4 className="font-medium text-gray-900 mb-1">Quality images</h4>
                                    <p className="text-gray-600">Showcase your best work with high-quality examples</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Preview Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <FileText className="w-5 h-5 text-blue-500" />
                                    <span>Service Preview</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {formData.title && (
                                    <div className="space-y-3">
                                        <h4 className="font-medium text-gray-900 line-clamp-2">
                                            {formData.title}
                                        </h4>
                                        {formData.price && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Starting at</span>
                                                <span className="font-bold text-lg">${formData.price}</span>
                                            </div>
                                        )}
                                        {formData.deliveryTime && (
                                            <div className="flex items-center space-x-1 text-sm text-gray-600">
                                                <Clock className="w-4 h-4" />
                                                <span>{formData.deliveryTime} delivery</span>
                                            </div>
                                        )}
                                        {formData.features.filter(f => f.trim()).length > 0 && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 mb-2">What's included:</p>
                                                <ul className="text-sm text-gray-600 space-y-1">
                                                    {formData.features.filter(f => f.trim()).map((feature, index) => (
                                                        <li key={index} className="flex items-start">
                                                            <span className="text-green-500 mr-2">✓</span>
                                                            {feature}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {!formData.title && (
                                    <p className="text-gray-500 text-sm">
                                        Fill out the form to see a preview of your service
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OfferService
