<script>
	export let name;
	export let ticker;
	export let description;
	export let cover;
	export let logo;
</script>

<div id="preview-main">
  <div id="image-container">
    {#if cover}
        <img class="cover" src={cover} alt="preview-cover"/>
    {/if}
    <div id="logo-container">
      {#if logo}
        <img class="logo" src="{logo}" alt="d" />
      {/if}
    </div>
  </div>
  <div id="details">
    <h3>{name}</h3>
    <h4>${ticker}</h4>
    <p>{description}</p>
  </div>
</div>
<style>
  #image-container {
    position:relative;
  }
  #preview-main {
    width:100%;
    height:100%;
    box-sizing:border-box;
    border:1px;
    border-style:solid;
    border-radius:10px;
    border-color:var(--lightGrey);

  }
  #details {
    padding:1rem;
  }
  #logo-container {
    border:.375px;
    border-style: none;
    border-radius:0.75rem;
    background-color:#fff;
    position:absolute;
    height:92px;
    width:92px;
    left:16px;
    bottom:-30px;
  }
  .logo {
    width:80px;
    height:80px;
    margin-top:6px;
    margin-left:6px;
  }
  .cover { 
    border-top-left-radius: 10px;
    border-top-right-radius:10px;
  }

  h3 {
    margin-bottom:0px;
  }
  h4 {
    margin-top:0px;
    margin-bottom:0px;
  }

</style>
