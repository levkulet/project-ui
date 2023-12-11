function createChart() {
  // Data
  const data = [
    { channel: 'Mr.Beast', q1: 374968, q2: 914153, q3: 776074, q4: 125315 },
    { channel: 'PewDiePie', q1: 146655, q2: 389799, q3: 687739, q4: 5611 },
    { channel: 'Set India', q1: 491881, q2: 679295, q3: 8621, q4: 774687 },
    { channel: 'Abckid Tv', q1: 617387, q2: 747622, q3: 948557, q4: 510605 },
    { channel: 'T-Series', q1: 441696, q2: 714420, q3: 822385, q4: 492428 }
  ];

  // Remove existing chart
  d3.select('#chart svg').remove();

  // Set up the chart dimensions
  const margin = { top: 20, right: 30, bottom: 70, left: 120 };
  const width = window.innerWidth - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Append SVG to the chart div
  const svg = d3.select('#chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Extract channel names
  const channels = data.map(d => d.channel);

  // X and Y scales
  const xScale = d3.scaleLinear().range([0, width]);
  const yScale = d3.scaleBand().range([height, 0]).padding(0.1);

  // Set up X and Y axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  // Tooltip
  const tooltip = d3.select('#chart').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  // Enable zoom
  const zoom = d3.zoom()
    .scaleExtent([1, 4])
    .on('zoom', zoomed);

  svg.call(zoom);

  function zoomed(event) {
    const transform = event.transform;
    svg.selectAll('.bar-q1, .bar-q2, .bar-q3, .bar-q4')
      .attr('transform', `translate(${transform.x}, 0) scale(${transform.k}, 1)`);
    svg.select('.x.axis').call(xAxis.scale(transform.rescaleX(xScale)));
  }

  // Render chart
  xScale.domain([0, d3.max(data, d => d3.max([d.q1, d.q2, d.q3, d.q4]))]);
  yScale.domain(channels).range([height, 0]);

  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0, ${height})`)
    .call(xAxis);

  svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis);

  // Grouped bar chart
  let quarters = ['q1', 'q2', 'q3', 'q4'];

  // Add quarter guide lines
  quarters.forEach((quarter, i) => {
    const xPos = xScale(i * (width / quarters.length));
    svg.append('line')
      .attr('class', 'quarter-line')
      .attr('x1', xPos)
      .attr('y1', 0)
      .attr('x2', xPos)
      .attr('y2', height);
  });

  quarters.forEach((quarter, i) => {
  svg.selectAll(`.bar-${quarter}`)
    .data(data)
    .enter()
    .append('rect')
    .attr('class', `bar-${quarter}`)
    .attr('x', 0)
    .attr('y', d => yScale(d.channel) + i * (yScale.bandwidth() / quarters.length))
    .attr('width', d => xScale(d[quarter]))
    .attr('height', yScale.bandwidth() / quarters.length)
    .attr('fill', d => d3.schemeCategory10[i])
    .on('mouseover', function (d, j) {
      const currentQuarter = quarters[i]; // Use closure to capture the current quarter
      tooltip.transition().duration(200).style('opacity', 0.9);
      tooltip.html(`<strong>${d.channel}</strong><br>${currentQuarter}: ${d[currentQuarter]}`)
        .style('left', (d3.event.pageX + 5) + 'px')
        .style('top', (d3.event.pageY - 28) + 'px');
    })
    .on('mouseout', () => {
      tooltip.transition().duration(500).style('opacity', 0);
    });
});

  // Legend
  const legend = svg.append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(0, ${height + margin.bottom - 20})`);

  quarters.forEach((quarter, i) => {
    legend.append('rect')
      .attr('x', i * 70)
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', d3.schemeCategory10[i]);

    legend.append('text')
      .attr('x', i * 70 + 20)
      .attr('y', 10)
      .text(quarter);
  });

  // Chart title
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', 0 - (margin.top / 2))
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .style('text-decoration', 'underline')
    .text('Top 5 YouTube Channels Quarterly Income');
}

// Initial chart creation
createChart();

// Update chart on window resize
window.addEventListener('resize', createChart);
