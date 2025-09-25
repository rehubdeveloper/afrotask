import React from 'react'
import { Shield, Users, Star } from 'lucide-react';
const Features = () => {

    const features = [
        {
            icon: Shield,
            title: 'Trust-First Verification',
            description: 'Every freelancer and client goes through our rigorous verification process'
        },
        {
            icon: Users,
            title: 'Quality Professionals',
            description: 'Work with verified experts who have proven their skills and credibility'
        },
        {
            icon: Star,
            title: 'Guaranteed Quality',
            description: 'Our verification system ensures high-quality work and reliable partnerships'
        }
    ]
    return (
        <div className="bg-gray-50">
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                            Why Choose AfroTask?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Our verification-first approach ensures you work with the best professionals
                            and most reliable clients in the industry.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300">
                                <div className={`${feature.title == "Quality Professionals" ? "bg-amber-600" : "bg-green-600"} flex items-center justify-center h-16 w-16 rounded-full text-white mx-auto mb-6`}>
                                    <feature.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 text-center">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Features
