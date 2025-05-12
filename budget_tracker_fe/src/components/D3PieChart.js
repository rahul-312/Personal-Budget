import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const D3PieChart = ({ data, width, height }) => {
  const ref = useRef();

  useEffect(() => {
    // Clear previous chart
    d3.select(ref.current).selectAll('*').remove();

    const radius = Math.min(width, height) / 2.5;

    const svg = d3
      .select(ref.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height + 100) // extra height for legend
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie().value((d) => d.value);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const arcs = svg.selectAll('arc').data(pie(data)).enter().append('g');

    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', (d) => color(d.data.name));

    // Legend rendering below the chart
    const legend = d3
      .select(ref.current)
      .select('svg')
      .append('g')
      .attr('transform', `translate(10, ${height + 10})`);

    const legendItemSize = 20;
    const legendSpacingX = 140; // horizontal spacing between columns
    const legendSpacingY = 30;  // vertical spacing between rows
    const columns = 2; // number of columns

    data.forEach((d, i) => {
      const col = i % columns;
      const row = Math.floor(i / columns);

      const legendGroup = legend
        .append('g')
        .attr('transform', `translate(${col * legendSpacingX}, ${row * legendSpacingY})`);

      legendGroup
        .append('rect')
        .attr('width', legendItemSize)
        .attr('height', legendItemSize)
        .attr('fill', color(d.name));

      legendGroup
        .append('text')
        .attr('x', legendItemSize + 8)
        .attr('y', legendItemSize - 4)
        .text(d.name)
        .attr('font-size', '14px');
    });
  }, [data, width, height]);

  return <div ref={ref}></div>;
};

export default D3PieChart;
