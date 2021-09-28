<script>
  import { Tabs, Tab, Container } from 'svelte-chota';
  import LimitedCurveCreator from '../components/limited-curve-creator.svelte'
  import BasicsForm from '../components/basics-form.svelte';
  import DeepDive from '../components/deepdive.svelte';

  let tab = 0;
</script>
<Container>
  <h1> Create a proposal to submit your project </h1>
  <Tabs bind:active={tab}>
    <Tab>Basic information</Tab>
    <Tab>Deep Dive</Tab>
    <Tab>Set Price</Tab>
    <Tab>Preview</Tab>
  </Tabs>
  {#if tab == 0}
    <BasicsForm />
  {/if}

  {#if tab == 1}
    <DeepDive />
  {/if}
  
  {#if tab == 2}
    <LimitedCurveCreator />
  {/if}
</Container>
<style>
</style>
