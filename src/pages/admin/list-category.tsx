import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from "../../components/Navbar/Navbar";
import { GlobalIcons } from '../../components/common/Icon/GlobalIcons';
import CustomModal from '../../components/Modal';
import {
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from '../../redux/features/category/category-slice'; // Import your Redux slice functions
import { AppDispatch, RootState } from '../../redux/store'; // Adjust the import according to your store structure
import Notification from '../../components/common/notification'; // Import komponen notifikasi

const ListCategory: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const categories = useSelector((state: RootState) => state.categories.categories);
    const error = useSelector((state: RootState) => state.categories.error); // Ambil error dari Redux store

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
    const [newCategoryName, setNewCategoryName] = useState('');

    useEffect(() => {
        dispatch(fetchCategories()); // Fetch categories on component mount
    }, [dispatch]);

    const totalPages = Math.ceil(Array.isArray(categories) ? categories.length : 0 / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentCategories = Array.isArray(categories) ? categories.slice(startIndex, startIndex + itemsPerPage) : [];

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleEdit = (id: number) => {
        const categoryToEdit = categories.find(category => category.categoryId === id);
        if (categoryToEdit) {
            setNewCategoryName(categoryToEdit.categoryName);
            setEditingCategoryId(id);
            setIsModalOpen(true);
        }
    };

    const handleDelete = (id: number) => {
        dispatch(deleteCategory(id));
    };

    const handleAddOrEditCategory = () => {
        if (newCategoryName.trim()) {
            if (editingCategoryId) {
                dispatch(updateCategory({
                    id: editingCategoryId,
                    categoryData: { categoryName: newCategoryName },
                }));
            } else {
                dispatch(createCategory({ categoryName: newCategoryName }));
            }
            setNewCategoryName('');
            setEditingCategoryId(null);
            setIsModalOpen(false);
        }
    };

    const inputs = [
        {
            name: 'categoryName',
            value: newCategoryName,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNewCategoryName(e.target.value),
            placeholder: 'Category Name',
        },
    ];

    return (
        <div className="w-full h-full bg-primary">
            <Navbar />
            <div className="mx-4 py-4 md:mx-10">
                {error && (
                    <Notification
                        message={error}
                        onClose={() => dispatch({ type: 'categories/clearError' })} // Clear error action
                    />
                )}
                <div className='flex justify-between border-b border-gray-700 items-center'>
                    <div className='pb-4'>
                        <h1 className='text-4xl text-white font-semibold'>Category</h1>
                        <p className='text-gray-400'>This is the list of categories</p>
                    </div>
                    <div>
                        <button
                            className='flex gap-4 bg-secondary hover:bg-red-500 text-white p-4 rounded transition duration-300'
                            onClick={() => {
                                setNewCategoryName('');
                                setEditingCategoryId(null);
                                setIsModalOpen(true);
                            }}
                        >
                            <GlobalIcons.Plus className='text-lg' />
                            Add New Category
                        </button>
                    </div>
                </div>
                <table className="min-w-full bg-transparent border-2 border-gray-700 shadow-lg my-2">
                    <thead>
                        <tr className="bg-gray-800 text-gray-300 uppercase text-lg leading-normal rounded-t-lg">
                            <th className="py-4 px-6 text-left rounded-tl-lg"><input type="checkbox" value="" /></th>
                            <th className="py-4 px-6 text-left">Category Name</th>
                            <th className="py-4 px-6 text-left rounded-tr-lg">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-300 text-lg font-light">
                        {currentCategories.map((category) => (
                            <tr key={category.categoryId} className="border-b border-gray-700 hover:bg-gray-600">
                                <td className="py-4 px-6 text-left"><input type="checkbox" /></td>
                                <td className="py-4 px-6 text-left">{category.categoryName}</td>
                                <td className="py-4 px-6 text-left">
                                    <button
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded mr-2 transition duration-300"
                                        onClick={() => handleEdit(category.categoryId)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-secondary hover:bg-red-500 text-white px-4 py-2 rounded transition duration-300"
                                        onClick={() => handleDelete(category.categoryId)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className='bg-gray-800'>
                        <tr>
                            <td colSpan={3} className="text-left rounded-b-lg ">
                                <div className="flex items-center justify-between p-4 rounded-lg shadow-lg">
                                    <span className="text-neutral font-medium text-lg">
                                        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, categories.length)} of {categories.length} categories
                                    </span>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
                                            className={`px-6 py-3 rounded-md text-lg font-medium ${currentPage === 1 ? 'bg-accent text-gray-500' : 'bg-secondary hover:bg-red-400 text-white transition duration-300'}`}
                                            disabled={currentPage === 1}
                                        >
                                            Previous
                                        </button>
                                        {Array.from({ length: totalPages }, (_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handlePageChange(index + 1)}
                                                className={`px-6 py-3 rounded-md text-lg font-medium ${currentPage === index + 1 ? 'bg-accent text-gray-500' : 'bg-secondary hover:bg-red-400 text-white transition duration-300'}`}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                            className={`px-6 py-3 rounded-md text-lg font-medium ${currentPage === totalPages ? 'bg-accent text-gray-500' : 'bg-secondary hover:bg-red-400 text-white transition duration-300'}`}
                                            disabled={currentPage === totalPages}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <CustomModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingCategoryId ? "Edit Category" : "Add Category"}
                onSubmit={handleAddOrEditCategory}
                inputs={inputs}
            />
        </div>
    );
};

export default ListCategory;
