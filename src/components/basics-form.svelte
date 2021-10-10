<script>
  import {
    organizationName,
    organizationType,
    shortDesc,
    tokenAddress,
    website,
    telegram,
    discord,
    twitter,
    deepdive,
    deepdiveTemplateDao,
    deepdiveTemplatePrivate,
    logo,
    tokenName,
    tokenTicker,
    tokenIcon,
    tokenTotalSupply,
    tokenFixedSupply,
    tokenTotalRaised,
    whitepaper,
    medium,
    cover
  } from '../stores/apply-store.js';
  import { Modal, Card } from 'svelte-chota';

  //Mechanics for changing the template of the deepdive 
  function handleOrgChange() {
    if ($organizationType == "DAO") {
      $deepdive = $deepdiveTemplateDao;
    }
    if ($organizationType == "Private Company"){
      $deepdive = $deepdiveTemplatePrivate;    
    }
  }

  //Mechanics for displaying the logo
  let  fileinput, fileinputCover;
	
	const onFileSelected =(e)=>{
  let image = e.target.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = e => {
                 $logo = e.target.result
            };
  }

 	const onCoverSelected =(e)=>{
  let image = e.target.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = e => {
                 $cover = e.target.result
            };
  }
 //Get token metadata
  let modalOpen = false;
  async function fetchTokenData() {
    const url = "https://mainnet.radixdlt.com/archive";
    let data = {
      jsonrpc: 2.0,
      method: "tokens.get_info",
      params: {
        rri: $tokenAddress
      },
      id: 1
    }
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });

    let responseObj = await response.json();

    if (responseObj['error']) {
      modalOpen = true;
      tokenOpen = false;
    } else {
      $tokenTotalSupply = Number(responseObj['result'].currentSupply / Math.pow(10, 18));
      $tokenTicker = responseObj['result'].symbol.toUpperCase();
      $tokenIcon = responseObj['result'].iconURL;
      $tokenName = responseObj['result'].name;
    }
  }
</script>

<div id="input-container">
  <p></p>
  <p>
    <label for="orgname">Organisation name*</label>
    <input type="text" bind:value={$organizationName}>
  </p>

  <p>
    <label for="organization">Organisation Type*</label>
    <select id="organization" bind:value={$organizationType} on:change={handleOrgChange}>
      <option value="DAO">DAO</option>
      <option value="Private Company">Private Company</option>
    </select>
  </p>
  
  <p>
    <label for="shortdesc">Describe the project in one sentence*</label>
    <input type="text" bind:value={$shortDesc}>
  </p>

  
  <p>
    <label for="tokenaddress">Token Address*</label>
    <input type="url" bind:value={$tokenAddress}>
    <button on:click={fetchTokenData}>Get Token Info</button>
    <Card>
      <h4 slot="header">Token details</h4>
      {#if $tokenIcon}
        <img src={$tokenIcon} alt="token_logo">
      {/if}
      <h5>Supply: {$tokenTotalSupply.toLocaleString()}</h5>
      <h5>Name: {$tokenName}</h5>
      <h5>Ticker: {$tokenTicker} </h5>
      <h5>Fixed supply: {$tokenFixedSupply} </h5>
    </Card>
  </p>
  <p>
    <label for="total-raised">Previous rounds total raised*</label>
    <input type="number" bind:value={$tokenTotalRaised}>
  </p>
  <p>
    <label for="website">Website*</label>
    <input type="url" bind:value={$website}>
  </p>
  
  <p>
    <label for="telegram">Telegram</label>
    <input type="url" bind:value={$telegram}>
  </p>
  <p>
    <label for="discord">Discord</label>
    <input type="url" bind:value={$discord}>
  </p>

 <p>
    <label for="medium">Medium</label>
    <input type="url" bind:value={$medium}>
  </p>


  <p>
    <label for="twitter">Twitter</label>
    <input type="url" bind:value={$twitter}>
  </p>

  <p>
    <label for="whitepaper">Whitepaper</label>
    <input type="url" bind:value={$whitepaper}>
  </p>

  <p>
    {#if $logo}
      <img class="logo" src="{$logo}" alt="d" />
    {:else}
      <img class="logo" src="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png" alt="" /> 
    {/if}
    <button class="upload" on:click={()=>{fileinput.click();}}>Upload logo</button>
    <input style="display:none" type="file" accept=".jpg"
      on:change={(e)=>onFileSelected(e)} bind:this={fileinput}
    >
  </p>
  <Card class="preview-card">
    {#if $cover}
      <img class="cover" src={$cover} alt="preview-cover"/>
    {/if}
    <h3>{$organizationName}</h3>
    <h4>${$tokenTicker}</h4>
  </Card>  
  <p>
    <button class="upload-cover" on:click={()=>{fileinputCover.click();}}>Upload Cover</button>
     <input style="display:none" type="file" accept=".jpg"
      on:change={(e)=>onCoverSelected(e)} bind:this={fileinputCover}
     >
  </p>
   <Modal bind:open={modalOpen}>
    <Card>
      Wrong token address (use rri)
    </Card>
  </Modal>
</div>
<style>
  .logo{
		display:flex;
		height:200px;
		width:200px;
	}
</style>
