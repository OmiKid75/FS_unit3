import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

export const fetchAllUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/admin/users");
      return data.users;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load users");
    }
  }
);

export const updateUserRole = createAsyncThunk(
  "admin/updateUserRole",
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/admin/users/${id}/role`, { role });
      return data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update role");
    }
  }
);

export const fetchSystemAnalytics = createAsyncThunk(
  "admin/fetchSystemAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/admin/analytics");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load system analytics");
    }
  }
);

const initialState = {
  users: [],
  usersStatus: "idle",
  systemAnalytics: null,
  analyticsStatus: "idle",
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => { state.usersStatus = "loading"; })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.usersStatus = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.usersStatus = "failed";
        state.error = action.payload;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const idx = state.users.findIndex((u) => u._id === action.payload._id);
        if (idx !== -1) state.users[idx] = action.payload;
      })
      .addCase(fetchSystemAnalytics.pending, (state) => { state.analyticsStatus = "loading"; })
      .addCase(fetchSystemAnalytics.fulfilled, (state, action) => {
        state.analyticsStatus = "succeeded";
        state.systemAnalytics = action.payload;
      })
      .addCase(fetchSystemAnalytics.rejected, (state, action) => {
        state.analyticsStatus = "failed";
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;