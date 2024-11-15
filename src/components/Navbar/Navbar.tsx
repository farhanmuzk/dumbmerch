import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/features/auth/auth-slice';
import Cookies from 'js-cookie';
import NavbarItem from './NavbarItem';
import { GlobalIcons } from '../common/Icon/GlobalIcons';
import Logo from '../common/Logo/logo-static';
import { fetchUserProfile } from '../../redux/features/user/user-slice';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchCart } from '../../redux/features/cart/cart-slice';
import { CartState, CartItem } from '../../redux/features/cart/cart-types';

const Navbar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userRole, setUserRole] = useState<'USER' | 'ADMIN' | null>(null);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const { data: userProfile } = useSelector((state: RootState) => state.profile);

    useEffect(() => {
        const role = Cookies.get('userRole');
        setUserRole(role === 'ADMIN' ? 'ADMIN' : 'USER');
        dispatch(fetchUserProfile());
    }, [dispatch]);

    useEffect(() => {
        if (userProfile && userProfile.id) {
            const fetchCartData = async () => {
                const response = await dispatch(fetchCart({ userId: userProfile.id }));
                if (fetchCart.fulfilled.match(response)) {
                    const cartData = response.payload as CartState;
                    const total = cartData.cartItems.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);
                    setTotalQuantity(total);
                } else {
                    console.error('Failed to fetch cart:', response.error.message);
                }
            };
            fetchCartData();
        }
    }, [dispatch, userProfile]);

    const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
    const closeDropdown = () => setIsDropdownOpen(false);

    const handleLogout = () => {
        dispatch(logout());
        Cookies.remove('authToken');
        Cookies.remove('userRole');
        closeDropdown();
        navigate('/');
    };

    const userLinks = (
        <>
            <NavbarItem
                type="link"
                href="/user/home"
                label="Home"
                className={location.pathname === '/user/home' ? 'text-red-500' : ''}
            />
            <div className="relative">
                <NavbarItem
                    type="link"
                    href="/user/complain"
                    label="Complain"
                    className={location.pathname === '/user/complain' ? 'text-red-500' : ''}
                />
            </div>
        </>
    );

    const adminLinks = (
        <>
            <NavbarItem
                type="link"
                href="/admin/dashboard"
                label="Dashboard"
                className={location.pathname === '/admin/dashboard' ? 'text-secondary' : ''}
            />
            <NavbarItem
                type="link"
                href="/admin/product"
                label="Product"
                className={location.pathname === '/admin/product' ? 'text-secondary' : ''}
            />
            <NavbarItem
                type="link"
                href="/admin/transaction"
                label="Transaction"
                className={location.pathname === '/admin/transaction' ? 'text-secondary' : ''}
            />
            <NavbarItem
                type="link"
                href="/admin/category"
                label="Category"
                className={location.pathname === '/admin/category' ? 'text-secondary' : ''}
            />
            <div className="relative">
                <NavbarItem
                    type="link"
                    href="/admin/complain"
                    label="Complain"
                    className={location.pathname === '/admin/complain' ? 'text-secondary' : ''}
                />
            </div>
        </>
    );

    const sharedProfileLink = (
        <Link to={userRole === 'USER' ? '/user/profile' : '/admin/profile'}>
            <div className="p-2 w-full max-w-sm">
                <p className="text-xs font-bold font-poppins text-neutral p-2">Your Account</p>
                <div className="w-full flex items-center gap-4 text-white hover:bg-accent p-2 rounded-lg">
                    <img src={userProfile?.avatar} alt={userProfile?.name} className="w-10 rounded-lg m-1" />
                    <div className="max-fit">
                        <p className="text-sm font-poppins text-neutral w-fit">{userProfile?.name}</p>
                    <p className="text-xs font-poppins text-neutral max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                            {userProfile?.email}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );

    const icons = userRole === 'USER' ? (
        <>
            <div className='flex gap-2'>
                <Link to='/user/whishlist'>
                    <NavbarItem
                        type="icon"
                        icon={<GlobalIcons.Like className="tooltip w-12 h-12 text-white p-3 ml-2 border-2 rounded-lg hover:text-secondary cursor-pointer transition-transform duration-300" />}
                    />
                </Link>
            </div>
            <div className='flex gap-2 relative'>
                <Link to='/user/cart'>
                    <NavbarItem
                        type="icon"
                        icon={<GlobalIcons.ShoppingCart className="tooltip w-12 h-12 text-white p-3 border-2 rounded-lg hover:text-secondary cursor-pointer transition-transform duration-300" />}
                    />
                    <div className="absolute top-0 right-0 w-5 h-5 flex items-center justify-center text-white text-xs bg-secondary rounded-full glow-border-animation z-50">
                        {totalQuantity}
                    </div>
                </Link>
            </div>
        </>
    ) : null;

    const profileImageUrl = userProfile?.avatar || 'https://via.placeholder.com/150';
    const profileName = userProfile?.name || 'Guest';

    return (
        <nav className="text-black bg-transparent">
            <div className="mx-4 py-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <Logo width="35" height="35" />
                        <div className="hidden sm:flex sm:items-baseline sm:ml-6">
                            {userRole === 'USER' ? userLinks : adminLinks}
                        </div>
                    </div>

                    <div className="bg-transparent flex items-center justify-end gap-2 w-full ml-10">
                        {icons}
                        <div className="relative">
                            <div onClick={toggleDropdown} className="bg-transparent w-full px-2 border-2 border-white text-white flex items-center space-x-2 transition-colors duration-300 rounded-lg cursor-pointer">
                                <img src={profileImageUrl} alt={profileName} className='w-10 rounded-lg m-1' />
                                <p className="text-sm russo-one-regular w-full">{profileName}</p>
                                <GlobalIcons.ChevronDown className="w-6 h-6 text-white" />
                            </div>
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-[240px] bg-primary opacity-95 rounded-md shadow-lg z-10">
                                    {sharedProfileLink}
                                    <div className="py-2 border-t border-gray-200">
                                        <button
                                            className="block px-4 py-2 text-sm text-neutral hover:text-gray-700 hover:bg-gray-100 w-full text-left"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
