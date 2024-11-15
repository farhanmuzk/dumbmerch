import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../redux/features/product/product-slice';
import { AppDispatch, RootState } from '../../redux/store';
import { Product } from '../../redux/features/product/product-types';
import { fetchCategories } from '../../redux/features/category/category-slice';
import Navbar from '../../components/Navbar/Navbar';
import { GlobalIcons } from '../../components/common/Icon/GlobalIcons';

const ProductList: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { products } = useSelector((state: RootState) => state.products);
    const { categories } = useSelector((state: RootState) => state.categories);

    const [form, setForm] = useState<Product>({
        productId: undefined,
        productName: '',
        productDescription: '',
        productPrice: 0,
        productStock: 0,
        productCategoryId: 0,
        productMedia: []
    });

    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchCategories());
    }, [dispatch]);

    const openModal = (product?: Product) => {
        if (product) {
            setForm(product);
        } else {
            resetForm();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setMediaFiles(files);
        setForm((prevForm) => ({
            ...prevForm,
            productMedia: files.map((file) => ({
                mediaUrl: URL.createObjectURL(file),
                mediaType: 'IMAGE'
            })),
        }));
    };

    const handleCreateOrUpdate = () => {
        const formData = new FormData();
        if (form.productId) formData.append('productId', form.productId.toString());
        formData.append('productName', form.productName);
        formData.append('productDescription', form.productDescription || '');
        formData.append('productPrice', form.productPrice.toString());
        formData.append('productStock', form.productStock.toString());
        formData.append('productCategoryId', form.productCategoryId.toString());
        mediaFiles.forEach(file => formData.append('mediaFiles', file));

        const action = form.productId ? updateProduct(formData) : createProduct(formData);
        dispatch(action)
            .unwrap()
            .then(result => {
                console.log('Operation successful:', result);
                closeModal();
            })
            .catch(err => {
                console.error('Operation failed:', err);
                alert('Failed to save product.');
            });
    };

    const handleEdit = (product: Product) => openModal(product);
    const handleDelete = (productId: number) => dispatch(deleteProduct(productId));

    const resetForm = () => {
        setForm({
            productId: undefined,
            productName: '',
            productDescription: '',
            productPrice: 0,
            productStock: 0,
            productCategoryId: 0,
            productMedia: []
        });
        setMediaFiles([]);
    };

    return (
        <div className='w-full h-full bg-primary'>
            <Navbar />
            <div className="mx-4 py-4 md:mx-10">
                <div className='flex justify-between border-b border-gray-700 items-center'>
                    <div className='pb-4'>
                        <h1 className='text-4xl text-white font-semibold'>Category</h1>
                        <p className='text-gray-400'>This is the list of categories</p>
                    </div>
                    <div>
                        <button
                            className='flex gap-4 bg-secondary hover:bg-red-500 text-white p-4 rounded transition duration-300'
                            onClick={() => openModal()}
                        >
                            <GlobalIcons.Plus className='text-lg' />
                            Add New Category
                        </button>
                    </div>
                </div>
                <table className="min-w-full bg-transparent border-2 border-gray-700 shadow-lg my-2">
                    <thead>
                        <tr className="bg-gray-800 text-gray-300 uppercase text-lg leading-normal rounded-t-lg">
                            <th className="py-4 px-4 text-center rounded-tl-lg"><input type="checkbox" value="" className='w-4 h-4' /></th>
                            <th className="py-4 px-2 text-center">Image Product</th>
                            <th className="py-4 px-4 text-center">Name Product</th>
                            <th className="py-4 px-4 text-center">Deskripsi Product</th>
                            <th className="py-4 px-4 text-center">Stock</th>
                            <th className="py-4 px-4 text-center">Price</th>
                            <th className="py-4 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-300 text-lg font-light">
                        {products.map((product) => (
                            <tr key={product.productId} className="border-b border-gray-700 hover:bg-gray-600">
                                <td className="py-4 px-2 text-center"><input type="checkbox" className='w-4 h-4' /></td>
                                <td className="px-2 py-4 flex items-center justify-center">
                                    {product.productMedia && product.productMedia.length > 0 ? (
                                        <img
                                            src={product.productMedia[0]?.mediaUrl}
                                            alt={product.productName}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                    ) : (
                                        <span>No Image</span>
                                    )}
                                </td>
                                <td className="px-4 py-4 text-center">{product.productName}</td>
                                <td className="px-4 py-4 text-center">{product.productDescription}</td>
                                <td className="px-4 py-4 text-center">{product.productStock}</td>
                                <td className="px-4 py-4 text-center">Rp. {product.productPrice}</td>
                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="w-fit bg-yellow-500 text-white px-4 py-2 rounded mr-2 hover:bg-yellow-600 mb-2">
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.productId as number)}
                                        className="w-fit bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-lg font-bold mb-4">{form.productId ? 'Update Product' : 'Create Product'}</h2>
                        <input
                            type="text"
                            name="productName"
                            value={form.productName}
                            onChange={handleChange}
                            placeholder="Product Name"
                            className="border p-2 w-full mb-2" />
                        <textarea
                            name="productDescription"
                            value={form.productDescription}
                            onChange={handleChange}
                            placeholder="Product Description"
                            className="border p-2 w-full mb-2" />
                        <input
                            type="number"
                            name="productPrice"
                            value={form.productPrice}
                            onChange={handleChange}
                            placeholder="Product Price"
                            className="border p-2 w-full mb-2" />
                        <input
                            type="number"
                            name="productStock"
                            value={form.productStock}
                            onChange={handleChange}
                            placeholder="Product Stock"
                            className="border p-2 w-full mb-2" />
                        <select
                            name="productCategoryId"
                            value={form.productCategoryId}
                            onChange={handleChange}
                            className="border p-2 w-full mb-2">
                            <option value={0}>Select Category</option>
                            {categories.map(category => (
                                <option key={category.categoryId} value={category.categoryId}>
                                    {category.categoryName}
                                </option>
                            ))}
                        </select>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            multiple
                            className="border p-2 w-full mb-2" />
                        <div className="flex justify-end">
                            <button
                                onClick={closeModal}
                                className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600">
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateOrUpdate}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                                {form.productId ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;
