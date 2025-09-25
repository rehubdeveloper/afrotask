'use client'
import { useState, useEffect } from 'react'
import { useUser } from '../contexts/UserContext'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Clock, 
  DollarSign, 
  MapPin,
  Users,
  Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import LoadingSpinner from '../components/LoadingSpinner'
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

interface ProjectCategory {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export default function ProjectsPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<ProjectCategory[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [minBudget, setMinBudget] = useState('')
  const [maxBudget, setMaxBudget] = useState('')
  const [selectedSkills, setSelectedSkills] = useState('')

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/signin')
      return
    }

    if (user) {
      console.log('Current user:', user)
      console.log('User type:', user.user_type)
      console.log('User ID:', user.id)
      // Force refresh projects when page loads
      fetchProjects()
      fetchCategories()
    }
  }, [user, isLoading, router])

  useEffect(() => {
    filterProjects()
  }, [projects, searchTerm, selectedCategory, minBudget, maxBudget, selectedSkills])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('trustwork_token')
      if (!token) {
        console.log('No token found, redirecting to signin')
        router.push('/signin')
        return
      }

      console.log('Fetching projects with token:', token.substring(0, 10) + '...')
      console.log('Full token (first 20 chars):', token.substring(0, 20) + '...')
      
      const response = await fetch('/api/projects', {
        headers: { 'Authorization': `Token ${token}` }
      })

      console.log('Projects API response status:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('Projects API response data:', data)
        
        // Handle the correct API response format from the documentation
        let projectsData = []
        if (data.results && Array.isArray(data.results)) {
          console.log('Projects found in data.results, length:', data.results.length)
          console.log('Total count:', data.count)
          projectsData = data.results
        } else if (Array.isArray(data)) {
          console.log('Projects is direct array, length:', data.length)
          projectsData = data
        } else if (data.projects && Array.isArray(data.projects)) {
          console.log('Projects found in data.projects, length:', data.projects.length)
          projectsData = data.projects
        } else {
          console.error('Unexpected projects data format:', data)
          setProjects([])
          return
        }

        // Normalize the projects data to ensure required_skills is always an array
        const normalizedProjects = projectsData.map(project => {
          // Ensure required_skills is an array
          let skills = project.required_skills
          if (typeof skills === 'string') {
            try {
              skills = JSON.parse(skills)
            } catch (e) {
              // If JSON parsing fails, split by comma
              skills = skills.split(',').map(s => s.trim()).filter(Boolean)
            }
          }
          if (!Array.isArray(skills)) {
            skills = []
          }

          return {
            ...project,
            required_skills: skills
          }
        })

        console.log('Normalized projects:', normalizedProjects)
        setProjects(normalizedProjects)
      } else {
        const errorData = await response.json()
        console.error('Failed to fetch projects, status:', response.status, 'error:', errorData)
        toast.error(`Failed to fetch projects: ${errorData.message || 'Unknown error'}`)
        setProjects([])
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
      toast.error('Failed to fetch projects')
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/project-categories')
      if (response.ok) {
        const data = await response.json()
        console.log('Categories API response:', data)
        
        // Handle different response formats
        if (Array.isArray(data)) {
          setCategories(data)
        } else if (data.categories && Array.isArray(data.categories)) {
          setCategories(data.categories)
        } else if (data.results && Array.isArray(data.results)) {
          setCategories(data.results)
        } else {
          console.error('Unexpected categories data format:', data)
          setCategories([])
        }
      } else {
        console.error('Failed to fetch categories, status:', response.status)
        setCategories([])
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      setCategories([])
    }
  }

  const filterProjects = () => {
    // Ensure projects is an array
    if (!Array.isArray(projects)) {
      console.warn('Projects is not an array:', projects)
      setFilteredProjects([])
      return
    }

    let filtered = [...projects]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category.name === selectedCategory)
    }

    // Budget filters
    if (minBudget) {
      filtered = filtered.filter(project => parseFloat(project.budget) >= parseFloat(minBudget))
    }
    if (maxBudget) {
      filtered = filtered.filter(project => parseFloat(project.budget) <= parseFloat(maxBudget))
    }

    // Skills filter
    if (selectedSkills) {
      const skills = selectedSkills.split(',').map(s => s.trim().toLowerCase())
      filtered = filtered.filter(project =>
        Array.isArray(project.required_skills) && project.required_skills.some(skill =>
          skills.some(searchSkill => skill.toLowerCase().includes(searchSkill))
        )
      )
    }

    setFilteredProjects(filtered)
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

  if (isLoading || loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-2">Browse and manage projects</p>
          </div>
          {user?.user_type === 'client' && user?.is_verified && (
            <Link href="/projects/create">
              <Button className="bg-green-500 hover:bg-green-600">
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </Link>
          )}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {Array.isArray(categories) && categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Min Budget</label>
                <Input
                  type="number"
                  placeholder="Min budget"
                  value={minBudget}
                  onChange={(e) => setMinBudget(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Max Budget</label>
                <Input
                  type="number"
                  placeholder="Max budget"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Skills</label>
                <Input
                  placeholder="Python, React, etc."
                  value={selectedSkills}
                  onChange={(e) => setSelectedSkills(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(filteredProjects) && filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
                    <CardDescription className="mt-1">
                      by {project.client.first_name} {project.client.last_name}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {project.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    {formatCurrency(project.budget)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    {project.duration_days} days
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {project.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    {project.bid_count} bids
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(project.created_at)}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Required Skills:</div>
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(project.required_skills) && project.required_skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {Array.isArray(project.required_skills) && project.required_skills.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.required_skills.length - 3} more
                      </Badge>
                    )}
                    {!Array.isArray(project.required_skills) && (
                      <Badge variant="secondary" className="text-xs">
                        Skills not specified
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/projects/${project.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                  {user?.user_type === 'freelancer' && user?.is_verified && project.status === 'active' && (
                    <Link href={`/projects/${project.id}/bid`} className="flex-1">
                      <Button className="w-full bg-green-500 hover:bg-green-600">
                        Submit Bid
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No projects found</div>
            <p className="text-gray-400 mt-2">
              {user?.user_type === 'client' 
                ? "You haven't created any projects yet. Create your first project to get started!"
                : user?.user_type === 'freelancer'
                ? "No active public projects available for bidding. Check back later!"
                : "No projects found. Try adjusting your filters or check back later."
              }
            </p>
            <div className="mt-4 space-y-2">
              <Button
                variant="outline"
                onClick={() => {
                  console.log('Manual refresh triggered')
                  fetchProjects()
                }}
                disabled={loading}
              >
                {loading ? 'Refreshing...' : 'Refresh Projects'}
              </Button>
              <div className="text-xs text-gray-400">
                Debug: User type: {user?.user_type}, Total projects: {projects.length}, Filtered: {filteredProjects.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
