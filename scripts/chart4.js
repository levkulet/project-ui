// Load the CSV file
d3.csv("./data/avg_view_every_year.csv").then(function (data) {

    // Set up the chart dimensions
    const margin = { top: 20, right: 120, bottom: 110, left: 90 }; // Increased right margin
    const width = 900 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Define specific colors for the channels
    const channelColors = ['#FF7119', '#2FA4A8', '#5F2680', '#efd103', '#FE3E11'];
    const format = d3.format(","); // Format function for commas


    // Create SVG container
    const svg = d3.select("#line-chart-container")
        .append("svg")
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr('viewBox', '0 0 ' + (width + margin.left + margin.right) + ' ' + (height + margin.top + margin.bottom))
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create x and y scales
    const xScale = d3.scaleBand().range([0, width]).padding(0.1);
    const yScale = d3.scaleLinear().range([height, 0]);

    // Set up the axes
    const xAxis = d3.axisBottom().scale(xScale);
    const yAxis = d3.axisLeft().scale(yScale);

    // Assign data to scales
    const years = data.map(d => d.Year);
    const channels = Object.keys(data[0]).filter(key => key !== 'Year');

    xScale.domain(years);
    yScale.domain([0, d3.max(data, d => d3.max(channels, channel => +d[channel]))]);

    // Add x-axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("fill", "white")
        .call(xAxis)
        .selectAll("text")
        .attr("fill", "white") // Change tick label color to white
        .attr("transform", "rotate(-45)")
        .attr("x", -10)
        .attr("y", 0)
        .style("text-anchor", "end");

    // Add y-axis
    svg.append("g")
        .attr("fill", "white") // Change tick label color to white
        .call(yAxis)
        .selectAll("text")
        .attr("fill", "white"); // Change tick label color to white

    // Create line function
    const line = d3.line()
        .x(d => xScale(d.Year) + xScale.bandwidth() / 2)
        .y(d => yScale(d));

    // Add lines and dots with specific colors
    channels.forEach((channel, i) => {
        const color = channelColors[i];
        svg.append("path")
            .data([data.map(d => d[channel])])
            .attr("class", "line")
            .attr("d", line)
            .attr("stroke", color);

        svg.selectAll("dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", d => xScale(d.Year) + xScale.bandwidth() / 2)
            .attr("cy", d => yScale(d[channel]))
            .attr("r", 8)
            .style("fill", color)
            .on("mouseover", function (event, d) {
                const year = d.Year;
                const views = channels.map(ch => `${ch}: ${format(d[ch])}`).join("<br>"); // Format numbers with commas
                tooltip.style("visibility", "visible")
                    .html(`Year: ${year}<br>${views}`)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function () {
                tooltip.style("visibility", "hidden");
            });
    });

    // Add legend
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + (width - 40) + "," + (10) - 5 + ")"); // Adjusted legend position

    channels.forEach((channel, i) => {
        const color = channelColors[i]; // Use the same color for legend text

        legend.append("rect") // Add a rectangle for color representation
            .attr("x", 0)
            .attr("y", i * 20 - 5) // Adjust position for better alignment
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", color);

        legend.append("text")
            .attr("x", 15) // Adjust position for text
            .attr("y", i * 20 + 7) // Adjusted the y-position
            .attr("fill", "white")
            .text(channel);
    });

    // Add x-axis label
    svg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 20) + ")")
        .style("fill", 'white')
        .style("text-anchor", "middle")
        .text("Years");

    // Add y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 10 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "0.6em")
        .style("fill", 'white') // Change text color to white
        .style("text-anchor", "middle")
        .text("Number of Views");

    // Add tooltip
    const tooltip = d3.select("#line-chart-container")
        .append("div")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "rgba(255, 255, 255, 0.8)")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "black");

}).catch(function (error) {
    console.log(error);
});
