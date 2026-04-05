import { useEffect, useRef } from "react";
import * as d3 from "d3";
import useGraph from "../hook/useGraph";

const GraphView = () => {
  const { nodes, links, loading, error, handleFetchGraph } = useGraph();
  const svgRef = useRef(null);

  useEffect(() => {
    handleFetchGraph();
  }, [handleFetchGraph]);

  useEffect(() => {
    if (!nodes.length) return;

    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const simulationNodes = nodes.map((node) => ({
      ...node,
      id: String(node.id),
    }));
    const simulationLinks = links.map((link) => ({
      ...link,
      source: String(link.source),
      target: String(link.target),
    }));

    const nodeIds = new Set(simulationNodes.map((node) => node.id));
    const validLinks = simulationLinks.filter(
      (link) => nodeIds.has(link.source) && nodeIds.has(link.target),
    );

    const simulation = d3
      .forceSimulation(simulationNodes)
      .force(
        "link",
        d3.forceLink(validLinks).id((d) => d.id),
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(300, 300));

    const link = svg
      .append("g")
      .selectAll("line")
      .data(validLinks)
      .enter()
      .append("line")
      .style("stroke", "#cbd5e1")
      .style("stroke-width", 2)
      .style("opacity", 0.6);

    const node = svg
      .append("g")
      .selectAll("circle")
      .data(simulationNodes)
      .enter()
      .append("circle")
      .attr("r", 10)
      .style("fill", "#1e3a8a")
      .style("stroke", "#3b82f6")
      .style("stroke-width", 2)
      .style("cursor", "pointer");

    const hoverLabel = svg
      .append("text")
      .attr("font-size", "12px")
      .attr("fill", "white")
      .style("pointer-events", "none")
      .style("display", "none")
      .style("font-weight", "500");

    node
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr("r", 14)
          .style("fill", "#2563eb");

        hoverLabel
          .style("display", "block")
          .text(d.label || "Untitled")
          .attr("x", d.x + 16)
          .attr("y", d.y + 4)
          .style("padding", "4px 8px")
          .style("border-radius", "4px");
      })
      .on("mousemove", (event, d) => {
        hoverLabel.attr("x", d.x + 16).attr("y", d.y + 4);
      })
      .on("mouseout", (event) => {
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr("r", 10)
          .style("fill", "#1e3a8a");

        hoverLabel.style("display", "none");
      });

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    });
  }, [links, nodes]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-slate-200">
        Loading graph...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-red-300">
        Error loading graph: {error}
      </div>
    );
  }

  if (!nodes.length) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-slate-200">
        No graph data available.
      </div>
    );
  }

  return (
    <div className="bg-slate-800 flex items-start justify-center  min-h-screen w-full ">
      <svg ref={svgRef} width={600} height={600}></svg>
    </div>
  );
};

export default GraphView;
