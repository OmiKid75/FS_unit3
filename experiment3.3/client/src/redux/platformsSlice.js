import { createSlice } from "@reduxjs/toolkit";

const initialState = { selected: [] };

const platformsSlice = createSlice({
  name: "platforms",
  initialState,
  reducers: {
    selectPlatform: (state, action) => {
      if (!state.selected.includes(action.payload)) {
        state.selected.push(action.payload);
      }
    },
    deselectPlatform: (state, action) => {
      state.selected = state.selected.filter((p) => p !== action.payload);
    },
    clearPlatforms: (state) => {
      state.selected = [];
    },
    setPlatforms: (state, action) => {
      state.selected = action.payload;
    },
  },
});

export const { selectPlatform, deselectPlatform, clearPlatforms, setPlatforms } = platformsSlice.actions;
export default platformsSlice.reducer;