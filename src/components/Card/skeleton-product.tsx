// components/Card/skeleton-product.tsx
import React from 'react';

interface SkeletonCardProps {
    isCompact?: boolean;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ isCompact }) => {
    return (
        <div className={`bg-gray-700 border border-gray-600 shadow-md rounded-lg overflow-hidden animate-pulse ${isCompact ? 'p-2 max-w-xs' : 'p-4 max-w-sm'}`}>
            <div className={`w-full ${isCompact ? 'h-32' : 'h-48'} bg-gray-600 rounded-lg`} />
            <div className='py-2'>
                <div className={`h-4 bg-gray-600 rounded w-3/4 mb-2 ${isCompact ? 'h-3' : 'h-4'}`} />
                <div className={`h-4 bg-gray-600 rounded mb-2 ${isCompact ? 'h-2' : 'h-3'}`} />
                <div className='flex items-center justify-between mt-4'>
                    <div className={`h-4 bg-gray-600 rounded w-1/3 ${isCompact ? 'h-3' : 'h-4'}`} />
                    <div className={`h-4 bg-gray-600 rounded w-1/4 ${isCompact ? 'h-3' : 'h-4'}`} />
                </div>
                <div className={`h-8 bg-gray-600 rounded mt-2 ${isCompact ? 'h-2' : 'h-3'}`} />
            </div>
        </div>
    );
};

export default SkeletonCard;
