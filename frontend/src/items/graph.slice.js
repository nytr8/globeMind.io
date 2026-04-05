import { createSlice } from "@reduxjs/toolkit";

const graphSlice = createSlice({
  name: "graph",
  initialState: {
    nodes: [],
    links: [],
    loading: false,
    error: null,
  },
  reducers: {
    setGraphData: (state, action) => {
      state.nodes = action.payload.nodes;
      state.links = action.payload.links;
      state.error = null;
    },
    setGraphLoading: (state, action) => {
      state.loading = action.payload;
    },
    setGraphError: (state, action) => {
      state.error = action.payload;
    },
    clearGraph: (state) => {
      state.nodes = [];
      state.links = [];
      state.error = null;
    },
  },
});

export const { setGraphData, setGraphLoading, setGraphError, clearGraph } =
  graphSlice.actions;
export default graphSlice.reducer;
