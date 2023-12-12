// Load the CSV data
d3.csv("./data/category_proportion_data.csv").then(function (data) {
    // Convert the Proportion values to numbers
    data.forEach(function (d) {
        d.Proportion = +d.Proportion;
    });

    // Set the dimensions of the chart
    var width = 1000;
    var height = 400;
    var radius = Math.min(width, height) / 2;

    // Color scale
    //var color = d3.scaleOrdinal(d3.schemeCategory10);
    // Define your own color scale
    var color = d3.scaleOrdinal()
        //.domain(sums.map(d => d.category).sort())
        .range(["#734a10", "#fe3e11", "#fff7ed", "#a47604", "#1e6367", "#b263e9", "#ff7119", "#46b9bb", "#efd103"]);  // Add more colors if needed


    // Create SVG
    var svg = d3.select("#chart1")
        .append("svg")
        .attr("width", "100%") // Set width to 100% for responsiveness
        .attr("height", "100%") // Set height to 100% for responsiveness
        .attr("viewBox", "0 0 " + width + " " + height) // Add viewBox attribute
        .attr("preserveAspectRatio", "xMidYMid meet") // Add preserveAspectRatio attribute
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Pie layout
    var pie = d3.pie()
        .value(function (d) { return +d.Proportion; })
        .sort(null);

    // Arc
    var arc = d3.arc()
        .innerRadius(radius - 100)
        .outerRadius(radius);

    var container = d3.select("#tooltip");

    // Create a tooltip
    var tooltip = container.append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .style('position', 'absolute')
        .style('background', 'white') // Add this line
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style('font-size', '.7rem')
        .style('color', 'black');

    // Create arcs
    var g = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

    // Append paths
    g.append("path")
        .attr("d", arc)
        .style("fill", function (d) { return color(d.data.Category); })
        .on("mouseover", function (d) { // Add event listener for mouseover
            tooltip.style("opacity", 1)
                .html(`Category: ${d.data.Category} \nProportion: ${d.data.Proportion}`);
        })
        .on('mousemove', function (event) {
            // Position the tooltip near the mouse pointer
            tooltip.style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px');
        })
        .on("mouseout", function (d) { // Add event listener for mouseout
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // Append text
    g.append("text")
        .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text(function (d) { return d.data.Category; });


    // Define the size and position of the legend
    var legendRectSize = 30;
    var legendSpacing = 8;
    var legendHeight = legendRectSize + legendSpacing;

    // Define the font size
    var fontSize = "10px";

    /*     // Create the legend
        var legend = svg.selectAll('.legend')
            .data(color.domain())
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function (d, i) {
                var height = legendHeight;
                var offset = height * color.domain().length / 2;
                var horz = -2 * legendRectSize;
                var vert = i * height - offset;
                return 'translate(' + horz + ',' + vert + ')';
            }); */

    // Create the legend
    var legend = svg.selectAll('.legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function (d, i) {
            var height = legendHeight;
            var offset = height * color.domain().length / 2;
            var horz = -width / 3 -80 ; // Adjust this value to move the legend to the left
            var vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
        })
        .on('mousedown', function(event, category) { // Add click event listener
            // Select all arcs
            var arcs = svg.selectAll('.arc');
    
            // Highlight the clicked category and dim the others
            arcs.style('opacity', function(d) {
                return d.data.Category === category ? 1 : 0.3;
            });
        })
        .on('mouseup', function() {
            // Select all arcs
            var arcs = svg.selectAll('.arc');
    
            // Reset the opacity of all arcs
            arcs.style('opacity', 1);
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
        .text(function (d) { return d; });
});
