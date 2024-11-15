import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../../components/Navbar/Navbar';
import { GlobalIcons } from '../../components/common/Icon/GlobalIcons';
import { fetchProducts } from '../../redux/features/product/product-slice';
import Card from '../../components/Card/card-product';
import SkeletonCard from '../../components/Card/skeleton-product';
import { AppDispatch, RootState } from '../../redux/store';

function Home() {
    const [isCompactGrid, setIsCompactGrid] = useState(false);
    const [activeCardId,] = useState<number | null>(null);
    const [quantity, setQuantity] = useState<{ [key: number]: number }>({}); // Track quantities for each product

    const dispatch: AppDispatch = useDispatch();
    const { products, loading, error } = useSelector((state: RootState) => state.products);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const truncateDescription = (description: string, maxLength: number) => {
        return description.length > maxLength ? description.slice(0, maxLength) + '...' : description;
    };

    return (
        <div className='bg-primary min-h-screen'>
            <Navbar />
            <div className='mx-4 py-4 md:mx-10'>
                <div className='text-neutral mb-4'>
                    <h1 className='text-2xl md:text-3xl font-bold'>All Product</h1>
                    <p className='text-sm'>Explore our products Dumb Merch</p>
                </div>
                <div className='flex flex-col md:flex-row text-white justify-between items-start md:items-center mb-6'>
                    <div className='w-full'>
                        <label className="input input-bordered flex items-center gap-2 w-full border-2 border-gray-600 p-3 text-neutral rounded-xl">
                            <input type="text" className="grow bg-transparent border-none outline-none px-4" placeholder="Search" />
                            <GlobalIcons.Search className='text-gray-500' />
                        </label>
                    </div>
                    <div className='flex flex-row gap-2 mt-4 md:mt-0 w-full justify-end'>
                        <GlobalIcons.Grid2X2
                            className={`tooltip w-10 h-10 md:w-12 md:h-12 ${!isCompactGrid ? 'text-secondary' : 'text-white'} p-2 md:p-3 border-2 rounded-lg hover:text-red-500 cursor-pointer`}
                            onClick={() => setIsCompactGrid(false)}
                        />
                        <GlobalIcons.Grid4X4
                            className={`tooltip w-10 h-10 md:w-12 md:h-12 ${isCompactGrid ? 'text-secondary' : 'text-white'} p-2 md:p-3 border-2 rounded-lg hover:text-red-500 cursor-pointer`}
                            onClick={() => setIsCompactGrid(true)}
                        />
                    </div>
                </div>
                <div className={`grid gap-6 ${isCompactGrid ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
                    {loading ? (
                        Array.from({ length: 5 }).map((_, index) => <SkeletonCard key={index} isCompact={isCompactGrid} />)
                    ) : error ? (
                        <p className='text-red-500'>Error: {error}</p>
                    ) : Array.isArray(products) && products.length > 0 ? (
                        products.map((product) => (
                            <Card
                                key={product.productId}
                                title={truncateDescription(product.productName, 30)}
                                price={product.productPrice}
                                imageUrl={product.productMedia?.[0]?.mediaUrl || 'placeholder-image-url'}
                                description={truncateDescription(product.productDescription || '', 30)}
                                isCompact={isCompactGrid}
                                isActive={activeCardId === product.productId}
                                quantity={product.productId !== undefined ? quantity[product.productId] || 1 : 1}
                                setQuantity={(qty) => setQuantity({ ...quantity, [product.productId.toString()]: qty })}
                                productId={product.productId}
                            />
                        ))
                    ) : (
                        <p className='text-white'>No products found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
