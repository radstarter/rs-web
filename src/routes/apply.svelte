<script>
  import { Tabs, Tab, Container } from 'svelte-chota';
  import LimitedCurveCreator from '../components/limited-curve-creator.svelte'
  import BasicsForm from '../components/basics-form.svelte';
  import Preview from '../components/preview.svelte';
  import QuillEditor from '../components/quill-editor.svelte';
  import { 
    deepdive, 
    outputHTML,
    logo,
    cover,
    code
  } from '../stores/apply-store.js';

  let tab = 0;
  let text = ""
  function handleNext() {
    if(tab < 3) {
      tab++;
    } else {
      tab = 0;
    }
  }
  async function handleSubmit() {
    let transferLogo = { code : $code, image: $logo };
    const response = await fetch(
      `${window.location.origin}/.netlify/functions/upload-image`,
      {
        method: 'POST',
        body: JSON.stringify(transferLogo),
      }
    );
    let statuscode = response.status;
    console.log(statuscode);
    if ( statuscode == 200) {
      const data = await response.json();
      let logoUrl = data['secure_url'];
      console.log(logoUrl);
    } else {

    }
  }
</script>

<svelte:head>
  <title>Radstarter - Create application proposal</title>
</svelte:head>
<div id="toppie">
<Container>
  <h1> Create a proposal to submit your project </h1>
  <Tabs full bind:active={tab} >
    <Tab>Info</Tab>
    <Tab>Dive</Tab>
    <Tab>Price</Tab>
    <Tab>Preview</Tab>
  </Tabs>
  {#if tab == 0}
    <BasicsForm />
  {/if}

  {#if tab == 1}
    <QuillEditor 
      bind:setDelta = {$deepdive}
      placeholder={"Write an in depth review of the project"}
      bind:outputHTML={$outputHTML}
      bind:code={$code}
    />
  {/if}
  
  {#if tab == 2}
    <LimitedCurveCreator />
  {/if}

  {#if tab == 3}
  <Preview />
  <div class="btn-center">
    <button class="btn-left" on:click={handleSubmit}>Submit</button>
  </div>
  {:else}
  <div class="btn-center">
    <button class="btn-left" on:click={handleNext}>Next</button>
  </div>
  {/if}
  
</Container>
</div>
<style>
  .btn-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  :global(Tabs){
    width:100%;
  }
</style>
