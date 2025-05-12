import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const D3BarChart = ({ data, width, height }) => {
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

    // Clear previous chart
    d3.select(ref.current).selectAll('*').remove();

    const svg = d3.select(ref.current)
      .attr('width', width)
      .attr('height', height)
      .style('background', '#fff');

    const margin = { top: 40, right: 30, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const x = d3.scaleBand()
      .domain(cleanedData.map(d => d.date))
      .range([0, innerWidth])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(cleanedData, d => d.value)])
      .nice()
      .range([innerHeight, 0]);

    const xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat('%b %Y'));
    const yAxis = d3.axisLeft(y);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X Axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#333')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    // Y Axis
    g.append('g')
      .call(yAxis)
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#333');

    // Bars (thinner and centered)
    const barWidthFactor = 0.4;
    const barOffsetFactor = (1 - barWidthFactor) / 2;

    g.selectAll('.bar')
      .data(cleanedData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.date) + x.bandwidth() * barOffsetFactor)
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth() * barWidthFactor)
      .attr('height', d => innerHeight - y(d.value))
      .attr('fill', '#4f46e5');

    // Text Labels Above Bars
    g.selectAll('.label')
      .data(cleanedData)
      .enter()
      .append('text')
      .attr('x', d => x(d.date) + x.bandwidth() / 2)
      .attr('y', d => y(d.value) - 5)
      .attr('text-anchor', 'middle')
      .style('fill', '#000')
      .style('font-size', '12px')
      .text(d => `₹${d.value}`);
  }, [data, width, height]);

  return <svg ref={ref}></svg>;
};

export default D3BarChart;
