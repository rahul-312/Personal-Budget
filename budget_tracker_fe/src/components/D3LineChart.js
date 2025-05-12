import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const D3LineChart = ({ data, width, height }) => {
  const ref = useRef();

  useEffect(() => {
    if (!data.length) return;

    const parseTime = d3.timeParse('%Y-%m');

    const cleanedData = data
      .map(d => ({
        date: parseTime(d.date),
        value: +d.value,
      }))
      .filter(d => d.date && !isNaN(d.value));

    if (!cleanedData.length) return;

    d3.select(ref.current).selectAll('*').remove();

    const svg = d3.select(ref.current)
      .attr('width', width)
      .attr('height', height)
      .style('background', '#fff'); // Ensure white background for visibility

    const margin = { top: 40, right: 30, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const x = d3.scaleTime()
      .domain(d3.extent(cleanedData, d => d.date))
      .range([0, innerWidth]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(cleanedData, d => d.value)])
      .nice()
      .range([innerHeight, 0]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.value));

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X Axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%b %Y')))
      .selectAll("text")
      .style("font-size", "12px")
      .style("fill", "#333");

    // Y Axis
    g.append('g')
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "12px")
      .style("fill", "#333");

    // Line Path
    g.append('path')
      .datum(cleanedData)
      .attr('fill', 'none')
      .attr('stroke', '#4f46e5')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Dots & labels
    g.selectAll('.dot')
      .data(cleanedData)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => x(d.date))
      .attr('cy', d => y(d.value))
      .attr('r', 5)
      .attr('fill', (d, i) => colorScale(i)); // Different color per month

    // Add text labels above points
    g.selectAll('.label')
      .data(cleanedData)
      .enter()
      .append('text')
      .attr('x', d => x(d.date))
      .attr('y', d => y(d.value) - 10)
      .attr('text-anchor', 'middle')
      .style('fill', '#000')
      .style('font-size', '12px')
      .text(d => `₹${d.value}`);
  }, [data, width, height]);

  return <svg ref={ref}></svg>;
};

export default D3LineChart;
