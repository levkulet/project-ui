// Load the CSV file
d3.csv("./data/top_100_youtubers.csv").then(function (data) {
    // Group the data by the 'Category' column
    var grouped = d3.group(data, d => d.Category);

    // Convert the Map to an array of [key, value] pairs
    var groupedArray = Array.from(grouped);

    // For each group, sum the 'followers'
    var sums = groupedArray.map(([key, value]) => ({
        category: key,
        totalFollowers: d3.sum(value, d => +d.followers)
    }));

    // Set dimensions based on the parent container
    var containerWidth = document.getElementById('chart1Container').offsetWidth;
    var containerHeight = document.getElementById('chart1Container').offsetHeight;
    var width = containerWidth;
    var height = containerWidth - 320;
    var radius = Math.min(width, height) / 2;
    var innerRadius = radius * 0.6; // Set the inner radius for the donut chart

    var svg = d3.select('chart1')
        .append('svg')
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr('viewBox', '0 0 ' + width + ' ' + height)
        .classed('svg-content', true)
        .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    // Define your own color scale
    var color = d3.scaleOrdinal()
        .domain(sums.map(d => d.category).sort())
        .range(["#734a10", "#fe3e11", "#fff7ed", "#a47604", "#1e6367", "#b263e9", "#ff7119", "#46b9bb", "#efd103"]);  // Add more colors if needed

    var pie = d3.pie().value(d => d.totalFollowers);
    var arc = d3.arc().outerRadius(radius - 10).innerRadius(innerRadius); // Use innerRadius for the donut chart

    var arcGroup = svg.selectAll('.arc')
        .data(pie(sums))
        .enter()
        .append('g')
        .attr('class', 'arc');

    arcGroup.append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.category))
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

    var legendSvg = d3.select('chart1Legend')
        .append('svg')
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr('viewBox', '0 0 ' + width + ' ' + legendHeight)
        .classed('svg-content', true)
        .selectAll('.chart1Legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class', 'chart1Legend')
        .attr('transform', (d, i) => {
            var totalWidth = legendPerRow * (legendRectSize + legendSpacing) * 6;
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
        .style('fill', 'white')
        .text(d => d);

    // Add interactivity to the legend
    legendSvg.on('mousedown', function (event, category) {
        // Select all arcs
        var arcs = svg.selectAll('.arc');

        // Highlight the clicked category and dim the others
        arcs.style('opacity', d => (d.data.category === category ? 1 : 0.3));
    });

    legendSvg.on('mouseup', function () {
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
        .style('font-size', '.7rem');

    // Add interactivity to the arcs
    arcGroup.on('mousemove', function (event) {
        // Position the tooltip near the mouse pointer
        tooltip.style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');
    })
        .on('mouseout', function () {
            // Hide the tooltip
            tooltip.style('opacity', 0);
        });

}).catch(function (error) {
    console.log(error);
});