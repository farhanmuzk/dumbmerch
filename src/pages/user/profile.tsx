import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, updateUserProfile } from '../../redux/features/user/user-slice';
import Navbar from '../../components/Navbar/Navbar';
import { GlobalIcons } from '../../components/common/Icon/GlobalIcons';
import { AppDispatch, RootState } from '../../redux/store';
import { UserProfile } from '../../redux/features/user/user-types';

function Profile() {
    const dispatch: AppDispatch = useDispatch();
    const { data: user } = useSelector((state: RootState) => state.profile);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // State for form fields
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        phone: '',
        gender: '',
        avatar: null as File | null
    });

    useEffect(() => {
        dispatch(fetchUserProfile());
    }, [dispatch]);

    // Update local form state when user data changes
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                address: user.address || '',
                phone: user.phone_number || '',
                gender: user.gender || '',
                avatar: null
            });
        }
    }, [user]);

    // Fungsi untuk menangani perubahan input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Fungsi untuk menangani perubahan file
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            setFormData(prevState => ({
                ...prevState,
                avatar: file
            }));

            // Buat URL untuk preview gambar dan simpan di state
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
        } else {
            // Jika tidak ada file yang dipilih, reset preview
            setPreviewImage(null);
        }
    };



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Create an object with the updated data
        const updatedData: Partial<UserProfile> = {
            name: formData.name,
            address: formData.address || '',
            phone_number: formData.phone || '',
            gender: formData.gender || '',
        };

        // Create FormData and append avatar if selected
        const formDataObject = new FormData();
        Object.entries(updatedData).forEach(([key, value]) => {
            if (value) {
                formDataObject.append(key, value.toString());
            }
        });

        // Append the avatar file if it's selected
        if (formData.avatar) {
            formDataObject.append('avatar', formData.avatar);
        }

        // Dispatch the update action
        dispatch(updateUserProfile(formDataObject)).then(() => {
            setLoading(false);
            setIsEditing(false);
            console.log('User profile updated successfully');
        }).catch((error) => {
            console.error("Failed to update user profile:", error);
            setLoading(false);
        });
    };




    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setPreviewImage(null); // Reset the preview image
        setFormData({
            ...formData,
            avatar: null, // Reset the avatar file
        });
    };


    return (
        <div className="bg-primary min-h-screen flex flex-col">
            <Navbar />
            <div className="flex justify-center items-center w-full flex-1 py-4">
                <div className="flex-[6] p-4">
                    <div className="flex w-full">
                        <div className="flex-1 p-2 items-center">
                            <div className='flex justify-center items-center gap-4'>
                                <img src={user?.avatar} alt="" className='w-[150px] rounded-2xl object-cover border-2 border-white' />
                                <div className="flex-1 p-2 text-neutral">
                                    <h1 className="text-4xl font-poppins font-bold">{user?.name}</h1>
                                    <p className="text-lg font-poppins tracking-wide">{user?.email}</p>
                                </div>
                                <div className='flex gap-4'>
                                    <button
                                        onClick={handleEditClick}
                                        className={`border-2 px-4 py-2 text-sm rounded-lg ${isEditing ? 'bg-neutral text-primary' : 'bg-transparent text-white'}`}>
                                        Edit Profile
                                    </button>
                                    {isEditing && (
                                        <button
                                            onClick={handleCancelClick} className='border-2 border-neutral px-4 py-2 text-sm rounded-lg text-white'>Cancel</button>
                                    )}
                                </div>
                            </div>

                            {loading && /* From Uiverse.io by adamgiebl */
                                /* From Uiverse.io by choudhary-usman */
                                <div className="loader"></div>

                            }

                            {/* Form hanya akan ditampilkan jika isEditing true */}
                            {isEditing && (
                                <form onSubmit={handleSubmit}>
                                    <div className='mt-8 text-neutral border-neutral border-b pb-8'>
                                        <h2 className='text-2xl font-bold font-poppins '>Update Profile User</h2>
                                        <p className="text-sm font-thin  font-poppins tracking-wide">Update your profile image and name details here.</p>
                                    </div>
                                    <div className='flex justify-between space-x-20 mt-4 items-center border-neutral border-b pb-8 pt-8'>
                                        <div className='text-neutral w-80'>
                                            <h2 className='text-lg font-bold font-poppins '>Public Profile</h2>
                                            <p className="text-sm font-thin  font-poppins tracking-wide">This will be displayed on your public profile.</p>
                                        </div>
                                        <div className='flex flex-col gap-2 w-80'>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className='border-2 bg-transparent border-neutral px-4 py-2 text-sm rounded-lg text-neutral'
                                                placeholder='Name'
                                            />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className='border-2 bg-transparent border-gray-600 px-4 py-2 text-sm rounded-lg text-gray-600 disabled'
                                                placeholder='Email'
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className='flex justify-between space-x-20 mt-4 items-center border-neutral border-b pb-8 pt-8'>
                                        <div className='text-neutral w-80'>
                                            <h2 className='text-lg font-bold font-poppins '>Profile Picture</h2>
                                            <p className="text-sm font-thin  font-poppins tracking-wide">Update your profile image and then choise a profile picture.</p>
                                        </div>
                                        <div className='flex gap-2 w-80 gap-4 items-start justify-center'>
                                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-30 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-transparent hover:bg-accent">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    {previewImage ? (
                                                        <img src={previewImage} alt="Preview" className="w-full h-auto rounded-lg" />
                                                    ) : (
                                                        <>
                                                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                            </svg>
                                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                                        </>
                                                    )}
                                                </div>
                                                <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
                                            </label>
                                        </div>
                                    </div>
                                    <div className='flex justify-between space-x-20 mt-4 items-center border-neutral border-b pb-8 pt-8'>
                                        <div className='text-neutral w-80'>
                                            <h2 className='text-lg font-bold font-poppins '>Addres Profile</h2>
                                            <p className="text-sm font-thin  font-poppins tracking-wide">Update your addres profile here for your public profile.</p>
                                        </div>
                                        <div className='flex flex-col gap-2 w-80'>
                                            <textarea id="message" rows={4} value={formData.address} name='address' onChange={handleInputChange} className="block p-2.5 w-full text-sm text-neutral bg-transparent rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="example addres profile"></textarea>
                                        </div>
                                    </div>
                                    <div className='flex justify-between space-x-20 mt-4 items-center border-neutral border-b pb-8 pt-8'>
                                        <div className='text-neutral w-80'>
                                            <h2 className='text-lg font-bold font-poppins '>Other Profile</h2>
                                            <p className="text-sm font-thin  font-poppins tracking-wide">This will be displayed on your public profile.</p>
                                        </div>
                                        <div className='flex flex-col gap-2 w-80'>
                                            <input type="text" value={formData.phone} onChange={handleInputChange} name='phone' className='border-2 bg-transparent border-neutral px-4 py-2 text-sm rounded-lg text-neutral' placeholder='08xxxxxxx' />
                                            <div className='flex gap-2'>
                                                <div className="flex items-center ps-4 border border-neutral rounded w-full">
                                                    <input
                                                        id="male-radio"
                                                        type="radio"
                                                        value="MALE"
                                                        name="gender"
                                                        checked={formData.gender === 'MALE'}
                                                        onChange={handleInputChange}
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <label htmlFor="male-radio" className="w-full py-2 ms-2 text-xs font-medium text-neutral">Male</label>
                                                </div>
                                                <div className="flex items-center ps-4 border border-neutral rounded w-full">
                                                    <input
                                                        id="female-radio"
                                                        type="radio"
                                                        value="FEMALE"
                                                        name="gender"
                                                        checked={formData.gender === 'FEMALE'}
                                                        onChange={handleInputChange}
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <label htmlFor="female-radio" className="w-full py-2 ms-2 text-xs font-medium text-neutral">Female</label>
                                                </div>
                                                <div className="flex items-center ps-2 border border-neutral rounded w-full">
                                                    <input
                                                        id="non-binary-radio"
                                                        type="radio"
                                                        value="NON_BINARY"
                                                        name="gender"
                                                        checked={formData.gender === 'NON_BINARY'}
                                                        onChange={handleInputChange}
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <label htmlFor="non-binary-radio" className="w-full py-2 ms-2 text-xs font-medium text-neutral">Non-Binary</label>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className='flex gap-2 justify-end mt-4'>
                                        <button className='bg-transparent border-2 border-neutral px-6 py-2 text-sm rounded-lg text-neutral' onClick={handleCancelClick}>Cancel</button>
                                        <button className='bg-neutral px-6 py-2 text-sm rounded-lg text-primary'>Save Changes</button>
                                    </div>
                                </form>
                            )}
                        </div>
                </div>
                </div>
                <div className="flex-[4] p-4 flex flex-col justify-start space-y-4">
                    <div className='text-white'>
                        <h1 className='text-2xl font-bold'>Summary Order</h1>
                        <p className='text-gray-500'>Your order history will be shown here</p>
                    </div>
                    <label className="input input-bordered flex items-center gap-2 w-full">
                        <input type="text" className="grow" placeholder="Search" />
                        <GlobalIcons.Search className='text-gray-500 w-6 h-6' />
                    </label>
                    <div className="relative">
                        <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-[#121212] to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-[#121212] to-transparent z-10 pointer-events-none"></div>
                        <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(60vh-50px)] p-4">
                            <div className='flex gap-2 p-2 border-2 border-white rounded-xl my-2 items-center space-x-4'>
                                <img src="https://i.pinimg.com/564x/0a/f8/e3/0af8e3e7c65709e48bc730d5d8d180ba.jpg" alt="" width={100} height={100} className='rounded-xl' />
                                <div className='space-y-1'>
                                    <h1 className='text-2xl text-white font-bold'>Box design for the Mouse</h1>
                                    <p className='text-gray-500'>High quality wireless headphones with noise cancellation.</p>
                                    <div className="flex items-end gap-2">
                                        <p className='text-xl font-bold text-white'>Rp. 1.000.000</p>
                                        <p className='text-gray-500 text-sm mb-auto font-bold'>Stock : 1</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
