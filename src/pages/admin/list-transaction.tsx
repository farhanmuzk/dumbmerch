import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../../redux/features/order/order-slice";
import Navbar from "../../components/Navbar/Navbar";
import { AppDispatch, RootState } from "../../redux/store";
import { Transaction } from "../../redux/features/order/order-types";

const ListTransaction = () => {
    const dispatch: AppDispatch = useDispatch();

    // Select orders from the Redux store
    const { order, loading, error } = useSelector((state: RootState) => state.order);

    // Fetch orders when the component is mounted
    useEffect(() => {
        dispatch(getAllOrders());
    }, [dispatch]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='w-full h-full bg-primary'>
            <Navbar />
            <div className="mx-4 py-4 md:mx-10">
                <div className='flex justify-between border-b border-gray-700 items-center'>
                    <div className='pb-4'>
                        <h1 className='text-4xl text-white font-semibold'>List Transaction</h1>
                        <p className='text-gray-400 w-3/4'>This is the list of transaction that has been made by users</p>
                    </div>
                </div>
                <table className="min-w-full bg-transparent border-2 border-gray-700 shadow-lg my-2">
                    <thead>
                        <tr className="bg-gray-800 text-gray-300 uppercase text-lg leading-normal rounded-t-lg">
                            <th className="py-4 px-4 text-center rounded-tl-lg">
                                <input type="checkbox" value="" className='w-4 h-4' />
                            </th>
                            <th className="py-4 px-2 text-center">User Name</th>
                            <th className="py-4 px-4 text-center">Product Items</th>
                            <th className="py-4 px-4 text-center">Total Price</th>
                            <th className="py-4 px-4 text-center">Time Purchased</th>
                            <th className="py-4 px-4 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-300 text-lg font-light">
                    {order?.map((transaction: Transaction) => (
                            <tr key={transaction.orderId} className="border-b border-gray-700 hover:bg-gray-600">
                                <td className="py-4 px-2 text-center">
                                    <input type="checkbox" className='w-4 h-4' />
                                </td>
                                <td className="px-4 py-4 text-center">{transaction.user.name}</td>
                                <td className="relative px-4 py-4 text-center flex justify-center">
                                    <div className="w-fit hover:bg-gray-800 rounded flex justify-center items-center">
                                        <div className="bg-gray-800 text-white px-2 py-1 rounded-l-lg">3</div>
                                        <div className="bg-gray-700 text-white px-2 py-1 rounded-r-lg">Items</div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-center">
                                    {`Rp.${transaction.totalAmount.toLocaleString()}`}
                                </td>
                                <td className="px-4 py-4 text-center">
                                    {new Date(transaction.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <span className="px-4 py-2 rounded-lg border-2 border-green-500 bg-[#4fde3c29] text-white">
                                        {transaction.paymentUrl === "PAID" ? "Success" : "Pending"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListTransaction;
