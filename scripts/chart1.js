// Load the CSV data
d3.csv("./data/category_proportion_data.csv").then(function(data) {
  // Set the dimensions of the chart
  var width = 960;
  var height = 400;
  var radius = Math.min(width, height) / 2;

  // Color scale
  var color = d3.scaleOrdinal(d3.schemeCategory10);

  // Create SVG
  var svg = d3.select("#chart1")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  // Pie layout
  var pie = d3.pie()
    .value(function(d) { return d.Proportion; })
    .sort(null);

  // Arc
  var arc = d3.arc()
    .innerRadius(radius - 100)
    .outerRadius(radius);

  // Create a tooltip
  var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  // Create arcs
  var g = svg.selectAll(".arc")
    .data(pie(data))
    .enter().append("g")
    .attr("class", "arc");

  // Append paths
  g.append("path")
    .attr("d", arc)
    .style("fill", function(d) { return color(d.data.Category); })
    .on("mouseover", function(d) { // Add event listener for mouseover
          tooltip.transition()
              .duration(200)
              .style("opacity", .9);
          tooltip.html(d.data.Category + "<br/>" + d.data.Proportion)
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) { // Add event listener for mouseout
          tooltip.transition()
              .duration(500)
              .style("opacity", 0);
      });

  // Append text
  g.append("text")
    .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
    .attr("dy", ".35em")
    .style("text-anchor", "middle")
    .text(function(d) { return d.data.Category; });

  // Define the size and position of the legend
  var legendRectSize = 12;
  var legendSpacing = 5;
  var legendHeight = legendRectSize + legendSpacing;

  // Define the font size
  var fontSize = "10px"; 

  // Create the legend
  var legend = svg.selectAll('.legend')
  .data(color.domain())
  .enter()
  .append('g')
  .attr('class', 'legend')
  .attr('transform', function(d, i) {
      var height = legendHeight;
      var offset =  height * color.domain().length / 2;
      var horz = -2 * legendRectSize;
      var vert = i * height - offset;
      return 'translate(' + horz + ',' + vert + ')';
  });

  // Add colored squares to the legend
  legend.append('rect')
  .attr('width', legendRectSize)
  .attr('height', legendRectSize)
  .style('fill', color)
  .style('stroke', color);

  // Add text to the legend
  legend.append('text')
  .attr('x', legendRectSize + legendSpacing)
  .attr('y', legendRectSize - legendSpacing)
  .style('fill', 'white')
  .style('font-size', fontSize) // Add the font size attribute
  .text(function(d) { return d; });
});
