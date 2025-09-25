'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Star, Clock, MapPin, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useUser } from '../contexts/UserContext'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const Explore = () => {
    const { user, isLoading } = useUser()
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [projects, setProjects] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)

    // Fetch projects and categories
    useEffect(() => {
        if (!isLoading) {
            if (user) {
                fetchProjects()
                fetchCategories()
            } else {
                // User not logged in, redirect to signin
                router.push('/signin')
            }
        }
    }, [user, isLoading, router])

    const fetchProjects = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('trustwork_token')
            if (!token) {
                console.log('No token found for fetching projects')
                return
            }

            const response = await fetch('/api/projects', {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            })

            if (response.ok) {
                const data = await response.json()
                console.log('Projects data for explore:', data)
                console.log('User type:', user?.user_type)
                console.log('Data structure:', {
                    hasResults: !!data.results,
                    resultsLength: data.results?.length,
                    isArray: Array.isArray(data),
                    dataKeys: Object.keys(data),
                    count: data.count
                })
                setProjects(data.results || [])
            } else {
                const errorData = await response.json()
                console.error('Failed to fetch projects:', response.status, errorData)
                toast.error(errorData.message || 'Failed to fetch projects')
            }
        } catch (error) {
            console.error('Failed to fetch projects:', error)
            toast.error('An error occurred while fetching projects')
        } finally {
            setLoading(false)
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/project-categories')
            if (response.ok) {
                const data = await response.json()
                console.log('Categories data:', data)
                setCategories(data.results || data || [])
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error)
        }
    }

    const formatTime = (dateString) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
        
        if (diffInHours < 1) {
            return 'Just now'
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)}h ago`
        } else {
            const diffInDays = Math.floor(diffInHours / 24)
            return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
        }
    }

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === 'all' ||
            project.category?.name?.toLowerCase() === selectedCategory.toLowerCase()
        return matchesSearch && matchesCategory
    })

    // Show loading while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        )
    }

    // Show access denied if no user
    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
                    <p className="text-gray-600 mb-4">
                        Please sign in to browse projects.
                    </p>
                    <Button onClick={() => router.push('/signin')}>
                        Sign In
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.back()}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>
                        <h1 className="text-3xl font-bold text-gray-900">Explore AfroTask</h1>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col lg:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                type="text"
                                placeholder="Search services or jobs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-3 text-lg"
                            />
                        </div>
                        <Button variant="outline" className="flex items-center space-x-2">
                            <Filter className="w-4 h-4" />
                            <span>Filters</span>
                        </Button>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={selectedCategory === 'all' ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory('all')}
                            className={selectedCategory === 'all' ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                            All
                        </Button>
                        {categories.map((category) => (
                            <Button
                                key={category.id}
                                variant={selectedCategory === category.name?.toLowerCase() ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedCategory(category.name?.toLowerCase() || 'all')}
                                className={selectedCategory === category.name?.toLowerCase() ? "bg-green-500 hover:bg-green-600" : ""}
                            >
                                {category.name}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <>
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Available Projects ({filteredProjects.length})
                            </h2>
                        </div>

                        {filteredProjects.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                                <p className="text-gray-600 mb-4">
                                    Try adjusting your search terms or filters to find what you're looking for.
                                </p>
                                
                                {/* Debug Information */}
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 text-left max-w-md mx-auto">
                                    <h4 className="font-medium text-gray-900 mb-2">Debug Info:</h4>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p><strong>User Type:</strong> {user?.user_type}</p>
                                        <p><strong>Total Projects:</strong> {projects.length}</p>
                                        <p><strong>Filtered Projects:</strong> {filteredProjects.length}</p>
                                        <p><strong>Search Term:</strong> "{searchTerm}"</p>
                                        <p><strong>Selected Category:</strong> {selectedCategory}</p>
                                    </div>
                                </div>
                                
                                <div className="flex gap-2 justify-center">
                                    <Button onClick={() => router.push('/projects/create')}>
                                        Create a Project
                                    </Button>
                                    <Button variant="outline" onClick={fetchProjects}>
                                        Refresh Projects
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {filteredProjects.map((project) => (
                                    <Card 
                                        key={project.id} 
                                        className="hover:shadow-lg transition-shadow cursor-pointer"
                                        onClick={() => router.push(`/projects/${project.id}`)}
                                    >
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                                                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                                        <div className="flex items-center space-x-1">
                                                            <span>{project.client?.first_name} {project.client?.last_name}</span>
                                                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                                                Verified
                                                            </Badge>
                                                        </div>
                                                        <span>•</span>
                                                        <span>{formatTime(project.created_at)}</span>
                                                    </div>
                                                    <CardDescription className="line-clamp-2">
                                                        {project.description}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-6 text-sm">
                                                    <div>
                                                        <span className="text-gray-500">Budget: </span>
                                                        <span className="font-medium">₦{project.budget}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">Duration: </span>
                                                        <span className="font-medium">{project.duration_days} days</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">Bids: </span>
                                                        <span className="font-medium">{project.bid_count || 0}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">Type: </span>
                                                        <span className="font-medium capitalize">{project.project_type}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    {project.category && (
                                                        <Badge variant="outline">{project.category.name}</Badge>
                                                    )}
                                                    <Badge 
                                                        variant={project.status === 'active' ? 'default' : 'secondary'}
                                                        className={project.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                                                    >
                                                        {project.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                            {project.required_skills && project.required_skills.length > 0 && (
                                                <div className="mt-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        {project.required_skills.slice(0, 5).map((skill, index) => (
                                                            <Badge key={index} variant="outline" className="text-xs">
                                                                {skill}
                                                            </Badge>
                                                        ))}
                                                        {project.required_skills.length > 5 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                +{project.required_skills.length - 5} more
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default Explore

