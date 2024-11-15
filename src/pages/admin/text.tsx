import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchProducts,
    deleteProduct,
    createProduct,
    updateProduct
} from '../../redux/features/product/product-slice';
import { RootState, AppDispatch } from '../../redux/store';
import Navbar from '../../components/Navbar/Navbar';
import Notification from '../../components/common/notification';
import CustomModal from '../../components/Modal';
import { GlobalIcons } from '../../components/common/Icon/GlobalIcons';
import { Product, UpdateProductDtoWithImage } from '../../redux/features/product/product-types';

const ListProduct: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { products, error } = useSelector((state: RootState) => state.products);
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        productImage: '',
        productName: '',
        productDescription: '',
        productPrice: 0,
        productStock: 0,
        productCategoryId: 0,
    });
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
            const url = URL.createObjectURL(event.target.files[0]);
            setFormData((prevData) => ({ ...prevData, productImage: url }));
        }
    };

    const handleDelete = async (productId: number) => {
        try {
            await dispatch(deleteProduct(productId));
            await dispatch(fetchProducts());
        } catch (error) {
            console.error('Delete product error:', error);
            alert('Failed to delete product. It may be referenced by other entities.');
        }
    };

    const handleSubmit = async () => {
        if (!formData.productCategoryId) {
            alert('Product category ID is required.');
            return;
        }

        let imageUrl = formData.productImage;

        if (file) {
            const formDataImage = new FormData();
            formDataImage.append('file', file);
            formDataImage.append('upload_preset', 'your_preset'); // Change to your Cloudinary preset

            try {
                const response = await fetch('https://api.cloudinary.com/v1_1/your_cloudinary_name/image/upload', {
                    method: 'POST',
                    body: formDataImage
                });
                const data = await response.json();
                imageUrl = data.secure_url;
            } catch (error) {
                console.error('Image upload error:', error);
                alert('Failed to upload image.');
                return;
            }
        }

        if (currentProduct) {
            dispatch(updateProduct({
                id: currentProduct.productId,
                productData: { ...formData, productImage: imageUrl } as UpdateProductDtoWithImage
            }));
        } else {
            dispatch(createProduct({ ...formData, productImage: imageUrl }));
        }
        setModalOpen(false);
        setFile(null);
        setFormData({
            productImage: '',
            productName: '',
            productDescription: '',
            productPrice: 0,
            productStock: 0,
            productCategoryId: 0
        });
        setCurrentProduct(null);
        dispatch(fetchProducts());
    };

    const handleEdit = (product: Product) => {
        setCurrentProduct(product);
        setFormData({
            productImage: product.productMedia[0]?.mediaUrl || '',
            productName: product.productName,
            productDescription: product.productDescription || '',
            productPrice: product.productPrice,
            productStock: product.productStock,
            productCategoryId: product.productCategoryId,
        });
        setModalOpen(true);
    };

    return (
        <div className="w-full h-full bg-primary">
            <Navbar />
            <div className="mx-4 py-4 md:mx-10">
                {error && (
                    <Notification
                        message={error}
                        onClose={() => {/* handle clear error logic here */ }}
                    />
                )}
                <div className='flex justify-between border-b border-gray-700 items-center'>
                    <div className='pb-4'>
                        <h1 className='text-4xl text-white font-semibold'>Products</h1>
                        <p className='text-gray-400'>Manage your products here</p>
                    </div>
                    <button
                        className='flex gap-4 bg-secondary hover:bg-red-500 text-white p-4 rounded transition duration-300'
                        onClick={() => {
                            setModalOpen(true);
                            setFormData({
                                productImage: '',
                                productName: '',
                                productDescription: '',
                                productPrice: 0,
                                productStock: 0,
                                productCategoryId: 0
                            });
                            setCurrentProduct(null);
                        }}
                    >
                        <GlobalIcons.Plus className='text-lg' />
                        Add New Product
                    </button>
                </div>
                <table className="min-w-full bg-transparent border-2 border-gray-700 shadow-lg my-2">
                    <thead>
                        <tr className="bg-gray-800 text-gray-300 uppercase text-lg leading-normal rounded-t-lg">
                            <th className="py-4 px-6 text-left">Image</th>
                            <th className="py-4 px-6 text-left">Name</th>
                            <th className="py-4 px-6 text-left">Description</th>
                            <th className="py-4 px-6 text-left">Price</th>
                            <th className="py-4 px-6 text-left">Stock</th>
                            <th className="py-4 px-6 text-left">Category</th>
                            <th className="py-4 px-6 text-left rounded-tr-lg">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-300 text-lg font-light">
                        {products.map((product) => (
                            <tr key={product.productId} className="border-b border-gray-700 hover:bg-gray-600">
                                <td className="py-4 px-6 text-center flex justify-center">
                                    {product.productMedia.length > 0 ? (
                                        <img src={product.productMedia[0].mediaUrl} alt="Product" className="w-20 h-20 object-cover border-2 border-gray-700 rounded-lg" />
                                    ) : (
                                        <span className='p-4 rounded-lg border-2 border-gray-700'><GlobalIcons.ImageOff className='w-12 h-12 text-secondary' /></span>
                                    )}
                                </td>
                                <td className="py-4 px-6">{product.productName}</td>
                                <td className="py-4 px-6">{product.productDescription}</td>
                                <td className="py-4 px-6">${product.productPrice.toFixed(2)}</td>
                                <td className="py-4 px-6">{product.productStock}</td>
                                <td className="py-4 px-6">{product.productCategoryId}</td>
                                <td className="py-4 px-6 flex gap-2">
                                    <button
                                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
                                        onClick={() => handleEdit(product)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded"
                                        onClick={() => handleDelete(product.productId)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <CustomModal
                title={currentProduct ? "Edit Product" : "Add New Product"}
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                inputs={[
                    {
                        name: 'productName',
                        value: formData.productName,
                        onChange: (e) => setFormData({ ...formData, productName: e.target.value }),
                    },
                    {
                        name: 'productDescription',
                        value: formData.productDescription,
                        onChange: (e) => setFormData({ ...formData, productDescription: e.target.value }),
                    },
                    {
                        name: 'productPrice',
                        value: formData.productPrice.toString(),
                        onChange: (e) => setFormData({ ...formData, productPrice: parseFloat(e.target.value) }),
                        type: 'number',
                    },
                    {
                        name: 'productStock',
                        value: formData.productStock.toString(),
                        onChange: (e) => setFormData({ ...formData, productStock: parseInt(e.target.value) }),
                        type: 'number',
                    },
                    {
                        name: 'productCategoryId',
                        value: formData.productCategoryId.toString(),
                        onChange: (e) => setFormData({ ...formData, productCategoryId: parseInt(e.target.value) }),
                        type: 'number',
                    },
                    {
                        name: 'productImage',
                        type: 'file',
                        onChange: handleFileChange,
                    }
                ]}
            />
        </div>
    );
};

export default ListProduct;
