'use client'
import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  Filter, 
  Eye, 
  Check, 
  X, 
  Clock, 
  User, 
  Mail, 
  Github, 
  ExternalLink, 
  BookOpen, 
  Code,
  AlertCircle,
  Calendar,
  ArrowLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import LoadingSpinner from '../../components/LoadingSpinner'
import toast from 'react-hot-toast'

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
  date_joined: string;
}

interface Freelancer {
  id: number;
  user: User;
  skills: string[];
  github_profile: string;
  portfolio_links: string[];
  experience_description: string;
  education: string;
  is_verified: boolean;
  is_pending_review: boolean;
  created_at: string;
  updated_at: string;
}

interface Review {
  id: number;
  freelancer: Freelancer;
  status: 'pending' | 'approved' | 'declined';
  admin_notes: string | null;
  reviewed_by: number | null;
  reviewed_at: string | null;
  created_at: string;
}

interface DetailedReview extends Omit<Review, 'reviewed_by'> {
  reviewed_by: User | null;
}

export default function AdminReviewsPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedReview, setSelectedReview] = useState<DetailedReview | null>(null)
  const [isModalLoading, setIsModalLoading] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<'approved' | 'declined'>('approved')

  useEffect(() => {
    const isAdmin = user?.user_type === 'admin' || user?.email === 'admin@gmail.com';
    if (!isLoading && (!user || !isAdmin)) {
      router.push('/dashboard')
      return
    }

    if (isAdmin) {
      fetchReviews()
    }
  }, [user, isLoading, router])

  useEffect(() => {
    filterReviews()
  }, [reviews, statusFilter, searchTerm])

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('trustwork_token')
      if (!token) return

      const response = await fetch('/api/admin/reviews', {
        headers: { 'Authorization': `Token ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Reviews API response:', data)
        
        // Handle different response formats
        if (Array.isArray(data)) {
          setReviews(data)
        } else if (data.reviews && Array.isArray(data.reviews)) {
          setReviews(data.reviews)
        } else if (data.results && Array.isArray(data.results)) {
          setReviews(data.results)
        } else {
          console.error('Unexpected data format:', data)
          setReviews([])
          setError('Unexpected data format received')
        }
      } else {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        setError('Failed to fetch reviews')
        toast.error('Failed to fetch reviews')
        setReviews([])
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
      setError('Failed to fetch reviews')
      toast.error('Failed to fetch reviews')
      setReviews([])
    } finally {
      setLoading(false)
    }
  }

  const fetchReviewDetails = async (reviewId: number) => {
    try {
      const token = localStorage.getItem('trustwork_token')
      if (!token) return

      setIsModalLoading(true)
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        headers: { 'Authorization': `Token ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setSelectedReview(data)
        setAdminNotes(data.admin_notes || '')
        setSelectedStatus(data.status === 'pending' ? 'approved' : data.status)
      } else {
        toast.error('Failed to fetch review details')
      }
    } catch (error) {
      console.error('Failed to fetch review details:', error)
      toast.error('Failed to fetch review details')
    } finally {
      setIsModalLoading(false)
    }
  }

  const updateReview = async () => {
    if (!selectedReview) return

    try {
      const token = localStorage.getItem('trustwork_token')
      if (!token) return

      const response = await fetch(`/api/admin/reviews/${selectedReview.id}/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: selectedStatus,
          admin_notes: adminNotes
        })
      })

      if (response.ok) {
        toast.success('Review updated successfully')
        setSelectedReview(null)
        fetchReviews() // Refresh the list
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to update review')
      }
    } catch (error) {
      console.error('Failed to update review:', error)
      toast.error('Failed to update review')
    }
  }

  const filterReviews = () => {
    // Ensure reviews is an array
    if (!Array.isArray(reviews)) {
      console.warn('Reviews is not an array:', reviews)
      setFilteredReviews([])
      return
    }

    let filtered = [...reviews]

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(review => review.status === statusFilter)
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(review =>
        review.freelancer?.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.freelancer?.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.freelancer?.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredReviews(filtered)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'declined': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'approved': return <Check className="w-4 h-4" />
      case 'declined': return <X className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (isLoading || loading) {
    return <LoadingSpinner />
  }

  const isAdmin = user?.user_type === 'admin' || user?.email === 'admin@gmail.com';
  if (!user || !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Freelancer Reviews</h1>
              <p className="text-gray-600 mt-2">Review and approve freelancer applications</p>
            </div>
            <div className="text-sm text-gray-500">
              {filteredReviews.length} of {reviews.length} reviews
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(filteredReviews) && filteredReviews.map((review) => (
            <Card key={review.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {review.freelancer.user.first_name} {review.freelancer.user.last_name}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {review.freelancer.user.email}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(review.status)}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(review.status)}
                      <span>{review.status}</span>
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Skills:</div>
                    <div className="flex flex-wrap gap-1">
                      {review.freelancer.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {review.freelancer.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{review.freelancer.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Applied: {formatDate(review.created_at)}
                    </div>
                  </div>

                  {review.reviewed_at && (
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Reviewed: {formatDate(review.reviewed_at)}
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={() => fetchReviewDetails(review.id)}
                    className="w-full"
                    variant="outline"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Review Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {error && (
          <div className="text-center py-12">
            <div className="text-red-500 text-lg mb-2">Error: {error}</div>
            <Button onClick={fetchReviews} variant="outline">
              Try Again
            </Button>
          </div>
        )}

        {!error && Array.isArray(filteredReviews) && filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No reviews found</div>
            <p className="text-gray-400 mt-2">Try adjusting your filters</p>
          </div>
        )}

        {/* Review Modal */}
        {selectedReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Review Freelancer Application</h2>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedReview(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {isModalLoading ? (
                  <LoadingSpinner />
                ) : (
                  <div className="space-y-6">
                    {/* Freelancer Info */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Freelancer Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm font-medium text-gray-700">Name</div>
                            <div className="text-lg">
                              {selectedReview.freelancer.user.first_name} {selectedReview.freelancer.user.last_name}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-700">Email</div>
                            <div className="text-lg">{selectedReview.freelancer.user.email}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-700">Applied Date</div>
                            <div className="text-lg">{formatDate(selectedReview.created_at)}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-700">Current Status</div>
                            <Badge className={getStatusColor(selectedReview.status)}>
                              {selectedReview.status}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Skills */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Skills</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {selectedReview.freelancer.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Experience */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Experience Description</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {selectedReview.freelancer.experience_description}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Education */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Education</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {selectedReview.freelancer.education}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Portfolio Links */}
                    {selectedReview.freelancer.portfolio_links.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Portfolio Links</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {selectedReview.freelancer.portfolio_links.map((link, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <ExternalLink className="w-4 h-4 text-gray-400" />
                                <a 
                                  href={link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  {link}
                                </a>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* GitHub Profile */}
                    {selectedReview.freelancer.github_profile && (
                      <Card>
                        <CardHeader>
                          <CardTitle>GitHub Profile</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center space-x-2">
                            <Github className="w-4 h-4 text-gray-400" />
                            <a 
                              href={selectedReview.freelancer.github_profile} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {selectedReview.freelancer.github_profile}
                            </a>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Review Actions */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Review Decision</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Decision</label>
                            <Select value={selectedStatus} onValueChange={(value: 'approved' | 'declined') => setSelectedStatus(value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="approved">Approve</SelectItem>
                                <SelectItem value="declined">Decline</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="text-sm font-medium mb-2 block">Admin Notes</label>
                            <Textarea
                              value={adminNotes}
                              onChange={(e) => setAdminNotes(e.target.value)}
                              placeholder="Add notes about your decision..."
                              rows={4}
                            />
                          </div>

                          <div className="flex gap-3">
                            <Button 
                              onClick={updateReview}
                              className="flex-1 bg-green-500 hover:bg-green-600"
                            >
                              {selectedStatus === 'approved' ? 'Approve Application' : 'Decline Application'}
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setSelectedReview(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
