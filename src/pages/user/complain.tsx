import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { getMessage, getOrCreateRoom, addMessage } from "../../redux/features/chat/chat-slice";
import { fetchAllUsers } from "../../redux/features/user/user-slice";
import { io } from "socket.io-client";
import { GlobalIcons } from "../../components/common/Icon/GlobalIcons";

export function Complain() {
    return (
        <div className="w-full h-screen bg-primary">
            <NavbarComplain />
            <ComplainForm />
        </div>
    );
}

export function NavbarComplain() {
    return (
        <div className="fixed top-0 left-0 w-full bg-primary z-10 shadow-lg">
            <Navbar />
        </div>
    );
}
export function ComplainForm() {
    const dispatch: AppDispatch = useDispatch();
    const { loading, room, allUser } = useSelector((state: RootState) => state.chat);
    const userProfile = useSelector((state: RootState) => state.profile.data);
    const allUsers = useSelector((state: RootState) => state.profile.allUsers);
    const messages = useSelector((state: RootState) => state.chat.messages);
    const socket = useMemo(() => io("http://localhost:3000"), []);

    const [newMessage, setNewMessage] = useState("");

    const handleRoomChange = async (newRoomId: number) => {
        const existingRoom = Array.isArray(room)
            ? room.find((r) => r.id === newRoomId)
            : undefined;

        if (!existingRoom) {
            const adminId = userProfile?.role === "ADMIN" ? userProfile.id : newRoomId;
            const userId = userProfile?.role === "USER" ? userProfile.id : newRoomId;
            await dispatch(getOrCreateRoom({ userId, adminId }));
            dispatch(getMessage({ roomId: newRoomId }));
        } else {
            dispatch(getMessage({ roomId: newRoomId }));
        }
    };

    const currentRoomId = room?.[0]?.id;

    useEffect(() => {
        dispatch(fetchAllUsers());
        socket.on("chat message", (msg) => {
            if (msg.roomId === currentRoomId) {
                dispatch(addMessage(msg));
            }
        });
        return () => {
            socket.off("chat message");
        };
    }, [dispatch, currentRoomId, socket]);

    const filteredUsers = allUsers?.filter((user) => {
        if (userProfile?.role === 'USER') {
            return user.role === 'ADMIN';
        }
        return user.role === 'USER';
    });

    useEffect(() => {
        if (currentRoomId) {
            dispatch(getMessage({ roomId: currentRoomId }));
            socket.emit("join room", currentRoomId);
        }
    }, [dispatch, currentRoomId, socket]);

    const sendMessage = () => {
        if (newMessage.trim() && currentRoomId && userProfile?.id) {
            const message = {
                userId: userProfile?.id,
                roomId: currentRoomId,
                content: newMessage,
            };
            socket.emit("chat message", message);
            setNewMessage("");
        }
    };

    const currentMessages = Array.isArray(messages)
        ? messages.filter((msg) => msg.roomId === currentRoomId)
        : [];

    return (
        <div className="flex flex-col lg:flex-row w-full h-full">
            {/* Sidebar */}
            <div className="w-full lg:w-1/4 bg-primary border-r-2 border-gray-800 text-white p-6 overflow-y-auto shadow-lg mt-4">
                <div className="mt-20">
                    <div className='flex flex-col md:flex-row text-white justify-between items-start md:items-center mb-6'>
                        <div className='w-full w-1/2'>
                            <label className="input input-bordered flex items-center gap-2 w-full border-2 border-gray-600 p-3 text-neutral rounded-xl">
                                <input type="text" className="grow bg-transparent border-none outline-none" placeholder="Search" />
                                <GlobalIcons.Search className='text-gray-500' />
                            </label>
                        </div>
                    </div>
                    {filteredUsers?.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center gap-4 mb-6 cursor-pointer hover:bg-gray-700 p-3 rounded-xl transition-colors"
                            onClick={() => handleRoomChange(user.id)}
                        >
                            <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-full" />
                            <div className="max-w-[70%]">
                                <p className="text-xl font-semibold">{user.name || "Admin"}</p>
                                <p className="text-sm text-gray-400 truncate">
                                    {currentMessages?.find((msg) => msg.senderId === user.id)?.content || "No messages yet"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="w-full lg:w-3/4 flex flex-col h-full bg-neutral-100 rounded-xl shadow-lg">
                <div className="flex flex-col gap-5 overflow-y-auto overflow-y flex-grow p-6 mt-20">
                    {loading ? (
                        <p className="text-center text-gray-500">Loading...</p>
                    ) : currentMessages?.length ? (
                        currentMessages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-3 ${msg.senderId === userProfile?.id ? "justify-end" : "justify-start"}`}
                            >
                                {/* Admin/Other User Avatar */}
                                {msg.senderId !== userProfile?.id && (
                                    <img
                                        src={allUser?.find((usr) => usr.id === msg.senderId)?.avatar || ""}
                                        alt="Admin"
                                        className="w-10 h-10 rounded-full"
                                    />
                                )}

                                {/* Message Container */}
                                <div
                                    className={`relative p-4 flex gap-4 rounded-lg max-w-[60%] text-sm shadow-md ${msg.senderId === userProfile?.id ? "bg-blue-600 text-white" : "bg-gray-600 text-white"}`}
                                >
                                    <p>{msg.content}</p>
                                    <div className="flex justify-end mt-2">
                                        <span className="text-xs text-gray-400">
                                            {new Date(msg.createdAt).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>

                                    {/* Bubble Tail */}
                                    <div
                                        className={`absolute w-0 h-0 border-t-[10px] border-t-transparent ${msg.senderId === userProfile?.id
                                                ? "border-l-[10px] border-l-blue-600 right-0 -mr-2"
                                                : "border-r-[10px] border-r-gray-600 left-0 -ml-2"
                                            }`}
                                    ></div>
                                </div>

                                {/* User Avatar */}
                                {msg.senderId === userProfile?.id && (
                                    <img src={userProfile?.avatar || ""} alt="User" className="w-10 h-10 rounded-full" />
                                )}
                            </div>


                        ))
                    ) : null}
                </div>

                {/* Input for sending messages */}
                <div className="relative flex items-center w-full">
                    <input
                        type="text"
                        placeholder="Send Message"
                        className="bg-primary border-2 border-l-0 border-gray-800 text-white w-full px-4 py-6 text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button
                        onClick={sendMessage}
                        className="absolute right-10 text-gray-400"
                    >
                        <span className="text-xl">➤</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
