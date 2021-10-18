<script>
  import { Nav, Container, Button } from 'svelte-chota';
</script>
<Container>
  <Nav class="navbar">
    <a slot="left" href="/">LOGO</a>
    <svelte:fragment slot= "right">
      <a href="learn/for-investors">Learn</a>
      <a href="/governance">Governance</a>
      <a href="/apply">Apply</a>
      <a href="/community">Community</a>
    </svelte:fragment>
  </Nav>
</Container>
<style>
</style>
