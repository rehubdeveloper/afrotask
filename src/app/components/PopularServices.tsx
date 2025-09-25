'use client'

import { Briefcase, Clapperboard, FileText, Laptop, Megaphone, Palette } from 'lucide-react';
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';

const PopularServices = () => {
    const [isHovered, setIsHovered] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const services = [
        {
            title: 'Programming & Tech',
            description: 'Web development, mobile apps, and software solutions',
            color: 'from-green-500 to-emerald-700',
            icon: Laptop,
        },
        {
            title: 'Graphics & Design',
            description: 'Logo design, branding, and creative services',
            color: 'from-amber-500 to-amber-800',
            icon: Palette,
        },
        {
            title: 'Digital Marketing',
            description: 'SEO, social media, and online advertising',
            color: 'from-green-500 to-emerald-700',
            icon: Megaphone,
        },
        {
            title: 'Writing & Translation',
            description: 'Content writing, copywriting, and translation services',
            color: 'from-amber-500 to-amber-700',
            icon: FileText,
        },
        {
            title: 'Video & Animation',
            description: 'Video editing, animation, and motion graphics',
            color: 'from-green-500 to-emerald-700',
            icon: Clapperboard
        },
        {
            title: 'Business',
            description: 'Consulting, virtual assistance, and business services',
            color: 'from-amber-500 to-amber-700',
            icon: Briefcase,
        },
    ];

    // Create multiple copies for seamless infinite scroll
    const infiniteServices = [...services, ...services, ...services];

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        let animationId: number | null;

        const animate = () => {
            if (!isHovered) {
                container.scrollLeft += 0.5; // Speed
                if (container.scrollLeft >= container.scrollWidth / 2) {
                    container.scrollLeft = 0;
                }
            }
            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, [isHovered]);

    return (
        <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                    <h2 className="bg-clip-text text-transparent bg-gradient-to-r from-green-900 via-green-700 to-green-500 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold">
                        Popular <span className='bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-amber-700 to-amber-500 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold'>Services</span>
                    </h2>
                    <p className="mt-3 sm:mt-4 text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
                        Discover top-rated services from talented professionals worldwide
                    </p>
                </div>

                {/* Scrolling Container */}
                <div
                    className="relative"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Add padding to prevent left cutoff */}
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-4 sm:gap-5 lg:gap-6 w-full overflow-x-auto scrollbar-hide"
                        style={{ userSelect: 'none' }}
                    >
                        {infiniteServices.map((service, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 w-70 sm:w-75 lg:w-80 group relative"
                            >
                                <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 hover:scale-[1.01] sm:hover:scale-[1.02] overflow-hidden">
                                    {/* Gradient overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                                    {/* Animated border */}
                                    <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>

                                    <div className="relative p-4 sm:p-6 lg:p-8">
                                        <div className="flex items-center mb-4 sm:mb-6">
                                            <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${service.color} rounded-lg sm:rounded-xl flex items-center justify-center text-lg sm:text-xl lg:text-2xl shadow-lg transform group-hover:rotate-12 transition-transform duration-300`}>
                                                <service.icon className='text-white' />
                                            </div>
                                            <div className="ml-3 sm:ml-4">
                                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-200">
                                                    {service.title}
                                                </h3>
                                            </div>
                                        </div>

                                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 group-hover:text-gray-700 transition-colors duration-200">
                                            {service.description}
                                        </p>

                                        <Link href='/explore' className={`inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r ${service.color} text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group-hover:translate-x-1`}>
                                            <span className="hidden sm:inline">Explore Services</span>
                                            <span className="sm:hidden">Explore</span>
                                            <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </Link>
                                    </div>

                                    {/* Shine effect */}
                                    <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:animate-ping group-hover:left-full transition-all duration-1000"></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Responsive Fade edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 lg:w-32 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-10"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 lg:w-32 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-10"></div>
                </div>

                {/* Scroll indicator */}
                <div className="flex justify-center mt-6 sm:mt-8">
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
                        <div className="flex space-x-1">
                            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-300 rounded-full ${!isHovered ? 'animate-bounce' : ''}`}></div>
                            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-300 rounded-full ${!isHovered ? 'animate-bounce' : ''}`} style={{ animationDelay: '0.1s' }}></div>
                            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-300 rounded-full ${!isHovered ? 'animate-bounce' : ''}`} style={{ animationDelay: '0.2s' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .w-70 { width: 17.5rem; }
                .w-75 { width: 18.75rem; }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                    overflow-x: scroll;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
};

export default PopularServices;