'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  Play, 
  Pause, 
  Square, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  User,
  Shield,
  Info
} from 'lucide-react'
import toast from 'react-hot-toast'

interface ProjectStatusManagerProps {
  project: {
    id: number
    status: string
    client: { id: number }
    awarded_freelancer?: { id: number } | null
  }
  currentUser: {
    id: number
    user_type: string
  }
  onStatusChange: (newStatus: string) => void
}

interface StatusTransition {
  from: string
  to: string
  allowedFor: string[]
  icon: React.ComponentType<any>
  color: string
  description: string
}

const STATUS_TRANSITIONS: StatusTransition[] = [
  // Client transitions
  {
    from: 'draft',
    to: 'active',
    allowedFor: ['client'],
    icon: Play,
    color: 'bg-green-500 hover:bg-green-600',
    description: 'Activate project for freelancers to see and bid'
  },
  {
    from: 'draft',
    to: 'cancelled',
    allowedFor: ['client'],
    icon: Square,
    color: 'bg-red-500 hover:bg-red-600',
    description: 'Cancel project before it goes live'
  },
  {
    from: 'active',
    to: 'cancelled',
    allowedFor: ['client'],
    icon: Square,
    color: 'bg-red-500 hover:bg-red-600',
    description: 'Cancel the project'
  },
  {
    from: 'active',
    to: 'paused',
    allowedFor: ['client'],
    icon: Pause,
    color: 'bg-yellow-500 hover:bg-yellow-600',
    description: 'Temporarily pause the project'
  },
  {
    from: 'active',
    to: 'on_hold',
    allowedFor: ['client'],
    icon: Clock,
    color: 'bg-orange-500 hover:bg-orange-600',
    description: 'Put project on hold'
  },
  {
    from: 'in_progress',
    to: 'cancelled',
    allowedFor: ['client'],
    icon: Square,
    color: 'bg-red-500 hover:bg-red-600',
    description: 'Cancel ongoing project'
  },
  {
    from: 'in_progress',
    to: 'paused',
    allowedFor: ['client'],
    icon: Pause,
    color: 'bg-yellow-500 hover:bg-yellow-600',
    description: 'Pause ongoing project'
  },
  {
    from: 'in_progress',
    to: 'on_hold',
    allowedFor: ['client'],
    icon: Clock,
    color: 'bg-orange-500 hover:bg-orange-600',
    description: 'Put ongoing project on hold'
  },
  {
    from: 'completed',
    to: 'cancelled',
    allowedFor: ['client'],
    icon: Square,
    color: 'bg-red-500 hover:bg-red-600',
    description: 'Cancel completed project'
  },
  {
    from: 'paused',
    to: 'active',
    allowedFor: ['client'],
    icon: Play,
    color: 'bg-green-500 hover:bg-green-600',
    description: 'Resume paused project'
  },
  {
    from: 'paused',
    to: 'cancelled',
    allowedFor: ['client'],
    icon: Square,
    color: 'bg-red-500 hover:bg-red-600',
    description: 'Cancel paused project'
  },
  {
    from: 'on_hold',
    to: 'active',
    allowedFor: ['client'],
    icon: Play,
    color: 'bg-green-500 hover:bg-green-600',
    description: 'Resume project from hold'
  },
  {
    from: 'on_hold',
    to: 'cancelled',
    allowedFor: ['client'],
    icon: Square,
    color: 'bg-red-500 hover:bg-red-600',
    description: 'Cancel held project'
  },
  
  // Freelancer transitions (awarded freelancer only)
  {
    from: 'active',
    to: 'in_progress',
    allowedFor: ['freelancer'],
    icon: Play,
    color: 'bg-blue-500 hover:bg-blue-600',
    description: 'Start working on the project'
  },
  {
    from: 'in_progress',
    to: 'completed',
    allowedFor: ['freelancer'],
    icon: CheckCircle,
    color: 'bg-green-500 hover:bg-green-600',
    description: 'Mark project as completed'
  },
  {
    from: 'in_progress',
    to: 'cancelled',
    allowedFor: ['freelancer'],
    icon: Square,
    color: 'bg-red-500 hover:bg-red-600',
    description: 'Cancel your work on the project'
  },
  {
    from: 'in_progress',
    to: 'paused',
    allowedFor: ['freelancer'],
    icon: Pause,
    color: 'bg-yellow-500 hover:bg-yellow-600',
    description: 'Pause your work on the project'
  },
  {
    from: 'in_progress',
    to: 'on_hold',
    allowedFor: ['freelancer'],
    icon: Clock,
    color: 'bg-orange-500 hover:bg-orange-600',
    description: 'Put your work on hold'
  },
  {
    from: 'completed',
    to: 'cancelled',
    allowedFor: ['freelancer'],
    icon: Square,
    color: 'bg-red-500 hover:bg-red-600',
    description: 'Cancel completed work'
  },
  {
    from: 'paused',
    to: 'in_progress',
    allowedFor: ['freelancer'],
    icon: Play,
    color: 'bg-blue-500 hover:bg-blue-600',
    description: 'Resume your work'
  },
  {
    from: 'paused',
    to: 'cancelled',
    allowedFor: ['freelancer'],
    icon: Square,
    color: 'bg-red-500 hover:bg-red-600',
    description: 'Cancel paused work'
  },
  {
    from: 'on_hold',
    to: 'in_progress',
    allowedFor: ['freelancer'],
    icon: Play,
    color: 'bg-blue-500 hover:bg-blue-600',
    description: 'Resume work from hold'
  },
  {
    from: 'on_hold',
    to: 'cancelled',
    allowedFor: ['freelancer'],
    icon: Square,
    color: 'bg-red-500 hover:bg-red-600',
    description: 'Cancel held work'
  }
]

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  active: 'bg-green-100 text-green-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
  paused: 'bg-yellow-100 text-yellow-800',
  on_hold: 'bg-orange-100 text-orange-800'
}

const STATUS_DESCRIPTIONS: Record<string, string> = {
  draft: 'Project is being prepared and not visible to freelancers',
  active: 'Project is live and accepting bids from freelancers',
  in_progress: 'Project is being worked on by the awarded freelancer',
  completed: 'Project work has been completed and is awaiting client approval',
  cancelled: 'Project has been cancelled and is no longer active',
  paused: 'Project is temporarily paused',
  on_hold: 'Project is on hold and not currently active'
}

export default function ProjectStatusManager({ project, currentUser, onStatusChange }: ProjectStatusManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [reason, setReason] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  // Get available transitions for current user
  const getAvailableTransitions = () => {
    return STATUS_TRANSITIONS.filter(transition => {
      // Check if transition is from current status
      if (transition.from !== project.status) return false
      
      // Check if user type is allowed
      if (!transition.allowedFor.includes(currentUser.user_type)) return false
      
      // Check user permissions according to requirements
      // Handle potential ID field mismatches between frontend and backend
      const currentUserId = currentUser.id
      const projectClientId = project.client.id
      const awardedFreelancerId = project.awarded_freelancer?.id || null
      
      // Check multiple possible ID fields for compatibility
      const currentUserPk = currentUser.user_id || currentUser.pk || currentUser.id
      const projectClientPk = project.client.user_id || project.client.pk || project.client.id
      const awardedFreelancerPk = project.awarded_freelancer ? 
        (project.awarded_freelancer.user_id || project.awarded_freelancer.pk || project.awarded_freelancer.id) : null
      
      // Additional check: Compare email addresses as fallback for ID mismatch
      const isEmailMatch = currentUser.email && project.client.email && 
        currentUser.email === project.client.email
      
      // Check if user is the project client using multiple methods
      const isProjectClient = (projectClientId === currentUserId) || 
                             (projectClientPk === currentUserPk) || 
                             isEmailMatch ||
                             (currentUser.user_type === 'client' && isEmailMatch)
      
      const isAwardedFreelancer = project.awarded_freelancer && 
        ((awardedFreelancerId === currentUserId) || (awardedFreelancerPk === currentUserPk))
      const isAdmin = currentUser.user_type === 'admin'
      
      console.log('Permission check:', {
        currentUserId,
        projectClientId,
        awardedFreelancerId,
        currentUserPk,
        projectClientPk,
        awardedFreelancerPk,
        isEmailMatch,
        isProjectClient,
        isAwardedFreelancer,
        isAdmin,
        userType: currentUser.user_type,
        currentUserEmail: currentUser.email,
        projectClientEmail: project.client.email,
        currentUserData: currentUser,
        projectClientData: project.client
      })
      
      // Special check for freelancer transitions
      if (currentUser.user_type === 'freelancer') {
        // Must be the awarded freelancer
        if (!isAwardedFreelancer) {
          console.log('Freelancer permission denied: Not the awarded freelancer')
          return false
        }
      }
      
      // Special check for client transitions
      if (currentUser.user_type === 'client') {
        // Must be the project owner
        if (!isProjectClient) {
          console.log('Client permission denied: Not the project owner')
          return false
        }
      }
      
      // Admin can do anything
      if (isAdmin) {
        console.log('Admin permission: Allowed')
        return true
      }
      
      return true
    })
  }

  const availableTransitions = getAvailableTransitions()

  // Debug logging
  console.log('ProjectStatusManager Debug:', {
    projectStatus: project.status,
    currentUserType: currentUser.user_type,
    currentUserId: currentUser.id,
    projectClientId: project.client.id,
    availableTransitions: availableTransitions.length,
    allTransitions: STATUS_TRANSITIONS.filter(t => t.from === project.status).length,
    isOwner: project.client.id === currentUser.id
  })

  const handleStatusChange = async () => {
    console.log('handleStatusChange called with selectedStatus:', selectedStatus)
    
    if (!selectedStatus) {
      toast.error('Please select a new status')
      return
    }

    console.log('Starting status update process...')
    setIsUpdating(true)
    try {
      const token = localStorage.getItem('trustwork_token')
      if (!token) {
        toast.error('Please sign in to update project status')
        return
      }

      const requestBody = {
        status: selectedStatus
      }
      
      console.log('Sending status update request:', {
        url: `/api/projects/${project.id}`,
        method: 'PUT',
        body: requestBody,
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })

      console.log('About to make fetch request to:', `/api/projects/${project.id}`)
      console.log('Request body:', JSON.stringify(requestBody))
      console.log('Authorization token:', token ? 'Present' : 'Missing')

      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      console.log('Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Status update successful:', data)
        toast.success(data.message || 'Project status updated successfully!')
        
        // Backend is now fixed, simple success message is sufficient
        
        onStatusChange(selectedStatus)
        setIsDialogOpen(false)
        setSelectedStatus('')
        setReason('')
      } else {
        const errorData = await response.json()
        console.error('Status update failed:', {
          status: response.status,
          statusText: response.statusText,
          errorData: errorData,
          requestBody: requestBody
        })
        toast.error(errorData.error || errorData.message || 'Failed to update project status')
      }
    } catch (error) {
      console.error('Failed to update project status:', error)
      toast.error('An error occurred while updating project status')
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <AlertTriangle className="w-4 h-4" />
      case 'active': return <Play className="w-4 h-4" />
      case 'in_progress': return <Clock className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'cancelled': return <Square className="w-4 h-4" />
      case 'paused': return <Pause className="w-4 h-4" />
      case 'on_hold': return <Clock className="w-4 h-4" />
      default: return <Info className="w-4 h-4" />
    }
  }

  const canChangeStatus = () => {
    return availableTransitions.length > 0 || currentUser.user_type === 'admin'
  }

  if (!canChangeStatus()) {
    console.log('No status changes available for this project')
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b">
          <CardTitle className="text-xl text-gray-900">Project Status Management</CardTitle>
          <CardDescription className="text-gray-600">
            Current Status: <span className={`font-semibold ${STATUS_COLORS[project.status]} px-2 py-1 rounded-md`}>
              {project.status.toUpperCase()}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="text-center text-gray-500">
              <p className="font-semibold text-red-600">No status changes available for this project.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-sm">
              <h4 className="font-semibold mb-2">Debug Information:</h4>
              <p><strong>Project Status:</strong> {project.status}</p>
              <p><strong>User Type:</strong> {currentUser.user_type}</p>
              <p><strong>Current User ID:</strong> {currentUser.id}</p>
              <p><strong>Project Client ID:</strong> {project.client.id}</p>
              <p><strong>Current User PK:</strong> {currentUser.user_id || currentUser.pk || currentUser.id}</p>
              <p><strong>Project Client PK:</strong> {project.client.user_id || project.client.pk || project.client.id}</p>
              <p><strong>Current User Email:</strong> {currentUser.email}</p>
              <p><strong>Project Client Email:</strong> {project.client.email}</p>
              <p><strong>Is Owner (ID):</strong> {project.client.id === currentUser.id ? 'Yes' : 'No'}</p>
              <p><strong>Is Owner (PK):</strong> {(project.client.user_id || project.client.pk || project.client.id) === (currentUser.user_id || currentUser.pk || currentUser.id) ? 'Yes' : 'No'}</p>
              <p><strong>Is Owner (Email):</strong> {currentUser.email && project.client.email && currentUser.email === project.client.email ? 'Yes' : 'No'}</p>
              <p><strong>Available Transitions:</strong> {availableTransitions.length}</p>
              <p><strong>All Draft Transitions:</strong> {STATUS_TRANSITIONS.filter(t => t.from === project.status).length}</p>
            </div>
            {project.client.id !== currentUser.id && 
             (project.client.user_id || project.client.pk || project.client.id) !== (currentUser.user_id || currentUser.pk || currentUser.id) &&
             !(currentUser.email && project.client.email && currentUser.email === project.client.email) && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <p className="text-red-800 font-semibold">⚠️ Permission Issue:</p>
                <p className="text-red-700">You are not the owner of this project. Only the project owner can change the status.</p>
                <p className="text-red-600 text-sm mt-2">
                  Current User ID: {currentUser.id} | Project Owner ID: {project.client.id}
                </p>
                <p className="text-red-600 text-sm">
                  Current User PK: {currentUser.user_id || currentUser.pk || currentUser.id} | Project Owner PK: {project.client.user_id || project.client.pk || project.client.id}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
        <CardTitle className="text-lg text-gray-900 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Project Status Management
        </CardTitle>
        <CardDescription>
          Manage project status with role-based permissions
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Current Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {getStatusIcon(project.status)}
              <div>
                <div className="font-semibold text-gray-900">Current Status</div>
                <div className="text-sm text-gray-600">
                  {STATUS_DESCRIPTIONS[project.status] || 'Unknown status'}
                </div>
              </div>
            </div>
            <Badge className={`${STATUS_COLORS[project.status]} text-sm px-3 py-1`}>
              {project.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>

          {/* Available Actions */}
          {availableTransitions.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Available Actions</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableTransitions.map((transition, index) => {
                  const IconComponent = transition.icon
                  return (
                    <Dialog key={index} open={isDialogOpen && selectedStatus === transition.to} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className={`${transition.color} text-white border-0 h-auto p-4 flex flex-col items-center space-y-2`}
                          onClick={() => {
                            console.log('Status selected:', transition.to)
                            setSelectedStatus(transition.to)
                          }}
                        >
                          <IconComponent className="w-5 h-5" />
                          <div className="text-center">
                            <div className="font-medium">
                              {transition.to.replace('_', ' ').toUpperCase()}
                            </div>
                            <div className="text-xs opacity-90">
                              {transition.description}
                            </div>
                          </div>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Change Project Status</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to change the project status from{' '}
                            <span className="font-semibold">{project.status}</span> to{' '}
                            <span className="font-semibold">{transition.to}</span>?
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="reason">Reason (Optional)</Label>
                            <Textarea
                              id="reason"
                              placeholder="Enter reason for status change..."
                              value={reason}
                              onChange={(e) => setReason(e.target.value)}
                              className="mt-1"
                            />
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsDialogOpen(false)
                              setSelectedStatus('')
                              setReason('')
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleStatusChange}
                            disabled={isUpdating}
                            className={transition.color}
                          >
                            {isUpdating ? 'Updating...' : 'Confirm Change'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )
                })}
              </div>
            </div>
          )}

          {/* Admin Override */}
          {currentUser.user_type === 'admin' && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-4 h-4 text-yellow-600" />
                <span className="font-medium text-yellow-800">Admin Override</span>
              </div>
              <p className="text-sm text-yellow-700 mb-3">
                As an admin, you can change the project status to any value.
              </p>
              <Dialog open={isDialogOpen && selectedStatus === 'admin_override'} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                    onClick={() => setSelectedStatus('admin_override')}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Admin Status Override
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Admin Status Override</DialogTitle>
                    <DialogDescription>
                      Select any status for this project. Use with caution.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="admin-status">New Status</Label>
                      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(STATUS_COLORS).map(status => (
                            <SelectItem key={status} value={status}>
                              {status.replace('_', ' ').toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="admin-reason">Reason (Required for Admin Changes)</Label>
                      <Textarea
                        id="admin-reason"
                        placeholder="Enter reason for admin status change..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false)
                        setSelectedStatus('')
                        setReason('')
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleStatusChange}
                      disabled={isUpdating || !selectedStatus || !reason}
                      className="bg-yellow-500 hover:bg-yellow-600"
                    >
                      {isUpdating ? 'Updating...' : 'Confirm Admin Change'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* Permission Info */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Info className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Permission Info</span>
            </div>
            <div className="text-xs text-blue-700">
              {currentUser.user_type === 'client' && 'You can manage project status as the project owner.'}
              {currentUser.user_type === 'freelancer' && 'You can change status only if you are the awarded freelancer.'}
              {currentUser.user_type === 'admin' && 'You have full admin access to change any project status.'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
