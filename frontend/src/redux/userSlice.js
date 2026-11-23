import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const storedUser = (() => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
})();

const initialState = {
  success: false,
  error: null,
  loading: false,
  loggedinUser: storedUser,
  user: storedUser,
  message: "",
  isLoggedIn: !!storedUser,
};

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const registerAction = createAsyncThunk("user/register", async ({ name, email, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, { name, email, password });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const loginAction = createAsyncThunk("user/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const fetchUserAction = createAsyncThunk("user/fetch-profile", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().Users?.loggedinUser?.token;
    const response = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateProfileAction = createAsyncThunk(
  "user/update-profile",
  async ({ formData, avatar }, { getState, rejectWithValue }) => {
    try {
      const token = getState().Users?.loggedinUser?.token;
      const payload = new FormData();
      Object.entries(formData || {}).forEach(([key, value]) => payload.append(key, value));
      if (avatar) payload.append("image", avatar);
      const response = await axios.put(`${BASE_URL}/auth/update-profile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const forgetPasswordAction = createAsyncThunk("user/forget-password", async ({ email }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/forget-password`, { email });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const resetPasswordAction = createAsyncThunk(
  "user/reset-password",
  async ({ password, token }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/auth/reset-password/${token}`, { password });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    successAction: (state) => { state.success = false; },
    errorAction: (state) => { state.error = null; },
    logoutAction: (state) => {
      localStorage.removeItem("user");
      Object.assign(state, initialState, { loggedinUser: null, user: null, isLoggedIn: false });
    },
  },
  extraReducers: (builder) => {
    const handlePending = (actionName) => {
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
    };

    [registerAction, loginAction, fetchUserAction, updateProfileAction, forgetPasswordAction, resetPasswordAction].forEach(handlePending);

    builder.addCase(registerAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = action.payload.message;
    });
    builder.addCase(loginAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.loggedinUser = action.payload.user;
      state.user = action.payload.user;
      state.isLoggedIn = true;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    });
    builder.addCase(fetchUserAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.user = action.payload.user;
      state.loggedinUser = { ...state.loggedinUser, ...action.payload.user };
    });
    builder.addCase(updateProfileAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      const updatedUser = action.payload.newUser || action.payload.user;
      if (updatedUser) {
        state.user = { ...state.user, ...updatedUser };
        state.loggedinUser = { ...state.loggedinUser, ...updatedUser };
        localStorage.setItem("user", JSON.stringify(state.loggedinUser));
      }
    });
    [forgetPasswordAction, resetPasswordAction].forEach((actionName) => {
      builder.addCase(actionName.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      });
    });
  },
});

export const { successAction, errorAction, logoutAction } = userSlice.actions;
export default userSlice.reducer;
