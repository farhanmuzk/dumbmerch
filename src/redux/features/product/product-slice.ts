// src/features/product/productSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../../utils/axiosInstance';
import { Product } from './product-types';

interface ProductState {
  products: Product[];
  loading: boolean;
  error?: string;
}

const initialState: ProductState = {
  products: [],
  loading: false,
};

// Fetch all products
export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
  const response = await axiosInstance.get('/products');
  return response.data;
});
// Create new product
export const createProduct = createAsyncThunk('products/create', async (formData: FormData) => {
    const response = await axiosInstance.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
});

export const updateProduct = createAsyncThunk('products/update', async (formData: FormData) => {
    const response = await axiosInstance.put(`/products/${formData.get('productId')}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
});



// Delete product
export const deleteProduct = createAsyncThunk('products/delete', async (productId: number) => {
  await axiosInstance.delete(`/products/${productId}`);
  return productId;
});

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.products.push(action.payload);
        state.loading = false;
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        const index = state.products.findIndex(product => product.productId === action.payload.productId);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<number>) => {
        state.products = state.products.filter((product) => product.productId !== action.payload);
        state.loading = false;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export const productReducer = productSlice.reducer;
