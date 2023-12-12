/*         const data = [
            { country: 'US', percentage: 40 },
            { country: 'Other Countries', percentage: 60 },
        ];

        function updateDimensions() {
            const containerWidth = document.getElementById('chart8Container').offsetWidth;
            const width = Math.min(containerWidth, 700);
            const height = width;
            const radius = Math.min(width, height) / 2;

            d3.select('svg')
                .attr('width', width)
                .attr('height', height);

            d3.select('g')
                .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

            const pie = d3.pie().value(d => d.percentage);
            const data_ready = pie(data);

            d3.selectAll('path')
                .attr('d', d3.arc()
                    .innerRadius(0)
                    .outerRadius(radius)
                )
                .attr('fill', d => {
                    return d.data.percentage === 40 ? 'green' : 'red';
                });

            d3.selectAll('.legend')
                .attr('transform', (d, i) => 'translate(0,' + (i * 20 + height / 4) + ')');
        }

        const containerWidth = document.getElementById('chart8Container').offsetWidth;
        const width = Math.min(containerWidth, 700);
        const height = width;
        const radius = Math.min(width, height) / 2;

        const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        const svg = d3.select('#chart-container')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        const pie = d3.pie().value(d => d.percentage);
        const data_ready = pie(data);

        const path = svg.selectAll('path')
            .data(data_ready)
            .enter()
            .append('path')
            .attr('d', d3.arc()
                .innerRadius(0)
                .outerRadius(radius)
            )
            .attr('fill', d => {
                return d.data.percentage === 40 ? 'green' : 'red';
            })
            .attr('stroke', 'black')
            .style('stroke-width', '2px')
            .style('opacity', 0.7)
            .on('mouseover', function (event, d) {
                tooltip.transition()
                    .duration(200)
                    .style('opacity', 0.9);
                tooltip.html(d.data.country + ': ' + d.data.percentage + '%')
                    .style('left', (event.pageX) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function () {
                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
            });

        svg.append('text')
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .text('YouTube YouTubers Distribution');

        const legend = svg.selectAll('.legend')
            .data(data.map(d => d.country))
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', (d, i) => 'translate(0,' + (i * 20 + height / 4) + ')');

        legend.append('rect')
            .attr('x', width / 2 - 18)
            .attr('width', 18)
            .attr('height', 18)
            .style('fill', (d, i) => (i === 0 ? 'green' : 'red'));

        legend.append('text')
            .attr('x', width / 2 - 24)
            .attr('y', 9)
            .attr('dy', '.35em')
            .style('text-anchor', 'end')
            .text(d => d);

        const brush = d3.brush()
            .extent([[-700, -700], [document.body.clientWidth, height]])
            .on('end', brushed);

        svg.append('g')
            .attr('class', 'brush')
            .call(brush);

        function brushed(event) {
            const selection = event.selection;
            if (selection) {
                path.classed('selected', d => {
                    const centroid = d3.arc().innerRadius(0).outerRadius(radius).centroid(d);
                    const isSelected = (
                        selection[0][0] <= centroid[0] &&
                        centroid[0] <= selection[1][0] &&
                        selection[0][1] <= centroid[1] &&
                        centroid[1] <= selection[1][1]
                    );

                    if (isSelected) {
                        tooltip.transition()
                            .duration(200)
                            .style('opacity', 0.9);
                        tooltip.html(d.data.country + ': ' + d.data.percentage + '%')
                            .style('left', (event.pageX) + 'px')
                            .style('top', (event.pageY - 28) + 'px');
                    } else {
                        tooltip.transition()
                            .duration(500)
                            .style('opacity', 0);
                    }

                    // Disable hover functions outside the brushed area
                    path.on('mouseover', null).on('mouseout', null);

                    return isSelected;
                });
            } else {
                // Restore hover functions when the brush is not active
                path.on('mouseover', function (event, d) {
                    tooltip.transition()
                        .duration(200)
                        .style('opacity', 0.9);
                    tooltip.html(d.data.country + ': ' + d.data.percentage + '%')
                        .style('left', (event.pageX) + 'px')
                        .style('top', (event.pageY - 28) + 'px');
                })
                .on('mouseout', function () {
                    tooltip.transition()
                        .duration(500)
                        .style('opacity', 0);
                });
            }
        }

        window.addEventListener('resize', updateDimensions);
 */

/* LEVIEL CODE FIX FROM HERE BELOW */

// Load the CSV data
d3.csv("./data/top_100_youtubers.csv").then(function(data) {
    // Group the data by country and count the number of YouTubers in each country
    const countryCounts = d3.rollup(data, v => v.length, d => d.Country);

    // Convert the map to an array of { country, count } objects
    const countryData = Array.from(countryCounts, ([country, count]) => ({ country, count }));

    // Sort the data by count in descending order
    countryData.sort((a, b) => b.count - a.count);

    // Set up chart dimensions
    const width = document.getElementById('chart8Container').offsetWidth;
    const height = width - 320;
    const radius = Math.min(width, height) / 2;

    // Create SVG container
    const svg = d3.select("#chart8Container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Define your own color scale
    const color = d3.scaleOrdinal()
        .range(["#734a10", "#fe3e11", "#fff7ed", "#a47604", "#1e6367", "#b263e9", "#ff7119", "#46b9bb", "#efd103"]);

    // Create a pie layout
    const pie = d3.pie().value(d => d.count);

    // Create an arc generator
    const arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0)
        .startAngle(function(d) { return d.startAngle + Math.PI / 2; })
        .endAngle(function(d) { return d.endAngle + Math.PI / 2; });

    // Create arcs
    const arcs = svg.selectAll(".arc")
        .data(pie(countryData))
        .enter().append("g")
        .attr("class", "arc")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Append paths
    arcs.append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => color(i))
        .style("opacity", 0);

    // Add a delay to the transition
    svg.selectAll("path")
        .transition()
        .duration(1000)
        .style("opacity", 1);

    // Add chart title
    d3.select("#chart8Title")
        .append("h5")
        .attr("class", "highlight")
        .html("Country Distribution of Top 100 YouTubers");

    // Add a tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background", "#ffffff")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("font-size", ".7rem");

    // Add interactivity to the arcs
    arcs.on("mouseover", function(event, d) {
        // Make the tooltip visible and set its content
        tooltip.style("opacity", 1)
            .html(`${d.data.country}<br/>Count: ${d.data.count}`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 10) + "px");
    })
    .on("mousemove", function(event) {
        // Position the tooltip near the mouse pointer
        tooltip.style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 10) + "px");
    })
    .on("mouseout", function() {
        // Hide the tooltip
        tooltip.style("opacity", 0);
    });

    // Add a legend
    const legendRectSize = 10;
    const legendSpacing = 4;
    const legendPerRow = 5;
    const legendHeight = Math.ceil(color.domain().length / legendPerRow) * (legendRectSize + legendSpacing);

    const legendSvg = d3.select("#chart8Legend")
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${width} ${legendHeight}`)
        .classed("svg-content", true)
        .selectAll(".chart8Legend")
        .data(countryData)
        .enter()
        .append("g")
        .attr("class", "chart8Legend")
        .attr("transform", function(_, i) {
            // Calculate total width of legend items
            const totalWidth = legendPerRow * (legendRectSize + legendSpacing) * 6;

            // Center the legend items
            const horz = (width - totalWidth) / 2 + (i % legendPerRow) * (legendRectSize + legendSpacing) * 6;
            const vert = Math.floor(i / legendPerRow) * (legendRectSize + legendSpacing);

            return `translate(${horz}, ${vert})`;
        })
        .on('mousedown', function(event, d) {
            // Select all arcs
            const selectedArcs = arcs.filter(function(p) {
                return p.data.country === d.country;
            });

            // Dim the unselected arcs
            arcs.style('opacity', 0.3);

            // Highlight the selected arcs
            selectedArcs.style('opacity', 1);
        })
        .on('mouseup', function() {
            // Reset the opacity of all arcs
            arcs.style('opacity', 1);
        });
        d3.select("#chart8Legend").on('mouseover', function(event, d) {
            // Make the tooltip visible and set its content
            tooltip.style('opacity', 1)
                .html('Click the legend to highlight the chart');
        });

    legendSvg.append("rect")
        .attr("width", legendRectSize)
        .attr("height", legendRectSize)
        .style("fill", (_, i) => color(i))
        .style("stroke", (_, i) => color(i));

    legendSvg.append("text")
        .attr("x", legendRectSize + legendSpacing)
        .attr("y", legendRectSize)
        .style("font-size", "10px")
        .style("fill", "white")
        .text(d => d.country);
}).catch(function(error) {
    console.log(error);
});