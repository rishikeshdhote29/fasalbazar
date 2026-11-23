import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const storedSeller = (() => {
  try {
    return JSON.parse(localStorage.getItem("seller"));
  } catch {
    return null;
  }
})();

const initialState = {
  success: false,
  error: null,
  loading: false,
  loggedinSeller: storedSeller,
  seller: storedSeller,
  message: "",
  isLoggedIn: !!storedSeller,
};

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const sellerRegisterAction = createAsyncThunk("seller/register", async (formData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/seller/auth/register`, formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const sellerLoginAction = createAsyncThunk("seller/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/seller/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const fetchSellerAction = createAsyncThunk("seller/fetch-profile", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().Sellers?.loggedinSeller?.token;
    const response = await axios.get(`${BASE_URL}/seller/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateSellerProfileAction = createAsyncThunk(
  "seller/update-profile",
  async ({ formData, avatar }, { getState, rejectWithValue }) => {
    try {
      const token = getState().Sellers?.loggedinSeller?.token;
      const payload = new FormData();
      Object.entries(formData || {}).forEach(([key, value]) => payload.append(key, value));
      if (avatar) payload.append("image", avatar);
      const response = await axios.put(`${BASE_URL}/seller/auth/update-seller-profile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const forgetSellerPasswordAction = createAsyncThunk("seller/forget-password", async ({ email }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/seller/auth/forget-password`, { email });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const resetSellerPasswordAction = createAsyncThunk(
  "seller/reset-password",
  async ({ password, token }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/seller/auth/reset-password/${token}`, { password });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
  }
});

const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {
    sellerSuccessAction: (state) => { state.success = false; },
    sellerErrorAction: (state) => { state.error = null; },
    sellerLogoutAction: (state) => {
      localStorage.removeItem("seller");
      Object.assign(state, initialState, { loggedinSeller: null, seller: null, isLoggedIn: false });
    },
  },
  extraReducers: (builder) => {
    const actions = [sellerRegisterAction, sellerLoginAction, fetchSellerAction, updateSellerProfileAction, forgetSellerPasswordAction, resetSellerPasswordAction];
    actions.forEach((actionName) => {
      builder.addCase(actionName.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      });
      builder.addCase(actionName.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || action.error?.message || "Request failed";
      });
    });

    builder.addCase(sellerRegisterAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = action.payload.message;
    });
    builder.addCase(sellerLoginAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.loggedinSeller = action.payload.user;
      state.seller = action.payload.user;
      state.isLoggedIn = true;
      localStorage.setItem("seller", JSON.stringify(action.payload.user));
    });
    builder.addCase(fetchSellerAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.seller = action.payload.seller;
      state.loggedinSeller = { ...state.loggedinSeller, ...action.payload.seller };
    });
    builder.addCase(updateSellerProfileAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      const updatedSeller = action.payload.user || action.payload.newUser;
      if (updatedSeller) {
        state.seller = { ...state.seller, ...updatedSeller };
        state.loggedinSeller = { ...state.loggedinSeller, ...updatedSeller };
        localStorage.setItem("seller", JSON.stringify(state.loggedinSeller));
      }
    });
    [forgetSellerPasswordAction, resetSellerPasswordAction].forEach((actionName) => {
      builder.addCase(actionName.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      });
    });
  },
});

export const { sellerSuccessAction, sellerErrorAction, sellerLogoutAction } = sellerSlice.actions;
export default sellerSlice.reducer;
