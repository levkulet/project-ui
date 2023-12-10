// Include D3.js library
var script = document.createElement('script');
script.src = "https://d3js.org/d3.v5.min.js";
document.head.appendChild(script);

// Wait for the script to load to ensure D3.js functions are available
script.onload = function() {
    // Set the dimensions of the chart
    var width = 500;
    var height = 500;
    var margin = {top: 50, right: 50, bottom: 50, left: 50};

    // Create a SVG container for the chart
    var svg = d3.select("body")
                .append("svg")
                .attr("width", width)
                .attr("height", height);

    // Define the data for the chart
    var data = [
        [
            {axis:"Entertainment", value:0.30},
            {axis:"Gaming", value:0.25},
            {axis:"Film", value:0.19},
            {axis:"News", value:0.10},
            {axis:"Music", value:0.15},
            {axis:"Education", value:0.05},
            {axis:"Other", value:0.03},
            {axis:"Sports", value:0.03}
        ]
    ];

    // Define the options for the radar chart
    var radarChartOptions = {
        w: width,
        h: height,
        margin: margin,
        maxValue: 0.5,
        levels: 5,
        roundStrokes: true,
        color: d3.scaleOrdinal().range(["#AFC52F", "#66A5AD"])
    };

    // Draw the chart, get a reference the created svg element :
    let svg_radar = RadarChart(".radarChart", data, radarChartOptions);
}
