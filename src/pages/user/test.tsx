import { useEffect, useMemo, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { GlobalIcons } from '../../components/common/Icon/GlobalIcons';
import { fetchUserProfile, fetchAllUsers } from '../../redux/features/user/user-slice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { User } from '../../redux/features/chat/chat-types';
import { io } from 'socket.io-client';

// Component to display a single message with conditional styling
const MessageBubble = ({ message, isUserLoggedIn }: { message: any, isUserLoggedIn: boolean }) => {
    const isCurrentUser = isUserLoggedIn && message.sender.role === 'USER';
    const isAdminUser = !isUserLoggedIn && message.sender.role === 'ADMIN';

    return (
        <div
            className={`flex flex-col py-2 ${isCurrentUser || isAdminUser ? 'items-end' : 'items-start'}`} // Align message to the right if the sender is the current user or admin
        >
            <div className={`flex items-center space-x-2 ${isCurrentUser || isAdminUser ? 'items-start' : 'items-end'}`} >
                <img
                    src={message.sender.avatar}
                    alt={message.sender.name}
                    className="w-12 h-12 rounded-full"
                />
                <div>
                    <div className="text-sm text-white font-semibold">{message.sender.name}</div>
                    <div className="text-sm text-gray-500">{message.content}</div>
                    <div className="text-xs text-gray-400">{new Date(message.createdAt).toLocaleString()}</div>
                </div>
            </div>
        </div>
    );
};

function Complain() {
    const dispatch: AppDispatch = useDispatch();
    const userProfile = useSelector((state: RootState) => state.profile.data);
    const allUsers = useSelector((state: RootState) => state.profile.allUsers);
    const messages = useSelector((state: RootState) => state.chat.messages);
    const [messageContent, setMessageContent] = useState('');
    const [roomId, setRoomId] = useState<number | null>(null);

    const socket = useMemo(() => {
        return io('http://localhost:3000', {
        transports: ['websocket', 'polling'],  // Specify transports if needed
        });
    }, []);

    useEffect(() => {
        dispatch(fetchUserProfile());
        dispatch(fetchAllUsers());

        // Listen for new chat messages
        socket.on('chat message', (newMessage) => {
            dispatch(addMessage(newMessage));  // Menggunakan action yang benar dari Redux
        });

        return () => {
        socket.disconnect();  // Clean up the socket connection on component unmount
        };
    }, [dispatch, socket]);

    const filteredUsers = allUsers?.filter((user) => {
        if (userProfile?.role === 'USER') {
            return user.role === 'ADMIN'; // Show only ADMIN users if the logged-in user is USER
        }
        return user.role === 'USER'; // Show only USER users if the logged-in user is ADMIN
    });

    const handleUserClick = (user: User) => {
        if (userProfile?.id) {
            const currentRoomId = userProfile.id > user.id ? `${userProfile.id}-${user.id}` : `${user.id}-${userProfile.id}`;
            dispatch(fetchMessages(currentRoomId))
                .unwrap()
                .then((messages) => {
                    setRoomId(currentRoomId);  // Set the roomId when messages are fetched
                })
                .catch(() => {
                    dispatch(fetchOrCreateRoom({ userId: userProfile.id, adminId: user.id }))
                        .unwrap()
                        .then((room) => {
                            const roomId = room.id;
                            setRoomId(roomId);  // Set the roomId when the room is created
                            dispatch(fetchMessages(roomId));
                        })
                        .catch((err) => {
                            console.log('Error creating or fetching room:', err);
                        });
                });
        } else {
            console.log('User ID not found');
        }
    };


    const handleSendMessage = () => {
        if (messageContent.trim() !== '') {
            if (roomId) {
                dispatch(sendMessage({ roomId, content: messageContent }))
                    .then(() => {
                        setMessageContent('');
                    })
                    .catch((error) => {
                        console.error('Error sending message:', error);
                    });
            } else {
                console.error('No room ID available');
            }
        }
    };




    const isUserLoggedIn = userProfile?.role === 'USER';

    return (
        <div className="bg-primary w-screen h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-col md:flex-row justify-between bg-transparent py-4 md:mx-10 flex-grow h-full gap-4">
                <div className="flex flex-col w-full md:w-[26%] overflow-y-auto h-full">
                    <div className="py-4 px-2">
                        <label className="input input-bordered flex items-center gap-2 w-full">
                            <input type="text" className="grow bg-transparent" placeholder="Search" />
                            <GlobalIcons.Search className="text-gray-500 w-6 h-6" />
                        </label>
                    </div>
                    <div className="overflow-y-auto max-h-[calc(90vh-150px)]">
                        {filteredUsers?.map((user) => (
                            <div
                                key={user.id}
                                className="flex flex-row py-4 px-2 justify-center items-center hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                                onClick={() => handleUserClick(user)}
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

                {/* Right side for the chat */}
                <div className="w-full md:w-[74%] flex flex-col border-l-2 border-gray-600 md:pl-4 my-2 h-full">
                    <div className="flex flex-col flex-grow overflow-y-auto px-2">
                        {messages.length > 0 ? (
                            messages.map((message) => (
                                <MessageBubble key={message.id} message={message} isUserLoggedIn={isUserLoggedIn} />
                            ))
                        ) : (
                            <div className="text-center text-gray-500">No messages yet...</div>
                        )}
                    </div>
                    <div className="flex p-2 border-t border-gray-600 w-full">
                        <form className="w-full" onSubmit={handleSendMessage}>
                            <label htmlFor="chat" className="sr-only">Your message</label>
                            <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                                <button
                                    type="button"
                                    className="inline-flex justify-center p-2 text-gray-800 rounded-lg cursor-no-drop"
                                >
                                    <GlobalIcons.ImagePlus />
                                    <span className="sr-only">Upload image</span>
                                </button>
                                <button
                                    type="button"
                                    className="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                                >
                                    <GlobalIcons.SmilePlus />
                                    <span className="sr-only">Add emoji</span>
                                </button>
                                <textarea
                                    id="chat"
                                    rows={1}
                                    className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Your message..."
                                    value={messageContent}
                                    onChange={(e) => setMessageContent(e.target.value)} // Binding textarea value to state
                                ></textarea>
                                <button
                                    type="submit"
                                    className="inline-flex justify-center p-2 text-secondary rounded-full cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-600"
                                >
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
