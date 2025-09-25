'use client'
import { useState, useEffect } from 'react'
import { Bell, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useUser } from '../contexts/UserContext'
import toast from 'react-hot-toast'

interface Notification {
    id: number;
    notification_type: string;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
    updated_at: string;
}

interface NotificationResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Notification[];
}

const NotificationCenter = () => {
    const { user, isAuthenticated } = useUser()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const fetchNotifications = async () => {
        if (!isAuthenticated) return

        try {
            const token = localStorage.getItem('trustwork_token')
            if (!token) return

            const response = await fetch('/api/notifications/', {
                headers: {
                    'Authorization': `Token ${token}`
                }
            })

            if (response.ok) {
                const data: NotificationResponse = await response.json()
                setNotifications(data.results)
                setUnreadCount(data.results.filter(n => !n.is_read).length)
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error)
        }
    }

    const markAsRead = async (notificationId: number) => {
        try {
            const token = localStorage.getItem('trustwork_token')
            if (!token) return

            const response = await fetch(`/api/notifications/${notificationId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ is_read: true })
            })

            if (response.ok) {
                // Update local state
                setNotifications(prev => 
                    prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
                )
                setUnreadCount(prev => Math.max(0, prev - 1))
            }
        } catch (error) {
            console.error('Failed to mark notification as read:', error)
        }
    }

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('trustwork_token')
            if (!token) return

            const response = await fetch('/api/notifications/mark-all-read', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`
                }
            })

            if (response.ok) {
                // Update local state
                setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
                setUnreadCount(0)
                toast.success('All notifications marked as read')
            }
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error)
            toast.error('Failed to mark all notifications as read')
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            fetchNotifications()
            // Poll for new notifications every 30 seconds
            const interval = setInterval(fetchNotifications, 30000)
            return () => clearInterval(interval)
        }
    }, [isAuthenticated])

    if (!isAuthenticated) return null

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2"
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                )}
            </Button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsOpen(false)}
                    />
                    
                    {/* Notification Panel */}
                    <Card className="absolute right-0 top-12 w-80 max-h-96 overflow-hidden z-50">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Notifications</CardTitle>
                                <div className="flex items-center gap-2">
                                    {unreadCount > 0 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={markAllAsRead}
                                            className="text-xs"
                                        >
                                            <Check className="h-3 w-3 mr-1" />
                                            Mark all read
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            {unreadCount > 0 && (
                                <CardDescription>
                                    {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                                </CardDescription>
                            )}
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="max-h-64 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500">
                                        No notifications yet
                                    </div>
                                ) : (
                                    notifications.map(notification => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                                                !notification.is_read ? 'bg-blue-50' : ''
                                            }`}
                                            onClick={() => markAsRead(notification.id)}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className={`font-medium text-sm ${
                                                        !notification.is_read ? 'text-blue-900' : 'text-gray-900'
                                                    }`}>
                                                        {notification.title}
                                                    </h4>
                                                    <p className={`text-xs mt-1 ${
                                                        !notification.is_read ? 'text-blue-700' : 'text-gray-600'
                                                    }`}>
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-2">
                                                        {new Date(notification.created_at).toLocaleString()}
                                                    </p>
                                                </div>
                                                {!notification.is_read && (
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1" />
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    )
}

export default NotificationCenter
