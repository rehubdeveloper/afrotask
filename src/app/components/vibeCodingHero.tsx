import React from 'react';

const VibeCodingHero = () => {
    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20 min-h-[400px] sm:min-h-[500px]">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-purple-600/20"></div>

            <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-12 h-full">
                {/* Left content */}
                <div className="flex-1 space-y-4 lg:space-y-6 max-w-xl">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal text-white leading-tight tracking-tight font-sans">
                        Stuck at vibe coding?
                    </h1>

                    <p className="text-base sm:text-lg md:text-xl text-white/95 leading-relaxed font-sans font-light">
                        Get matched with the right expert to turn your prototype into a real,
                        working product.
                    </p>

                    <button className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-gray-900 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base font-sans">
                        Find an expert
                    </button>
                </div>

                {/* Right desktop mockup */}
                <div className="flex-shrink-0 w-full lg:w-auto flex justify-center lg:justify-end">
                    <div className="relative scale-75 sm:scale-90 lg:scale-100">
                        {/* Desktop container */}
                        <div className="w-80 sm:w-96 bg-gradient-to-br from-yellow-500/40 to-yellow-600/60 backdrop-blur-sm rounded-2xl p-4 border border-white/10 shadow-2xl">

                            {/* Window chrome */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                                    <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                                    <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                                </div>
                            </div>

                            {/* Main content area */}
                            <div className="bg-gradient-to-br from-purple-200 via-blue-200 to-amber-200 rounded-xl p-4 mb-4 relative overflow-hidden min-h-[120px] sm:min-h-[140px]">
                                {/* Top navigation bars */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex gap-2">
                                        <div className="h-2 bg-white/60 rounded-full flex-1"></div>
                                        <div className="h-2 bg-white/40 rounded-full w-12"></div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="h-1.5 bg-white/40 rounded-full w-8"></div>
                                        <div className="h-1.5 bg-white/40 rounded-full w-8"></div>
                                        <div className="h-1.5 bg-white/40 rounded-full w-8"></div>
                                    </div>
                                </div>

                                {/* Poppy flower illustration area */}
                                <div className="absolute right-2 top-4 w-16 h-12 sm:w-20 sm:h-16">
                                    <div className="relative">
                                        {/* Flower stem */}
                                        <div className="absolute bottom-0 left-1/2 w-0.5 h-8 bg-green-600 transform -translate-x-1/2"></div>
                                        {/* Flower head */}
                                        <div className="absolute top-0 right-2 w-8 h-6 sm:w-10 sm:h-8 bg-red-500 rounded-full"></div>
                                        <div className="absolute top-0.5 right-2.5 w-6 h-4 sm:w-8 sm:h-6 bg-red-600 rounded-full"></div>
                                        {/* Black center */}
                                        <div className="absolute top-2 right-4 w-2 h-2 bg-black rounded-full"></div>
                                    </div>
                                </div>

                                {/* Profile avatar - top right */}
                                <div className="absolute top-2 right-20 sm:right-24 w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-white/50">
                                    <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500"></div>
                                </div>

                                {/* Cursor */}
                                <div className="absolute top-6 right-16 w-4 h-6 transform rotate-12">
                                    <div className="w-0 h-0 border-l-[8px] border-l-transparent border-b-[12px] border-b-white border-r-[8px] border-r-transparent"></div>
                                </div>
                            </div>

                            {/* Bottom dock */}
                            <div className="flex items-center gap-2 px-2">
                                {/* Left profile */}
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-white/30">
                                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-500"></div>
                                </div>

                                {/* App icons */}
                                <div className="flex gap-1 sm:gap-2 flex-1">
                                    <div className="w-8 h-6 sm:w-10 sm:h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg"></div>
                                    <div className="w-8 h-6 sm:w-10 sm:h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-lg"></div>
                                    <div className="w-8 h-6 sm:w-10 sm:h-8 bg-gradient-to-br from-orange-300 to-amber-400 rounded-lg"></div>
                                </div>

                                {/* Add button */}
                                <div className="w-8 h-6 sm:w-10 sm:h-8 border-2 border-white/40 rounded-lg flex items-center justify-center">
                                    <div className="w-4 h-0.5 bg-white/60"></div>
                                    <div className="w-0.5 h-4 bg-white/60 absolute"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative floating elements */}
            <div className="absolute top-16 right-16 w-2 h-2 bg-white/20 rounded-full animate-pulse delay-300 hidden sm:block"></div>
            <div className="absolute bottom-24 left-12 w-1.5 h-1.5 bg-white/15 rounded-full animate-pulse delay-700 hidden sm:block"></div>
        </div>
    );
};

export default VibeCodingHero;