'use client'
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { useUser } from '@/app/contexts/UserContext'
import LoadingSpinner from '@/app/components/LoadingSpinner'
import FreelanceProfileDialog from '@/app/components/freelance-profile-dialog'

const ProfilePage = () => {
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
                        <p className="text-gray-600">Manage your professional information</p>
                    </div>
                    <div className="mt-4 sm:mt-0 cursor-pointer">
                        <FreelanceProfileDialog user={user} refetchUser={refetchUser} />
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

                    {/* Professional Information */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center mb-4">
                            <div className="w-1 h-6 bg-yellow-500 rounded-full mr-3"></div>
                            <h2 className="text-xl font-semibold text-gray-900">Professional Information</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">GitHub Profile</p>
                                <p className="text-gray-900">{user.github_profile || 'Not provided'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Experience</p>
                                <p className="text-gray-900 leading-relaxed">{user.experience_description || 'Not provided'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Education</p>
                                <p className="text-gray-900">{user.education || 'Not provided'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center mb-4">
                            <div className="w-1 h-6 bg-green-500 rounded-full mr-3"></div>
                            <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {user.skills?.map((skill: string) => (
                                <Badge
                                    key={skill}
                                    className="bg-gray-100 text-gray-800 hover:bg-green-50 hover:text-green-700 border-0 px-3 py-1.5 font-medium transition-colors duration-200"
                                >
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Portfolio Links */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center mb-4">
                            <div className="w-1 h-6 bg-yellow-500 rounded-full mr-3"></div>
                            <h2 className="text-xl font-semibold text-gray-900">Portfolio Links</h2>
                        </div>
                        <div className="space-y-3">
                            {user.portfolio_links?.map((link: string) => (
                                <div key={link} className="flex items-center">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-3 flex-shrink-0"></div>
                                    <a
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-600 hover:text-green-700 hover:underline transition-colors duration-200 break-all"
                                    >
                                        {link}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;