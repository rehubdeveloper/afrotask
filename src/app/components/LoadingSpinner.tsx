import React from 'react';
import { Shield } from 'lucide-react';

const LoadingSpinner = () => {
    return (
        <div className="flex items-center justify-center">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-green-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-amber-200 rounded-full animate-spin-reverse" style={{ borderTopColor: 'transparent', borderLeftColor: 'transparent' }}></div>
                <div className="absolute inset-0 border-4 border-green-500 rounded-full animate-spin" style={{ borderBottomColor: 'transparent', borderRightColor: 'transparent' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-green-600" />
                </div>
            </div>
        </div>
    );
};

export default LoadingSpinner;
