<script>
  import { Container, Button } from 'svelte-chota'
</script>
<svelte:head>
  <title>Radstarter - For Ventures</title>
</svelte:head>

<div id="toppie">
  <Container>
    <h1>Investment funding on Radix</h1>
    <h3>Get access to capital for your Radix projects</h3>
    <p>
    Showcase your venture and get exposure to a collective of savvy Radix 
    investors. Connect with them on our platform and grow your community around
    it.
   </p>
   <h4>What are the criteria to get approved?</h4>
    <p>
      We are open to all projects that launch Radix tokens. From utility tokens
      to gamer tokens, to special defi instruments. When you are done reading
      this page. Just click at the button on the bottom of this page
      and you are taken to the apply page. There you can create a proposal to 
      register your venture or DAO to the platform. You will need quite some 
      time it's a long process since you create the whole proposal. I.e filling 
      in the basic information, writing the deep dive, creating
      the graphs, setting the cover image and reviewing. The finished proposal
      preview will look the same as the offering. Take a look to see what the 
      process is like.
    </p>
     <p>
      Note,  It is recommended to make a post on the Ventures/DAOs
      page of our forum and see if we are a match first. A basic template will
      be provided where you can fill in some general information.
      We can guide you through the whole process, 
      and help you with writing your deep dive. A basic template is provided,
      it's best to adhere to this template to get the highest chance in passing the 
      proposal. 
    </p>
    <h4>What happens after I've submitted the proposal?</h4>
    <p>
      You get a brand category on our forum, where you can communicate directly with the
      collective. Meanwhile your proposal gets voted on for one week,
      if the vote passes we instantiate a component on ledger where you have to
      send the amount of tokens to that you want to sell. The trustless
      <a href="/learn/for-investors#limited-curve">limited curve</a> or fixed
      price component will then be listed on our frontpage and investors can 
      start to buy tokens from the component. The brand category on our forum stays open
      throughout the whole raise, there you can build community with the people
      who believe in your project. If you want we can keep it open afterwards
      for direct communication with the people who believe in your project.
    </p>
    <h4>What is the price for listing on Radstarter?</h4>
    <p>
      We take 1% of the capital raised and 0.8% of the tokens offered. Creating
      a proposal is free, but if you want our help in writing the deep dive we 
      charge a small fee.
    </p>
    <h4>When can we start listing our tokens?</h4>
    <p>
      You can already apply and get listed, we will create a way to raise funds
      before the babylon release, when the new API update gets released.
    </p>
    <h4>What methods do you have to raise money?</h4>
    <p>
      We have several methods of raising:
    </p>
      <ul>
        <li>Dutch auction - Price starts high and declines according to a decay rate</li>
        <li>Crowd sale - ICO contract at a fixed price</li>
        <li>Batch auction - Trading happens in batches to prevent MEV</li> 
        <li>Limited curve - Curve that sets price by amount of tokens sold, each token sold pushes price upwards </li>
      </ul>
    <h4>Do you offer compliance as a service?</h4>
    <p>
      No we don't you are completely responsible for the legality of your token.
    </p>
    
  <div id="btn-container">
      <a href="/governance/apply"> <Button outline primary>Apply </Button></a>

    </div>
  </Container>
</div>
<style>
  #btn-container {
    margin-top:3rem;
    margin-bottom:3rem;
    text-align:center;
  }
</style>
