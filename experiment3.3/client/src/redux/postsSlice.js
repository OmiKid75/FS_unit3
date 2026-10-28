import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

export const fetchPosts = createAsyncThunk(
  "posts/fetchAll",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/posts", { params: filters });
      return data.posts;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load posts");
    }
  }
);

export const addPost = createAsyncThunk(
  "posts/add",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/posts", payload);
      return data.post;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.errors?.join(", ") || err.response?.data?.message || "Failed to create post"
      );
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/update",
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/posts/${id}`, payload);
      return data.post;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.errors?.join(", ") || err.response?.data?.message || "Failed to update post"
      );
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/posts/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete post");
    }
  }
);

export const publishPost = createAsyncThunk(
  "posts/publish",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/posts/${id}`, { status: "published" });
      return data.post;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to publish post");
    }
  }
);

export const uploadPostMedia = createAsyncThunk(
  "posts/uploadMedia",
  async ({ id, files }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("files", file));
      const { data } = await api.post(`/posts/${id}/media`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.post;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Upload failed");
    }
  }
);
// Read-only feed for the Viewer role — all published posts, any author
export const fetchPublishedFeed = createAsyncThunk(
  "posts/fetchPublishedFeed",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/posts/published");
      return data.posts;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load feed");
    }
  }
);

const initialState = { items: [], publicItems:[], status: "idle", error: null };

const upsert = (state, post) => {
  const idx = state.items.findIndex((p) => p._id === post._id);
  if (idx !== -1) state.items[idx] = post;
  else state.items.unshift(post);
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearPostsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(addPost.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        upsert(state, action.payload);
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p._id !== action.payload);
      })
      .addCase(publishPost.fulfilled, (state, action) => {
        upsert(state, action.payload);
      })
      .addCase(uploadPostMedia.fulfilled, (state, action) => {
        upsert(state, action.payload);
      })
      .addCase(fetchPublishedFeed.fulfilled, (state, action) => {
  state.publicItems = action.payload;
     })
      .addMatcher(
        (action) => action.type === "drafts/save/fulfilled" || action.type === "drafts/update/fulfilled",
        (state, action) => {
          upsert(state, action.payload);
        }
      )
      .addMatcher(
        (action) => action.type === "drafts/delete/fulfilled",
        (state, action) => {
          state.items = state.items.filter((p) => p._id !== action.payload);
        }
      );
  },
});

export const { clearPostsError } = postsSlice.actions;
export default postsSlice.reducer;