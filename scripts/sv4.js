d3.csv("./data/top_100_youtubers.csv").then(function (data) {
    updateTopChannel();

    function updateTopChannel() {
        // Assuming the data is sorted by BoostIndex in descending order
        var topChannel = d3.max(data, function (d) {
            return +d.BoostIndex; // Assuming "BoostIndex" is a numerical column
        });

        // Find the channel with the highest BoostIndex
        var topChannelData = data.find(function (d) {
            return +d.BoostIndex === topChannel;
        });

        // Clear previous content
        d3.select("#sv4Title").selectAll("*").remove();
        d3.select("#sv4").selectAll("*").remove();

        // Create div elements and update their content
        var svTitle = d3.select("#sv4Title")
            .append("h5")
            .classed("highlight", true) // Add a class to the div
            .text("Channel with the Highest Boost Index")
            .style("opacity", 0) // Set initial opacity to 0
            .transition() // Apply transition
            .duration(1000) // Transition duration in milliseconds
            .style("opacity", 1); // Set final opacity to 1

        var channelNameDiv = d3.select("#sv4SubTitle");

        var boostIndexDiv = d3.select("#sub4Num")
            .text(""); // Clear previous content
        var boostIndexDescDiv = d3.select("#sub4NumDesc")
            .text(""); // Clear previous content

        if (topChannelData) {
            channelNameDiv.append("h4")
                .text(topChannelData.ChannelName)
                .style("color", "#b263e9") // Set initial color using CSS variable
                .transition()
                .duration(1000)
                .style("color", "white"); // Set final color using CSS variable

            boostIndexDiv.append("p")
                .classed("data-body-text", true)
                .text(`${topChannelData.BoostIndex} boost index`); // Format to two decimal places
        } else {
            channelNameDiv.append("span").text("No data available.");
            boostIndexDiv.append("span").text("No data available.");
        }
    }
});
