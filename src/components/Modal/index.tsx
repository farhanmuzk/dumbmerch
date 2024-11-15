import React from 'react';

interface InputField {
    name: string;
    value?: string;  // Make this optional
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
}


interface CustomModalProps {
    title: string;
    inputs: InputField[];
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    children?: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({
    title,
    inputs,
    isOpen,
    onClose,
    onSubmit,
    children, // Tambahkan children ke dalam destructuring props
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
            <div className="relative w-full max-w-md p-6 mx-auto bg-accent rounded-lg shadow-lg">
                <h2 className="text-lg font-bold text-neutral">{title}</h2>
                {inputs.map((input) => (
                    <input
                        key={input.name}
                        type={input.type || 'text'}
                        value={input.value}
                        onChange={input.onChange}
                        className="mt-2 w-full p-2 border rounded bg-transparent border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                        placeholder={input.placeholder}
                    />
                ))}
                {children} {/* Menampilkan children di dalam modal */}
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="mr-2 text-secondary font-bold border-2 border-secondary rounded px-4 py-2 mt-8"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSubmit}
                        className="bg-blue-600 text-white rounded px-4 py-2"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomModal;
