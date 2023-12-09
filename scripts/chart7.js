// Load the CSV file
d3.csv("./data/top_100_youtubers.csv").then(function(data) {
    // Group the data by the 'Category' column
    var grouped = d3.group(data, d => d.Category);

    // Convert the Map to an array of [key, value] pairs
    var groupedArray = Array.from(grouped);

    // For each group, sum the 'followers'
    var sums = groupedArray.map(([key, value]) => {
        return {
            category: key,
            totalFollowers: d3.sum(value, d => +d.followers)
        };
    });

    // Set dimensions based on the parent container
    var containerWidth = document.getElementById('pie-chart-contain').offsetWidth;
    var containerHeight = document.getElementById('pie-chart-contain').offsetHeight;
    var width = containerWidth;
    var height = containerWidth-320;
    var radius = Math.min(width, height) / 2;

    var svg = d3.select('#vishnupiechart')
        .append('svg')
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr('viewBox', '0 0 ' + width + ' ' + height)
        .classed('svg-content', true)
        .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ') rotate(-90)');

    // Define your own color scale
    var color = d3.scaleOrdinal()
        .domain(sums.map(d => d.category).sort())
        .range(["#734a10", "#fe3e11", "#fff7ed", "#a47604", "#1e6367", "#b263e9", "#ff7119", "#46b9bb", "#efd103"]);  // Add more colors if needed

    var pie = d3.pie().value(function(d) { return d.totalFollowers; });
    var path = d3.arc().outerRadius(radius - 10).innerRadius(0)
        .startAngle(function(d) { return d.startAngle + Math.PI/2; })
        .endAngle(function(d) { return d.endAngle + Math.PI/2; });

    var arc = svg.selectAll('.arc')
        .data(pie(sums))
        .enter().append('g')
        .attr('class', 'arc');

    var arcGroup = arc.append('path')
        .attr('d', path)
        .attr('fill', function(d) { return color(d.data.category); })
        .style('opacity', 0);

    // Add a delay to the transition
    svg.selectAll('path')
        .transition()
        .duration(1000)
        .style('opacity', 1);

    // Add a legend
    var legendRectSize = 10;
    var legendSpacing = 10;
    var legendPerRow = 3;
    var legendHeight = Math.ceil(color.domain().length / legendPerRow) * (legendRectSize + legendSpacing);

    var legendSvg = d3.select('#vishnupiechartlegend')
        .append('svg')
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr('viewBox', '0 0 ' + width + ' ' + legendHeight)
        .classed('svg-content', true)
        .selectAll('.vishnupiechartlegend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class', 'vishnupiechartlegend')
        .attr('transform', function(d, i) {
            // Calculate total width of legend items
            var totalWidth = legendPerRow * (legendRectSize + legendSpacing) * 6;

            // Center the legend items
            var horz = (width - totalWidth) / 2 + (i % legendPerRow) * (legendRectSize + legendSpacing) * 6;
            var vert = Math.floor(i / legendPerRow) * (legendRectSize + legendSpacing);

            return 'translate(' + horz + ',' + vert + ')';
        });

    legendSvg.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', color)
        .style('stroke', color);

    legendSvg.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize)
        .style('font-size', '10px')
        .style('fill','white')
        .text(function(d) { return d; });

    // Add interactivity to the legend
    legendSvg.on('mousedown', function(event, category) {
        // Select all arcs
        var arcs = svg.selectAll('.arc');

        // Highlight the clicked category and dim the others
        arcs.style('opacity', function(d) {
            return d.data.category === category ? 1 : 0.3;
        });
    });

    legendSvg.on('mouseup', function() {
        // Select all arcs
        var arcs = svg.selectAll('.arc');

        // Reset the opacity of all arcs
        arcs.style('opacity', 1);
    });

    // Create a tooltip
    var tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .style('position', 'absolute')
        .style("background", "#ffffff")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style('font-size','.7rem');

    // Add interactivity to the arcs
    arcGroup.on('mouseover', function(event, d) {
        // Make the tooltip visible and set its content
        tooltip.style('opacity', 1)
            .html('Category: ' + d.data.category + '<br>' +
                  'Total Followers: ' + d.data.totalFollowers);
    })
    .on('mousemove', function(event) {
        // Position the tooltip near the mouse pointer
        tooltip.style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');
    })
    .on('mouseout', function() {
        // Hide the tooltip
        tooltip.style('opacity', 0);
    });
}).catch(function(error){
   console.log(error);
});
