<script>
  import { Container, Row, Col } from 'svelte-chota';
  import VizSupply from '../../components/viz-supply.svelte';
  const data = [
  {
    "size": 1000000,
    "label": "Seed Sale",
    "color": "rgb(100,180,200)"
  },
  {
    "size": 3500000,
    "label": "DAO Vault",
    "color": "rgb(150,200,250)"
  },
  {
    "size": 3000000,
    "label": "Public Sale",
    "color": "rgb(80,100,150)"
  },
  {
    "size": 1500000,
    "label": "Founder retention",
    "color": "rgb(72,61,139)"
  }
];
</script>
<svelte:head>
  <title>Radstarter - Learn</title>
</svelte:head>
  <div id="toppie">
    <Container>
<h1>Investment funding on Radix</h1>
<p>
  Radstarter is a community curated launchpad for startups and DAOs
  built on radix. It's a platform where projects can raise money, launch
  their tokens and build a community.
</p>
<p>
  The platform is governed by a dao (Decentralised Autonomous Organisation)
  this means that everybody has equal access to information. 
  If a project wants to raise with us they have to create a public 
  proposal with all the details. Then the collective can vote for or against. 
</p>
<p>
  All profit from raises are divided between stakeholders in the dao. Through
  consensus we can incubate or invest in projects that raise on our platform
  with capital from the vault. When we make smart decisions we all gain.
</p>


<h2>Token</h2>
  <Row>
    <Col size={6}>
      <h3>Information</h3>
      <tr>
        <td>Name</td><td>Radstarter Token</td>
      </tr>
      <tr>
        <td>Ticker</td><td>RST</td>
      </tr>
      <tr>
        <td>Type:</td><td>Profit Share / Governance</td>
      </tr>
      <tr>
        <td>Supply:</td><td>9.000.000 (Fixed)</td>
      </tr>
      <tr>
        <td>Seed Raise:</td><td>TBA</td>
      </tr>
      <tr>
        <td>Seed price:</td><td>0.5 XRD</td>
      </tr>
    </Col>
    <Col size={6}>
      <div class="viz">
        <VizSupply segments={data}/>
      </div>
    </Col>
</Row>
<h2>FAQ</h2>
<h3>How does the platform work?</h3>
<h3>How does the profit share model work?</h3>
<p>
  There are two vaults one that holds the funds of the dao, the dao-vault. And 
  one that holds the earnings, the dividend-vault. The profits from raises
  automatically go to the dividend-vault. You can then claim your share from
  the dividend-vault. The dao-vault generates it's profits by holding $RST tokens.
</p>

<h3>What is a limited curve?</h3>
<p>
  It is a curve that sets the price of the token by the amount of tokens sold,
  like a bonding curve. But unlike bonding curves limited curves only have a 
  buying curve and no selling curve. You can see it as a gumball machine that
  sells tokens, but every token that is bought increases the price of the next one. 
  This rewards early investors who take on more risk.
</p>

<h3>When will governance be completely implemented?</h3>
<p>
  We are currently working together with the radix guild to build 
  the backbone of our governance platform. We will roll it out piece by piece
  and slowly take off the training wheels. First we will roll out voting for
  the curation of projects, after that voting to control the vault. We will
  start moving more and more funds into the dao controlled vault until security
  is optimal, then all the funds will be controlled by the dao.
</p>
  </Container>
</div>

<style>
  .viz {
    width:100%;
    height:100%;
    text-align:center;
  }
  .viz h3 {
  }
</style>
