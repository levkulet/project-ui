d3.csv("./data/top_100_youtubers.csv").then(function (data) {
    updateTopChannel();

    function updateTopChannel() {
        // Assuming the data is sorted by followers in descending order
        var topChannel = d3.max(data, function (d) {
            return +d.followers; // Assuming "followers" is a numerical column
        });

        // Find the channel with the highest number of followers
        var topChannelData = data.find(function (d) {
            return +d.followers === topChannel;
        });

        // Clear previous content
        d3.select("#sv1Title").selectAll("*").remove();
        d3.select("#sv1").selectAll("*").remove();

        // Create div elements and update their content
        var svTitle = d3.select("#sv1Title")
            .append("h5")
            .classed("highlight2", true) // Add a class to the div
            .text("Channel with the Most subscribers")
            .style("opacity", 0) // Set initial opacity to 0
            .transition() // Apply transition
            .duration(1000) // Transition duration in milliseconds
            .style("opacity", 1); // Set final opacity to 1

        var channelNameDiv = d3.select("#sv1SubTitle");

        var followersDiv = d3.select("#subNum")
            .text(""); // Clear previous content
        var followersDescDiv = d3.select("#subNumDesc")
            .text(""); // Clear previous content

        if (topChannelData) {
            channelNameDiv
                .append("h4")
                .text(topChannelData.ChannelName)
                .style("color", "#ff7119") // Set initial color using CSS variable
                .transition()
                .duration(1000)
                .style("color", "white"); // Set final color using CSS variable

            // Format followers
            var formattedFollowers = formatFollowers(topChannelData.followers);

            followersDiv
                .append("p")
                .classed("data-body-text", true)
                .text(`${formattedFollowers} subscribers`);
        } else {
            channelNameDiv.append("span").text("No data available.");
            followersDiv.append("span").text("No data available.");
        }
    }

    // Function to format followers to "K", "M", or "B" format
    function formatFollowers(followers) {
        if (followers >= 1000000000) {
            return (followers / 1000000000).toFixed(1) + "B";
        } else if (followers >= 1000000) {
            return (followers / 1000000).toFixed(1) + "M";
        } else if (followers >= 1000) {
            return (followers / 1000).toFixed(1) + "K";
        } else {
            return followers.toString();
        }
    }
});
