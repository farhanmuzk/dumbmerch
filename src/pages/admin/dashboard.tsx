import Navbar from '../../components/Navbar/Navbar';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { GlobalIcons } from '../../components/common/Icon/GlobalIcons';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { useEffect } from 'react';
import { fetchAllUsers } from '../../redux/features/user/user-slice';
import { getAllOrders } from '../../redux/features/order/order-slice';
import { fetchProducts } from '../../redux/features/product/product-slice';
import { OrderData } from '../../redux/features/order/order-types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const Dashboard: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { room } = useSelector((state: RootState) => state.chat);
    const allUsers = useSelector((state: RootState) => state.profile.allUsers);
    const orders: OrderData[] | null = useSelector((state: RootState) => state.order.order);
    const products = useSelector((state: RootState) => state.products.products);
    const messages = useSelector((state: RootState) => state.chat.messages);
    const userProfile = useSelector((state: RootState) => state.profile.data);
    console.log(orders, 'APA AJA AYAA');

    const totalOrders = orders ? orders.length : 0;
    const totalUsers = allUsers ? allUsers.length : 0;
    const totalProducts = products ? products.length : 0;
    const currentRoomId = room?.[0]?.id;

    useEffect(() => {
        dispatch(fetchAllUsers());
        dispatch(getAllOrders());
        dispatch(fetchProducts());
    }, [dispatch]);

    const filteredUsers = allUsers?.filter((user) => {
        if (userProfile?.role === 'USER') {
            return user.role === 'ADMIN';
        }
        return user.role === 'USER';
    });

    const currentMessages = Array.isArray(messages)
        ? messages.filter((msg) => msg.roomId === currentRoomId)
        : [];

    const orderData = {
        labels: ['Paid', 'Pending', 'Failed'],
        datasets: [
            {
                label: 'Orders by Status',
                data: [
                    (orders ?? []).filter(order => order.paymentUrl === 'PAID').length,
                    (orders ?? []).filter(order => order.paymentUrl === 'PENDING').length,
                    (orders ?? []).filter(order => order.paymentUrl === 'FAILED').length,
                ],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 205, 86, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                ],
                borderColor: 'white',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="w-full h-full bg-primary">
            <Navbar />
            <div className="p-10 w-full min-h-screen text-neutral">
                <div className='flex justify-between'>
                    <div>
                        <p className='text-white text-xl'>Hello, admin</p>
                        <h1 className='text-4xl font-bold text-white'>Dashboard Admin</h1>
                    </div>
                </div>
                <div className='w-full flex mt-4 gap-4'>
                    <div className='w-[75%]'>
                        <div className='w-full flex gap-4'>
                            <div className='w-full h-fit flex items-center gap-6 bg-[#22222296] shadow-md rounded-lg p-4'>
                                <div className='bg-[#e45f5f52] shadow-md rounded-lg p-4'>
                                    <GlobalIcons.Users className='text-secondary w-8 h-8' />
                                </div>
                                <div>
                                    <h1 className='text-3xl text-white'>{totalUsers}</h1>
                                    <h3 className='text-gray-600 text-sm'>Total Users</h3>
                                </div>
                            </div>
                            <div className='w-full h-fit flex justify-between items-center gap-6 bg-[#22222296] shadow-md rounded-lg p-4'>
                                <div className='flex gap-4'>
                                    <div className='bg-[#e45f5f52] shadow-md rounded-lg p-4'>
                                        <GlobalIcons.Wallet className='text-secondary w-8 h-8' />
                                    </div>
                                    <div>
                                        <h1 className='text-3xl text-white'>{totalOrders}</h1>
                                        <h3 className='text-gray-600 text-sm'>Total Transaction</h3>
                                    </div>
                                </div>
                                <div className='p-2 rounded-full hover:bg-[#e45f5f52]'>
                                    <Link to="/admin/transaction">
                                        <GlobalIcons.ChevronRight className='text-secondary hover:w-7 hover:h-7' />
                                    </Link>
                                </div>
                            </div>
                            <div className='w-full h-fit flex justify-between items-center gap-6 bg-[#22222296] shadow-md rounded-lg p-4'>
                                <div className='flex gap-4'>
                                    <div className='bg-[#e45f5f52] shadow-md rounded-lg p-4'>
                                        <GlobalIcons.Package className='text-secondary w-8 h-8' />
                                    </div>
                                    <div>
                                        <h1 className='text-3xl text-white'>{totalProducts}</h1>
                                        <h3 className='text-gray-600 text-sm'>Total Product</h3>
                                    </div>
                                </div>
                                <div className='ml-8 p-2 rounded-full hover:bg-[#e45f5f52]'>
                                    <Link to="/admin/product">
                                        <GlobalIcons.ChevronRight className='text-secondary hover:w-7 hover:h-7' />
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="flex flex-col justify-center items-center md:col-span-2 p-6 h-[400px]">
                                <Bar
                                    data={orderData}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: 'Order Status Overview',
                                                padding: {
                                                    top: 10,
                                                    bottom: 30,
                                                },
                                                font: {
                                                    size: 18,
                                                },
                                            },
                                            legend: {
                                                position: 'top',
                                                labels: {
                                                    color: 'white',
                                                },
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='w-[25%]'>
                        <div className='bg-[#22222296] w-full h-fit pb-4 rounded-xl'>
                            <div className='flex justify-between items-center p-4'>
                                <div>
                                    <h1 className='text-xl text-white font-bold'>Complain User</h1>
                                    <p>You have <span className='text-secondary'>3 complain</span> today</p>
                                </div>
                                <Link to={'/admin/complain'}>
                                    <GlobalIcons.DetailList className='text-neutral hover:text-secondary cursor-pointer w-8 h-8' />
                                </Link>
                            </div>
                            <div className='mt-2 p-2'>
                                <Link to={'/admin/complain'}>
                                    {filteredUsers?.slice(0, 5).map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center gap-4 cursor-pointer hover:bg-gray-700 p-3 rounded-xl transition-colors"
                                        >
                                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                                            <div className="max-w-[70%]">
                                                <p className="text-lg font-semibold">{user.name || "Admin"}</p>
                                                <p className="text-xs text-gray-400 truncate">
                                                    {currentMessages?.find((msg) => msg.senderId === user.id)?.content || "No messages yet"}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
