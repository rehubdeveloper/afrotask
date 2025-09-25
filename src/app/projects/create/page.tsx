'use client'
import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X, Plus, ArrowLeft } from 'lucide-react'
import LoadingSpinner from '../../components/LoadingSpinner'
import toast from 'react-hot-toast'

interface ProjectCategory {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export default function CreateProjectPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [categories, setCategories] = useState<ProjectCategory[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    required_skills: '',
    budget: '',
    duration_days: '',
    project_type: 'public',
    location: 'Remote',
    target_freelancer: '',
    chat_room_id: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [fileCategories, setFileCategories] = useState<string[]>([])
  const [fileDescriptions, setFileDescriptions] = useState<string[]>([])

  useEffect(() => {
    // Only check user type, not verification (clients don't need verification)
    if (!isLoading && (!user || user.user_type !== 'client')) {
      router.push('/dashboard')
      return
    }

    if (user?.user_type === 'client') {
      fetchCategories()
      
      // Check for URL parameters for private project creation
      const urlParams = new URLSearchParams(window.location.search)
      const projectType = urlParams.get('type')
      const freelancerId = urlParams.get('freelancer_id')
      const chatRoomId = urlParams.get('chat_room_id')
      
      if (projectType === 'private' && freelancerId && chatRoomId) {
        console.log('Setting private project data from URL:', {
          projectType,
          freelancerId,
          chatRoomId,
          freelancerIdType: typeof freelancerId,
          chatRoomIdType: typeof chatRoomId
        })
        setFormData(prev => ({
          ...prev,
          project_type: 'private',
          target_freelancer: freelancerId,
          chat_room_id: chatRoomId
        }))
      }
    }
  }, [user, isLoading, router])

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...');
      const response = await fetch('/api/project-categories')
      console.log('Categories response status:', response.status);
      
      if (response.ok) {
        const data = await response.json()
        console.log('Categories response data:', data);
        
        // Handle different response formats
        let categoriesData = []
        if (Array.isArray(data)) {
          categoriesData = data
          console.log('Categories is direct array:', categoriesData.length, 'items');
        } else if (data.categories && Array.isArray(data.categories)) {
          categoriesData = data.categories
          console.log('Categories found in data.categories:', categoriesData.length, 'items');
        } else if (data.results && Array.isArray(data.results)) {
          categoriesData = data.results
          console.log('Categories found in data.results:', categoriesData.length, 'items');
        } else {
          console.error('Unexpected categories response format:', data)
          toast.error('Failed to load categories - unexpected format')
          return
        }
        
        setCategories(categoriesData)
        console.log('Categories set successfully:', categoriesData);
      } else {
        console.error('Failed to fetch categories:', response.status, response.statusText)
        toast.error('Failed to load categories')
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      toast.error('Failed to load categories')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user makes selection
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles(prev => [...prev, ...files])
    
    // Initialize categories and descriptions for new files
    const newCategories = files.map(() => 'project_brief')
    const newDescriptions = files.map(() => '')
    
    setFileCategories(prev => [...prev, ...newCategories])
    setFileDescriptions(prev => [...prev, ...newDescriptions])
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setFileCategories(prev => prev.filter((_, i) => i !== index))
    setFileDescriptions(prev => prev.filter((_, i) => i !== index))
  }

  const updateFileCategory = (index: number, category: string) => {
    setFileCategories(prev => prev.map((cat, i) => i === index ? category : cat))
  }

  const updateFileDescription = (index: number, description: string) => {
    setFileDescriptions(prev => prev.map((desc, i) => i === index ? description : desc))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required'
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters'
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }

    if (!formData.required_skills.trim()) {
      newErrors.required_skills = 'At least one skill is required'
    }

    if (!formData.budget.trim()) {
      newErrors.budget = 'Budget is required'
    } else if (parseFloat(formData.budget) <= 0) {
      newErrors.budget = 'Budget must be greater than 0'
    }

    if (!formData.duration_days.trim()) {
      newErrors.duration_days = 'Duration is required'
    } else if (parseInt(formData.duration_days) <= 0) {
      newErrors.duration_days = 'Duration must be greater than 0 days'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }

    console.log('Validation errors:', newErrors)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted with data:', formData)

    if (!validateForm()) {
      console.log('Form validation failed')
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      const token = localStorage.getItem('trustwork_token')
      if (!token) {
        toast.error('Please sign in to create a project')
        return
      }

      // Determine which endpoint to use based on files and project type
      const hasFiles = selectedFiles.length > 0
      const isPrivate = formData.project_type === 'private'

      if (hasFiles) {
        // Use create-with-files endpoint
        const formDataToSend = new FormData()
        formDataToSend.append('title', formData.title)
        formDataToSend.append('description', formData.description)
        formDataToSend.append('category', formData.category)
        formDataToSend.append('required_skills', JSON.stringify(formData.required_skills.split(',').map(s => s.trim()).filter(Boolean)))
        formDataToSend.append('budget', formData.budget)
        formDataToSend.append('duration_days', formData.duration_days)
        formDataToSend.append('project_type', formData.project_type)
        formDataToSend.append('location', formData.location)
        
        if (isPrivate && formData.target_freelancer) {
          const freelancerId = parseInt(formData.target_freelancer)
          console.log('Setting target_freelancer:', freelancerId, 'from string:', formData.target_freelancer)
          
          // Validate freelancer ID
          if (isNaN(freelancerId) || freelancerId <= 0) {
            toast.error('Invalid freelancer ID')
            setIsSubmitting(false)
            return
          }
          
          // Note: Backend will validate freelancer ID and provide clear error messages
          console.log('Using freelancer ID:', freelancerId, 'for private project creation')
          
          formDataToSend.append('target_freelancer', freelancerId.toString())
        }
        if (isPrivate && formData.chat_room_id) {
          const chatRoomId = parseInt(formData.chat_room_id)
          console.log('Setting chat_room_id:', chatRoomId, 'from string:', formData.chat_room_id)
          formDataToSend.append('chat_room_id', chatRoomId.toString())
        }

        // Add files
        selectedFiles.forEach((file, index) => {
          formDataToSend.append('files', file)
          formDataToSend.append('file_categories', fileCategories[index] || 'project_brief')
          formDataToSend.append('file_descriptions', fileDescriptions[index] || '')
        })

        console.log('Sending form data with files')
        
        // Debug: Log all form data values
        console.log('Form data contents:')
        for (let [key, value] of formDataToSend.entries()) {
          console.log(`${key}:`, value, typeof value)
        }

        const response = await fetch('/api/projects/create-with-files', {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token}`
          },
          body: formDataToSend
        })

        const data = await response.json()
        console.log('Response data:', data)

        if (response.ok) {
          console.log('Project created successfully with files:', data)
          toast.success(data.message || 'Project created successfully with files!')
          // Add a small delay to ensure backend has processed the project
          setTimeout(() => {
            router.push('/projects')
          }, 1000)
        } else {
          // Handle specific error messages from backend
          if (data.error && data.error.includes('Invalid target freelancer ID')) {
            toast.error('The selected freelancer is not available for private projects. Please choose a different freelancer.')
          } else if (data.error && data.error.includes('Invalid chat room ID')) {
            toast.error('Invalid chat room. Please start a new conversation with the freelancer.')
          } else {
            handleErrorResponse(data)
          }
        }
      } else if (isPrivate) {
        // Use create-private endpoint
        const payload = {
          title: formData.title,
          description: formData.description,
          category: parseInt(formData.category),
          required_skills: formData.required_skills.split(',').map(s => s.trim()).filter(Boolean),
          budget: formData.budget,
          duration_days: parseInt(formData.duration_days),
          location: formData.location,
          target_freelancer: formData.target_freelancer ? parseInt(formData.target_freelancer) : null,
          chat_room_id: formData.chat_room_id ? parseInt(formData.chat_room_id) : null
        }

        console.log('Sending private project payload:', payload)

        const response = await fetch('/api/projects/create-private', {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })

        const data = await response.json()
        console.log('Response data:', data)

        if (response.ok) {
          toast.success(data.message || 'Private project created successfully!')
          router.push('/projects')
        } else {
          handleErrorResponse(data)
        }
      } else {
        // Use regular create endpoint
        const payload = {
          title: formData.title,
          description: formData.description,
          category: parseInt(formData.category),
          required_skills: formData.required_skills.split(',').map(s => s.trim()).filter(Boolean),
          budget: formData.budget,
          duration_days: parseInt(formData.duration_days),
          project_type: formData.project_type,
          location: formData.location
        }

        console.log('Sending regular project payload:', payload)

        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })

        const data = await response.json()
        console.log('Response data:', data)

        if (response.ok) {
          console.log('Project created successfully:', data)
          toast.success(data.message || 'Project created successfully!')
          // Add a small delay to ensure backend has processed the project
          setTimeout(() => {
            router.push('/projects')
          }, 1000)
        } else {
          handleErrorResponse(data)
        }
      }
    } catch (error) {
      console.error('Project creation failed:', error)
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleErrorResponse = (data: any) => {
    if (typeof data === 'object' && data !== null) {
      const newErrors: Record<string, string> = {}
      Object.keys(data).forEach(key => {
        const errorMessage = Array.isArray(data[key]) ? data[key].join(' ') : String(data[key])
        newErrors[key] = errorMessage
        const fieldName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        toast.error(`${fieldName}: ${errorMessage}`)
      })
      setErrors(newErrors)
    } else {
      toast.error(data.message || 'Failed to create project')
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  // Only check user type, not verification (clients don't need verification)
  if (!user || user.user_type !== 'client') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You need to be a client to create projects.
          </p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
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
          <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
          <p className="text-gray-600 mt-2">Post a project and find the right freelancer for your needs</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>
              Provide detailed information about your project to attract the best freelancers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., E-commerce Website Development"
                  className={`${errors.title ? 'border-red-500' : ''} mt-2`}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <Label htmlFor="description">Project Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your project in detail. Include requirements, deliverables, and any specific needs..."
                  rows={6}
                  className={`${errors.description ? 'border-red-500' : ''} mt-2`}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.description.length}/50 characters minimum
                </p>
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                  <SelectTrigger className={`${errors.category ? 'border-red-500' : ''} mt-2`}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(categories) && categories.length > 0 ? (
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-categories" disabled>
                        No categories available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>

              <div>
                <Label htmlFor="required_skills">Required Skills *</Label>
                <Input
                  id="required_skills"
                  name="required_skills"
                  value={formData.required_skills}
                  onChange={handleChange}
                  placeholder="e.g., Python, Django, React, PostgreSQL"
                  className={`${errors.required_skills ? 'border-red-500' : ''} mt-2`}
                />
                <p className="text-sm text-gray-500 mt-1">Separate skills with commas</p>
                {errors.required_skills && <p className="text-red-500 text-sm mt-1">{errors.required_skills}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget">Budget (NGN) *</Label>
                  <Input
                    id="budget"
                    name="budget"
                    type="number"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="150000"
                    className={`${errors.budget ? 'border-red-500' : ''} mt-2`}
                  />
                  {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
                </div>

                <div>
                  <Label htmlFor="duration_days">Duration (Days) *</Label>
                  <Input
                    id="duration_days"
                    name="duration_days"
                    type="number"
                    value={formData.duration_days}
                    onChange={handleChange}
                    placeholder="30"
                    className={`${errors.duration_days ? 'border-red-500' : ''} mt-2`}
                  />
                  {errors.duration_days && <p className="text-red-500 text-sm mt-1">{errors.duration_days}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Remote, Lagos, Nigeria, etc."
                  className={`${errors.location ? 'border-red-500' : ''} mt-2`}
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>

              <div>
                <Label htmlFor="project_type">Project Type</Label>
                <Select value={formData.project_type} onValueChange={(value) => handleSelectChange('project_type', value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-1">
                  {formData.project_type === 'public' 
                    ? 'Public projects are visible to all freelancers' 
                    : 'Private projects are only visible to the selected freelancer'
                  }
                </p>
                {formData.project_type === 'private' && formData.target_freelancer && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 mb-2">
                      <strong>Private Project:</strong> This project will be created specifically for the freelancer you're chatting with.
                    </p>
                    <div className="text-xs text-blue-600">
                      <p><strong>Target Freelancer ID:</strong> {formData.target_freelancer}</p>
                      <p><strong>Chat Room ID:</strong> {formData.chat_room_id}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* File Upload Section */}
              <div>
                <Label htmlFor="files">Project Files (Optional)</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    id="files"
                    multiple
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    accept=".pdf,.doc,.docx,.txt,.zip,.rar,.jpg,.jpeg,.png,.gif"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Upload project briefs, reference materials, or requirement documents
                  </p>
                </div>

                {/* Display selected files */}
                {selectedFiles.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        
                        <div className="flex-1">
                          <Select 
                            value={fileCategories[index] || 'project_brief'} 
                            onValueChange={(value) => updateFileCategory(index, value)}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="project_brief">Project Brief</SelectItem>
                              <SelectItem value="reference_material">Reference Material</SelectItem>
                              <SelectItem value="requirement_doc">Requirement Document</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex-1">
                          <Input
                            placeholder="File description"
                            value={fileDescriptions[index] || ''}
                            onChange={(e) => updateFileDescription(index, e.target.value)}
                            className="h-8"
                          />
                        </div>
                        
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  className="flex-1 bg-green-500 hover:bg-green-600" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Project...
                    </>
                  ) : 'Create Project'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.push('/projects')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
