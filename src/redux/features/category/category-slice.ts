import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "./category-types";
import axiosInstance from '../../../utils/axiosInstance';

interface CategoryState {
  categories: Category[];
  error: string | null; // Menambahkan state untuk error
}

const initialState: CategoryState = {
  categories: [],
  error: null, // Inisialisasi error sebagai null
};

// Thunks
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    const response = await axiosInstance.get("/categories");
    return response.data as Category[];
  }
);

export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (categoryData: CreateCategoryDto) => {
    const response = await axiosInstance.post("/categories", categoryData);
    return response.data as Category;
  }
);

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({
    id,
    categoryData,
  }: {
    id: number;
    categoryData: UpdateCategoryDto;
  }) => {
    const response = await axiosInstance.put(`/categories/${id}`, categoryData);
    return response.data as Category;
  }
);

export const deleteCategory = createAsyncThunk(
    "categories/deleteCategory",
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/categories/${id}`);
            // Log the response data for debugging
            console.log("Delete response:", response.data); // Should be null or your success message
            return id; // Return the id to remove it from the state
        } catch (error: unknown) {
            console.error("Delete error:", error);
            return rejectWithValue(
                (error as { response: { data: { error: string } } }).response?.data?.error ||
                'Gagal menghapus kategori'
            );
        }
    }
);



// Slice
const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null; // Aksi untuk membersihkan error
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload; // Menyimpan kategori ke dalam state
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload); // Menambahkan kategori baru
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (category) => category.categoryId === action.payload.categoryId
        );
        if (index !== -1) {
          state.categories[index] = action.payload; // Memperbarui kategori
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        // Menghapus kategori dari state
        state.categories = state.categories.filter(
          (category) => category.categoryId !== action.payload
        );
        state.error = null; // Reset error jika penghapusan berhasil
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        // Menangani error jika penghapusan gagal
        state.error = action.payload as string; // Set error message
      });
  },
});

// Export actions dan reducer
export const { clearError } = categorySlice.actions; // Ekspor aksi untuk membersihkan error
export const categoryReducer = categorySlice.reducer;
