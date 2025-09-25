'use client'
import { useState, useEffect } from 'react'
import { useUser } from '../contexts/UserContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, MessageCircle, Clock, User } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

interface ChatRoom {
  id: number;
  name: string;
  chat_type: string;
  participants: Array<{
    id: number;
    first_name: string;
    last_name: string;
    user_type: string;
  }>;
  last_message?: {
    id: number;
    content: string;
    sender: {
      id: number;
      first_name: string;
      last_name: string;
    };
    created_at: string;
  };
  created_at: string;
  updated_at: string;
}

export default function MessagesPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/signin')
      return
    }

    if (user) {
      fetchChatRooms()
    }
  }, [user, isLoading, router])

  const fetchChatRooms = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('trustwork_token')
      if (!token) {
        toast.error('Please sign in to view messages')
        return
      }

      const response = await fetch('/api/chat-rooms', {
        headers: {
          'Authorization': `Token ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Chat rooms data:', data)
        setChatRooms(data.results || data || [])
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to fetch messages')
      }
    } catch (error) {
      console.error('Failed to fetch chat rooms:', error)
      toast.error('An error occurred while fetching messages')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const getOtherParticipant = (chatRoom: ChatRoom) => {
    if (!user) return null
    return chatRoom.participants.find(p => p.id !== user.id)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            Please sign in to view your messages.
          </p>
          <Button onClick={() => router.push('/signin')}>
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
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
              <h1 className="text-3xl font-bold text-gray-900">My Messages</h1>
              <p className="text-gray-600">View and manage your conversations</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : chatRooms.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
              <p className="text-gray-500 mb-4">
                Start a conversation by browsing freelancers or creating a project.
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => router.push('/freelancers')}>
                  Browse Freelancers
                </Button>
                <Button variant="outline" onClick={() => router.push('/projects')}>
                  Browse Projects
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {chatRooms.map((chatRoom) => {
              const otherParticipant = getOtherParticipant(chatRoom)
              return (
                <Card 
                  key={chatRoom.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/chat/${chatRoom.id}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {otherParticipant ? 
                              `${otherParticipant.first_name} ${otherParticipant.last_name}` : 
                              'Unknown User'
                            }
                          </h3>
                          <p className="text-sm text-gray-500">
                            {otherParticipant?.user_type === 'freelancer' ? 'Freelancer' : 'Client'}
                          </p>
                          {chatRoom.last_message && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                              {chatRoom.last_message.sender.id === user.id ? 'You: ' : ''}
                              {chatRoom.last_message.content}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        {chatRoom.last_message && (
                          <p className="text-sm text-gray-500">
                            {formatTime(chatRoom.last_message.created_at)}
                          </p>
                        )}
                        <Badge variant="outline" className="mt-1">
                          {chatRoom.chat_type === 'direct' ? 'Direct' : 'Project'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
