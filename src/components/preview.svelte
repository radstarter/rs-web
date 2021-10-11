<script>
	import Intro from './intro.svelte'; 
	import {
		organizationName,
		organizationType,
		shortDesc,
		tokenAddress,
		website,
		telegram,
		discord,
		twitter,
		medium,
		whitepaper,
		logo,
		cover,
		deepdive,
		mode,
		totalSupply,
		range,
		offset,
		factorExp,
		factorLin
	} from '../stores/apply-store.js';
</script>

<Intro 
	bind:organizationName={$organizationName} 
	bind:organizationType={$organizationType}
	bind:shortDesc={$shortDesc}
	bind:tokenAddress={$tokenAddress}
	bind:website={$website}
	bind:telegram={$telegram}
	bind:discord={$discord}
	bind:twitter={$twitter}
	bind:medium={$medium}
	bind:whitepaper={$whitepaper}
	bind:cover={$cover}
	bind:logo={$logo}
/>
