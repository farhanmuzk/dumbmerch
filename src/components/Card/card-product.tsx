import React, { useState } from 'react';
import { GlobalIcons } from '../common/Icon/GlobalIcons';
import { useDispatch } from 'react-redux';
import { addToCartAsync } from '../../redux/features/cart/cart-slice';
import { AppDispatch } from '../../redux/store';

interface CardProps {
    title: string;
    price: number;
    imageUrl: string;
    description?: string;
    productId: number; // Ensure this is defined as required
    isCompact?: boolean;
    isActive?: boolean;
    onAddToCart: () => void;
    quantity: number;
    setQuantity: (qty: number) => void;
}

const Card: React.FC<CardProps> = ({
    title,
    price,
    imageUrl,
    description,
    productId,
    isCompact,
    isActive,
    quantity,
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    const handleAddToCart = () => {
        if (productId === undefined) {
            return;
        }
        dispatch(addToCartAsync({ productId, quantity }));
    };

    return (
        <div
            className={`bg-transparent border border-gray-600 shadow-md rounded-lg overflow-hidden transition-transform duration-300 ${isCompact ? 'p-2 max-w-xs hover:scale-105' : 'p-4 max-w-sm'} ${isActive ? 'border-red-700' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className='relative flex items-center justify-center'>
                <img
                    src={imageUrl}
                    alt={title}
                    className={`w-full ${isCompact ? 'h-32' : 'h-48'} object-cover object-center rounded-lg`}
                />
                <div className={`${isHovered ? 'block' : 'hidden'} absolute bottom-0 left-0 w-full h-full bg-black bg-opacity-25`} />
                <div className={`${isHovered ? 'block' : 'hidden'} absolute bottom-0 left-0 w-full flex justify-between items-center p-2 gap-2`}>
                    <button
                        onClick={handleAddToCart}
                        className={`${isCompact ? 'block' : 'hidden'} bg-secondary p-2 w-full text-white rounded transition-all duration-300 rounded-lg text-sm`}
                    >
                        Add to Cart +
                    </button>
                    <button
                        className={`${isCompact ? 'block' : 'hidden'} bg-transparent border-2 border-white p-1 w-fit text-white rounded transition-all duration-300 rounded-lg`}
                    >
                        <GlobalIcons.Save className='' />
                    </button>
                </div>
            </div>
            <div className='py-2'>
                <h3 className='text-lg font-semibold text-white'>{title}</h3>
                <p className={`text-gray-500 mt-2 ${isCompact ? 'text-xs' : ''}`}>{description || 'No description available.'}</p>
                <div className='flex items-center justify-between mt-4'>
                    <span className={`text-white font-bold ${isCompact ? 'text-sm' : 'text-xl'}`}>
                        {price.toLocaleString()}
                    </span>
                    {!isCompact && (
                        <button
                            onClick={handleAddToCart}
                            className="bg-secondary p-2 px-4 text-white rounded hover:bg-red-700 transition duration-300 rounded-lg text-sm"
                        >
                            Add to Cart
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Card;
