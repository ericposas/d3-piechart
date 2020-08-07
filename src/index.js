import * as d3 from 'd3'
import './style.scss'


window.start = () => {
	let data = [
		{ name: 'Jim', votes: 12 },
		{ name: 'Sue', votes: 5 },
		{ name: 'Bob', votes: 21 },
		{ name: 'Ann', votes: 17 },
		{ name: 'Dan', votes: 3 }
	];
	let data2 = [
		{ name: 'Jim', votes: 21 },
		{ name: 'Sue', votes: 14 },
		{ name: 'Bob', votes: 7 },
		{ name: 'Ann', votes: 6 },
		{ name: 'Dan', votes: 18 }
	];
	let dsName = 'dataset 1'
	// create a pie data 'layout' for the data to feed into the 'path' 'd' attribute
	let pie = d3.pie().value(d => d.votes).padAngle(0.025)
	// arcMkr will process the pie data into and arc
	let arcMkr = d3.arc().innerRadius(50).outerRadius(150).cornerRadius(10)

	// create our ordinal scale for the pie chart
	let scC = d3.scaleOrdinal(d3.schemePastel1)
	.domain(pie(data).map(d => d.index))

	// create a <g> element and move it to (300, 175)
	let g = d3.select('svg')
	.attr('width', 620)
	.attr('height', 360)
	.style('background-color', 'lightgrey')
	.append('g').attr('transform', 'translate(300, 175)')

	// using the pie layout data, append a 'path' and enter the arc maker into the 'd' attr
	let path = g.selectAll('path')
	.data(pie(data), d => d.data.name).enter()
	.append('path')
	.attr('d', arcMkr)
	.attr('fill', d => scC(d.index))
	.attr('stroke', 'grey')

	// add our text elements in to corresponding pie slices
	// let texts = g.selectAll('text')
	// .data(pie, d => d.data.name).enter().append('text')
	// .text(d => `${d.data.name} ${d.data.votes}`)
	// .attr('x', d => arcMkr.innerRadius(70).centroid(d)[0])
	// .attr('y', d => arcMkr.innerRadius(70).centroid(d)[1])
	// .attr('font-family', 'sans-serif').attr('font-size', 11)
	// .attr('text-anchor', 'middle')

	let datasetName = d3.select('svg')
	.append('text').attr('id', 'datasetName')
	.text(dsName)
	.attr('x', 10)
	.attr('y', 350)
	.attr('font-family', 'arial')

	function makeCrosshair() {
		return d3.select('svg')
		.append('use').attr('href', '#crosshair')
		.attr('id', 'c_h')
		.attr('transform', `translate(500, 40) scale(4)`)
		.attr('stroke', 'black')
		.attr('stroke-width', 0.5)
	}

	function addMouseFollow(c) {
		d3.select('svg')
		.on('mousemove', function() {
			let mx = d3.mouse( d3.select('svg').node() )[0]
			let my = d3.mouse( d3.select('svg').node() )[1]
			c.attr('transform', `translate(${mx}, ${my}) scale(4)`)
		})
	}

	let c_h = makeCrosshair()
	c_h.call(addMouseFollow)

	g.on('click', () => {
		[data, data2] = [data2, data];
		if (dsName === 'dataset 1') dsName = 'dataset 2';
		else dsName = 'dataset 1';

		datasetName.text(dsName)

		path.data(pie(data)).merge(path)
		.transition().duration(1000)
		.attrTween('d', arcTween)

		// texts.data(pie).merge(texts)
		// .text(d => `${d.data.name} ${d.data.votes}`)
		// .transition().duration(1000)
		// .attr('x', d => arcMkr.innerRadius(70).centroid(d)[0])
		// .attr('y', d => arcMkr.innerRadius(70).centroid(d)[1])
		// if (d3.select('#legend')) d3.select('#legend').remove()
		makeLegend(pie(data))

	})

	makeLegend(pie(data))

	function makeLegend(pieData) {

		if (!window.doOnce) {

			let legend = d3.select('svg')
			.append('g')
			.attr('id', 'legend')

			legend.selectAll('rect')
			.data(pieData, d => d.data.name).enter().append('rect')
			.attr('width', 10)
			.attr('height', 10)
			.attr('x', 5)
			.attr('y', (d, i, ds) => i * 15 + 5)
			.attr('fill', d => scC(d.index))
			.attr('stroke', 'grey')

			legend.selectAll('text')
			.data(pieData, d => d.data.name).enter().append('text')
			.attr('x', 20)
			.attr('y', (d, i, ds) => (i + 1) * 15 - 1)
			.attr('font-size', 12)
			.attr('font-family', 'arial')
			.text(d => `${d.data.name}`)
			.attr('color', '#000')

			window.doOnce = true
		}

		d3.select('svg')
		.select('#legend').selectAll('.vote').remove()

		d3.select('svg')
		.select('#legend')
		.selectAll('.vote')
		.data(pieData).enter().append('text').attr('class', 'vote')
		.attr('x', 50)
		.attr('y', (d, i, ds) => (i + 1) * 15 - 1)
		.attr('font-size', 12)
		.attr('font-family', 'arial')
		.text(d => `${d.data.votes}`)

	}

	function arcTween(a) {
		let i = d3.interpolate(this._current, a)
		this._current = i(0)
		return function (t) {
			return arcMkr(i(t))
		}
	}

}
