d3.csv("./data/top_100_youtubers.csv").then(function (data) {
    updateTopChannel();

    function updateTopChannel() {
        // Calculate the total income for each channel
        data.forEach(function (d) {
            d.totalIncome = +d["Income q1"] + +d["Income q2"] + +d["Income q3"] + +d["Income q4"];
        });

        // Assuming the data is sorted by totalIncome in descending order
        var topChannel = d3.max(data, function (d) {
            return d.totalIncome; // Assuming "totalIncome" is a new numerical column
        });

        // Find the channel with the highest totalIncome
        var topChannelData = data.find(function (d) {
            return d.totalIncome === topChannel;
        });

        // Clear previous content
        d3.select("#sv3Title").selectAll("*").remove();
        //d3.select("#sv3").selectAll("*").remove();
        var chartContainer = d3.select("#sv3");

        // Create div elements and update their content
        var svTitle = d3.select("#sv3Title")
            .append("h5")
            .classed("highlight2", true) // Add a class to the div
            .text("Channel with the Highest Earnings")
            .style("opacity", 0) // Set initial opacity to 0
            .transition() // Apply transition
            .duration(1000) // Transition duration in milliseconds
            .style("opacity", 1); // Set final opacity to 1

        var channelNameDiv = d3.select("#sv3SubTitle");

        var earningsDiv = d3.select("#sub3Num")
            .text(""); // Clear previous content
        var earningsDescDiv = d3.select("#sub3NumDesc")
            .text(""); // Clear previous content

        if (topChannelData) {
            channelNameDiv.append("h4")
                .text(topChannelData.ChannelName)
                .style("color", "#ff7119") // Set initial color using CSS variable
                .transition()
                .duration(1000)
                .style("color", " white"); // Set final color using CSS variable

            earningsDiv.append("p")
                .classed("data-body-text", true)
                .text(`$ ${formatEarnings(topChannelData.totalIncome)} USD`); // Format earnings

            // Log the formatted Earnings value
            console.log("Formatted Earnings:", formatEarnings(topChannelData.totalIncome));
        } else {
            channelNameDiv.append("span").text("No data available.");
            earningsDiv.append("span").text("No data available.");
        }
        // Create a tooltip
        var tooltip = d3.select("#sv3").append('div')
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

    // Function to format earnings to add commas and specify "M" for million and "B" for billion
    function formatEarnings(earnings) {
        if (earnings >= 1000000000) {
            return (earnings / 1000000000).toFixed(2) + "B";
        } else if (earnings >= 1000000) {
            return (earnings / 1000000).toFixed(2) + "M";
        } else {
            return earnings.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }
});
