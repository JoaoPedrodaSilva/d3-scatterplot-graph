const req = new XMLHttpRequest();
req.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json', true)
req.onload = () => {
  const dataSet = JSON.parse(req.responseText)
  main(dataSet)
}
req.send()

function main(dataSet) {
  const tooltip = document.querySelector('#tooltip')
  const w = 800
  const h = 600
  const pad = 40

  const xScale = d3.scaleLinear()
                   .domain([d3.min(dataSet, d => d.Year - 1),
                            d3.max(dataSet, d => d.Year) + 1] )
                   .range([pad, w - pad])
  
  const yScale = d3.scaleTime()
                   .domain([d3.min(dataSet, d => new Date(d.Seconds * 1000)),
                            d3.max(dataSet, d => new Date(d.Seconds * 1000))])
                   .range([pad, h - pad])
  
  const xAxis = d3.axisBottom(xScale)
                  .tickFormat(d3.format('d'))
                d3.select('svg')
                  .append('g')
                  .attr('id', 'x-axis')
                  .attr('transform', 'translate(0, ' + (h - pad) + ')')
                  .call(xAxis)
  
  const yAxis = d3.axisLeft(yScale)
                  .tickFormat(d3.timeFormat('%M:%S'))
                d3.select('svg')
                  .append('g')
                  .attr('id', 'y-axis')
                  .attr('transform', 'translate('+ (pad) + ', 0)')
                  .call(yAxis)  
  
  d3.select('svg')
    .attr('width', w)
    .attr('height', h)
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
        .on('mouseover', (_, d) => {
          tooltip.style.left = xScale(d.Year) + 20 + 'px'
          tooltip.style.top = yScale(new Date(d.Seconds * 1000)) + 20 + 'px'
          tooltip.setAttribute('data-year', d.Year)
          tooltip.classList.add('visible')
          tooltip.innerHTML = (`
            ${d.Name}, ${d.Nationality}<br>
            Year: ${d.Year}, Time: ${d.Time}<br><br>
            ${d.Doping === '' ? 'No doping allegation' : d.Doping}
          `)          
        })
        .on('mouseout', () => {
          tooltip.classList.remove('visible')
        })
}

 

