import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  success: false,
  error: null,
  loading: false,
  message: "",
  orders: [],
  orderDetails: null,
  cancelledOrder: null,
};

const BASE_URL = import.meta.env.VITE_BASE_URL;
const userToken = (getState) => getState().Users?.loggedinUser?.token;

export const palceOrderAction = createAsyncThunk("userOrders/place", async (_, { getState, rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/order/create-order`, {}, {
      headers: { Authorization: `Bearer ${userToken(getState)}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const fetchOrdersAction = createAsyncThunk("userOrders/list", async (_, { getState, rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/order/get-orders-list`, {
      headers: { Authorization: `Bearer ${userToken(getState)}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const cancelOrdersAction = createAsyncThunk("userOrders/cancel", async ({ id }, { getState, rejectWithValue }) => {
  try {
    const response = await axios.put(`${BASE_URL}/order/cancel-order/${id}`, {}, {
      headers: { Authorization: `Bearer ${userToken(getState)}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

const userOrderSlice = createSlice({
  name: "userOrders",
  initialState,
  extraReducers: (builder) => {
    [palceOrderAction, fetchOrdersAction, cancelOrdersAction].forEach((actionName) => {
      builder.addCase(actionName.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
      builder.addCase(actionName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Request failed";
      });
    });
    builder.addCase(palceOrderAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.orderDetails = action.payload.data;
    });
    builder.addCase(fetchOrdersAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.orders = action.payload.orders || [];
    });
    builder.addCase(cancelOrdersAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.cancelledOrder = action.payload.order;
    });
  },
});

export default userOrderSlice.reducer;
