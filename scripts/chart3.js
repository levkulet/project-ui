// Load the CSV file
d3.csv("./data/top_100_youtubers.csv").then(function (data) {

    // Data manipulation to get counts per country
    const counts = {};
    data.forEach(d => {
        const key = d.Country;
        counts[key] = (counts[key] || new Set()).add(d.ChannelName);
    });

    // Convert counts object to an array for D3
    const countsArray = Object.entries(counts).map(([Country, channels]) => {
        return { Country, count: channels.size };
    });

    // Set up the chart dimensions
    const margin = { top: 20, right: 20, bottom: 100, left: 70 };
    const barWidth = 40; // Adjust the bar width 
    const width = 960 - margin.left - margin.right // Adjusted width calculation
    const height = 500 - margin.top - margin.bottom;

    // Create SVG container
    const svg = d3.select("#tanya_bar_chart_container")
        .append("svg")
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr('viewBox', '0 0 ' + (width + margin.left + margin.right) + ' ' + (height + margin.top + margin.bottom))
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create x and y scales
    const xScale = d3.scaleBand().range([0, width - margin.left - margin.right]).padding(0.1); // Adjusted xScale range
    const yScale = d3.scaleLinear().range([height, 0]);

    // Set up the axes
    const xAxis = d3.axisBottom().scale(xScale);
    const yAxis = d3.axisLeft().scale(yScale).ticks(8).tickFormat(d3.format("d")); // Adjusted ticks and format

    // Assign data to scales
    xScale.domain(countsArray.map(d => d.Country));
    yScale.domain([0, 40]); // Set the desired domain range


    // Add x-axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("fill", "white") // Set x-axis text color to white
        .call(xAxis)
        .selectAll("text")
        .attr("fill", "white") // Set x-axis tick label color to white
        .attr("transform", "rotate(-45)"); // Rotate x-axis labels for better readability;
    

    // Add y-axis
    svg.append("g")
        .attr("fill", "white") // Set y-axis text color to white
        .call(yAxis)
        .selectAll("text")
        .attr("fill", "white"); // Set y-axis tick label color to white

    // Add label for y-axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("fill", 'white')
        .text("Number of YouTubers");

    // Create bars with initial transition and transforms
    const bars = svg.selectAll("rect")
        .data(countsArray)
        .enter().append("rect")
        .attr("x", d => xScale(d.Country))
        .attr("width", xScale.bandwidth())
        .attr("y", height) // Initial position at the bottom
        .attr("height", 0) // Initial height as 0
        .attr("fill", "#F05006")
        // Tooltip 
        .on("mouseover", function(event, d) {
            tooltip.style("visibility", "visible");
        })
        .on("mousemove", function (event, d) {
            tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px")
                .text("Country: " +  d.Country + ", " + "YouTubers: " + d.count);    
        })
        .on("mouseout", function (event, d) {
            tooltip.style("visibility", "hidden");
        })
        .transition()
        .duration(1000) // Transition duration
        .attr("y", d => yScale(d.count))
        .attr("height", d => height - yScale(d.count))
        

    // Add label for countries
    svg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 30) + ")") // Adjusted y-coordinate
        .style("fill", 'white')
        .style("text-anchor", "middle")
        .text("Countries");
})
    .catch(function (error) {
        console.log(error);
    });
