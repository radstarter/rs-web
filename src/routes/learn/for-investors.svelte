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
  All profit from raises is divided between stakeholders in the dao. The dao has the option to
  invest in projects we launch with capital from the vault. So we are 
  not only a launchpad but also an incubator for innovative ventures on radix.
</p>


<h2>Token</h2>
  <Row>
    <Col>
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
    <Col>
      <div class="viz">
        <h3> Distribution </h3>
        <VizSupply segments={data}/>
      </div>
    </Col>
</Row>
<h2>FAQ</h2>
<h3>How does it work?</h3>
<h3>What is a limited curve?</h3>
<p>
  It is a curve that decides the price of the current token. You can see it as
  a gumball machine that sells tokens, but every token that is bought increases
  the price of the next token. This is to reward early investors and believers
  in the project. When more people believe in the project, it becomes more
  expensive. Bonding curves are usually unlimited, but our limited 
  curves have a fixed supply of tokens.
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
<h3>How do dividends work?</h3>
<p>
  There are two vaults one that holds the funds of the dao, the dao-vault. And 
  one that holds the earnings, the dividend-vault. The profits from raises
  automatically go to the dividend-vault. And it gets triggered twice a year
  to pay out the profits. The dao-vault generates it's profits from holding 
  $RST tokens.
</p>
</Container>
<style>
  .viz {
    width:100%;
    height:100%;
    text-align:center;
  }
  .viz h3 {
    position:absolute;
  }
</style>
