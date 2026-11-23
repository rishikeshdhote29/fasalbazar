import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  success: false,
  error: null,
  loading: false,
  message: "",
  products: [],
  product: null,
  cart: {},
  pagination: { total: 0, page: 1, limit: 10, hasMore: true },
};

const BASE_URL = import.meta.env.VITE_BASE_URL;
const userToken = (getState) => getState().Users?.loggedinUser?.token;

export const getAllProductsAction = createAsyncThunk(
  "userProducts/getAll",
  async ({ page, limit, sortBy } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/product/getAllProducts?page=${page || 1}&limit=${limit || 10}&sortBy=${sortBy || "newest"}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const searchProductsAction = createAsyncThunk("userProducts/search", async ({ query }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/product/search?q=${query}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const fetchProductDetailsAction = createAsyncThunk("userProducts/details", async ({ id }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/product/${id}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const fetchCartAction = createAsyncThunk("userProducts/fetch-cart", async (_, { getState, rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/cart/get-cart`, {
      headers: { Authorization: `Bearer ${userToken(getState)}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const removeFromCartAction = createAsyncThunk("userProducts/remove-cart", async ({ id }, { getState, rejectWithValue }) => {
  try {
    const response = await axios.put(`${BASE_URL}/cart/delete-form-cart/${id}`, {}, {
      headers: { Authorization: `Bearer ${userToken(getState)}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

const userProductSlice = createSlice({
  name: "userProducts",
  initialState,
  reducers: {
    clearUserProductState: () => initialState,
  },
  extraReducers: (builder) => {
    const trackedActions = [getAllProductsAction, searchProductsAction, fetchProductDetailsAction, fetchCartAction, removeFromCartAction];
    trackedActions.forEach((actionName) => {
      builder.addCase(actionName.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
      builder.addCase(actionName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Request failed";
      });
    });

    builder.addCase(getAllProductsAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      const incoming = Array.isArray(action.payload.products) ? action.payload.products : [];
      const page = action.meta.arg?.page || 1;
      state.products = page > 1 ? [...state.products, ...incoming] : incoming;
      state.pagination = action.payload.pagination || state.pagination;
    });
    builder.addCase(searchProductsAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.products = Array.isArray(action.payload.products) ? action.payload.products : [];
    });
    builder.addCase(fetchProductDetailsAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.product = action.payload.product;
    });
    builder.addCase(fetchCartAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.cart = action.payload.cart || {};
    });
    builder.addCase(removeFromCartAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.cart = action.payload.cart || state.cart;
    });
  },
});

export const { clearUserProductState } = userProductSlice.actions;
export default userProductSlice.reducer;
