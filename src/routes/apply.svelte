<script>
  import { Tabs, Tab, Container } from 'svelte-chota';
  import { setContext } from 'svelte'
  import LimitedCurveCreator from '../components/limited-curve-creator.svelte'
  import BasicsForm from '../components/basics-form.svelte';
  import BytemdEditor from '../components/bytemd-editor.svelte';

  let tab = 0;
  function handleNext() {
    if(tab < 3) {
      tab++;
    } else {
      tab = 0;
    }
  }
  function handleSubmit() {
  }
</script>
<Container>
  <h1> Create a proposal to submit your project </h1>
  <Tabs full bind:active={tab} >
    <Tab>Basic information</Tab>
    <Tab>Deep Dive</Tab>
    <Tab>Set Price</Tab>
    <Tab>Preview</Tab>
  </Tabs>
  {#if tab == 0}
    <BasicsForm />
  {/if}

  {#if tab == 1}
    <BytemdEditor />
  {/if}
  
  {#if tab == 2}
    <LimitedCurveCreator />
  {/if}

  <div class="btn-left">
  {#if tab == 3}
    <button class="btn-left" on:click={handleSubmit}>Submit</button>
  {:else}
    <button class="btn-left" on:click={handleNext}>Next</button>
  {/if}
  </div>
  
</Container>
<style>
  .btn-left {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
