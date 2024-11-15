import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteOrder, fetchOrder, updateOrderStatus } from '../../redux/features/order/order-slice';
import { AppDispatch, RootState } from '../../redux/store';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { GlobalIcons } from '../../components/common/Icon/GlobalIcons';

const Checkout: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { orderId } = useParams<{ orderId: string }>();
    const order = useSelector((state: RootState) => state.order.order);
    const cart = useSelector((state: RootState) => state.cart.cart);

    const [countdown, setCountdown] = useState<string>("");

    useEffect(() => {
        if (orderId) {
            const fetchData = async () => {
                try {
                    await dispatch(fetchOrder(Number(orderId)));
                } catch (err) {
                    console.error("Error fetching order:", err);
                }
            };
            fetchData();
        }
    }, [dispatch, orderId]);

    useEffect(() => {
        if (order && order.order && order.order.createdAt) {
            const createdAt = new Date(order.order.createdAt);
            if (isNaN(createdAt.getTime())) {
                console.error("Invalid createdAt date:", order.order.createdAt);
                return;
            }

            const endTime = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
            const startTimeInSeconds = 23 * 60 * 60 + 57 * 60 + 44;
            let timeElapsed = 0;

            const updateCountdown = () => {
                const now = new Date();
                const timeLeft = endTime.getTime() - now.getTime() - timeElapsed * 1000;

                if (timeLeft <= 0) {
                    setCountdown("00:00:00");
                    clearInterval(interval);
                } else {
                    timeElapsed += 1;

                    const remainingTime = startTimeInSeconds - timeElapsed;
                    if (remainingTime < 0) {
                        setCountdown("00:00:00");
                        clearInterval(interval);
                    } else {
                        const hours = Math.floor((remainingTime / 3600) % 24);
                        const minutes = Math.floor((remainingTime % 3600) / 60);
                        const seconds = remainingTime % 60;

                        setCountdown(
                            `${String(hours).padStart(2, "0")} : ${String(minutes).padStart(2, "0")} : ${String(seconds).padStart(2, "0")}`
                        );
                    }
                }
            };

            updateCountdown();
            const interval = setInterval(updateCountdown, 1000);

            return () => clearInterval(interval);
        } else {
            console.warn("Order or createdAt is missing.");
        }
    }, [order]);

    const handleDeleteOrder = async () => {
        const iDorder = order?.order.orderId;
        const confirmDelete = window.confirm("Are you sure you want to delete this order?");
        if (confirmDelete && iDorder) {
            try {
                await dispatch(deleteOrder(Number(iDorder)));
                navigate(-1);
            } catch (err) {
                console.error("Error deleting order:", err);
                alert("Failed to delete order. Please try again.");
            }
        } else {
            alert("Failed to delete order. Order ID not found.");
        }
    };

    const handleMidtransCallback = async (orderId: number, transactionStatus: string) => {
        if (transactionStatus === 'settlement') {
            try {
                await dispatch(updateOrderStatus({ orderId, status: 'PAID' })); // Ubah status menjadi 'PAID'
                alert("Order status updated successfully!");
                navigate('/success'); // Mengarahkan ke halaman success setelah status diperbarui
            } catch (err) {
                console.error("Error updating order status:", err);
                alert("Failed to update order status.");
            }
        } else {
            console.warn("Transaction status is not settlement:", transactionStatus);
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const orderIdParam = params.get('order_id');
        const statusCode = params.get('status_code');
        const transactionStatus = params.get('transaction_status');

        if (orderIdParam && order && orderIdParam === order.order.orderId.toString()) {
            if (statusCode === '200' && transactionStatus === 'settlement') {
                handleMidtransCallback(Number(orderIdParam), transactionStatus);
            } else {
                console.warn("Transaction was not successful:", statusCode, transactionStatus);
            }
        }
    }, [location, order]);

    if (!order) {
        return <p>No order found.</p>;
    }

    const cartItems = cart?.cartItems || [];
    const subtotal = cartItems.reduce((total, item) => total + item.product.productPrice * item.quantity, 0);

    return (
        <div className="bg-primary w-full min-h-screen flex flex-col">
            <div className="flex flex-col items-center w-full">
                <div className="flex flex-1 px-8 w-full">
                    <div className="flex-1 pr-8 p-4">
                        <div className="relative bg-primary h-full flex flex-col justify-between rounded-lg shadow-lg">
                            <div>
                                <div className='text-neutral'>
                                    <h1 className='text-3xl font-bold'>Order Summary</h1>
                                    <p>Your order has been placed. Please check your email for the order details.</p>
                                </div>
                                <div className='w-full overflow-y overflow-y-auto h-[calc(100vh-250px)]'>
                                    {cartItems.length > 0 ? (
                                        cartItems.map((cartItem) => (
                                            <div key={cartItem.cartItemId} className="flex gap-4 p-4">
                                                <img
                                                    src={cartItem.product.productMedia?.[0]?.mediaUrl}
                                                    alt={cartItem.product.productName}
                                                    width={80}
                                                    height={80}
                                                    className="rounded-lg object-cover"
                                                />
                                                <div className="flex-1 space-y-2">
                                                    <h1 className="text-lg text-neutral font-semibold">{cartItem.product.productName}</h1>
                                                    <p className='text-sm text-neutral font-semibold'>Quantity: <span className='font-bold'>{cartItem.quantity}</span></p>
                                                    <p className="text-md font-bold text-neutral">Rp. {cartItem.product.productPrice.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-red-500">Your cart is empty.</p>
                                    )}
                                </div>
                            </div>
                            <div className='absolute bottom-0 w-full flex justify-between border-t border-gray-200 p-4'>
                                <div className='text-neutral'>
                                    <p className='m-0 p-0'>Checkout Time :</p>
                                    <h1 className='text-2xl font-bold'>{countdown}</h1>
                                    <button className='flex items-center gap-1 flex-row text-sm font border border-gray-300 rounded-lg p-2 hover:bg-gray-200 hover:text-primary transition duration-200 mt-4' onClick={handleDeleteOrder}>
                                        <GlobalIcons.ChevronLeft width={20} height={20} />
                                        Continue Shopping
                                    </button>
                                </div>
                                <div className='w-[30%] text-right'>
                                    <div className='flex justify-between w-full text-neutral mb-2'>
                                        <h2 className='text-sm text-gray-500 pr-4'>Subtotal :</h2>
                                        <p className='font-bold text-neutral'>Rp. {subtotal.toLocaleString()}</p>
                                    </div>
                                    <div className='flex justify-between w-full text-neutral mb-2 border-b border-gray-300 pb-4'>
                                        <h2 className='text-sm text-gray-500 pr-4'>Shipping :</h2>
                                        <p className='font-bold text-neutral'>Rp. 0,00</p>
                                    </div>
                                    <div className='flex justify-between w-full text-neutral'>
                                        <h2 className='text-lg text-gray-500 pr-4'>Total :</h2>
                                        <p className='font-bold text-neutral'>Rp. {subtotal.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-[40%] h-screen">
                        {order.paymentUrl ? (
                            <iframe
                                src={order.paymentUrl}
                                className="w-full h-screen p-4 rounded-lg"
                                title="Midtrans Payment Gateway"
                            />
                        ) : (
                            <p className="text-red-500">Payment URL not available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
