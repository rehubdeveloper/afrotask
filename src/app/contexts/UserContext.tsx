'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    user_type: 'freelancer' | 'client' | 'admin';
    is_verified?: boolean;
    is_pending_review?: boolean;
    review_status?: 'pending' | 'approved' | 'declined';
    admin_notes?: string | null;
    [key: string]: any;
}

interface UserContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    refetchUser: () => Promise<void>;
    signIn: (userData: any) => void;
    signOut: () => void;
    signupPayload: Partial<any> | null;
    updateSignupPayload: (payload: Partial<any> | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUser = () => {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [signupPayload, setSignupPayload] = useState<Partial<any> | null>(null)

    const refetchUser = async () => {
        const token = localStorage.getItem('trustwork_token');
        if (token) {
            try {
                // Fetch both profile and user status
                const [profileRes, statusRes] = await Promise.all([
                    fetch('/api/profile', {
                        headers: {
                            'Authorization': `Token ${token}`,
                        },
                    }),
                    fetch('/api/user-status', {
                        headers: {
                            'Authorization': `Token ${token}`,
                        },
                    })
                ]);

                if (profileRes.ok && statusRes.ok) {
                    const profileData = await profileRes.json();
                    const statusData = await statusRes.json();
                    
                    // Determine review status for freelancers
                    let review_status = 'approved';
                    if (statusData.user_type === 'freelancer') {
                        if (statusData.is_verified) {
                            review_status = 'approved';
                        } else if (statusData.is_pending_review) {
                            review_status = 'pending';
                        } else {
                            review_status = 'declined';
                        }
                    }
                    
                    // Merge profile and status data
                    const userData = { 
                        ...profileData.user, 
                        ...profileData.profile,
                        is_verified: statusData.is_verified,
                        is_pending_review: statusData.is_pending_review,
                        review_status: review_status,
                        admin_notes: null // Backend doesn't provide this yet
                    };
                    
                    setUser(userData);
                    setIsAuthenticated(true);
                    localStorage.setItem('trustwork_user', JSON.stringify(userData));
                } else {
                    await signOut();
                }
            } catch (error) {
                console.error('Failed to fetch user profile', error);
                await signOut();
            } finally {
                setIsLoading(false);
            }
        } else {
            // No token, but try to load user data from localStorage as fallback
            const savedUser = localStorage.getItem('trustwork_user');
            if (savedUser) {
                try {
                    const userData = JSON.parse(savedUser);
                    setUser(userData);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Failed to parse saved user data:', error);
                    localStorage.removeItem('trustwork_user');
                }
            }
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refetchUser();
        const savedPayload = localStorage.getItem('trustwork_signup_payload');
        if (savedPayload) {
            setSignupPayload(JSON.parse(savedPayload));
        }
    }, [])

    const signIn = async (data: any) => {
        // Store token first
        localStorage.setItem('trustwork_token', data.token);
        localStorage.removeItem('trustwork_signup_payload');
        setSignupPayload(null);
        
        // Immediately fetch current user status to ensure we have the latest data
        await refetchUser();
    };

    const signOut = async () => {
        const token = localStorage.getItem('trustwork_token');
        if (token) {
            try {
                await fetch('/api/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });
            } catch (error) {
                console.error('Failed to logout from backend', error);
            }
        }
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('trustwork_user');
        localStorage.removeItem('trustwork_token');
    };

    const updateSignupPayload = (payload: Partial<any> | null) => {
        if (payload) {
            const newPayload = { ...signupPayload, ...payload };
            setSignupPayload(newPayload);
            localStorage.setItem('trustwork_signup_payload', JSON.stringify(newPayload));
        } else {
            setSignupPayload(null);
            localStorage.removeItem('trustwork_signup_payload');
        }
    };

    const value = {
        user,
        isAuthenticated,
        isLoading,
        refetchUser,
        signIn,
        signOut,
        signupPayload,
        updateSignupPayload
    }

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}
