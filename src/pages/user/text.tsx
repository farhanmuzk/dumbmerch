import { useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { GlobalIcons } from '../../components/common/Icon/GlobalIcons';
import { fetchUserProfile, fetchAllUsers } from '../../redux/features/user/user-slice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchOrCreateRoom } from '../../redux/features/chat/chat-slice';
import { User } from '../../redux/features/chat/chat-types';

function Complain() {
    const dispatch: AppDispatch = useDispatch();
    const userProfile = useSelector((state: RootState) => state.profile.data);
    const allUsers = useSelector((state: RootState) => state.profile.allUsers);

    useEffect(() => {
        dispatch(fetchUserProfile()); // Mendapatkan profil pengguna yang login
        dispatch(fetchAllUsers());    // Mendapatkan semua pengguna
    }, [dispatch]);

    const filteredUsers = allUsers?.filter((user) => {
        if (userProfile?.role === 'USER') {
            return user.role === 'ADMIN';
        }
        return user.role === 'USER';
    });

    // Get userId from cookies (assuming the token contains userId)
    const userId = userProfile?.id;
    // Function to handle user click
    const handleUserClick = (user: User) => {
        console.log(user);

        if (userId) {
            const adminId = user.role === 'ADMIN' ? user.id : null;
            dispatch(fetchOrCreateRoom({ userId, adminId: adminId || user.id }));

        }else{
            console.log('User ID not found in cookies');
        }
    };

    return (
        <div className='bg-primary w-screen h-screen flex flex-col'>
            <Navbar />
            <div className="flex flex-col md:flex-row justify-between bg-transparent py-4 md:mx-10 flex-grow h-full gap-4">
                {/* Bagian kiri untuk daftar pengguna (khusus admin) */}
                <div className="flex flex-col w-full md:w-[26%] overflow-y-auto h-full">
                    <div className="py-4 px-2">
                        <label className="input input-bordered flex items-center gap-2 w-full">
                            <input type="text" className="grow bg-transparent" placeholder="Search" />
                            <GlobalIcons.Search className='text-gray-500 w-6 h-6' />
                        </label>
                    </div>
                    <div className="overflow-y-auto max-h-[calc(90vh-150px)]">
                        {filteredUsers?.map((user) => (
                            <div
                                key={user.id}
                                className="flex flex-row py-4 px-2 justify-center items-center hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                                onClick={() => handleUserClick(user)} // Call the function on click
                            >
                                <div className="w-1/4">
                                    <img
                                        src={user.avatar}
                                        className="object-cover h-12 w-12 rounded-full border-2 border-white"
                                        alt={user.name}
                                    />
                                </div>
                                <div className="w-3/4 text-white">
                                    <div className="text-lg font-semibold">{user.name}</div>
                                    <span className="text-gray-500 text-sm">{user.phone_number}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bagian kanan untuk chat */}
                <div className="w-full md:w-[74%] flex flex-col border-l-2 border-gray-600 md:pl-4 my-2 h-full">
                    <div className="flex flex-col flex-grow overflow-y-auto px-2">

                    </div>
                    <div className="flex p-2 border-t border-gray-600 w-full">
                        <form className='w-full'>
                            <label htmlFor="chat" className="sr-only">Your message</label>
                            <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                                <button type="button" className="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                    <GlobalIcons.ImagePlus />
                                    <span className="sr-only">Upload image</span>
                                </button>
                                <button type="button" className="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                    <GlobalIcons.SmilePlus />
                                    <span className="sr-only">Add emoji</span>
                                </button>
                                <textarea id="chat" rows={1} className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your message..."></textarea>
                                <button type="submit" className="inline-flex justify-center p-2 text-secondary rounded-full cursor-pointer hover:bg-blue-100  dark:hover:bg-gray-600">
                                    <GlobalIcons.Send />
                                    <span className="sr-only">Send message</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Complain;
