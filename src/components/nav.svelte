<script>
  import { Nav } from 'svelte-chota';
</script>
<Nav>

  <a slot="left" href="/">LOGO</a>
  <svelte:fragment slot= "right"> 
    <a href="/learn">Learn</a>
    <a href="/governance">Governance</a>
    <a href="/apply">Apply</a>
    <a href="/community">Community</a>
  </svelte:fragment>
</Nav>
