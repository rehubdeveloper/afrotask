'use client'
import React from 'react'
import { useUser } from '@/app/contexts/UserContext'
import LoadingSpinner from '@/app/components/LoadingSpinner'
import ClientProfileDialog from '@/app/components/client-profile-dialog'

const ClientProfilePage = () => {
    const { user, isLoading, refetchUser } = useUser();

    if (isLoading || !user) {
        return (
            <div className="flex items-center justify-center h-screen bg-white">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto p-6 max-w-4xl">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b border-gray-100">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
                        <p className="text-gray-600">Manage your company information</p>
                    </div>
                    <div className="mt-4 sm:mt-0 cursor-pointer">
                        <ClientProfileDialog user={user} refetchUser={refetchUser} />
                    </div>
                </div>

                {/* Profile Content */}
                <div className="space-y-8">
                    {/* Personal Information */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center mb-4">
                            <div className="w-1 h-6 bg-green-500 rounded-full mr-3"></div>
                            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">First Name</p>
                                <p className="text-gray-900 font-medium">{user.user?.first_name}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Last Name</p>
                                <p className="text-gray-900 font-medium">{user.user?.last_name}</p>
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Email</p>
                                <p className="text-gray-900 font-medium">{user.user?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Company Information */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center mb-4">
                            <div className="w-1 h-6 bg-yellow-500 rounded-full mr-3"></div>
                            <h2 className="text-xl font-semibold text-gray-900">Company Information</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Company Name</p>
                                <p className="text-gray-900 font-medium">{user.company_name || 'Not provided'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Location</p>
                                <p className="text-gray-900 font-medium">{user.location || 'Not provided'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClientProfilePage;