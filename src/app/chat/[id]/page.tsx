'use client'
import { useState, useEffect, use } from 'react'
import { useUser } from '../../contexts/UserContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Send, Plus, MessageCircle } from 'lucide-react'
import LoadingSpinner from '../../components/LoadingSpinner'
import toast from 'react-hot-toast'

interface ChatRoom {
  id: number;
  project?: {
    id: number;
    title: string;
  };
  chat_type: string;
  title: string;
  is_active: boolean;
  participants: Array<{
    id: number;
    user: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
    };
    joined_at: string;
    is_active: boolean;
  }>;
  messages: Array<{
    id: number;
    sender: {
      id: number;
      first_name: string;
      last_name: string;
    };
    message_type: string;
    content: string;
    created_at: string;
  }>;
  created_at: string;
  updated_at: string;
}

export default function ChatRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const resolvedParams = use(params)
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null)
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/signin')
      return
    }

    if (user) {
      fetchChatRoom()
    }
  }, [user, isLoading, router, resolvedParams.id])

  const fetchChatRoom = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('trustwork_token')
      if (!token) {
        toast.error('Please sign in to view chat')
        return
      }

      const response = await fetch(`/api/chat-rooms/${resolvedParams.id}`, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setChatRoom(data)
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to fetch chat room')
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Failed to fetch chat room:', error)
      toast.error('An error occurred while fetching the chat room')
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    try {
      setSending(true)
      const token = localStorage.getItem('trustwork_token')
      if (!token) {
        toast.error('Please sign in to send messages')
        return
      }

      const response = await fetch(`/api/chat-rooms/${resolvedParams.id}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message_type: 'text',
          content: newMessage.trim()
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setNewMessage('')
        // Refresh chat room to get new message
        fetchChatRoom()
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to send message')
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      toast.error('An error occurred while sending the message')
    } finally {
      setSending(false)
    }
  }

  const createPrivateProject = () => {
    if (!chatRoom) return
    
    // Find the other participant (not the current user)
    const otherParticipant = chatRoom.participants.find(p => p.user.id !== user?.id)
    if (!otherParticipant) return

    // Navigate to project creation with pre-filled data
    const queryParams = new URLSearchParams({
      type: 'private',
      freelancer_id: otherParticipant.user.id.toString(),
      chat_room_id: chatRoom.id.toString()
    })
    
    router.push(`/projects/create?${queryParams.toString()}`)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (isLoading || loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return null
  }

  if (!chatRoom) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Chat Room Not Found</h1>
          <p className="text-gray-600 mb-4">
            The chat room you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
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
              <h1 className="text-xl font-semibold text-gray-900">{chatRoom.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={chatRoom.is_active ? "default" : "secondary"}>
                  {chatRoom.chat_type === 'direct_message' ? 'Direct Message' : 'Project Chat'}
                </Badge>
                {chatRoom.project && (
                  <Badge variant="outline">
                    Project: {chatRoom.project.title}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {chatRoom.chat_type === 'direct_message' && user.user_type === 'client' && (
            <Button
              onClick={createPrivateProject}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Private Project
            </Button>
          )}
        </div>
      </div>

      {/* Chat Content */}
      <div className="max-w-4xl mx-auto p-6">
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Messages
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatRoom.messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                chatRoom.messages.map((message) => {
                  const isCurrentUser = message.sender.id === user.id
                  
                  return (
                  <div
                    key={message.id}
                    className={`flex ${isCurrentUser ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender.id === user.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">
                          {message.sender.first_name} {message.sender.last_name}
                        </span>
                        <span className={`text-xs ${
                          message.sender.id === user.id ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.created_at)}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                  )
                })
              )}
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4">
              <form onSubmit={sendMessage} className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                  disabled={sending}
                />
                <Button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="flex items-center gap-2"
                >
                  {sending ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send
                    </>
                  )}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        {/* Participants Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {chatRoom.participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    {participant.user.first_name[0]}{participant.user.last_name[0]}
                  </div>
                  <div>
                    <p className="font-medium">
                      {participant.user.first_name} {participant.user.last_name}
                    </p>
                    <p className="text-sm text-gray-500">{participant.user.email}</p>
                    <Badge variant={participant.is_active ? "default" : "secondary"} className="text-xs">
                      {participant.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
