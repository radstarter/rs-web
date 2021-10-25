<script>
  import  PreviewFrontpage  from './preview-frontpage.svelte';
  import { Modal, Card, Row, Col, Input, Button } from 'svelte-chota';
  import * as yup from 'yup';
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
    tokenName,
    tokenTicker,
    tokenIcon,
    tokenTotalSupply,
    tokenFixedSupply,
    tokenTotalRaised,
    whitepaper,
    medium,
    logo,
    cover,
    code,
    discordHandler,
    email,
  } from '../stores/apply-store.js';

  $: {
    if ($tokenTotalRaised < 0) {
      $tokenTotalRaised = 0;
    }
  }
  //Mechanics for changing the template of the deepdive 
  function handleOrgChange() {
    if ($organizationType == "DAO") {
      $deepdive = $deepdiveTemplateDao;
    }
    if ($organizationType == "Venture"){
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
    if ($tokenAddress) {
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
      isTickerValid();
    }
  }
  //Validation 
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

  let errorName, errorDesc, errorAddress, errorTicker, errorWebsite, errorTelegram, errorDiscord, errorMedium, errorTwitter, errorWhitepaper, errorHandle, errorEmail, errorUpload;
  function isNameValid() {
    try {
      schemaBasics.validateSyncAt("organizationName", {organizationName: $organizationName});
      errorName = false;
      } catch(e) {
      errorName = true;
    }
  }
  function isDescValid() {
    try {
      schemaBasics.validateSyncAt("shortDesc", {shortDesc: $shortDesc});
      errorDesc = false;
      } catch(e) {
      errorDesc = true;
    }
  }
  function isAddressValid() {
    try {
      schemaBasics.validateSyncAt("tokenAddress", {tokenAddress: $tokenAddress});
      errorAddress = false;
      } catch(e) {
      errorAddress = true;
    }
  }
  function isTickerValid() {
    try {
      schemaBasics.validateSyncAt("ticker", {ticker : $tokenTicker});
      errorTicker = false;
      } catch(e) {
      errorTicker = true;
    }
  }
  function isWebsiteValid() {
    try {
      schemaBasics.validateSyncAt("website", {website: $website});
      errorWebsite = false;
      } catch(e) {
      errorWebsite = true;
    }
  }
  function isTelegramValid() {
    try {
      schemaBasics.validateSyncAt("telegram", {telegram: $telegram});
      errorTelegram = false;
      } catch(e) {
      errorTelegram = true;
    }
  }
  function isDiscordValid() {
    try {
      schemaBasics.validateSyncAt("discord", {discord: $discord});
      errorDiscord = false;
      } catch(e) {
      errorDiscord = true;
    }
  }
  function isMediumValid() {
    try {
      schemaBasics.validateSyncAt("medium", {medium: $medium});
      errorMedium = false;
      } catch(e) {
      errorMedium = true;
    }
  }
  function isTwitterValid() {
    try {
      schemaBasics.validateSyncAt("twitter", {twitter: $twitter});
      errorTwitter = false;
      } catch(e) {
      errorTwitter = true;
    }
  }
  function isWhitepaperValid() {
    try {
      schemaBasics.validateSyncAt("whitepaper", {whitepaper: $whitepaper});
      errorWhitepaper= false;
      } catch(e) {
      errorWhitepaper= true;
    }
  }
  function isHandleValid() {
    try {
      schemaBasics.validateSyncAt("discordHandler", {discordHandler: $discordHandler});
      errorHandle = false;
      } catch(e) {
      errorHandle = true;
    }
  }
  function isEmailValid() {
    try {
      schemaBasics.validateSyncAt("email", {email: $email});
      errorEmail = false;
      } catch(e) {
      errorEmail = true;
    }
  }
  function isUploadValid() {
    try {
      schemaBasics.validateSyncAt("uploadCode", {uploadCode: $code});
      errorUpload = false;
      } catch(e) {
      errorUpload = true;
    }
  }

</script>


<div id="input-container">
  <p></p>
    <p>
    <label for="orgname">Organisation name *</label>
    <Input type="text" bind:error={errorName} bind:value={$organizationName} on:focus={isNameValid} on:keyup={isNameValid} />
  </p>

  <p>
    <label for="organization">Organisation Type *</label>
    <select id="organization" bind:value={$organizationType} on:change={handleOrgChange}>
      <option value="DAO">DAO</option>
      <option value="Private Company">Private Company</option>
    </select>
  </p>
  
  <p>
    <label for="shortdesc">Describe the project in one sentence *</label>
    <Input type="text" bind:value={$shortDesc} bind:error={errorDesc} on:keyup={isDescValid} on:focus={isDescValid} />
  </p>

  
  <p>
    <label for="tokenaddress">Token Address *</label>
    <Input type="text" bind:value={$tokenAddress} bind:error={errorAddress} on:keyup={isAddressValid} on:focus={isAddressValid} on:blur={isTickerValid} />
    <Button outline primary on:click={fetchTokenData}>Get Token Info</Button>
  </p>
    <div id="token-details" class:error={errorTicker}>
      <h4>Token details</h4>
      {#if $tokenIcon}
        <img src={$tokenIcon} alt="token_logo">
      {/if}
      <h5>Supply: {$tokenTotalSupply.toLocaleString()}</h5>
      <h5>Name: {$tokenName}</h5>
      <h5>Ticker: {$tokenTicker} </h5>
      <h5>Fixed supply: {$tokenFixedSupply} </h5>
    </div>

  <p>
    <label for="total-raised">Previous rounds total raised *</label>
    <input type="number" bind:value={$tokenTotalRaised}>
  </p>
  <p>
    <label for="website">Website *</label>
    <Input type="url" placeholder="https://" bind:value={$website} bind:error={errorWebsite} on:keyup={isWebsiteValid} on:focus={isWebsiteValid} />
  </p>
  
  <p>
    <label for="telegram">Telegram</label>
    <Input type="url" placeholder="https://" bind:value={$telegram} bind:error={errorTelegram} on:keyup={isTelegramValid} />
  </p>
  <p>
    <label for="discord">Discord</label>
    <Input type="url" placeholder="https://" bind:value={$discord} bind:error={errorDiscord} on:keyup={isDiscordValid} />
  </p>

 <p>
    <label for="medium">Medium</label>
    <Input type="url" placeholder="https://" bind:value={$medium} bind:error={errorMedium} on:keyup={isMediumValid} />
  </p>


  <p>
    <label for="twitter">Twitter</label>
    <Input type="url" placeholder="https://" bind:value={$twitter} bind:error={errorTwitter} on:keyup={isTwitterValid} />
  </p>

  <p>
    <label for="whitepaper">Whitepaper</label>
    <Input type="url" placeholder="https://" bind:value={$whitepaper} bind:error={errorWhitepaper} on:keyup={isWhitepaperValid} />
  </p>
  <p>
    <label for="discord-handle">Your discord handle *</label>
    <Input type="text" bind:value={$discordHandler} bind:error={errorHandle} on:keyup={isHandleValid} on:focus={isHandleValid} />
  </p>
  <p>
    <label for="email">Your email *</label>
    <Input type="email" bind:value={$email} bind:error={errorEmail} on:keyup={isEmailValid} on:focus={isEmailValid} />
  </p>
  <h3>Preview mini:</h3>
  <Row>
    {#if $logo && $cover}
      <Col  size="6" sizeMD="4" sizeLG="4" ><PreviewFrontpage name={$organizationName} ticker={$tokenTicker} type={organizationType} description={$shortDesc} cover={$cover} logo={$logo} /></Col>
    {:else if $logo}
      <Col  size="6" sizeMD="4" sizeLG="4" ><PreviewFrontpage name={$organizationName} ticker={$tokenTicker} type={organizationType} description={$shortDesc} cover="https://res.cloudinary.com/dhxjflczp/image/upload/v1635003589/1920_hhdrhb.jpg" logo={$logo} /></Col>
    {:else if $cover}
      <Col  size="6" sizeMD="4" sizeLG="4" ><PreviewFrontpage name={$organizationName} ticker={$tokenTicker} type={organizationType} description={$shortDesc} cover={$cover} logo="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png" /></Col>
    {:else}
      <Col  size="6" sizeMD="4" sizeLG="4" ><PreviewFrontpage name={$organizationName} ticker={$tokenTicker} type={organizationType} description={$shortDesc} cover="https://res.cloudinary.com/dhxjflczp/image/upload/v1635003589/1920_hhdrhb.jpg" logo="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png" /></Col>
    {/if}
  </Row>
   <p>
   <button class="upload" on:click={()=>{fileinput.click();}}>Upload logo*</button>
    <input style="display:none" type="file" accept=".jpg, .png"
      on:change={(e)=>onFileSelected(e)} bind:this={fileinput}
    >

    <button class="upload-cover" on:click={()=>{fileinputCover.click();}}>Upload Cover*</button>
     <input style="display:none" type="file" accept=".jpg"
      on:change={(e)=>onCoverSelected(e)} bind:this={fileinputCover}
     >
  </p>
 <p>
    <label for="upload-code">Upload Code **</label>
    <Input type="text" bind:value={$code} bind:error={errorUpload} on:keyup={isUploadValid} on:focus={isUploadValid} />
 </p>
   <div id="info-sm">
     <p>
     ** To prevent spam on our fileservers we require you to request an upload
     code on the discord. You do not need the upload code to preview
   </p>
   </div>
   <Modal bind:open={modalOpen}>
    <Card>
      Wrong token address (use rri)
    </Card>
  </Modal>
</div>
<style>
  #info-sm {
    font-size:9pt;
  }
  #token-details {
    border:1px;
    border-style: solid;
    border-radius: 5px;
    border-color:var(--color-lightGrey);
    padding:10px;
    -webkit-transition: all 0.2s ease;
    transition: all 0.4s ease;
  }
  #token-details.error {
    border-color:var(--color-error);
  }
 </style>
