<script>
	import { scaleLinear } from 'd3-scale';
	import { line, curveBasis } from 'd3-shape';
	import { bisector} from 'd3-array';
	import { onMount } from 'svelte';

	import Axis from './Axis.svelte';
	import {
		mode,
		totalSupply,
		range,
		offset,
		factorExp,
		factorLin
	} from '../stores/apply-store.js'

	const height = 400;
	const margin = 40;
	let width;

	let x = margin;
	let y = height - margin;
	let data = [{x: 0, y:0}];
	let point = data[0];
	let m = { x:0, y:0};
	var bisect = bisector((d) => d.x).right;

	let price;
	let profitTilPoint;
	let profitTilPointDisplay;

	$: xScale = scaleLinear()
		.domain([0, $totalSupply])
		.range([margin, width - margin]);

	$: yScale = scaleLinear()
		.domain([0, $range])
		.range([height - margin, margin]);

	$: factorExpLocal = ($range - $offset) / Math.pow($totalSupply, 2);
	$: minStepExp =  ($range - $offset) / (Math.pow($totalSupply, 2) * 100) ;
	$: limitExp = ($range - $offset) / Math.pow($totalSupply, 2);
	$: factorLinLocal = ($range - $offset) / $totalSupply;
	$: minStep = ($range - $offset) / ($totalSupply * 100);
	$: limit = ($range - $offset) / $totalSupply;


	let pathLine = line()
		.x(d => xScale(d.x))
		.y(d => yScale(d.y))
		.curve(curveBasis);
	
	$: step = $totalSupply / width;

	let funcLin = function(x) {
		return x * factorLinLocal + $offset;
	}

	let funcExp = function(x) {
		return Math.pow(x,2) * factorExpLocal + $offset;
	}

	function calculatePoint(){
		let i = bisect(data, xScale.invert(m.x));

		if (i < data.length) {
			point = data[i];
		}
		
		x = xScale(point.x);
		y = yScale(point.y);
		
		price = Number(point.y.toFixed(2));

		if ($mode == 'exp'){
			profitTilPoint = (point.x * (point.x + 1) * (2 * point.x + 1)) / 6 * factorExpLocal + $offset * point.x;
		}
		if ($mode == 'lin') {
			profitTilPoint = (point.x * ( point.x + 1) / 2) * factorLinLocal + $offset * point.x;
		}
		profitTilPointDisplay = Number(profitTilPoint).toLocaleString();
	}

	function resample()  {
		while(data.length) {
			data.pop()
		}
		if($offset < 0) { $offset = 0 }
		for (let i = 0; i < $totalSupply; i += step) {
			let z;
				if ($mode == 'lin'){
					z = funcLin(i);
				} else {
					z = funcExp(i);
				}
				data.push({
					x: i,
					y: z
				})
		}
		//Force trigger path update 
		pathLine = pathLine;
		calculatePoint();
	}

	function handleMousemove(event) {
		m.x = event.offsetX;
		m.y = event.offsetY;
		
		calculatePoint();
	}

	function setStore() {
		$factorExp = factorExpLocal;
		$factorLin = factorLinLocal;
	}
	
	//Count for not updating before width is set
	let count = 0;
	$: {
		//Redraw pathLine and tooltip when width updates
		pathLine = pathLine;
		if (count > 0) {
			x = xScale(point.x);
			y = yScale(point.y);
		}
		count++;
	}
	
	onMount(async () => {
		factorExpLocal = $factorExp;
		factorLinLocal = $factorLin;
		factorExpLocal = ($range - $offset) / Math.pow($totalSupply, 2);
		const sleep = ms => new Promise(f => setTimeout(f, ms));
		await sleep(10);
		resample();
		pathLine = pathLine;

	});
	
	const onInputTotalSupply = (e) => {
		$totalSupply = e.target.value;
		factorExpLocal = ($range - $offset) / Math.pow($totalSupply, 2);
		factorLinLocal = ($range - $offset) / $totalSupply;
		step = $totalSupply / width;
		resample();
	}
</script>
<p></p>
<div class='navigation'>
	<p>
		<label for="mode">Mode</label>
		<select bind:value={$mode} on:change={resample}>
			<option value="lin">Linear</option>
			<option value="exp">Exponential</option>
		</select>
	</p>
	<p>
		<label for="tokens-loaded">Total tokens for sale</label>
		<input type="number" on:input={onInputTotalSupply} bind:value={$totalSupply} >

	</p>
	
	<p>
		<label for="$range">Range</label>
		<input type ="range" min=1 max=33 bind:value={$range} on:input={resample}>
	</p>

	<p>
	<label for="multiplier">Factor</label>
		{#if $mode == 'lin'}
			<input type=range step={minStep} max={limit} bind:value={factorLinLocal} on:input={resample} on:change={setStore}>
		{/if}
		{#if $mode == 'exp'}
			<input type="range" step={minStepExp} max={limitExp} bind:value={factorExpLocal} on:input={resample} on:change={setStore}>
		{/if}
	</p>
	<p>
		<label for="offset" >offset</label>
		<input type="number" step=0.1 bind:value={$offset} on:change={resample}>
	</p>
</div>

<div class='limited-curve' bind:clientWidth={width} >
	{#if width}
		<svg width={width} height={height} on:mousemove={handleMousemove}>
			<Axis {width} {height} {margin} scale={xScale} position='bottom' />
			<Axis {width} {height} {margin} scale={yScale} position='left' />
			<path d={pathLine(data)}/>
			<circle class="point" cx={x} cy={y} r="4" />
		</svg>
	{/if}
</div>
<div class="output-point">
	Token price: {price} XRD
	Total earnings: {profitTilPointDisplay} XRD
</div>

<style>
	path {
		stroke: pink;
		stroke-width: 2;
		fill: none;
		stroke-linecap: round;
	}
	.point {
		fill: #000;
	}
</style>
