d3.csv("./data/top_100_youtubers.csv").then(function (data) {
    updateTopChannel();

    function updateTopChannel() {
        var topChannel = d3.max(data, function (d) {
            return +d.followers;
        });

        var topChannelData = data.find(function (d) {
            return +d.followers === topChannel;
        });

        d3.select("#sv1Title").selectAll("*").remove();

        var svTitle = d3.select("#sv1Title")
            .append("h5")
            .classed("highlight2", true)
            .text("Channel with the Most subscribers")
            .style("opacity", 0)
            .transition()
            .duration(1000)
            .style("opacity", 1);

        var channelNameDiv = d3.select("#sv1SubTitle");
        var chartContainer = d3.select("#sv1");

        var followersDiv = d3.select("#subNum")
            .text("");
        var followersDescDiv = d3.select("#subNumDesc")
            .text("");

        if (topChannelData) {
            channelNameDiv
                .append("h4")
                .text(topChannelData.ChannelName)
                .style("color", "#ff7119")
                .transition()
                .duration(1000)
                .style("color", "white");

            var formattedFollowers = formatFollowers(topChannelData.followers);

            followersDiv
                .append("p")
                .classed("data-body-text", true)
                .text(`${formattedFollowers} subscribers`);
        } else {
            channelNameDiv.append("span").text("No data available.");
            followersDiv.append("span").text("No data available.");
        }


        var tooltip = d3.select("#sv1").append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0)
            .style('position', 'absolute')
            .style("background", "#ffffff")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "5px")
            .style('font-size', '.7rem');


        chartContainer.on('mouseover', function (event, d) {

            tooltip.style('opacity', 1)
                .html(`Channel: ${topChannelData.ChannelName}
                    <br>Total Followers: ${topChannelData.followers}
                    <br>Category: ${topChannelData.Category}`);
        })
            .on('mouseout', function () {
                tooltip.style('opacity', 0);
            });
    }

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
