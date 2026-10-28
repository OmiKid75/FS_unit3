import { createSlice } from "@reduxjs/toolkit";

const now = new Date();

const initialState = {
  viewYear: now.getFullYear(),
  viewMonth: now.getMonth(),
  selectedDate: null,
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    nextMonth: (state) => {
      if (state.viewMonth === 11) { state.viewMonth = 0; state.viewYear += 1; }
      else { state.viewMonth += 1; }
    },
    prevMonth: (state) => {
      if (state.viewMonth === 0) { state.viewMonth = 11; state.viewYear -= 1; }
      else { state.viewMonth -= 1; }
    },
    goToToday: (state) => {
      const today = new Date();
      state.viewYear = today.getFullYear();
      state.viewMonth = today.getMonth();
    },
    selectDate: (state, action) => { state.selectedDate = action.payload; },
  },
});

export const { nextMonth, prevMonth, goToToday, selectDate } = calendarSlice.actions;
export default calendarSlice.reducer;
