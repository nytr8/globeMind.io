import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/auth.slice.js";
import itemReducer from "./items/item.slice.js";
import graphReducer from "./items/graph.slice.js";
import collectionReducer from "./collections/collection.slice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    items: itemReducer,
    graph: graphReducer,
    collections: collectionReducer,
  },
});

export default store;
