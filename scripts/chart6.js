var margin = {top: 20, right: 20, bottom: 100, left: 80},
    width = 960 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom,
    barWidth = 40;  // Set a fixed width for the bars

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

var tooltip = d3.select("body").append("div")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background", "#ffffff")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style('font-size','.7rem');

d3.csv("./data/top_100_youtubers.csv").then(function(data) {
    var countries = [...new Set(data.map(row => row.Country))];
    var select = d3.select("#countrySelect");
    select.selectAll('option')
            .data(countries)
            .enter()
            .append('option')
            .text(function (d) { return d; });

    select.on("change", function(d) {
        var value = d3.select(this).property("value");
        updateChart(value);
    });

    updateChart("IN");

    function updateChart(country) {
        // Remove the old chart
        d3.select("#VishnuChart").selectAll("*").remove();

        var svg = d3.select("#VishnuChart").append("svg")
                    .attr("preserveAspectRatio", "xMinYMin meet")
                    .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
                    .classed("svg-content", true)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        d3.select("#chartTitle").text(`Count of YouTube Channels by Country (${country})`);
        var filteredData = data.filter(row => row.Country === country);
        var categories = d3.nest()
                            .key(function(d) { return d.Category; })
                            .entries(filteredData);

        x.domain(categories.map(function(d) { return d.key; }));
        y.domain([0, d3.max(categories, function(d) { return d.values.length+1; })]);

        svg.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-45)");

        svg.append("text")             
            .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 70) + ")")
            .style("fill",'white')
            .style("text-anchor", "middle")
            .text("Categories");

        svg.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).ticks(11))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 200)
            .attr("x", 10)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Number of YouTube Channels");

        var bars = svg.selectAll(".bar")
            .data(categories)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.key) + (x.bandwidth() - barWidth) / 2; })  // Adjust the x position
            .attr("y", height)  // Set initial y position to create the effect of bars growing from the bottom
            .attr("width", barWidth)  // Use the fixed bar width
            .attr("height", 0)  // Set initial height to 0
            .attr("fill", '#ff7119')  // Set the color of the bars 
            .on("mouseover", function(event, d) {
                tooltip.style("visibility", "visible");
            })
            .on("mousemove", function(event, d) {
                tooltip.style("top", (event.pageY-10)+"px")
                       .style("left",(event.pageX+10)+"px")
                       .text("Category: " + d.key + ", Count: " + d.values.length);
            })
            .on("mouseout", function(event, d) {
                tooltip.style("visibility", "hidden");
            });

        bars.transition()  // Add the transition
            .duration(1000)  // Set the duration of the transition in milliseconds
            .attr("y", function(d) { return y(d.values.length); })  // Final y position
            .attr("height", function(d) { return height - y(d.values.length); });  // Final height
    }
});
