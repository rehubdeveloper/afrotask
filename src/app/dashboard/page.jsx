'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle, Clock, AlertCircle, Plus, Eye, Briefcase, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useUser } from '../contexts/UserContext'
import { useUI } from '../contexts/UIContext'
import toast from 'react-hot-toast'
import FreelancerReapplyForm from '../components/FreelancerReapplyForm'
import ClientReapplyForm from '../components/ClientReapplyForm'

const Dashboard = () => {
  const { user, refetchUser } = useUser()
  const { showRestrictedModal } = useUI()
  const router = useRouter()
  const [showReapplyForm, setShowReapplyForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [projectStats, setProjectStats] = useState({
    postedJobs: 0,
    activeHires: 0,
    profileViews: 0
  })
  const [statsLoading, setStatsLoading] = useState(true)

  // Fetch project statistics
  const fetchProjectStats = async () => {
    try {
      setStatsLoading(true)
      const token = localStorage.getItem('trustwork_token')
      if (!token) {
        console.log('No token found for fetching stats')
        return
      }

      // Fetch projects for clients
      if (user?.user_type === 'client') {
        const response = await fetch('/api/projects', {
          headers: {
            'Authorization': `Token ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          console.log('Projects data for stats:', data)
          
          // Count different types of projects
          const projects = data.results || []
          const postedJobs = projects.length
          const activeHires = projects.filter(p => p.status === 'in_progress' || p.status === 'active').length
          
          setProjectStats({
            postedJobs,
            activeHires,
            profileViews: 0 // This would need a separate endpoint
          })
        } else {
          console.error('Failed to fetch projects for stats')
        }
      }
    } catch (error) {
      console.error('Error fetching project stats:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  // Fetch stats when user is loaded
  useEffect(() => {
    if (user && user.user_type === 'client') {
      fetchProjectStats()
    } else {
      setStatsLoading(false)
    }
  }, [user])

  const getStatusIcon = () => {
    if (user?.is_verified) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    if (user?.is_pending_review) {
      return <Clock className="w-5 h-5 text-orange-500" />;
    }
    if (user?.review_status === 'declined') {
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
    return <AlertCircle className="w-5 h-5 text-gray-500" />;
  }

  const getStatusText = () => {
    if (user?.is_verified) {
      return 'Verified';
    }
    if (user?.is_pending_review) {
      return 'Under Review';
    }
    if (user?.review_status === 'declined') {
      return 'Declined';
    }
    return 'Not Verified';
  }

  const getStatusColor = () => {
    if (user?.is_verified) {
      return 'bg-green-100 text-green-800';
    }
    if (user?.is_pending_review) {
      return 'bg-orange-100 text-orange-800';
    }
    if (user?.review_status === 'declined') {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-gray-100 text-gray-800';
  }

  const handleRestrictedAction = (action) => {
    if (!user?.is_verified) {
      showRestrictedModal(action)
      return
    }
    // If approved, navigate to the actual page
    // This would be handled by the Link component
  }

  const handleReapply = () => {
    setIsLoading(true);
    setShowReapplyForm(true);
    setIsLoading(false);
  }

  const handleReapplySuccess = () => {
    setShowReapplyForm(false);
  }

  const handleReapplyCancel = () => {
    setShowReapplyForm(false);
  }

  const handleCreateProject = () => {
    router.push('/projects/create');
  }

  const handleBrowseProjects = () => {
    router.push('/projects');
  }

  const stats = [
    {
      title: user?.user_type === 'freelancer' ? 'Active Services' : 'Posted Jobs',
      value: statsLoading ? '...' : (user?.user_type === 'freelancer' ? '0' : projectStats.postedJobs.toString()),
      icon: user?.user_type === 'freelancer' ? Briefcase : Plus,
      color: 'text-blue-600'
    },
    {
      title: user?.user_type === 'freelancer' ? 'Total Earnings' : 'Active Hires',
      value: statsLoading ? '...' : (user?.user_type === 'freelancer' ? '₦0' : projectStats.activeHires.toString()),
      icon: user?.user_type === 'freelancer' ? Users : Users,
      color: 'text-green-600'
    },
    {
      title: 'Profile Views',
      value: statsLoading ? '...' : projectStats.profileViews.toString(),
      icon: Eye,
      color: 'text-purple-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Vertical Navigation Bar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
          <p className="text-sm text-gray-500">
            {user?.user_type === 'client' ? 'Manage your projects' : 'Manage your services'}
          </p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {user?.user_type === 'client' ? (
            // Client Navigation
            <>
              <Button 
                className="w-full justify-start h-12"
                onClick={handleCreateProject}
              >
                <Plus className="w-4 h-4 mr-3" />
                Create Project
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start h-12"
                onClick={handleBrowseProjects}
              >
                <Eye className="w-4 h-4 mr-3" />
                My Projects
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start h-12"
                onClick={() => router.push('/freelancers')}
              >
                <Users className="w-4 h-4 mr-3" />
                Browse Freelancers
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start h-12"
                onClick={() => router.push('/messages')}
              >
                <Users className="w-4 h-4 mr-3" />
                Messages
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start h-12"
                onClick={handleReapply}
                disabled={isLoading}
              >
                <Plus className="w-4 h-4 mr-3" />
                {isLoading ? 'Loading...' : 'Update Profile'}
              </Button>
            </>
          ) : (
            // Freelancer Navigation
            <>
              {user?.is_verified ? (
                <Link href="/offer-service">
                  <Button className="w-full justify-start h-12 bg-green-500 hover:bg-green-600">
                    <Plus className="w-4 h-4 mr-3" />
                    Create Service
                  </Button>
                </Link>
              ) : (
                <Button
                  className="w-full justify-start h-12 bg-green-500 hover:bg-green-600"
                  onClick={() => handleRestrictedAction('creating services')}
                >
                  <Plus className="w-4 h-4 mr-3" />
                  Create Service
                </Button>
              )}
              
              <Link href="/explore">
                <Button variant="outline" className="w-full justify-start h-12">
                  <Eye className="w-4 h-4 mr-3" />
                  Browse Jobs
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                className="w-full justify-start h-12"
                onClick={() => router.push('/messages')}
              >
                <Users className="w-4 h-4 mr-3" />
                Messages
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start h-12"
                onClick={handleReapply}
                disabled={isLoading}
              >
                <Plus className="w-4 h-4 mr-3" />
                {isLoading ? 'Loading...' : 'Update Profile'}
              </Button>
            </>
          )}
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <p>Logged in as:</p>
            <p className="font-medium text-gray-700">{user?.first_name} {user?.last_name}</p>
            <p className="text-gray-400 capitalize">{user?.user_type}</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.first_name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your {user?.user_type === 'freelancer' ? 'services and projects' : 'job postings and hires'}
          </p>
        </div>

        {/* Status Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  {getStatusIcon()}
                  <span>Account Status</span>
                </CardTitle>
                <CardDescription>
                  Your current verification status
                </CardDescription>
              </div>
              <Badge className={getStatusColor()}>
                {getStatusText()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {user?.is_verified ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-700">
                  🎉 Your account is verified! You have full access to all AfroTask features.
                </p>
              </div>
            ) : user?.is_pending_review ? (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-orange-700">
                  ⏳ Your verification is under review. We'll notify you once it's complete.
                </p>
              </div>
            ) : user?.review_status === 'declined' ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-red-800 font-medium mb-2">
                      Application Declined
                    </h4>
                    <p className="text-red-700 mb-3">
                      Unfortunately, your freelancer application was not approved at this time. 
                      You can reapply with improved information or contact support for more details.
                    </p>
                    {user?.admin_notes ? (
                      <div className="bg-red-100 border border-red-200 rounded-md p-3 mb-3">
                        <h5 className="text-red-800 font-medium text-sm mb-1">Admin Feedback:</h5>
                        <p className="text-red-700 text-sm">{user.admin_notes}</p>
                      </div>
                    ) : (
                      <div className="bg-red-100 border border-red-200 rounded-md p-3 mb-3">
                        <h5 className="text-red-800 font-medium text-sm mb-1">Note:</h5>
                        <p className="text-red-700 text-sm">
                          Please contact support for detailed feedback about your application.
                        </p>
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-2">
                 <Button 
                   size="sm" 
                   className="cursor-pointer bg-red-600 hover:bg-red-700"
                   onClick={handleReapply}
                   disabled={isLoading}
                 >
                   {isLoading ? 'Loading...' : 'Reapply'}
                 </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="cursor-pointer border-red-300 text-red-700 hover:bg-red-50"
                        onClick={() => window.open('mailto:support@afrotask.com?subject=Application Appeal', '_blank')}
                      >
                        Contact Support
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-700 mb-3">
                  Complete your verification to access all features.
                </p>
                <Link href="/verification">
                  <Button size="sm" className="cursor-pointer bg-blue-600 hover:bg-blue-700">
                    Complete Verification
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>


        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest actions and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Account created</span>
                <span className="text-gray-400 ml-auto">
                  {user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'Today'}
                </span>
              </div>
              {user?.user_type && (
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">
                    Selected role: {user.user_type === 'freelancer' ? 'Freelancer' : 'Client'}
                  </span>
                  <span className="text-gray-400 ml-auto">Today</span>
                </div>
              )}
              {user?.is_pending_review && (
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-600">Verification submitted</span>
                  <span className="text-gray-400 ml-auto">Today</span>
                </div>
              )}
              {user?.is_verified && (
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Account verified</span>
                  <span className="text-gray-400 ml-auto">Today</span>
                </div>
              )}
              {user?.review_status === 'declined' && (
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-600">Application declined</span>
                  <span className="text-gray-400 ml-auto">Today</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Reapplication Form Modal */}
      {showReapplyForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {user?.user_type === 'freelancer' ? (
              <FreelancerReapplyForm 
                onSuccess={handleReapplySuccess}
                onCancel={handleReapplyCancel}
              />
            ) : (
              <ClientReapplyForm 
                onSuccess={handleReapplySuccess}
                onCancel={handleReapplyCancel}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
