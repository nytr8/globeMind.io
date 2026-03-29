import { createSlice } from "@reduxjs/toolkit";

const itemSlice = createSlice({
  name: "items",
  initialState: {
    items: [],
    recentItems: [],
    loading: false,
    error: null,
  },
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
      state.recentItems = action.payload.slice(0, 3);
    },

    setRecentItems: (state, action) => {
      state.recentItems = action.payload;
    },

    addItem: (state, action) => {
      state.items.unshift(action.payload);

      state.recentItems.unshift(action.payload);
      if (state.recentItems.length > 3) {
        state.recentItems.pop();
      }
    },

    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);

      state.recentItems = state.recentItems.filter(
        (item) => item._id !== action.payload,
      );
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setItems,
  setLoading,
  setError,
  setRecentItems,
  addItem,
  removeItem,
} = itemSlice.actions;
export default itemSlice.reducer;
