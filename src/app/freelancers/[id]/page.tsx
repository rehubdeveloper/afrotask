'use client'
import { useState, useEffect, use } from 'react'
import { useUser } from '../../contexts/UserContext'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  MessageSquare,
  ExternalLink,
  Code,
  Award,
  Clock,
  DollarSign,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import LoadingSpinner from '../../components/LoadingSpinner'
import toast from 'react-hot-toast'

interface Freelancer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
  freelancer_profile: {
    id: number;
    skills: string[];
    github_profile: string;
    portfolio_links: string[];
    experience_description: string;
    education: string;
    is_verified: boolean;
    is_pending_review: boolean;
    rating: string;
    completed_projects: number;
    response_time_hours: number;
    response_time: string;
  };
}

export default function FreelancerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const resolvedParams = use(params)
  const [freelancer, setFreelancer] = useState<Freelancer | null>(null)
  const [loading, setLoading] = useState(true)
  const [creatingChat, setCreatingChat] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/signin')
      return
    }

    if (user) {
      fetchFreelancerProfile()
    }
  }, [user, isLoading, router, resolvedParams.id])

  const fetchFreelancerProfile = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('trustwork_token')
      if (!token) {
        toast.error('Please sign in to view freelancer profile')
        return
      }

      const response = await fetch(`/api/freelancers/${resolvedParams.id}`, {
        headers: { 'Authorization': `Token ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Freelancer profile data:', data)
        
        // Handle the freelancer data from the browse endpoint
        if (data && typeof data === 'object') {
          console.log('Processing freelancer data from browse endpoint:', data)
          
          // The data structure has user info in data.user and profile data at top level
          const normalizedFreelancer = {
            id: data.id,
            first_name: data.user?.first_name || 'Unknown',
            last_name: data.user?.last_name || 'User',
            email: data.user?.email || '',
            user_type: data.user?.user_type || 'freelancer',
            freelancer_profile: {
              id: data.id,
              skills: data.skills || [],
              github_profile: data.github_profile || '',
              portfolio_links: data.portfolio_links || [],
              experience_description: data.experience_description || 'No experience description available',
              education: data.education || 'No education information available',
              is_verified: data.is_verified || false,
              is_pending_review: data.is_pending_review || false,
              rating: data.rating || '0.0',
              completed_projects: data.completed_projects || 0,
              response_time_hours: data.response_time_hours || 0,
              response_time: data.response_time || 'N/A'
            }
          }
          console.log('Normalized freelancer data:', normalizedFreelancer)
          setFreelancer(normalizedFreelancer)
        } else {
          toast.error('Freelancer not found')
          router.push('/freelancers')
        }
      } else {
        toast.error('Failed to fetch freelancer profile')
        router.push('/freelancers')
      }
    } catch (error) {
      console.error('Failed to fetch freelancer profile:', error)
      toast.error('Failed to fetch freelancer profile')
      router.push('/freelancers')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateChat = async () => {
    if (!freelancer || !user) return

    setCreatingChat(true)
    try {
      const token = localStorage.getItem('trustwork_token')
      if (!token) {
        toast.error('Please sign in to create a chat')
        return
      }

      const response = await fetch('/api/chat-rooms/create-direct', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          freelancer_id: freelancer.id,
          initial_message: `Hi ${freelancer.first_name}! I'd like to discuss a potential project with you.`
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Chat created successfully!')
        router.push(`/chat/${data.chat_room.id}`)
      } else {
        toast.error(data.message || 'Failed to create chat')
      }
    } catch (error) {
      console.error('Failed to create chat:', error)
      toast.error('Failed to create chat')
    } finally {
      setCreatingChat(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!freelancer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Freelancer Not Found</h1>
            <p className="text-gray-600 mb-6">The freelancer you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => router.push('/freelancers')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Freelancers
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {freelancer.first_name} {freelancer.last_name}
              </h1>
              <p className="text-gray-600">Verified Freelancer</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {freelancer.freelancer_profile?.experience_description || 'No experience description available'}
                </p>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Skills & Expertise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(freelancer.freelancer_profile?.skills) && freelancer.freelancer_profile.skills.length > 0 ? (
                    freelancer.freelancer_profile.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline" className="text-sm">
                      No skills specified
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{freelancer.freelancer_profile?.education || 'No education information available'}</p>
              </CardContent>
            </Card>

            {/* Portfolio Links */}
            {freelancer.freelancer_profile?.portfolio_links && Array.isArray(freelancer.freelancer_profile.portfolio_links) && freelancer.freelancer_profile.portfolio_links.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="w-5 h-5" />
                    Portfolio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {freelancer.freelancer_profile.portfolio_links.map((link, index) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 underline"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {link}
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-semibold">{freelancer.freelancer_profile?.rating || 'N/A'}</span>
                  <span className="text-gray-500">rating</span>
                </div>

                {/* Completed Projects */}
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-semibold">{freelancer.freelancer_profile?.completed_projects || 0}</span>
                  <span className="text-gray-500">projects completed</span>
                </div>

                {/* Response Time */}
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold">{freelancer.freelancer_profile?.response_time || 'N/A'}</span>
                  <span className="text-gray-500">response time</span>
                </div>

                {/* Verification Status */}
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-600 font-semibold">Verified</span>
                </div>

                <div className="border-t border-gray-200 my-4"></div>

                {/* Contact Actions */}
                <div className="space-y-2">
                  <Button 
                    onClick={handleCreateChat}
                    disabled={creatingChat}
                    className="w-full"
                  >
                    {creatingChat ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Chat...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Start Conversation
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* GitHub Profile */}
            {freelancer.freelancer_profile?.github_profile && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    GitHub
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href={freelancer.freelancer_profile?.github_profile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View GitHub Profile
                  </a>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
