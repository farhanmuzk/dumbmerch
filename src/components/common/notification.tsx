import React from 'react';

interface NotificationProps {
    message: string;
    onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
    return (
        <div className="fixed top-4 right-4 bg-red-600 text-white p-4 rounded shadow-md">
            <div className="flex justify-between items-center">
                <span>{message}</span>
                <button onClick={onClose} className="ml-4 text-xl">×</button>
            </div>
        </div>
    );
};

export default Notification;
