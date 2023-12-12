d3.csv("./data/top_100_youtubers.csv").then(function (data) {
    updateTopChannel();

    function updateTopChannel() {

        data.forEach(function (d) {
            d.totalIncome = +d["Income q1"] + +d["Income q2"] + +d["Income q3"] + +d["Income q4"];
        });

        var topChannel = d3.max(data, function (d) {
            return d.totalIncome; 
        });

        var topChannelData = data.find(function (d) {
            return d.totalIncome === topChannel;
        });

        d3.select("#sv3Title").selectAll("*").remove();

        var chartContainer = d3.select("#sv3");

 
        var svTitle = d3.select("#sv3Title")
            .append("h5")
            .classed("highlight2", true) 
            .text("Channel with the Highest Earnings")
            .style("opacity", 0) 
            .transition() 
            .duration(1000) 
            .style("opacity", 1); 

        var channelNameDiv = d3.select("#sv3SubTitle");

        var earningsDiv = d3.select("#sub3Num")
            .text("");
        var earningsDescDiv = d3.select("#sub3NumDesc")
            .text("");

        if (topChannelData) {
            channelNameDiv.append("h4")
                .text(topChannelData.ChannelName)
                .style("color", "#ff7119")
                .transition()
                .duration(1000)
                .style("color", " white");

            earningsDiv.append("p")
                .classed("data-body-text", true)
                .text(`$ ${formatEarnings(topChannelData.totalIncome)} USD`);


            console.log("Formatted Earnings:", formatEarnings(topChannelData.totalIncome));
        } else {
            channelNameDiv.append("span").text("No data available.");
            earningsDiv.append("span").text("No data available.");
        }

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
