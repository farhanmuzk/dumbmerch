import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { CartState, CartItem } from "./cart-types";
import axiosInstance from "../../../utils/axiosInstance";
import { AxiosError } from "axios";

interface FetchCartParams {
  userId: number;
}

const initialState: CartState = {
  cartId: null,
  cart: {
    cartItems: [],
  },
  status: "idle",
  error: null,
};

// Helper function to extract error message
const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError && error.response) {
    return error.response.data?.message || "An error occurred";
  }
  return "An unknown error occurred";
};

// Async thunk for fetching cart data
export const fetchCart = createAsyncThunk<
  { cartItems: CartItem[]; cartId: number | null }, // Updated return type
  FetchCartParams
>("cart/fetchCart", async ({ userId }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/carts/${userId}`);
    return {
      cartItems: response.data.cartItems, // Ensure this is the correct structure
      cartId: response.data.cartId, // Ensure this is the correct structure
    };
  } catch (error: unknown) {
    console.error("Fetch cart error:", error);
    return rejectWithValue(getErrorMessage(error));
  }
});

// Async thunk for adding item to cart
export const addToCartAsync = createAsyncThunk<
  CartItem,
  { productId: number; quantity: number }
>("cart/addToCart", async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/carts/add`, {
      productId,
      quantity,
    });
    return response.data; // Assuming this returns the CartItem structure
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error));
  }
});

// Async thunk for updating item quantity in cart
export const updateCartItemQuantity = createAsyncThunk<
  CartItem,
  { productId: number; quantity: number }
>(
  "cart/updateItemQuantity",
  async ({ productId, quantity }, { dispatch, rejectWithValue }) => {
    // Optimistically update the quantity
    dispatch(cartSlice.actions.optimisticUpdateItem({ productId, quantity }));
    try {
      const response = await axiosInstance.put(`/carts/update`, {
        productId,
        quantity,
      });
      return response.data; // Assuming this returns the updated CartItem
    } catch (error) {
      console.error("Update cart item error:", error);
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Async thunk for removing item from cart
export const removeCartItem = createAsyncThunk<number, number>(
  "cart/removeCartItem",
  async (productId, { dispatch, rejectWithValue }) => {
    // Optimistically remove the item from the cart
    dispatch(cartSlice.actions.optimisticRemoveItem(productId));
    try {
      await axiosInstance.delete(`/carts/remove/${productId}`);
      return productId; // Keep it for logging or other purposes
    } catch (error: unknown) {
      console.error("Remove cart item error:", error);
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    optimisticUpdateItem(
      state,
      action: PayloadAction<{ productId: number; quantity: number }>
    ) {
      const { productId, quantity } = action.payload;
      const item = state.cart.cartItems.find(
        (item) => item.productId === productId
      );
      if (item) {
        item.quantity = quantity; // Update quantity optimistically
      } else {
        // If the item doesn't exist, consider adding it to the cart
        state.cart.cartItems.push({
          cartId: 0, // You may need to set this appropriately
          cartItemId: Math.random(), // Replace with your ID generation logic
          productId,
          quantity,
          userId: 0, // Set this to the appropriate userId
          product: {
            productName: "", // Default values or update as needed
            productPrice: 0,
            productDescription: "",
            productMedia: [],
          },
        } as CartItem);
      }
    },
    optimisticRemoveItem(state, action: PayloadAction<number>) {
      const productId = action.payload;
      state.cart.cartItems = state.cart.cartItems.filter(
        (item) => item.productId !== productId
      );
    },
    clearCart(state) {
      state.cart.cartItems = []; // Clear the cart items
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        addToCartAsync.fulfilled,
        (state, action: PayloadAction<CartItem>) => {
          state.status = "succeeded";
          state.cart.cartItems.push(action.payload); // Append the new item
        }
      )
      .addCase(
        fetchCart.fulfilled,
        (
          state,
          action: PayloadAction<{
            cartItems: CartItem[];
            cartId: number | null;
          }>
        ) => {
          state.cart.cartItems = action.payload.cartItems;
          state.cartId = action.payload.cartId ?? 0; // Use 0 or some default value instead of null
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string | null;
      })
      .addCase(
        updateCartItemQuantity.fulfilled,
        (state, action: PayloadAction<CartItem>) => {
          state.status = "succeeded";
          const updatedItem = action.payload;
          const index = state.cart.cartItems.findIndex(
            (item) => item.productId === updatedItem.productId
          );
          if (index !== -1) {
            state.cart.cartItems[index] = updatedItem; // Replace the updated item
          }
        }
      )
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string | null;
      })
      .addCase(
        removeCartItem.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.status = "succeeded";
          state.cart.cartItems = state.cart.cartItems.filter(
            (item) => item.productId !== action.payload
          );
        }
      )
      .addCase(removeCartItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string | null;
      });
  },
});

export const cartReducer = cartSlice.reducer;
export const { clearCart } = cartSlice.actions;

