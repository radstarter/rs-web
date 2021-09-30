<script>
	export let organizationName;
	export let organizationType;
	export let shortDesc;
	export let tokenAddress;
	export let website;
	export let telegram;
	export let discord;
	export let twitter;
	export let logo;
</script>
<div class="intro">
	<h1>	{organizationName} </h1>
	{#if logo}
    <img class="logo" src="{logo}" alt="d" />
  {:else}
    <img class="logo" src="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png" alt="" /> 
	{/if}
	{shortDesc}
	{tokenAddress}

</div>

<style>
  .logo{
		display: flex;
		height:200px;
		width:200px;
	}
</style>
