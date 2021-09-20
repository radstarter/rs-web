<script>
	import { scaleLinear } from 'd3-scale';
	import { line, curveBasis } from 'd3-shape';

	import Axis from './Axis.svelte';
	
	const height = 400;
	const margin = 40;
	let range = 10;
	let width;

	let mode = 'lin';
	let totalSupply = 1000000;
	let offset = 0.5;

	$: expMultiplier = (range - offset) / Math.pow(totalSupply, 2);
	$: minStepExp =  (range - offset) / (Math.pow(totalSupply, 2) * 100) ;
	$: limitExp = (range - offset) / Math.pow(totalSupply, 2);
	$: linMultiplier = (range - offset) / totalSupply;
	$: minStep = (range - offset) / (totalSupply * 100);
	$: limit = (range - offset) / totalSupply;

	$: xScale = scaleLinear()
		.domain([0, totalSupply])
		.range([margin, width - margin]);

	$: yScale = scaleLinear()
		.domain([0, range])
		.range([height - margin, margin]);

	 $: pathLine = line()
		.x(d => xScale(d.x))
		.y(d => yScale(d.y))
		.curve(curveBasis);
	
	$: step = totalSupply / width;

	let funcLin = function(x) {
		return x * linMultiplier + offset;
	}

	let funcExp = function(x) {
		return Math.pow(x,2) * expMultiplier + offset;
	}

	let data = [];

	$: {
		while(data.length) {
			data.pop()
		}
		for (let i = 0; i < totalSupply; i += step) {
			let z;
				if (mode == 'lin'){
					z = funcLin(i);
					linMultiplier = linMultiplier;
				} else {
					z = funcExp(i);
					expMultiplier = expMultiplier;
				}
				data.push({
					x: i,
					y: z
				})
				//Force trigger path update 
				pathLine = pathLine;
				offset = offset;
			}
	}
</script>

<div class='navigation'>
	<label for="mode">Mode</label>

	<select bind:value={mode}>
		<option value="lin">Linear</option>
		<option value="exp">Exponential</option>
	</select>

	<label for="tokens-loaded">Total tokens for sale</label>
	<input type="number" bind:value={totalSupply}>
	<label for="range">Range</label>
	<input type ="range" min=10 max=26 bind:value={range}>
	<label for="multiplier">Multiplier</label>
	{#if mode == 'lin'}
		<input type=range step={minStep} max={limit} bind:value={linMultiplier}>
		{linMultiplier}
	{/if}
	{#if mode == 'exp'}
		<input type="range" step={minStepExp} max={limitExp} bind:value={expMultiplier}>
		{expMultiplier}
	{/if}
	<label for="offset" >Offset</label>
	<input type="number" step=0.1 bind:value={offset}>
</div>

<div class='limited-curve' bind:clientWidth={width}>
	{#if width}
		<svg width={width} height={height}>
			<Axis {height} {margin} scale={xScale} position='bottom' />
			<Axis {height} {margin} scale={yScale} position='left' />
			<path
				d={pathLine(data)}
			/>
		</svg>
	{/if}
</div>


<style>
	path {
		stroke: pink;
		stroke-width: 2;
		fill: none;
		stroke-linecap: round;
	}
</style>
