import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGraph } from "../services/graph.api";
import { setGraphData, setGraphLoading, setGraphError } from "../graph.slice";

const useGraph = () => {
  const dispatch = useDispatch();
  const graphState = useSelector((state) => state.graph);

  const handleFetchGraph = useCallback(async () => {
    dispatch(setGraphLoading(true));
    try {
      const data = await fetchGraph();
      dispatch(
        setGraphData({
          nodes: data.nodes || [],
          links: data.links || [],
        }),
      );
    } catch (error) {
      dispatch(
        setGraphError(error.response?.data?.message || "Failed to fetch graph"),
      );
    } finally {
      dispatch(setGraphLoading(false));
    }
  }, [dispatch]);

  return {
    ...graphState,
    handleFetchGraph,
  };
};

export default useGraph;
