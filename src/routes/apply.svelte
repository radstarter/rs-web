<script>
  import LimitedCurveCreator from '../components/limited-curve-creator.svelte'
  import { afterUpdate } from 'svelte';
  import MarkdownIt from 'markdown-it';
  const md = new MarkdownIt();
  
  //Globals
  let organizationName = "";
  let organizationType = "";
  let shortDesc = "";
  let tokenAddress = "";
  let website = "";
  let telegram = "";
  let discord = "";
  let twitter = "";

  let deepdiveTemplatePrivate =
`### 1. PROJECT OVERVIEW

### 2. GO-TO-MARKET STRATEGY

### 3. PRODUCT VIABILITY 

### 4. PRODUCT ROADMAP

### 5. REVENUE STREAMS

### 6. PRODUCT DIVE

### 7. TECHNOLOGIES USED AND CREATED BY THE PROJECT

### 8. TEAM & ADVISORS

### 9. INVESTORS & PARTNERS

### 10. TOKEN ECONOMY

### 11. PREVIOUS RAISES

### 12. TOKEN DISTRIBUTION

### 13. TOKEN RELEASE SCHEDULE`;

  let deepdiveTemplateDao =
`### 1. PROJECT OVERVIEW

### 2. GO-TO-MARKET STRATEGY

### 3. DAO VIABILITY 

### 4. DAO ROADMAP

### 5. REVENUE STREAMS

### 6. PRODUCT(S) DIVE

### 7. TECHNOLOGIES USED AND CREATED BY THE PROJECT

### 8. FOUNDING MEMBERS

### 9. INVESTORS & PARTNERS

### 10. TOKEN ECONOMY

### 11. PREVIOUS RAISES

### 12. TOKEN AND OR REPUTATION DISTRIBUTION

### 13. TOKEN RELEASE SCHEDULE`;
  
  //Mechanics for changing the template of the deepdive 
  let deepdive= ``;
  function handleOrgChange() {
    if (organizationType == "DAO") {
      deepdive = deepdiveTemplateDao;
    }
    if (organizationType == "Private Company"){
      deepdive = deepdiveTemplatePrivate;    
    }
  }
  //Mechanics for rendering markdown as html in page
  //todo: Sanitize output.
  let resultDeepdive = ``;
  afterUpdate(() => {
    resultDeepdive = md.render(deepdive);
  });

  //Mechanics for displaying the logo
  let  logo, fileinput;
	
	const onFileSelected =(e)=>{
  let image = e.target.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = e => {
                 logo = e.target.result
            };
  }
</script>
<div id="input-container">
  <h2>Create a proposal for submitting your project</h2>

  <label for="orgname">Organisation name</label>
  <input type="text" bind:value={organizationName}>

  <label for="organization">Organisation Type</label>
  <select id="organization" bind:value={organizationType} on:change={handleOrgChange}>
    <option value="DAO">DAO</option>
    <option value="Private Company">Private Company</option>
  </select>

  <label for="shortdesc">Describe the organisation in one sentence</label>
  <input type="text" bind:value={shortDesc}>

  <button class="upload" on:click={()=>{fileinput.click();}}>Upload logo</button>
  <input style="display:none" type="file" accept=".png"
    on:change={(e)=>onFileSelected(e)} bind:this={fileinput}
  >

  <label for="tokenaddress">Token Address</label>
  <input type="url" bind:value={tokenAddress}>

  <label for="website">Website</label>
  <input type="url" bind:value={website}>
  <label for="telegram">Telegram</label>
  <input type="url" bind:value={telegram}>
  <label for="discord">Discord</label>
  <input type="url" bind:value={discord}>
  <label for="twitter">Twitter</label>
  <input type="url" bind:value={twitter}>

  <label for="deepdive">Deep dive (markdown)</label>
  <textarea id="deepdive" rows="30" cols="60" bind:value={deepdive} ></textarea>

  <label for="issueing-mechanism">Issueing Method</label>
  <!-- supposed to be tabs, but I'll leave the choice of UI kit to you -->
  <select>
    <option value="ltd">Limited Curve</option>
    <option value="fix">Fixed Price</option>
  </select>
  <LimitedCurveCreator />
</div>

<div id="output-container">
  <h2>Proposal Preview</h2>

  <div id="intro">
    {#if logo}
      <img class="logo" src="{logo}" alt="d" />
    {:else}
      <img class="logo" src="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png" alt="" />
    {/if}

    {#if organizationName}
      <h2> {organizationName} </h2>
    {:else}
      <h2> Organization </h2>
    {/if}

    {#if organizationType}
      Type: {organizationType}
    {:else}
       Type: empty
    {/if}
    <div id="links">
       <!-- I'll leave this to you -->
       <h5>Radix explorer: <a href="https://explorer.radixdlt.com/{tokenAddress}">
           {tokenAddress}</a></h5>
    </div>
    {#if shortDesc}
      {shortDesc}
    {:else}
      Short description of the organization
    {/if}

  </div>
  <div id="token-metrics">
    Ticker:<br/>
    #todo
    <hr/>
    Total Supply: <br/>
    #todo
    <hr/>
    Total Raise (All Rounds): <br/>
    #todo
    <hr/>
    Token Price: <br/>
    #todo either mini lc or fixed
    <hr/>
    Tokens for sale: <br/>
    #todo
  </div>
  <div id=deepdive>
    {@html resultDeepdive}
  </div>
</div>

<style>
  #input-container{
  	display:flex;
  	flex-flow:column;
  }

  #token-metrics{
    padding: 20px;
    width: 400px; 
    border-radius: 3%;
    border-style: solid;
    border-width: 1px;
  }

  .logo{
		display:flex;
		height:200px;
		width:200px;
	}

</style>
