import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface OrderItem {
  title: string;
  qty: number;
  image: string;
  price: number;
  product: string;
  productType: string;
  downloadLink?: string;
  seller: string;
}

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface PaymentResult {
  id: string;
  status: string;
  update_time: string;
  email_address: string;
}

interface Order {
  _id: string;
  user: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentResult?: PaymentResult;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  trackingNumber?: string;
  shippingStatus: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderState {
  orders: Order[];
  order: Order | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  sellerOrders: Order[];
}

const initialState: OrderState = {
  orders: [],
  order: null,
  loading: false,
  error: null,
  success: false,
  sellerOrders: [],
};

// Create order
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (order: Partial<Order>, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as any;
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.user.token}`,
        },
      };

      const { data } = await axios.post<Order>(
        'http://localhost:5000/api/orders',
        order,
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

// Get order details
export const getOrderDetails = createAsyncThunk(
  'order/getOrderDetails',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as any;
      
      const config = {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      };

      const { data } = await axios.get<Order>(
        `http://localhost:5000/api/orders/${id}`,
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

// Pay order
export const payOrder = createAsyncThunk(
  'order/payOrder',
  async (
    { id, paymentResult }: { id: string; paymentResult: PaymentResult },
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

      const { data } = await axios.put<Order>(
        `http://localhost:5000/api/orders/${id}/pay`,
        paymentResult,
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

// Deliver order
export const deliverOrder = createAsyncThunk(
  'order/deliverOrder',
  async (
    { id, trackingNumber }: { id: string; trackingNumber?: string },
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

      const { data } = await axios.put<Order>(
        `http://localhost:5000/api/orders/${id}/deliver`,
        { trackingNumber },
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

// Update shipping status
export const updateShippingStatus = createAsyncThunk(
  'order/updateShippingStatus',
  async (
    {
      id,
      shippingStatus,
      trackingNumber,
    }: { id: string; shippingStatus: string; trackingNumber?: string },
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

      const { data } = await axios.put<Order>(
        `http://localhost:5000/api/orders/${id}/shipping`,
        { shippingStatus, trackingNumber },
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

// Get my orders
export const listMyOrders = createAsyncThunk(
  'order/listMyOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as any;
      
      const config = {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      };

      const { data } = await axios.get<Order[]>(
        'http://localhost:5000/api/orders/myorders',
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

// Get seller orders
export const listSellerOrders = createAsyncThunk(
  'order/listSellerOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as any;
      
      const config = {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      };

      const { data } = await axios.get<Order[]>(
        'http://localhost:5000/api/orders/sellerorders',
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

// Get all orders (admin)
export const listOrders = createAsyncThunk(
  'order/listOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as any;
      
      const config = {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      };

      const { data } = await axios.get<Order[]>(
        'http://localhost:5000/api/orders',
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

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.success = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(payOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(payOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(payOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deliverOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deliverOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(deliverOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateShippingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShippingStatus.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.order = action.payload;
        state.sellerOrders = state.sellerOrders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
      })
      .addCase(updateShippingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(listMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listMyOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(listMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(listSellerOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listSellerOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false;
        state.sellerOrders = action.payload;
      })
      .addCase(listSellerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(listOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(listOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearOrder, clearError } = orderSlice.actions;

export default orderSlice.reducer;