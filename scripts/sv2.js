d3.csv("./data/top_100_youtubers.csv").then(function (data) {
    updateTopChannel();

    function updateTopChannel() {
      
        var topChannel = d3.max(data, function (d) {
            return +d.EngagementRate; 
        });


        var topChannelData = data.find(function (d) {
            return +d.EngagementRate === topChannel;
        });

        d3.select("#sv2Title").selectAll("*").remove();
        var chartContainer = d3.select("#sv2");

        var svTitle = d3.select("#sv2Title")
            .append("h5")
            .classed("highlight", true) 
            .text("Channel with Top Engagement Rate")
            .style("opacity", 0) 
            .transition() 
            .duration(1000) 
            .style("opacity", 1); 

        var channelNameDiv = d3.select("#sv2SubTitle");

        var engagementRateDiv = d3.select("#sub2Num")
            .text(""); 
        var engagementRateDescDiv = d3.select("#sub2NumDesc")
            .text("");
            

        if (topChannelData) {
            channelNameDiv.append("h4")
                .text(topChannelData.ChannelName)
                .style("color", "#b263e9")
                .transition()
                .duration(1000)
                .style("color", "white"); 

            engagementRateDiv.append("p")
                .classed("data-body-text", true)
                .text(`${topChannelData.EngagementRate} %`); 
        } else {
            channelNameDiv.append("span").text("No data available.");
            engagementRateDiv.append("span").text("No data available.");
        }


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
});
