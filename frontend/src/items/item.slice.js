import { createSlice } from "@reduxjs/toolkit";

const itemSlice = createSlice({
  name: "items",
  initialState: {
    items: [],
    recentItems: [],
    resurfaceItems: [],
    loading: false,
    error: null,
    results: [],
    itemDetails: null,
  },
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
      state.recentItems = action.payload.slice(0, 3);
    },
    setResurfaceItems: (state, action) => {
      state.resurfaceItems = action.payload;
    },
    setItemDetails: (state, action) => {
      state.itemDetails = action.payload;
    },

    setReslts: (state, action) => {
      state.results = action.payload;
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
  setResurfaceItems,
  setReslts,
  setItemDetails,
} = itemSlice.actions;
export default itemSlice.reducer;
