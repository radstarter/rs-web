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
    logo
  } from '../stores/apply-store.js';

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
  let  fileinput;
	
	const onFileSelected =(e)=>{
  let image = e.target.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = e => {
                 $logo = e.target.result
            };
  }
</script>

<div id="input-container">
  <p></p>
  <p>
    <label for="orgname">Organisation name</label>
    <input type="text" bind:value={$organizationName}>
  </p>

  <p>
    <label for="organization">Organisation Type</label>
    <select id="organization" bind:value={$organizationType} on:change={handleOrgChange}>
      <option value="DAO">DAO</option>
      <option value="Private Company">Private Company</option>
    </select>
  </p>
  
  <p>
    <label for="shortdesc">Describe the project in one sentence</label>
    <input type="text" bind:value={$shortDesc}>
  </p>

  
  <p>
    <label for="tokenaddress">Token Address</label>
    <input type="url" bind:value={$tokenAddress}>
  </p>

  <p>
    <label for="website">Website</label>
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
    <label for="twitter">Twitter</label>
    <input type="url" bind:value={$twitter}>
  </p>
  <p>
    {#if $logo}
      <img class="logo" src="{$logo}" alt="d" />
    {:else}
      <img class="logo" src="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png" alt="" /> 
    {/if}
    <button class="upload" on:click={()=>{fileinput.click();}}>Upload logo</button>
    <input style="display:none" type="file" accept=".png"
      on:change={(e)=>onFileSelected(e)} bind:this={fileinput}
    >
  </p>
</div>
<style>
  .logo{
		display:flex;
		height:200px;
		width:200px;
	}
</style>
