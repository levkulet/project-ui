d3.csv("./data/top_100_youtubers.csv").then(function (data) {
    updateTopChannel();

    function updateTopChannel() {
        // Assuming the data is sorted by EngagementRate in descending order
        var topChannel = d3.max(data, function (d) {
            return +d.EngagementRate; // Assuming "EngagementRate" is a numerical column
        });

        // Find the channel with the highest EngagementRate
        var topChannelData = data.find(function (d) {
            return +d.EngagementRate === topChannel;
        });

        // Clear previous content
        d3.select("#sv2Title").selectAll("*").remove();
        var chartContainer = d3.select("#sv2");

        // Create div elements and update their content
        var svTitle = d3.select("#sv2Title")
            .append("h5")
            .classed("highlight", true) // Add a class to the div
            .text("Channel with Top Engagement Rate")
            .style("opacity", 0) // Set initial opacity to 0
            .transition() // Apply transition
            .duration(1000) // Transition duration in milliseconds
            .style("opacity", 1); // Set final opacity to 1

        var channelNameDiv = d3.select("#sv2SubTitle");

        var engagementRateDiv = d3.select("#sub2Num")
            .text(""); // Clear previous content
        var engagementRateDescDiv = d3.select("#sub2NumDesc")
            .text(""); // Clear previous content
            

        if (topChannelData) {
            channelNameDiv.append("h4")
                .text(topChannelData.ChannelName)
                .style("color", "#b263e9") // Set initial color using CSS variable
                .transition()
                .duration(1000)
                .style("color", "white"); // #ff7119

            engagementRateDiv.append("p")
                .classed("data-body-text", true)
                .text(`${topChannelData.EngagementRate} %`); // Format to two decimal places
        } else {
            channelNameDiv.append("span").text("No data available.");
            engagementRateDiv.append("span").text("No data available.");
        }

        // Create a tooltip
        var tooltip = d3.select("#sv2").append('div')
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
        chartContainer.on('mouseover', function (event, d) {
            // Make the tooltip visible and set its content
            tooltip.style('opacity', 1)
                .html(`Channel: ${topChannelData.ChannelName}
                    <br>Total Followers: ${topChannelData.followers}
                    <br>Category: ${topChannelData.Category}`);
        })

            .on('mouseout', function () {
                // Hide the tooltip
                tooltip.style('opacity', 0);
            });
    }
});
