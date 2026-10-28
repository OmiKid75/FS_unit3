import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

export const fetchDrafts = createAsyncThunk(
  "drafts/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/posts/drafts");
      return data.posts;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load drafts");
    }
  }
);

export const saveDraft = createAsyncThunk(
  "drafts/save",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/posts", { ...payload, status: "draft" });
      return data.post;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to save draft");
    }
  }
);

export const updateDraft = createAsyncThunk(
  "drafts/update",
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/posts/${id}`, { ...payload, status: "draft" });
      return data.post;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update draft");
    }
  }
);

export const deleteDraft = createAsyncThunk(
  "drafts/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/posts/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete draft");
    }
  }
);

const initialState = { items: [], status: "idle", error: null };

const draftsSlice = createSlice({
  name: "drafts",
  initialState,
  reducers: {
    clearDraftsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDrafts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDrafts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchDrafts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(saveDraft.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateDraft.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteDraft.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p._id !== action.payload);
      })
      .addMatcher(
        (action) => action.type === "posts/publish/fulfilled" || action.type === "posts/delete/fulfilled",
        (state, action) => {
          const id = action.payload?._id || action.payload;
          state.items = state.items.filter((p) => p._id !== id);
        }
      )
      .addMatcher(
        (action) => action.type === "posts/uploadMedia/fulfilled",
        (state, action) => {
          const idx = state.items.findIndex((p) => p._id === action.payload._id);
          if (idx !== -1) state.items[idx] = action.payload;
        }
      );
  },
});

export const { clearDraftsError } = draftsSlice.actions;
export default draftsSlice.reducer;