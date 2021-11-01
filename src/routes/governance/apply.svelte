<script>
  import * as yup from 'yup';
  import { Tabs, Tab, Container, Button, Modal, Card } from 'svelte-chota';
  import LimitedCurveCreator from '../../components/limited-curve-creator.svelte'
  import BasicsForm from '../../components/basics-form.svelte';
  import Preview from '../../components/preview.svelte';
  import QuillEditor from '../../components/quill-editor.svelte';
  import {
    organizationName,
    organizationType,
    shortDesc,
    tokenAddress,
    tokenTotalSupply,
    tokenTicker,
    tokenFixedSupply,
    tokenTotalRaised,
    website,
    telegram,
    discord,
    medium,
    twitter,
    whitepaper,
    discordHandler,
    email,
    deepdive, 
    outputHTML,
    logo,
    cover,
    code,
  } from '../../stores/apply-store.js';

  let tab = 0;
  let modalText;
  let modalErrorOpen = false;
  function handleNext() {
    if(tab < 3) {
      tab++;
    } else {
      tab = 0;
    }
  }
 //Validation of form
  let schemaBasics = yup.object().shape({
    organizationName: yup.string().required(),
    organizationType: yup.string().required(),
    shortDesc: yup.string().required(),
    tokenAddress: yup.string().required(),
    supply: yup.number().required(),
    ticker: yup.string().required(),
    fixed: yup.boolean().required(),
    prevRaise: yup.number().required(),
    website: yup.string().url().required(),
    telegram: yup.string().url(),
    discord: yup.string().url(),
    medium: yup.string().url(),
    twitter: yup.string().url(),
    whitepaper: yup.string().url(),
    discordHandler: yup.string().required(),
    email: yup.string().email().required(),
    uploadCode: yup.string().required()
  });

  function validateForm() {
    schemaBasics.isValid({
      organizationName: $organizationName,
      organizationType: $organizationType,
      shortDesc: $shortDesc,
      tokenAddress: $tokenAddress,
      supply: $tokenTotalSupply,
      ticker: $tokenTicker,
      fixed: $tokenFixedSupply,
      prevRaise: $tokenTotalRaised,
      website: $website,
      telegram: $telegram,
      discord: $discord,
      medium: $medium,
      twitter: $twitter,
      whitepaper: $whitepaper,
      discordHandler: $discordHandler,
      email: $email,
      uploadCode: $code
    }).then(function (valid) {
      if (valid && $logo && $cover) {
        handleSubmit();
      }
      else {
        modalText = "<li>There are errors or missing information in the Info tab</li>";
        modalErrorOpen = true;
      }
    });
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
  <title>Radstarter - Apply</title>
</svelte:head>

<div id="toppie">
<Container>
  <h1> Create a proposal to submit your project </h1>
  <a href="#todo"> <Button outline primary>Request upload code </Button></a>
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
    <button class="btn-left" on:click={validateForm}>Submit</button>
  </div>
  {:else}
  <div class="btn-center">
    <button class="btn-left" on:click={handleNext}>Next</button>
  </div>
  {/if}
  <Modal bind:open={modalErrorOpen}>
    <div id="error-modal">
      <ul> {@html modalText} </ul>
    </div>
  </Modal>  
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
  #error-modal {
    padding:50px;
    color:var(--color-error);
  }
</style>
