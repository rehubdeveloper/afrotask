'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Briefcase, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useUser } from '../contexts/UserContext'

const ChooseRole = () => {
    const [selectedRole, setSelectedRole] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { signupPayload, updateSignupPayload } = useUser()
    const router = useRouter()

    const roles = [
        {
            id: 'freelancer',
            title: 'I want to offer services',
            subtitle: 'Freelancer',
            description: 'Showcase your skills and find clients who need your expertise',
            icon: Users,
            features: [
                'Create service offerings',
                'Build your portfolio',
                'Set your own rates',
                'Work with verified clients'
            ]
        },
        {
            id: 'client',
            title: 'I want to hire talent',
            subtitle: 'Client',
            description: 'Find and hire verified professionals for your projects',
            icon: Briefcase,
            features: [
                'Post job requirements',
                'Browse verified freelancers',
                'Manage projects',
                'Secure payments'
            ]
        }
    ]

    const handleRoleSelect = (roleId: string) => {
        setSelectedRole(roleId)
    }

    const handleContinue = async () => {
        if (!selectedRole) return

        setIsLoading(true)
        try {
            updateSignupPayload({ role: selectedRole })
            router.push('/verification')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.back()}
                        className="flex items-center space-x-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                    </Button>
                </div>
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-green-600 mb-4">
                        Welcome to Afro<span className='font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700'>Task, {signupPayload?.first_name}!</span>
                    </h1>
                    <p className="text-xl text-gray-600">
                        How would you like to use AfroTask?
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {roles.map((role) => (
                        <Card
                            key={role.id}
                            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${selectedRole === role.id
                                ? 'ring-2 ring-green-500 border-green-500'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                            onClick={() => handleRoleSelect(role.id)}
                        >
                            <CardHeader className="text-center">
                                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${selectedRole === role.id ? 'bg-green-100' : 'bg-gray-100'
                                    }`}>
                                    <role.icon className={`w-8 h-8 ${selectedRole === role.id ? 'text-green-500' : 'text-gray-500'
                                        }`} />
                                </div>
                                <CardTitle className="text-xl">{role.title}</CardTitle>
                                <CardDescription className="text-lg font-medium text-green-600">
                                    {role.subtitle}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-6 text-center">
                                    {role.description}
                                </p>
                                <ul className="space-y-2">
                                    {role.features.map((feature, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="text-center">
                    <Button
                        onClick={handleContinue}
                        disabled={!selectedRole || isLoading}
                        className="cursor-pointer bg-green-500 hover:bg-green-600 px-8 py-3 text-lg"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Processing...
                            </>
                        ) : (
                            <>
                                Continue to Verification
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </>
                        )}
                    </Button>

                    {selectedRole && (
                        <p className="mt-4 text-sm text-gray-600">
                            You selected: <span className="font-medium text-green-600">
                                {roles.find(r => r.id === selectedRole)?.subtitle}
                            </span>
                        </p>
                    )}
                </div>

                <div className="mt-12 bg-blue-50 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-900 mb-2">Why verification matters</h3>
                    <p className="text-blue-700 text-sm">
                        Our verification process ensures trust and quality in every interaction.
                        All users go through identity verification to create a safe, professional marketplace.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ChooseRole
