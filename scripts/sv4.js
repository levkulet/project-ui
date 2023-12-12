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
        var chartContainer = d3.select("#sv4");

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

         // Create a tooltip
         var tooltip = d3.select("#sv4").append('div')
         .attr('class', 'tooltip')
         .style('opacity', 0)
         .style('position', 'absolute')
         .style("background", "#ffffff")
         .style("border", "solid")
         .style("border-width", "1px")
         .style("border-radius", "5px")
         .style("padding", "5px")
         .style('font-size', '.7rem');

     // Add interactivity 
     chartContainer.on('mouseover', function (event, d) {
         // Make the tooltip visible and set its content
         tooltip.style('opacity', 1)
             .html(`Channel: ${topChannelData.ChannelName}
                 <br>Total Followers: ${topChannelData.followers}
                 <br>Category: ${topChannelData.Category}`);
     })
         /*            .on('mousemove', function (event) {
                        // Position the tooltip near the mouse pointer
                        tooltip.style('left', (event.pageX + 10) + 'px')
                            .style('top', (event.pageY - tooltip.node().offsetHeight - 100) + 'px');
                    })
         */
         .on('mouseout', function () {
             // Hide the tooltip
             tooltip.style('opacity', 0);
         });
    }
});
