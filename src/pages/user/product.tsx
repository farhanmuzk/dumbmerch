import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'; // Import useParams
import Navbar from '../../components/Navbar/Navbar';
import { GlobalIcons } from '../../components/common/Icon/GlobalIcons';
import { fetchProducts } from '../../redux/features/product/product-slice';
import { AppDispatch, RootState } from '../../redux/store';

const Product: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { id } = useParams<{ id: string }>(); // Get product ID from URL parameters
    const products = useSelector((state: RootState) => state.products.products); // Access products from state
    const product = products.find(p => p.productId === Number(id)); // Find product by ID

    useEffect(() => {
        if (products.length === 0) {
            dispatch(fetchProducts());
        }
    }, [dispatch, products.length]);

    return (
        <div className='bg-primary w-screen h-full flex flex-col'>
            <Navbar />
            {product ? ( // Render product details if available
                <div className="flex mx-4 py-4 md:mx-10 gap-20">
                    <div className="w-1/2">
                        <div className='w-full flex justify-center'>
                            <img src={product.productMedia[0]?.mediaUrl || "fallback-image-url"} alt="" width={600} height={600} className='object-cover rounded-xl' />
                        </div>
                        <div className='my-4 flex gap-4 justify-center'>
                            {product && product.productMedia && product.productMedia.map((media, index) => (
                                <img key={index} src={media.mediaUrl} alt="" className='object-cover w-20 h-20 rounded glow-border-static' />
                            ))}
                        </div>
                    </div>
                    <div className="w-1/2">
                        <div className='flex flex-col space-y-2 my-4'>
                            <h1 className='text-3xl font-bold text-white russo-one-bold tracking-wide'>{product.productName}</h1>
                            <p className='text-lg text-white russo-one-regular'>Stock : {product.productStock}</p>
                            <h1 className='text-3xl font-bold text-white russo-one-bold tracking-wide py-8'>Rp {product.productPrice}</h1>
                            <p className='text-lg text-white russo-one-regular'>{product.productDescription}</p>
                        </div>
                        <div className="flex mt-2 gap-2 w-[530px]">
                            <button className='bg-transparent border-2 border-white hover:border-red-500 hover:text-red-500 p-1 w-fit text-white rounded transition-all duration-300 rounded-l'>
                                <GlobalIcons.Save className='' />
                            </button>
                            <button className='bg-red-500 border-2 border-red-500 hover:bg-transparent hover:border-2 hover:border-red-500 p-2 w-full text-white hover:text-red-500 rounded transition-all duration-300 rounded-lg text-sm'>
                                Add To Cart
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <p className='text-white'>Loading...</p> // Display loading or error message
            )}
        </div>
    );
};

export default Product;
