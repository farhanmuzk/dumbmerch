import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { GlobalIcons } from '../../components/common/Icon/GlobalIcons';
import { dummyProducts } from '../../components/Card/dummy';
import Card from '../../components/Card/card-product';
import SkeletonCard from '../../components/Card/skeleton-product';

function Home() {
    // State to track grid mode and loading
    const [isCompactGrid, setIsCompactGrid] = useState(false);
    const [activeCardId, setActiveCardId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    // Function to handle adding products to the cart
    const handleAddToCart = (productId: number, productTitle: string) => {
        setActiveCardId(productId);
        alert(`${productTitle} has been added to your cart.`);
    };

    // Function to truncate product descriptions
    const truncateDescription = (description: string, maxLength: number) => {
        return description.length > maxLength ? description.slice(0, maxLength) + '...' : description;
    };

    // Effect to simulate data fetching with loading state
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false); // Set loading to false after 2 seconds
        }, 2000);

        return () => clearTimeout(timer); // Cleanup timer on unmount
    }, []);

    // Effect to check grid mode on component mount
    useEffect(() => {
        const storedGridMode = localStorage.getItem('isCompactGrid'); // Retrieve saved grid mode from localStorage
        if (storedGridMode) {
            setIsCompactGrid(JSON.parse(storedGridMode)); // Set the initial grid mode based on saved state
        }
    }, []);

    // Effect to save grid mode to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('isCompactGrid', JSON.stringify(isCompactGrid)); // Save grid mode to localStorage
    }, [isCompactGrid]);

    return (
        <div className='bg-black min-h-screen'>
            <Navbar />
            <div className='mx-4 py-4 md:mx-10'>
                <div className='flex flex-col md:flex-row text-white justify-between items-start md:items-center mb-6'>
                    <div>
                        <h1 className='text-2xl md:text-3xl font-bold'>All Product</h1>
                        <p className='text-sm'>Explore our products Dumb Merch</p>
                    </div>
                    <div className='flex flex-row gap-2 mt-4 md:mt-0'>
                        <GlobalIcons.Grid2X2
                            className={`tooltip w-10 h-10 md:w-12 md:h-12 ${isCompactGrid ? 'text-white' : 'text-red-500'} p-2 md:p-3 border-2 rounded-lg hover:text-red-600 cursor-pointer`}
                            onClick={() => setIsCompactGrid(false)} // Set grid mode to 2x2
                        />
                        <GlobalIcons.Grid4X4
                            className={`tooltip w-10 h-10 md:w-12 md:h-12 ${isCompactGrid ? 'text-red-500' : 'text-white'} p-2 md:p-3 border-2 rounded-lg hover:text-red-600 cursor-pointer`}
                            onClick={() => setIsCompactGrid(true)} // Set grid mode to 4x4
                        />
                    </div>
                </div>
                <div className={`grid gap-6 ${isCompactGrid ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'}`}>
                    {loading
                        ? Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} isCompact={isCompactGrid} />) // Display skeleton cards
                        : dummyProducts.map((product) => (
                            <Card
                                key={product.id}
                                title={truncateDescription(product.title, 30)}
                                price={product.price}
                                imageUrl={product.imageUrl}
                                description={truncateDescription(product.description, 30)}
                                onAddToCart={() => handleAddToCart(product.id, product.title)}
                                isCompact={isCompactGrid}
                                isActive={activeCardId === product.id}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
}

export default Home;
