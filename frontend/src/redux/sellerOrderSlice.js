import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  success: false,
  error: null,
  loading: false,
  message: "",
  orders: [],
  orderDetails: null,
};

const BASE_URL = import.meta.env.VITE_BASE_URL;
const sellerToken = (getState) => getState().Sellers?.loggedinSeller?.token;

export const fetchSellerOrdersAction = createAsyncThunk(
  "sellerOrders/list",
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/order/get-seller-orders-list`, {
        headers: { Authorization: `Bearer ${sellerToken(getState)}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const updateSellerOrderStatusAction = createAsyncThunk(
  "sellerOrders/status",
  async ({ id, status }, { getState, rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/order/update-order-status/${id}`, { status }, {
        headers: { Authorization: `Bearer ${sellerToken(getState)}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

const sellerOrderSlice = createSlice({
  name: "sellerOrders",
  initialState,
  extraReducers: (builder) => {
    [fetchSellerOrdersAction, updateSellerOrderStatusAction].forEach((actionName) => {
      builder.addCase(actionName.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
      builder.addCase(actionName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Request failed";
      });
    });
    builder.addCase(fetchSellerOrdersAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.orders = action.payload.orders || [];
    });
    builder.addCase(updateSellerOrderStatusAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.orderDetails = action.payload.order;
    });
  },
});

export default sellerOrderSlice.reducer;
