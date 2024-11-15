import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../../components/Navbar/Navbar';
import { GlobalIcons } from '../../components/common/Icon/GlobalIcons';
import { fetchCart, updateCartItemQuantity, removeCartItem } from '../../redux/features/cart/cart-slice';
import { AppDispatch, RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import { createOrder, setLastOrder } from '../../redux/features/order/order-slice';
import { v4 as uuidv4 } from 'uuid';

// Komponen Modal Konfirmasi
const ConfirmationModal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h2 className="text-lg font-semibold mb-4">Hapus Item</h2>
                <p>Apakah Anda yakin ingin menghapus item ini dari cart?</p>
                <div className="mt-6 flex justify-center gap-4">
                    <button onClick={onConfirm} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Ya</button>
                    <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Tidak</button>
                </div>
            </div>
        </div>
    );
};

const Cart: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const userId = useSelector((state: RootState) => state.auth.user?.id);
    const cart = useSelector((state: RootState) => state.cart.cart);
    const cartStatus = useSelector((state: RootState) => state.cart.status);
    const error = useSelector((state: RootState) => state.cart.error);
    const cartId = useSelector((state: RootState) => state.cart.cartId);
    // const lastOrder = useSelector((state: RootState) => state.order.lastOrder);
    const [isProcessing, setIsProcessing] = useState(false);// Pindahkan ini ke atas

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    useEffect(() => {
        if (userId) {
            dispatch(fetchCart({ userId: Number(userId) }));
        }
    }, [dispatch, userId]);

    const cartItems = cart?.cartItems || [];
    console.log(cartItems);
    const subtotal = cartItems.reduce((total, item) => total + item.product.productPrice * item.quantity, 0);

    const total = subtotal;

    const updateQuantity = (productId: number, change: number) => {
        const currentQuantity = cartItems.find(item => item.productId === productId)?.quantity || 0;
        const newQuantity = currentQuantity + change;

        if (newQuantity >= 1) {
            dispatch(updateCartItemQuantity({ productId, quantity: newQuantity }));
        }
    };

    const handleRemoveItem = (productId: number) => {
        setIsModalOpen(true);
        setItemToDelete(productId);
    };

    const confirmRemoveItem = () => {
        if (itemToDelete !== null) {
            dispatch(removeCartItem(itemToDelete));
        }
        setIsModalOpen(false);
        setItemToDelete(null);
    };

    const handleCheckout = () => {
        if (isProcessing) return;  // Prevent multiple submissions

        setIsProcessing(true);

        if (cartItems.length === 0) {
            alert("Keranjang Anda kosong. Silakan tambahkan barang untuk checkout.");
            setIsProcessing(false);
            return;
        }

        const selectedItems = cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
        }));

        const orderData = {
            orderId: uuidv4(),
            cartId: cartId || 0,
            products: selectedItems,
        };

        dispatch(createOrder(orderData))
            .then((result) => {
                setIsProcessing(false);
                if (createOrder.fulfilled.match(result)) {
                    const order = result.payload.order;
                    if (order && order.orderId) {
                        dispatch(setLastOrder(order));
                        navigate(`/user/checkout/${order.orderId}`);
                    }
                } else {
                    console.error("Gagal membuat order:", result.error);
                }
            });
    };

    return (
        <div className='bg-primary w-screen h-screen flex flex-col'>
            <Navbar />
            <div className="flex mx-4 py-4 md:mx-10 gap-20">
                <div className="w-[70%] mt-6 p-4">
                    <div className='text-white mb-4'>
                        <h1 className='text-2xl font-bold'>Summary Order</h1>
                        <p className='text-gray-500'>Your order history will be shown here</p>
                    </div>
                    <div className="relative">
                        <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#121212] to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#121212] to-transparent z-10 pointer-events-none"></div>
                        <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(60vh-50px)] w-full p-4">
                            {cartStatus === 'loading' ? (
                                <p className="text-white">Loading...</p>
                            ) : error ? (
                                <p className="text-white">{error}</p>
                            ) : cartItems.length > 0 ? (
                                cartItems.map((cartItem) => (
                                    <div key={cartItem.cartItemId} className="w-full flex gap-4">
                                        <div className="relative flex w-full gap-4 p-4 border border-gray-700 rounded-lg items-center bg-primary">
                                            <button onClick={() => handleRemoveItem(cartItem.productId)} className='absolute top-2 left-fit right-2 h-10 text-white cursor-pointer hover:text-red-500'>
                                                <GlobalIcons.Remove width={20} className="text-gray-400 hover:text-white" />
                                            </button>
                                            <img
                                                src={cartItem.product.productMedia?.[0]?.mediaUrl}
                                                alt={cartItem.product.productName}
                                                width={80}
                                                height={80}
                                                className="rounded-lg"
                                            />
                                            <div className="flex-1 space-y-2">
                                                <h1 className="text-lg text-white font-semibold">{cartItem.product.productName}</h1>
                                                <div className="flex justify-between items-end">
                                                    <p className="text-md font-bold text-white">Rp. {cartItem.product.productPrice.toLocaleString()}</p>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => updateQuantity(cartItem.productId, -1)}
                                                            className="border-2 border-gray-700 p-2 rounded-lg bg-primary hover:bg-gray-700"
                                                            disabled={cartItem.quantity <= 1}
                                                        >
                                                            <GlobalIcons.Minus width={16} className="text-gray-400" />
                                                        </button>
                                                        <p className="text-white">{cartItem.quantity}</p>
                                                        <button
                                                            onClick={() => updateQuantity(cartItem.productId, 1)}
                                                            className="border-2 border-gray-700 p-2 rounded-lg bg-primary hover:bg-gray-700"
                                                        >
                                                            <GlobalIcons.Plus width={16} className="text-gray-400" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-white">Your cart is empty.</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="w-[30%] mt-6 p-4">
                    <div className='text-white mb-4'>
                        <h1 className='text-2xl font-bold'>Checkout</h1>
                    </div>
                    <div className="bg-primary rounded-lg p-4 border border-gray-700">
                        <h2 className="text-lg text-white mb-2">Order Summary</h2>
                        <div className="flex justify-between">
                            <p className="text-white">Subtotal:</p>
                            <p className="text-white">Rp. {subtotal.toLocaleString()}</p>
                        </div>
                        <div className="flex justify-between mt-2">
                            <p className="text-white">Total:</p>
                            <p className="text-white">Rp. {total.toLocaleString()}</p>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            </div>
            <ConfirmationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={confirmRemoveItem} />
        </div>
    );
};

export default Cart;
