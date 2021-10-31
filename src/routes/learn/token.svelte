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
    "size": 3000000,
    "label": "DAO Vault",
    "color": "rgb(150,200,250)"
  },
  {
    "size": 2500000,
    "label": "Public Sale",
    "color": "rgb(80,100,150)"
  },
  {
    "size": 2500000,
    "label": "Initial Contributors",
    "color": "rgb(95,158,160)",
  },
];
</script>
<svelte:head>
  <title>Radstarter - Learn</title>
</svelte:head>
  <div id="toppie">
    <Container>
<h1>RST Economy</h1>
<p>
  Radstarter is a community curated launchpad for startups and DAOs
  built on radix. It's a platform where projects can raise money, launch
  their tokens and build a community.
</p>
<p>
  The platform is governed by a dao (Decentralized Autonomous Organization)
  this means that everybody has equal access to information. There's no 
  hierarchies and it's open for everyone.
  If a project wants to raise with us they have to create a public 
  proposal with all the details. Then the collective can vote for or against. 
</p>
<p>
  All profit from raises are divided between members of the dao. Through
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
        <td>Type</td><td>Profit Share / Governance</td>
      </tr>
      <tr>
        <td>Supply</td><td>9.000.000 (Fixed)</td>
      </tr>
      <tr>
        <td>Seed Raise</td><td>TBA</td>
      </tr>
      <tr>
        <td>Seed price</td><td>0.4 XRD</td>
      </tr>
     <tr>
       <td>Public price</td><td><a href="/learn/for-investors#limited-curve">Limited Curve</a> 0.5 -> 2.5 XRD</td>
      </tr>
    </Col>
    <Col size={6}>
       <h3>Distribution</h3>
      <div class="viz">
        <VizSupply segments={data}/>
      </div>
    </Col>
</Row>
<h3>Initial Contributors</h3>
<p>
  We will have a period where tokens are payed out to the initial contributors. 
  Contributions will be tracked trough <a href="https://sourcecred.io/">SourceCred</a>.
  There is no founder retention, everybody will have equal opportunity to earn tokens.
  Not only coders will be rewarded, everybody in the collective will have a chance
  to earn tokens. From the apes to the creators. For more info check  
  <a href="/contribute">the contribute page</a>.
</p>
<h3>The profit share model</h3>
<p>
  There will be two vaults one that holds the funds of the dao, the dao-vault. And 
  one that holds the earnings, the dividend-vault. The profits from raises
  automatically go to the dividend-vault. You can then claim your share from
  the dividend-vault. The dao-vault generates it's profits by holding RST tokens.
</p>

<h3>The Governance Model</h3>
<p>
  We will use a hybrid of token and reputation based Holographic Consensus to 
  govern the vault. Holographic Consensus ensures scalability, while retaining 
  resiliency. In short it means a proposal has to reach absolute majority to pass. 
  Unless it's boosted, when it's boosted
  it only has to reach relative majority. If you want to know more check out 
  <a href="/governance/governance-model">our page on our governance model</a>.
</p>
<p>
  We are currently working together with the radix guild and adeptDAO to build 
  the backbone of our governance platform. We will roll it out piece by piece
  and slowly take off the training wheels. First we will roll out voting for
  the curation of projects, after that voting to control the vault. We will
  start moving more and more funds into the dao controlled vault until security
  is optimal, then all the funds will be controlled by the dao.
</p>
<div id="roadmap">
<h3>Roadmap</h3>
  <h4>Phase 1 - Creating the blueprints</h4>
  <p>
  This phase will coincide with Alexandria, here we build out the smart-contracts,
  we create the trustless <a href="/learn/for-investors#limited-curve">limited curve</a> 
  sale blueprint, the staking component and the voting blueprints.
  </p>
  <h4>Phase 2 - Launch Platform</h4>
  <p>
    This phase is right after the launch of babylon. In this phase we will launch the smart
    contracts and focus on marketing, and networking with as many projects
    as possible.
  </p>
  <h4>Phase 3 - Launch DAO</h4>
  <p>
    This is where the vault becomes part of the DAO, and the DAO can start to become
    an incubator. By now our voting contracts will be thoroughly tested.
  </p>
  <h4>Phase 4 - Iterate</h4>
  <p>
    Optimize marketing and tech, automate as much as possible, and make all
    processes trustless.
  </p>
  <h4>Phase 5 - Expand</h4>
  <p>
    Create the legal structure to create a launchpad for non crypto companies.
  </p>
</div>
</Container>
</div>

<style>
  .viz {
    width:100%;
    height:100%;
    text-align:center;
    position:grid;
  }
  #roadmap h4{
    font-weight:300;
    text-align:center;
  }
  #roadmap p {
    text-align:center;
  }
</style>
