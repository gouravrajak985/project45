import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Product {
  _id: string;
  seller: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  status: string;
  productType: string;
  downloadLink?: string;
  isApproved: boolean;
  salesCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductsResponse {
  products: Product[];
  page: number;
  pages: number;
}

interface ProductState {
  products: Product[];
  product: Product | null;
  loading: boolean;
  error: string | null;
  page: number;
  pages: number;
  sellerProducts: Product[];
  adminProducts: Product[];
}

const initialState: ProductState = {
  products: [],
  product: null,
  loading: false,
  error: null,
  page: 1,
  pages: 1,
  sellerProducts: [],
  adminProducts: [],
};

// Fetch all products
export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (
    {
      keyword = '',
      pageNumber = 1,
      category = '',
    }: { keyword?: string; pageNumber?: number; category?: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.get<ProductsResponse>(
        `http://localhost:5000/api/products?keyword=${keyword}&pageNumber=${pageNumber}&category=${category}`
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Fetch single product
export const fetchProductDetails = createAsyncThunk(
  'product/fetchProductDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<Product>(
        `http://localhost:5000/api/products/${id}`
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Create product
export const createProduct = createAsyncThunk(
  'product/createProduct',
  async (productData: Partial<Product>, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as any;
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.user.token}`,
        },
      };

      const { data } = await axios.post<Product>(
        'http://localhost:5000/api/products',
        productData,
        config
      );
      
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Update product
export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async (
    { id, productData }: { id: string; productData: Partial<Product> },
    { getState, rejectWithValue }
  ) => {
    try {
      const { auth } = getState() as any;
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.user.token}`,
        },
      };

      const { data } = await axios.put<Product>(
        `http://localhost:5000/api/products/${id}`,
        productData,
        config
      );
      
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Delete product
export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as any;
      
      const config = {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      };

      await axios.delete(`http://localhost:5000/api/products/${id}`, config);
      
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Fetch seller products
export const fetchSellerProducts = createAsyncThunk(
  'product/fetchSellerProducts',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as any;
      
      const config = {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      };

      const { data } = await axios.get<Product[]>(
        'http://localhost:5000/api/products/seller',
        config
      );
      
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Approve product
export const approveProduct = createAsyncThunk(
  'product/approveProduct',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as any;
      
      const config = {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      };

      const { data } = await axios.put<Product>(
        `http://localhost:5000/api/products/${id}/approve`,
        {},
        config
      );
      
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Fetch admin products
export const fetchAdminProducts = createAsyncThunk(
  'product/fetchAdminProducts',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as any;
      
      const config = {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      };

      const { data } = await axios.get<Product[]>(
        'http://localhost:5000/api/products/admin',
        config
      );
      
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearProductDetails: (state) => {
      state.product = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<ProductsResponse>) => {
        state.loading = false;
        state.products = action.payload.products;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.sellerProducts = state.sellerProducts.filter(
          (product) => product._id !== action.payload
        );
        state.adminProducts = state.adminProducts.filter(
          (product) => product._id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSellerProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.sellerProducts = action.payload;
      })
      .addCase(fetchSellerProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(approveProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.adminProducts = state.adminProducts.map((product) =>
          product._id === action.payload._id ? action.payload : product
        );
      })
      .addCase(approveProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.adminProducts = action.payload;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProductDetails, clearError } = productSlice.actions;

export default productSlice.reducer;