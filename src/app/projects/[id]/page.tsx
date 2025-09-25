'use client'
import { useState, useEffect, use } from 'react'
import { useUser } from '../../contexts/UserContext'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft,
  DollarSign, 
  Clock, 
  MapPin, 
  Users, 
  Calendar,
  Eye,
  MessageSquare,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Link from 'next/link'
import LoadingSpinner from '../../components/LoadingSpinner'
import ProjectStatusManager from '../../components/ProjectStatusManager'
import toast from 'react-hot-toast'

interface Project {
  id: number;
  client: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    user_type: string;
    date_joined: string;
  };
  title: string;
  description: string;
  category: {
    id: number;
    name: string;
    description: string;
  };
  required_skills: string[];
  budget: string;
  duration_days: number;
  status: string;
  project_type: string;
  location: string;
  awarded_freelancer: any;
  awarded_at: string | null;
  completed_at: string | null;
  client_approved_at: string | null;
  client_approval_deadline: string | null;
  files: any[];
  bids: any[];
  milestones: any[];
  bid_count: number;
  created_at: string;
  updated_at: string;
}

interface Bid {
  id: number;
  freelancer: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    user_type: string;
  };
  proposed_price: string;
  timeline_days: number;
  approach_methodology: string;
  cover_letter: string;
  questions_for_client: string;
  status: string;
  files: any[];
  created_at: string;
  updated_at: string;
}

export default function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const resolvedParams = use(params)
  const [project, setProject] = useState<Project | null>(null)
  const [bids, setBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)
  const [showBids, setShowBids] = useState(false)
  const [showClientModal, setShowClientModal] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/signin')
      return
    }

    if (user) {
      fetchProjectDetails()
    }
  }, [user, isLoading, router, resolvedParams.id])

  const fetchProjectDetails = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true)
      }
      
      const token = localStorage.getItem('trustwork_token')
      if (!token) return

      const response = await fetch(`/api/projects/${resolvedParams.id}`, {
        headers: { 'Authorization': `Token ${token}` }
      })

        if (response.ok) {
          const data = await response.json()
          
          // Debug: Log the raw project data to understand the structure
          console.log('🔍 Raw project data from API:', data)
          console.log('🔍 Project client data:', data.client)
          console.log('🔍 Current user from context:', user)
          console.log('🔍 Project client ID:', data.client?.id)
          console.log('🔍 Current user ID:', user?.id)
          console.log('🔍 Are they the same?', data.client?.id === user?.id)
          
          // Check for other possible ID fields
          console.log('🔍 Project client user_id:', data.client?.user_id)
          console.log('🔍 Project client pk:', data.client?.pk)
          console.log('🔍 Current user user_id:', user?.user_id)
          console.log('🔍 Current user pk:', user?.pk)
          
          // Normalize the project data to ensure required_skills is always an array
        const normalizedProject = {
          ...data,
          required_skills: Array.isArray(data.required_skills) 
            ? data.required_skills 
            : typeof data.required_skills === 'string'
              ? (() => {
                  try {
                    return JSON.parse(data.required_skills)
                  } catch (e) {
                    return data.required_skills.split(',').map(s => s.trim()).filter(Boolean)
                  }
                })()
              : []
        }
        
        setProject(normalizedProject)
        setBids(data.bids || [])
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
      setIsRefreshing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount: string) => {
    return `₦${parseInt(amount).toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const canSubmitBid = () => {
    return user?.user_type === 'freelancer' && 
           user?.is_verified && 
           project?.status === 'active' &&
           !bids.some(bid => bid.freelancer.id === user.id)
  }

  const canViewBids = () => {
    return user?.user_type === 'client' && 
           project?.client.id === user.id
  }

  if (isLoading || loading) {
    return <LoadingSpinner />
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
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
            <Link href="/projects">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Projects
              </Button>
            </Link>
          </div>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
                <div className="flex items-center space-x-2">
                  <Badge className={`${getStatusColor(project.status)} text-sm px-3 py-1`}>
                    {project.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  {isRefreshing && (
                    <div className="flex items-center space-x-1 text-xs text-blue-600">
                      <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Syncing...</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Posted by {project.client.first_name} {project.client.last_name}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{formatDate(project.created_at)}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span className="font-semibold text-green-600">{formatCurrency(project.budget)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{project.duration_days} days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Overview */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <CardTitle className="text-xl text-gray-900">Project Overview</CardTitle>
                <CardDescription className="text-gray-600">
                  Complete project details and requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Project Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{project.description}</p>
                    </div>
                  </div>

                  {/* Required Skills */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(project.required_skills) && project.required_skills.length > 0 ? (
                        project.required_skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline" className="px-3 py-1">
                          No skills specified
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Project Type & Category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Project Type</h4>
                      <Badge variant={project.project_type === 'private' ? 'default' : 'secondary'} className="capitalize">
                        {project.project_type}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Category</h4>
                      <Badge variant="outline" className="text-sm">
                        {project.category.name}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bids Section */}
            {canViewBids() && (
              <Card className="border-0 shadow-sm">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl text-gray-900">Project Bids</CardTitle>
                      <CardDescription className="text-gray-600">
                        {bids.length} {bids.length === 1 ? 'bid' : 'bids'} received
                      </CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowBids(!showBids)}
                      className="border-green-200 text-green-700 hover:bg-green-50"
                    >
                      {showBids ? 'Hide Bids' : 'View Bids'}
                    </Button>
                  </div>
                </CardHeader>
                {showBids && (
                  <CardContent className="p-6">
                    {bids.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Users className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No bids yet</h3>
                        <p className="text-gray-500">Freelancers will start bidding on your project soon.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {bids.map((bid) => (
                          <div key={bid.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-blue-600 font-semibold text-sm">
                                    {bid.freelancer.first_name[0]}{bid.freelancer.last_name[0]}
                                  </span>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">
                                    {bid.freelancer.first_name} {bid.freelancer.last_name}
                                  </h4>
                                  <p className="text-sm text-gray-600">{bid.freelancer.email}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-green-600">
                                  {formatCurrency(bid.proposed_price)}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {bid.timeline_days} days delivery
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                              <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                                {bid.cover_letter}
                              </p>
                            </div>
                            
                            <div className="flex gap-3">
                              <Link href={`/projects/${project.id}/bids/${bid.id}`}>
                                <Button size="sm" variant="outline" className="flex-1">
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Full Proposal
                                </Button>
                              </Link>
                              {project.status === 'active' && (
                                <Button 
                                  size="sm" 
                                  className="bg-green-500 hover:bg-green-600 flex-1"
                                  onClick={() => awardProject(bid.id)}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Award Project
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Stats */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                <CardTitle className="text-lg text-gray-900">Project Statistics</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <DollarSign className="w-6 h-6 text-green-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Budget</div>
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(project.budget)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-600">{project.duration_days}</div>
                      <div className="text-sm text-gray-600">Days</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <Users className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-orange-600">{project.bid_count}</div>
                      <div className="text-sm text-gray-600">Bids</div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <MapPin className="w-5 h-5 text-gray-600 mr-2" />
                      <span className="font-medium text-gray-900">Location</span>
                    </div>
                    <div className="text-gray-700">{project.location}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
                <CardTitle className="text-lg text-gray-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {canSubmitBid() && (
                  <Link href={`/projects/${project.id}/bid`} className="block">
                    <Button className="w-full bg-green-500 hover:bg-green-600 h-12 text-base">
                      <FileText className="w-5 h-5 mr-2" />
                      Submit Bid
                    </Button>
                  </Link>
                )}

                {user?.user_type === 'client' && project.client.id === user.id && (
                  <>
                    <Link href={`/projects/${project.id}/edit`} className="block">
                      <Button variant="outline" className="w-full h-12 text-base">
                        <FileText className="w-5 h-5 mr-2" />
                        Edit Project
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="w-full h-12 text-red-600 border-red-300 hover:bg-red-50 text-base"
                      onClick={() => deleteProject()}
                    >
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Delete Project
                    </Button>
                  </>
                )}

                <Button 
                  variant="outline" 
                  className="w-full h-12 text-base"
                  onClick={() => setShowClientModal(true)}
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  View Client Info
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Project Status Management */}
      {project && user && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <ProjectStatusManager
            project={project}
            currentUser={user}
            onStatusChange={(newStatus) => {
              console.log('Status changed to:', newStatus)
              // Update local state immediately for UI responsiveness
              setProject(prev => prev ? { ...prev, status: newStatus } : null)
              // Refetch project data from backend to ensure consistency
              setTimeout(() => {
                console.log('Refetching project data after status change...')
                fetchProjectDetails(true)
              }, 1000) // Backend is now fixed, shorter delay is sufficient
            }}
          />
        </div>
      )}

      {/* Client Information Modal */}
      <Dialog open={showClientModal} onOpenChange={setShowClientModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Client Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-xl">
                  {project?.client.first_name[0]}{project?.client.last_name[0]}
                </span>
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-lg">
                  {project?.client.first_name} {project?.client.last_name}
                </div>
                <div className="text-sm text-gray-600">{project?.client.email}</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="font-medium">Member Since</span>
                </div>
                <div className="text-gray-900">{formatDate(project?.client.date_joined || '')}</div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Users className="w-4 h-4 mr-2" />
                  <span className="font-medium">User Type</span>
                </div>
                <div className="text-gray-900 capitalize">{project?.client.user_type}</div>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowClientModal(false)}
              >
                Close
              </Button>
              <Button 
                className="flex-1 bg-blue-500 hover:bg-blue-600"
                onClick={() => {
                  setShowClientModal(false)
                  // Add contact functionality here
                }}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Client
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )

  // Helper functions
  async function awardProject(bidId: number) {
    try {
      const token = localStorage.getItem('trustwork_token')
      if (!token) return

      const response = await fetch(`/api/projects/${project.id}/award/${bidId}`, {
        method: 'POST',
        headers: { 'Authorization': `Token ${token}` }
      })

      if (response.ok) {
        toast.success('Project awarded successfully!')
        fetchProjectDetails() // Refresh project data
      } else {
        toast.error('Failed to award project')
      }
    } catch (error) {
      console.error('Failed to award project:', error)
      toast.error('Failed to award project')
    }
  }

  async function deleteProject() {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const token = localStorage.getItem('trustwork_token')
      if (!token) return

      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${token}` }
      })

      if (response.ok) {
        toast.success('Project deleted successfully!')
        router.push('/projects')
      } else {
        toast.error('Failed to delete project')
      }
    } catch (error) {
      console.error('Failed to delete project:', error)
      toast.error('Failed to delete project')
    }
  }
}
