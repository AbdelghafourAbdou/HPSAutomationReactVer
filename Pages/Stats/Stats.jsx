import { useEffect, useRef } from 'react';
import { useLoaderData } from 'react-router-dom';
import * as d3 from 'd3';
import './Stats.css';

const BASEPATH = 'http://localhost:8088/pwcAutomationTest/DataBase';

// eslint-disable-next-line react-refresh/only-export-components
export async function loader() {
    const res = await fetch(`${BASEPATH}/performanceStats`);
    const stats = await res.json();
    return stats;
}

export default function Stats() {
    const stats = useLoaderData();
    const processedStats = stats.slice(1).map(stat => {
        let [label, value] = stat.split(': ');
        return { label, value: +value };
    });
    const ref = useRef();

    useEffect(() => {
        const width = 350;
        const height = 450;
        const radius = 150;

        const svg = d3.select(ref.current)
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2},${height / 2 + 20})`);

        // Check if all values are zero
        const total = processedStats.slice(0, 2).reduce((acc, cur) => acc + cur.value, 0);
        if (total === 0) {
            svg.append("text")
                .attr("text-anchor", "middle")
                .attr('dy', '-0.35em')
                .text("No Data Available")
                .style("font-size", "16px")
                .style("fill", "#fff");

            return; // Exit if no data to visualize
        }

        const pie = d3.pie()
            .value(d => d.value)(processedStats);

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        const labels = d3.arc()
            .innerRadius(radius / 2)
            .outerRadius(radius);

        const color = d3.scaleOrdinal()
            .domain(processedStats.map(d => d.label))
            .range(d3.schemeCategory10);

        svg.selectAll('path')
            .data(pie)
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', (d, i) => color(i))
            .attr('stroke', 'white')
            .style('stroke-width', '2px');

        svg.selectAll('text')
            .data(pie)
            .enter()
            .append('text')
            .attr('transform', d => `translate(${labels.centroid(d)})`)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'middle')
            .text(d => d.data.label)
            .style('fill', '#fff')
            .style('font-size', '14px');

        svg.append('text')
            .attr('x', 0) // Centered at the middle of the svg
            .attr('y', -radius - 20) // Positioned above the pie chart
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .style('font-weight', 'bold')
            .style('fill', '#fff')
            .text('Test Cases Stats');
    }, [processedStats]);

    return (
        <>
            <div className='titleContainer'>
                Global Statistics
            </div>
            <div className='svgCenter'>
                <svg ref={ref} ></svg>
                <div className='statsSummary'>
                    {stats.map((stat, index) => <h1 key={index}>{stat}</h1>)}
                </div>
            </div>
        </>
    )
}
