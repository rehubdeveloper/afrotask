'use client'
import { useState, useEffect, use } from 'react'
import { useUser } from '../../../contexts/UserContext'
import { useRouter } from 'next/navigation'
import { ArrowLeft, DollarSign, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import LoadingSpinner from '../../../components/LoadingSpinner'
import toast from 'react-hot-toast'

interface Project {
  id: number;
  title: string;
  description: string;
  budget: string;
  duration_days: number;
  required_skills: string[];
  client: {
    first_name: string;
    last_name: string;
  };
}

export default function SubmitBidPage({ params }: { params: Promise<{ id: string }> }) {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const resolvedParams = use(params)
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    proposed_price: '',
    timeline_days: '',
    approach_methodology: '',
    cover_letter: '',
    questions_for_client: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isLoading && (!user || user.user_type !== 'freelancer' || !user.is_verified)) {
      router.push('/projects')
      return
    }

    if (user?.user_type === 'freelancer') {
      fetchProjectDetails()
    }
  }, [user, isLoading, router, resolvedParams.id])

  const fetchProjectDetails = async () => {
    try {
      const token = localStorage.getItem('trustwork_token')
      if (!token) return

      const response = await fetch(`/api/projects/${resolvedParams.id}`, {
        headers: { 'Authorization': `Token ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setProject(data)
        // Pre-fill timeline with project duration
        setFormData(prev => ({
          ...prev,
          timeline_days: data.duration_days.toString()
        }))
      } else {
        toast.error('Failed to fetch project details')
        router.push('/projects')
      }
    } catch (error) {
      console.error('Failed to fetch project details:', error)
      toast.error('Failed to fetch project details')
      router.push('/projects')
    } finally {
      setLoading(false)
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.proposed_price.trim()) {
      newErrors.proposed_price = 'Proposed price is required'
    } else if (parseFloat(formData.proposed_price) <= 0) {
      newErrors.proposed_price = 'Proposed price must be greater than 0'
    }

    if (!formData.timeline_days.trim()) {
      newErrors.timeline_days = 'Timeline is required'
    } else if (parseInt(formData.timeline_days) <= 0) {
      newErrors.timeline_days = 'Timeline must be greater than 0 days'
    }

    if (!formData.approach_methodology.trim()) {
      newErrors.approach_methodology = 'Approach methodology is required'
    } else if (formData.approach_methodology.length < 50) {
      newErrors.approach_methodology = 'Approach methodology must be at least 50 characters'
    }

    if (!formData.cover_letter.trim()) {
      newErrors.cover_letter = 'Cover letter is required'
    } else if (formData.cover_letter.length < 30) {
      newErrors.cover_letter = 'Cover letter must be at least 30 characters'
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
        toast.error('Please sign in to submit a bid')
        return
      }

      const payload = {
        proposed_price: formData.proposed_price,
        timeline_days: parseInt(formData.timeline_days),
        approach_methodology: formData.approach_methodology,
        cover_letter: formData.cover_letter,
        questions_for_client: formData.questions_for_client
      }

      const response = await fetch(`/api/projects/${resolvedParams.id}/bids`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message || 'Bid submitted successfully!')
        router.push(`/projects/${resolvedParams.id}`)
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
          toast.error(data.error || 'Failed to submit bid')
        }
      }
    } catch (error) {
      console.error('Bid submission error:', error)
      toast.error('An error occurred while submitting the bid')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (amount: string) => {
    return `₦${parseInt(amount).toLocaleString()}`
  }

  if (isLoading || loading) {
    return <LoadingSpinner />
  }

  if (!user || user.user_type !== 'freelancer' || !user.is_verified) {
    return null
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <Link href="/projects">
            <Button>Back to Projects</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
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
            <Link href={`/projects/${resolvedParams.id}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Project
              </Button>
            </Link>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Submit Bid</h1>
            <p className="text-gray-600">Submit your proposal for "{project.title}"</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bid Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Proposal</CardTitle>
                <CardDescription>
                  Provide detailed information about your approach and pricing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="proposed_price">Proposed Price (NGN) *</Label>
                      <Input
                        id="proposed_price"
                        name="proposed_price"
                        type="number"
                        value={formData.proposed_price}
                        onChange={handleChange}
                        placeholder="120000"
                        className={`${errors.proposed_price ? 'border-red-500' : ''} mt-2`}
                      />
                      {errors.proposed_price && <p className="text-red-500 text-sm mt-1">{errors.proposed_price}</p>}
                    </div>

                    <div>
                      <Label htmlFor="timeline_days">Timeline (Days) *</Label>
                      <Input
                        id="timeline_days"
                        name="timeline_days"
                        type="number"
                        value={formData.timeline_days}
                        onChange={handleChange}
                        placeholder="25"
                        className={`${errors.timeline_days ? 'border-red-500' : ''} mt-2`}
                      />
                      {errors.timeline_days && <p className="text-red-500 text-sm mt-1">{errors.timeline_days}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="approach_methodology">Approach & Methodology *</Label>
                    <Textarea
                      id="approach_methodology"
                      name="approach_methodology"
                      value={formData.approach_methodology}
                      onChange={handleChange}
                      placeholder="Describe your approach to completing this project. Include the technologies you'll use, your development process, and how you'll ensure quality..."
                      rows={6}
                      className={`${errors.approach_methodology ? 'border-red-500' : ''} mt-2`}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.approach_methodology.length}/50 characters minimum
                    </p>
                    {errors.approach_methodology && <p className="text-red-500 text-sm mt-1">{errors.approach_methodology}</p>}
                  </div>

                  <div>
                    <Label htmlFor="cover_letter">Cover Letter *</Label>
                    <Textarea
                      id="cover_letter"
                      name="cover_letter"
                      value={formData.cover_letter}
                      onChange={handleChange}
                      placeholder="Introduce yourself and explain why you're the best fit for this project. Highlight your relevant experience and skills..."
                      rows={5}
                      className={`${errors.cover_letter ? 'border-red-500' : ''} mt-2`}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.cover_letter.length}/30 characters minimum
                    </p>
                    {errors.cover_letter && <p className="text-red-500 text-sm mt-1">{errors.cover_letter}</p>}
                  </div>

                  <div>
                    <Label htmlFor="questions_for_client">Questions for Client</Label>
                    <Textarea
                      id="questions_for_client"
                      name="questions_for_client"
                      value={formData.questions_for_client}
                      onChange={handleChange}
                      placeholder="Ask any clarifying questions about the project requirements, timeline, or deliverables..."
                      rows={3}
                      className="mt-2"
                    />
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
                          Submitting Bid...
                        </>
                      ) : 'Submit Bid'}
                    </Button>
                    <Link href={`/projects/${resolvedParams.id}`} className="flex-1">
                      <Button type="button" variant="outline" className="w-full" disabled={isSubmitting}>
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Project Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Project Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg">{project.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    by {project.client.first_name} {project.client.last_name}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-5 h-5 mr-3" />
                    <div>
                      <div className="font-medium">Budget</div>
                      <div className="text-lg font-bold text-green-600">
                        {formatCurrency(project.budget)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-3" />
                    <div>
                      <div className="font-medium">Duration</div>
                      <div className="text-lg">{project.duration_days} days</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="font-medium text-gray-700 mb-2">Required Skills:</div>
                  <div className="flex flex-wrap gap-1">
                    {project.required_skills.map((skill, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    Make sure your proposal is competitive and clearly explains your approach to this project.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
