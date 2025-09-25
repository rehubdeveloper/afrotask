'use client';
import React, { useState, useEffect } from 'react';

interface Project {
    id: number;
    title: string;
    description: string;
    image: string;
}

interface PortfolioProps {
    projects?: Project[];
    title?: string;
    subtitle?: string;
}

const Portfolio: React.FC<PortfolioProps> = ({
    projects = defaultProjects,
    title = "Made By Our Talented Freelancers",
    subtitle = "Creative solutions that make an impact"
}) => {
    const [visibleOverlays, setVisibleOverlays] = useState<Set<number>>(new Set());

    useEffect(() => {
        let timeouts: NodeJS.Timeout[] = [];

        const showRandomOverlay = () => {
            const availableProjects = projects.filter(project => !visibleOverlays.has(project.id));
            if (availableProjects.length > 0) {
                const randomProject = availableProjects[Math.floor(Math.random() * availableProjects.length)];
                setVisibleOverlays(prev => new Set([...prev, randomProject.id]));
            }
        };

        const hideRandomOverlay = () => {
            const visibleArray = Array.from(visibleOverlays);
            if (visibleArray.length > 0) {
                const randomId = visibleArray[Math.floor(Math.random() * visibleArray.length)];
                setVisibleOverlays(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(randomId);
                    return newSet;
                });
            }
        };

        // Initial random showing of overlays
        projects.forEach((_, index) => {
            const randomDelay = Math.random() * 3000 + 1000; // Random delay between 1-4 seconds
            timeouts.push(setTimeout(() => {
                if (Math.random() > 0.5) { // 50% chance for each card to show initially
                    showRandomOverlay();
                }
            }, randomDelay));
        });

        // Continue showing/hiding overlays at random intervals
        const interval = setInterval(() => {
            if (Math.random() > 0.4) { // 60% chance to show an overlay
                showRandomOverlay();
            } else { // 40% chance to hide an overlay
                hideRandomOverlay();
            }
        }, Math.random() * 2500 + 1500); // Random interval between 1.5-4 seconds

        return () => {
            timeouts.forEach(timeout => clearTimeout(timeout));
            clearInterval(interval);
        };
    }, [projects, visibleOverlays]);

    return (
        <section className="py-20 px-4 bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-20">
                    <h2 className="text-xl md:text-6xl font-bold text-gray-900 mb-6">
                        {title}
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        {subtitle}
                    </p>
                </div>

                {/* Masonry-style Grid */}
                <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                    {projects.map((project, index) => (
                        <div
                            key={project.id}
                            className={`break-inside-avoid group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:scale-[1.02] ${index % 3 === 0 ? 'hover:rotate-1' :
                                index % 3 === 1 ? 'hover:-rotate-1' :
                                    'hover:rotate-0'
                                }`}
                            style={{
                                animationDelay: `${index * 0.15}s`,
                                animation: 'fadeInUp 0.8s ease-out forwards',
                                opacity: 0
                            }}
                        >
                            {/* Dynamic Height Image Container */}
                            <div className={`relative overflow-hidden ${index % 4 === 0 ? 'h-80' :
                                index % 4 === 1 ? 'h-64' :
                                    index % 4 === 2 ? 'h-96' : 'h-72'
                                }`}>
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />

                                {/* Gradient Overlay - Now Automatically Animated */}
                                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-all duration-700 ${visibleOverlays.has(project.id) ? 'opacity-100' : 'opacity-0'
                                    }`}>
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <h3 className={`text-white font-bold text-xl mb-2 transition-all duration-500 ${visibleOverlays.has(project.id) ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                                            }`}>
                                            {project.title}
                                        </h3>
                                        <p className={`text-gray-200 text-sm leading-relaxed transition-all duration-500 delay-75 ${visibleOverlays.has(project.id) ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                                            }`}>
                                            {project.description}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Card Content - Always Visible */}
                            <div className="p-6">
                                <h3 className={`text-lg font-bold mb-2 transition-colors duration-500 ${visibleOverlays.has(project.id) ? 'text-blue-600' : 'text-gray-900'
                                    }`}>
                                    {project.title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {project.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </section>
    );
};

// Default sample projects
const defaultProjects: Project[] = [
    {
        id: 1,
        title: "Brand Identity Design",
        description: "Complete visual identity system with modern typography and cohesive color palette for emerging brand.",
        image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&h=600&fit=crop"
    },
    {
        id: 2,
        title: "E-commerce Platform",
        description: "Clean, conversion-focused online store design with intuitive navigation and seamless user experience.",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=400&fit=crop"
    },
    {
        id: 3,
        title: "Mobile App Design",
        description: "User-centered mobile interface design focusing on accessibility and modern interaction patterns.",
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&h=700&fit=crop"
    },
    {
        id: 4,
        title: "Marketing Campaign",
        description: "Multi-channel visual campaign with striking imagery and consistent messaging across all touchpoints.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=500&fit=crop"
    },
    {
        id: 5,
        title: "Corporate Website",
        description: "Professional web presence with clean architecture, optimized performance, and engaging storytelling.",
        image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=500&h=450&fit=crop"
    },
    {
        id: 6,
        title: "Product Photography",
        description: "High-impact visual content showcasing products with artistic composition and professional lighting.",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=600&fit=crop"
    },
    {
        id: 7,
        title: "Editorial Design",
        description: "Magazine layout design with dynamic typography and compelling visual hierarchy for enhanced readability.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=400&fit=crop"
    },
    {
        id: 8,
        title: "Packaging Design",
        description: "Sustainable packaging solution combining eco-friendly materials with eye-catching visual design.",
        image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&h=650&fit=crop"
    }
];

export default Portfolio;