import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Import useDispatch and useSelector from react-redux
import Navbar from '../../components/Navbar/Navbar';
import { GlobalIcons } from '../../components/common/Icon/GlobalIcons';
import Card from '../../components/Card/card-product';
import SkeletonCard from '../../components/Card/skeleton-product';
import { fetchProducts } from '../../redux/features/product/product-slice'; // Import the fetchProducts thunk
import { AppDispatch } from '../../redux/store';

// Define Product type
interface Product {
    productId: number;
    productName: string;
    productPrice: number;
    productMedia: { mediaUrl: string }[]; // Adjust the type based on your media structure
    productDescription: string;
}

// Define the RootState type for your Redux store
interface RootState {
    products: {
        products: Product[];
        loading: boolean;
    };
}

function Whishlist() {
    const dispatch: AppDispatch = useDispatch();
    // Specify the RootState type for useSelector
    const { products, loading } = useSelector((state: RootState) => state.products); // Access products and loading from the Redux store

    // State to track grid mode and active card
    const [isCompactGrid, setIsCompactGrid] = useState(false);
    const [activeCardId, setActiveCardId] = useState<number | null>(null);

    // Function to handle adding products to the cart
    const handleAddToCart = (productId: number, productTitle: string) => {
        setActiveCardId(productId);
        alert(`${productTitle} has been added to your cart.`);
    };

    // Function to truncate product descriptions
    const truncateDescription = (description: string, maxLength: number) => {
        return description.length > maxLength ? description.slice(0, maxLength) + '...' : description;
    };

    // Effect to fetch products when component mounts
    useEffect(() => {
        dispatch(fetchProducts()); // Fetch products from the Redux store
    }, [dispatch]);

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
        <div className='bg-primary min-h-screen'>
            <Navbar />
            <div className='mx-4 py-4 md:mx-10'>
                <div className='flex flex-col md:flex-row text-white justify-between items-start md:items-center mb-6'>
                    <div>
                        <h1 className='text-2xl md:text-3xl font-bold'>Whishlist Product</h1>
                        <p className='text-sm'>Explore our whishlist of products Dumb Merch</p>
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
                        ? Array.from({ length: 5 }).map((_, index) => <SkeletonCard key={index} isCompact={isCompactGrid} />) // Display skeleton cards
                        : products.map((product) => (
                            <Card
                                key={product.productId}
                                title={truncateDescription(product.productName, 30)}
                                price={product.productPrice}
                                imageUrl={product.productMedia[0]?.mediaUrl || ''} // Get the first media URL
                                description={truncateDescription(product.productDescription || '', 30)}
                                onAddToCart={() => handleAddToCart(product.productId, product.productName)}
                                isCompact={isCompactGrid}
                                isActive={activeCardId === product.productId}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
}

export default Whishlist;
