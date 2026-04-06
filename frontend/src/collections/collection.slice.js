import { createSlice } from "@reduxjs/toolkit";

const collectionSlice = createSlice({
  name: "collections",
  initialState: {
    collections: [],
    selectedCollection: null,
    collectionItems: [],
    loading: false,
    error: null,
  },
  reducers: {
    setCollections: (state, action) => {
      state.collections = action.payload;
    },
    upsertCollection: (state, action) => {
      const incomingCollection = action.payload;
      const index = state.collections.findIndex(
        (collection) => collection._id === incomingCollection._id,
      );

      if (index === -1) {
        state.collections.unshift(incomingCollection);
      } else {
        state.collections[index] = {
          ...state.collections[index],
          ...incomingCollection,
        };
      }
    },
    removeCollection: (state, action) => {
      const collectionId = action.payload;
      state.collections = state.collections.filter(
        (collection) => collection._id !== collectionId,
      );

      if (state.selectedCollection?._id === collectionId) {
        state.selectedCollection = null;
        state.collectionItems = [];
      }
    },
    setSelectedCollection: (state, action) => {
      state.selectedCollection = action.payload;
    },
    setCollectionItems: (state, action) => {
      state.collectionItems = action.payload;
    },
    setCollectionLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCollectionError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCollections,
  upsertCollection,
  removeCollection,
  setSelectedCollection,
  setCollectionItems,
  setCollectionLoading,
  setCollectionError,
} = collectionSlice.actions;

export default collectionSlice.reducer;
