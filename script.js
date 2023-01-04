const req = new XMLHttpRequest();
req.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json', true)
req.onload = () => {
    const dataSet = JSON.parse(req.responseText)
    main(dataSet)
}
req.send()

function main(dataSet) {

    //constants  
    const w = 600
    const h = 570
    const pad = 65
    const tooltip = document.querySelector('.tooltip')
    const iframeContainer = document.querySelector('.iframe-container')
    const tooltipLeft = window.getComputedStyle(iframeContainer).width.replace('px', '')
    const tooltipBottom = window.getComputedStyle(iframeContainer).height.replace('px', '')

    //scales
    const xScale = d3.scaleLinear()
        .domain([d3.min(dataSet, d => d.Year - 1),
        d3.max(dataSet, d => d.Year) + 1])
        .range([pad, w - pad])

    const yScale = d3.scaleTime()
        .domain([d3.min(dataSet, d => new Date(d.Seconds * 1000)),
        d3.max(dataSet, d => new Date(d.Seconds * 1000))])
        .range([pad, h - pad])

    //axes
    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format('d'))
    d3.select('svg')
        .append('g')
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, ' + (h - pad) + ')')
        .style("font-size", "12px")
        .call(xAxis)

    const yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.timeFormat('%M:%S'))
    d3.select('svg')
        .append('g')
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + (pad) + ', 0)')
        .style("font-size", "12px")
        .call(yAxis)

    //title
    d3.select('svg')
        .append("text")
        .attr("x", w / 2)
        .attr("y", pad - 30)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .text("Doping in Professional Bicycle Racing");

    //circles and tooltip
    d3.select('svg')
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${w} ${h}`)
        .classed("svg-content", true)
        .selectAll('circle')
        .data(dataSet)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.Year))
        .attr('cy', d => yScale(new Date(d.Seconds * 1000)))
        .attr('r', 5)
        .attr('class', 'dot')
        .attr('data-xvalue', d => d.Year)
        .attr('data-yvalue', d => new Date(d.Seconds * 1000))
        .attr('fill', d => d.Doping !== '' ? 'red' : 'blue')
        .on('mouseover', (e, d) => {
            tooltip.style.left = e.clientX - (tooltipLeft * 0.20) + 'px'
            tooltip.style.top = e.clientY + (tooltipBottom * 0.05) + 'px'
            tooltip.setAttribute('data-year', d.Year)
            tooltip.classList.add('visible')
            tooltip.innerHTML = (`
            ${d.Name}, ${d.Nationality}<br>
            Year: ${d.Year}, Time: ${d.Time}<br><br>
            ${d.Doping === '' ? 'No doping allegation' : d.Doping}
        `)
        })
        .on('mouseout', () => tooltip.classList.remove('visible'))


    //labels

    d3.select('svg')
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(h / 2))
        .attr("y", 20)
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Time");

}





