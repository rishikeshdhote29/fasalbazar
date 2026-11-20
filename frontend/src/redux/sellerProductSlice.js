import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  success: false,
  error: null,
  loading: false,
  message: "",
  listings: [],
  product: null,
};

const BASE_URL = import.meta.env.VITE_BASE_URL;
const sellerToken = (getState) => getState().Sellers?.loggedinSeller?.token;

const multipartPayload = (formData, avatar) => {
  const payload = new FormData();
  Object.entries(formData || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) payload.append(key, value);
  });
  if (avatar) payload.append("image", avatar);
  return payload;
};

export const fetchSellerListing = createAsyncThunk("sellerProducts/listings", async (_, { getState, rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/product/seller/listing`, {
      headers: { Authorization: `Bearer ${sellerToken(getState)}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const listProductAction = createAsyncThunk("sellerProducts/create", async ({ formData, avatar }, { getState, rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/product/create`, multipartPayload(formData, avatar), {
      headers: { Authorization: `Bearer ${sellerToken(getState)}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateProductListingAction = createAsyncThunk(
  "sellerProducts/update",
  async ({ id, formData, avatar }, { getState, rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/product/update/${id}`, multipartPayload(formData, avatar), {
        headers: { Authorization: `Bearer ${sellerToken(getState)}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const deleteListedProductAction = createAsyncThunk(
  "sellerProducts/delete",
  async ({ productId, id }, { getState, rejectWithValue }) => {
    const resolvedId = productId || id;
    try {
      const response = await axios.delete(`${BASE_URL}/product/delete-product/${resolvedId}`, {
        headers: { Authorization: `Bearer ${sellerToken(getState)}` },
      });
      return { ...response.data, deletedId: resolvedId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const fetchSellerProductDetailsAction = createAsyncThunk(
  "sellerProducts/details",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/product/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

const sellerProductSlice = createSlice({
  name: "sellerProducts",
  initialState,
  extraReducers: (builder) => {
    const actions = [fetchSellerListing, listProductAction, updateProductListingAction, deleteListedProductAction, fetchSellerProductDetailsAction];
    actions.forEach((actionName) => {
      builder.addCase(actionName.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
      builder.addCase(actionName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Request failed";
      });
    });
    builder.addCase(fetchSellerListing.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.listings = action.payload.listings || [];
    });
    builder.addCase(listProductAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = action.payload.message;
    });
    builder.addCase(updateProductListingAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = action.payload.message;
    });
    builder.addCase(deleteListedProductAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = action.payload.message;
      state.listings = state.listings.filter((product) => product._id !== action.payload.deletedId);
    });
    builder.addCase(fetchSellerProductDetailsAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.product = action.payload.product;
    });
  },
});

export default sellerProductSlice.reducer;
