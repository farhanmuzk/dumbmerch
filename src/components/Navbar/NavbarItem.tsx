import React, {  } from 'react';

interface NavbarItemProps {
    type: 'link' | 'button' | 'icon' | 'dropdown';
    href?: string;
    label?: string;
    icon?: React.ReactNode;
    items?: string[][];
    className?: string; // Tambahkan className sebagai prop opsional
}

const NavbarItem: React.FC<NavbarItemProps> = ({ type, href, label, icon, className }) => {
    return (
        <>
            {type === 'link' && (
                <a
                    href={href}
                    className={`hover:text-red-500 px-3 py-2 rounded-md text-lg text-white font-medium ${className}`}
                >
                    {label}
                </a>
            )}
            {type === 'button' && (
                <button
                    className={`bg-black text-white font-semibold py-4 px-4 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 ${className}`
                }
                >
                    {label}
                </button>
            )}
            {type === 'icon' && <span className={`text-xl ${className}`}>{icon}</span>}
        </>
    );
};

export default NavbarItem;
