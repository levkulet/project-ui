// Load the CSV data
d3.csv("./data/likesubscribe.csv").then(function(data) {
  // Set the dimensions of the chart
  var margin = {top: 10, right: 30, bottom: 30, left: 60},
      width = 1000 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  // Append the SVG object to the chart2 div
  var svg = d3.select("#chart2")
    .append("svg")
      .attr("width", "100%") // Set width to 100% for responsiveness
      .attr("height", "100%") // Set height to 100% for responsiveness
      .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom)) // Add viewBox attribute
      .attr("preserveAspectRatio", "xMidYMid meet") // Add preserveAspectRatio attribute
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

  // Create a tooltip div that is hidden by default:
  var tooltip = d3.select("#chart2")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
    tooltip.style("opacity", 1);
  }
  var mousemove = function(d) {
    tooltip
      .html("Likes: " + d.Like + "<br>Subscribes: " + d.Subscribe)
      .style("left", (d3.mouse(this)[0]+70) + "px")
      .style("top", (d3.mouse(this)[1]) + "px");
  }
  var mouseleave = function(d) {
    tooltip.style("opacity", 0);
  }

  // Add the points
  svg
    // First we need to enter in a group
    .selectAll("myDots")
    .data(data)
    .enter()
      .append('g')
      .attr("class", "dot")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
    // Second we need to enter in the 'values' part of this group
    .selectAll("myPoints")
    .data(function(d){ return d.values })
    .enter()
    .append("circle")
      .attr("cx", function(d) { return x(d.date) } )
      .attr("cy", function(d) { return y(d.value) } )
      .attr("r", 5)
      .attr("stroke", "white");
});
