        const data = [
            { country: 'US', percentage: 40 },
            { country: 'Other Countries', percentage: 60 },
        ];

        function updateDimensions() {
            const containerWidth = document.getElementById('chart8Container').offsetWidth;
            const width = Math.min(containerWidth, 700);
            const height = width;
            const radius = Math.min(width, height) / 2;

            d3.select('svg')
                .attr('width', width)
                .attr('height', height);

            d3.select('g')
                .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

            const pie = d3.pie().value(d => d.percentage);
            const data_ready = pie(data);

            d3.selectAll('path')
                .attr('d', d3.arc()
                    .innerRadius(0)
                    .outerRadius(radius)
                )
                .attr('fill', d => {
                    return d.data.percentage === 40 ? 'green' : 'red';
                });

            d3.selectAll('.legend')
                .attr('transform', (d, i) => 'translate(0,' + (i * 20 + height / 4) + ')');
        }

        const containerWidth = document.getElementById('chart8Container').offsetWidth;
        const width = Math.min(containerWidth, 700);
        const height = width;
        const radius = Math.min(width, height) / 2;

        const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        const svg = d3.select('#chart-container')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        const pie = d3.pie().value(d => d.percentage);
        const data_ready = pie(data);

        const path = svg.selectAll('path')
            .data(data_ready)
            .enter()
            .append('path')
            .attr('d', d3.arc()
                .innerRadius(0)
                .outerRadius(radius)
            )
            .attr('fill', d => {
                return d.data.percentage === 40 ? 'green' : 'red';
            })
            .attr('stroke', 'black')
            .style('stroke-width', '2px')
            .style('opacity', 0.7)
            .on('mouseover', function (event, d) {
                tooltip.transition()
                    .duration(200)
                    .style('opacity', 0.9);
                tooltip.html(d.data.country + ': ' + d.data.percentage + '%')
                    .style('left', (event.pageX) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function () {
                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
            });

        svg.append('text')
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .text('YouTube YouTubers Distribution');

        const legend = svg.selectAll('.legend')
            .data(data.map(d => d.country))
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', (d, i) => 'translate(0,' + (i * 20 + height / 4) + ')');

        legend.append('rect')
            .attr('x', width / 2 - 18)
            .attr('width', 18)
            .attr('height', 18)
            .style('fill', (d, i) => (i === 0 ? 'green' : 'red'));

        legend.append('text')
            .attr('x', width / 2 - 24)
            .attr('y', 9)
            .attr('dy', '.35em')
            .style('text-anchor', 'end')
            .text(d => d);

        const brush = d3.brush()
            .extent([[-700, -700], [document.body.clientWidth, height]])
            .on('end', brushed);

        svg.append('g')
            .attr('class', 'brush')
            .call(brush);

        function brushed(event) {
            const selection = event.selection;
            if (selection) {
                path.classed('selected', d => {
                    const centroid = d3.arc().innerRadius(0).outerRadius(radius).centroid(d);
                    const isSelected = (
                        selection[0][0] <= centroid[0] &&
                        centroid[0] <= selection[1][0] &&
                        selection[0][1] <= centroid[1] &&
                        centroid[1] <= selection[1][1]
                    );

                    if (isSelected) {
                        tooltip.transition()
                            .duration(200)
                            .style('opacity', 0.9);
                        tooltip.html(d.data.country + ': ' + d.data.percentage + '%')
                            .style('left', (event.pageX) + 'px')
                            .style('top', (event.pageY - 28) + 'px');
                    } else {
                        tooltip.transition()
                            .duration(500)
                            .style('opacity', 0);
                    }

                    // Disable hover functions outside the brushed area
                    path.on('mouseover', null).on('mouseout', null);

                    return isSelected;
                });
            } else {
                // Restore hover functions when the brush is not active
                path.on('mouseover', function (event, d) {
                    tooltip.transition()
                        .duration(200)
                        .style('opacity', 0.9);
                    tooltip.html(d.data.country + ': ' + d.data.percentage + '%')
                        .style('left', (event.pageX) + 'px')
                        .style('top', (event.pageY - 28) + 'px');
                })
                .on('mouseout', function () {
                    tooltip.transition()
                        .duration(500)
                        .style('opacity', 0);
                });
            }
        }

        window.addEventListener('resize', updateDimensions);
