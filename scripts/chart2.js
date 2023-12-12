// Load the CSV data
d3.csv("./data/likesubscribe.csv").then(function(data) {
  // Set the dimensions of the chart
  var margin = {top: 10, right: 30, bottom: 30, left: 60},
      width = 960 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  // Append the SVG object to the chart2 div
  var svg = d3.select("#chart2")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, data.length])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 300])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add the 'Like' line
  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d, i) { return x(i); })
      .y(function(d) { return y(d.Like); })
    );

  // Add the 'Subscribe' line
  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "orange")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d, i) { return x(i); })
      .y(function(d) { return y(d.Subscribe); })
    );
});