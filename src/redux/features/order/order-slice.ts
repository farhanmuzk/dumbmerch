import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../utils/axiosInstance';
import Cookies from 'js-cookie';
import {
  OrderDataSchema,
  OrderResponse,
  OrderData,
} from './order-types'; // Importing types and schemas

// Define the state interface
interface OrderState {
  order: OrderResponse | null;
  lastOrder: OrderData | null; // Add lastOrder to the statea
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: OrderState = {
  order: null,
  lastOrder: null, // Initialize lastOrder to null
  loading: false,
  error: null,
};

// Helper function to handle errors
const handleError = (error: any) => {
  return error?.response?.data?.error || 'An unknown error occurred';
};

export const getAllOrders = createAsyncThunk('order/getAllOrders', async () => {
  const token = Cookies.get('authToken'); // Get token from cookies
  const response = await axiosInstance.get('/orders/orders', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

// Async thunk for creating an order (POST /checkout)
export const createOrder = createAsyncThunk<OrderResponse, OrderData>(
  'order/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      // Validate orderData with Zod
      OrderDataSchema.parse(orderData);
      const token = Cookies.get('authToken'); // Get token from cookies
      const response = await axiosInstance.post('/orders/checkout', orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // Directly return the response data
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Async thunk for fetching an order (GET /:orderId)
export const fetchOrder = createAsyncThunk<OrderResponse, number>(
  'order/fetchOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const token = Cookies.get('authToken'); // Get token from cookies
      const response = await axiosInstance.get(`/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("API Response:", response.data); // Log the API response
      return response.data; // Directly return the response data
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Async thunk for updating order status (POST /midtrans-callback)
export const updateOrderStatus = createAsyncThunk<void, { orderId: number; status: string }>(
  'order/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const token = Cookies.get('authToken');
      await axiosInstance.post(`/orders/midtrans-callback`, { order_id: orderId, transaction_status: status }, { // Change to POST
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Async thunk for deleting an order (DELETE /:orderId)
export const deleteOrder = createAsyncThunk<void, number>(
  'order/deleteOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const token = Cookies.get('authToken');
      await axiosInstance.delete(`/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Create the slice
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder(state) {
      state.order = null;
      return initialState; // Reset state to initial
    },
    setLastOrder(state, action) { // Add the setLastOrder reducer
      state.lastOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateOrderStatus.fulfilled, (state) => {
        state.order = { ...state.order, status: 'PAID' } as OrderResponse & { status: string };
      })
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state) => {
        state.loading = false;
        state.order = null; // Clear order after deletion
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { resetOrder, setLastOrder } = orderSlice.actions; // Export setLastOrder
export const orderReducer = orderSlice.reducer;
