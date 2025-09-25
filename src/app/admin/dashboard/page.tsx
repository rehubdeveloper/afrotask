'use client'
import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  Briefcase, 
  MessageSquare, 
  Bell, 
  BarChart3, 
  Shield, 
  FileText,
  AlertTriangle,
  TrendingUp,
  Eye,
  Clock,
  ArrowLeft,
  Settings,
  Activity
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import LoadingSpinner from '../../components/LoadingSpinner'

interface AdminStats {
  total_users: number;
  total_freelancers: number;
  total_clients: number;
  verified_freelancers: number;
  pending_freelancers: number;
  active_projects_count: number;
  completed_projects_count: number;
}

interface ProjectStats {
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  total_budget: string;
  average_project_duration: number;
  projects_by_category: Record<string, number>;
  projects_by_status: Record<string, number>;
}

interface BidStats {
  total_bids: number;
  average_bid_amount: string;
  bids_by_status: Record<string, number>;
  top_freelancers: Array<{ name: string; bid_count: number }>;
}

export default function AdminDashboard() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [userStats, setUserStats] = useState<AdminStats | null>(null)
  const [projectStats, setProjectStats] = useState<ProjectStats | null>(null)
  const [bidStats, setBidStats] = useState<BidStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const isAdmin = user?.user_type === 'admin' || user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL || user?.email === 'admin@gmail.com';
    console.log('Admin dashboard - User:', user);
    console.log('Admin dashboard - Is admin:', isAdmin);
    
    if (!isLoading && (!user || !isAdmin)) {
      router.push('/dashboard')
      return
    }

    if (isAdmin) {
      fetchAdminData()
    }
  }, [user, isLoading, router])

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('trustwork_token')
      if (!token) return

      const [usersRes, projectsRes, bidsRes] = await Promise.all([
        fetch('/api/admin/analytics/users', {
          headers: { 'Authorization': `Token ${token}` }
        }),
        fetch('/api/admin/analytics/projects', {
          headers: { 'Authorization': `Token ${token}` }
        }),
        fetch('/api/admin/analytics/bids', {
          headers: { 'Authorization': `Token ${token}` }
        })
      ])

      if (usersRes.ok) {
        const userData = await usersRes.json()
        setUserStats(userData)
      }

      if (projectsRes.ok) {
        const projectData = await projectsRes.json()
        setProjectStats(projectData)
      }

      if (bidsRes.ok) {
        const bidData = await bidsRes.json()
        setBidStats(bidData)
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (isLoading || loading) {
    return <LoadingSpinner />
  }

  const isAdmin = user?.user_type === 'admin' || user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL || user?.email === 'admin@gmail.com';
  if (!user || !isAdmin) {
    return null
  }

  const adminFeatures = [
    {
      title: 'User Management',
      description: 'Manage freelancer reviews and user accounts',
      icon: Users,
      href: '/admin/reviews',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Project Analytics',
      description: 'View project statistics and performance',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Content Moderation',
      description: 'Monitor chats and moderate content',
      icon: Shield,
      href: '/admin/monitoring',
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      title: 'Reports & Warnings',
      description: 'Handle user reports and issue warnings',
      icon: AlertTriangle,
      href: '/admin/reports',
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Vertical Navigation Bar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
          <p className="text-sm text-gray-500">Platform management</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Button 
            className="w-full justify-start h-12"
            onClick={() => router.push('/admin/reviews')}
          >
            <Users className="w-4 h-4 mr-3" />
            User Reviews
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start h-12"
            onClick={() => router.push('/admin/analytics')}
          >
            <BarChart3 className="w-4 h-4 mr-3" />
            Analytics
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start h-12"
            onClick={() => router.push('/admin/monitoring')}
          >
            <Eye className="w-4 h-4 mr-3" />
            Monitoring
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start h-12"
            onClick={() => router.push('/admin/reports')}
          >
            <FileText className="w-4 h-4 mr-3" />
            Reports
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start h-12"
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="w-4 h-4 mr-3" />
            Back to Dashboard
          </Button>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <p>Logged in as:</p>
            <p className="font-medium text-gray-700">{user?.first_name} {user?.last_name}</p>
            <p className="text-gray-400 capitalize">Admin</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage and monitor the AfroTask platform</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats?.total_users || 0}</div>
              <p className="text-xs text-muted-foreground">
                {userStats?.total_freelancers || 0} freelancers, {userStats?.total_clients || 0} clients
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectStats?.active_projects || 0}</div>
              <p className="text-xs text-muted-foreground">
                {projectStats?.completed_projects || 0} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats?.pending_freelancers || 0}</div>
              <p className="text-xs text-muted-foreground">
                Freelancers awaiting approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₦{projectStats?.total_budget ? parseInt(projectStats.total_budget).toLocaleString() : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all projects
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminFeatures.map((feature) => {
            const IconComponent = feature.icon
            return (
              <Link key={feature.title} href={feature.href}>
                <Card className="cursor-pointer transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-lg ${feature.color}`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>

        </div>
      </div>
    </div>
  )
}
