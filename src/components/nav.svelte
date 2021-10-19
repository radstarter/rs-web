<script>
  import { Nav, Container, Button } from 'svelte-chota';
  let open = false;
  let learn = false;
  let governance = false;
  let community = false;

  function toggleBurger() {
    open = !open;
  }
  function toggleLearn() {
    learn = !learn;
  }
  function toggleGovernance() {
    governance = !governance;
  }
  function toggleCommunity() {
    community = !community;
  }
  function closeMenu() {
    open = false;
  }

</script>
<Container>
  <div class="navbar-desktop">
    <Nav> 
    <a slot="left" href="/">LOGO</a>
    <svelte:fragment slot= "right">
      <a href="/learn/for-investors">Learn</a>
      <a href="/governance">Governance</a>
      <a href="/apply">Apply</a>
      <a href="/community">Community</a>
    </svelte:fragment>
  </Nav>
  </div>
</Container>

<div class="navbar-mobile">
  <div class="logo"><a href="/" on:click={closeMenu}>LOGO</a></div>
  <div class="menu-btn" on:click={toggleBurger} class:open={open}>
    <div class="menu-btn-burger"></div>
  </div>
</div>
<div class="menu-mobile-content" class:open={open}>
  <ul class="ul-container">
    <li>
      <div class="dropdown-top" on:click={toggleLearn} class:open={learn}>Learn</div>
      <ul class="dropdown" class:open={learn}>        
        <li><a href="/learn/for-investors" on:click={toggleBurger}>For Investors</a></li>
        <li><a href="/learn/for-ventures" on:click={toggleBurger}>For Ventures</a></li>
        <li><a href="/learn/token" on:click={toggleBurger}>Token</a></li>
      </ul>
    </li>
    <li>
      <div class="dropdown-top" on:click={toggleGovernance} class:open={governance}>Governance</div>
      <ul class="dropdown" class:open={governance}>
        <li><a href="/governance/vote" on:click={toggleBurger}>Vote</a></li>
        <li><a href="/governance/apply" on:click={toggleBurger}>Apply</a>
      </ul>
    </li>
    <li>
      <div class="dropdown-top" on:click={toggleCommunity} class:open={community}>Community</div>
      <ul class="dropdown" class:open={community}>
        <li><a href="#todo" on:click={toggleBurger}>Discord</a></li>
        <li><a href="#todo" on:click={toggleBurger}>Forum</a></li>
      </ul>
    </li>
    <li><a href="/stake" on:click={toggleBurger}>Stake</a></li>
    <li><a href="/contribute"  on:click={toggleBurger}>Contribute</a></li>
  </ul>
</div>
<style>
  @media only screen and (max-width: 599px) {
      .navbar-desktop {
        display: none;
      }
      .navbar-mobile {
        display:flex;
        position:fixed;
        z-index:2;
        width:100%;
        height: 55px;
        background-color:#fff;
        top:0;
      }
      .logo {
        padding-top:2rem;
        padding-left:2rem;
      }
      .menu-btn {
        position:relative;
        display:flex;
        justify-content:center;
        align-items:center;
        width: 45px;
        height:45px;
        cursor:pointer;
        transition: all .3s ease-in-out;
        margin-left:auto;
        padding-right:2rem;
        padding-top:0.8rem;
      }
      .menu-btn-burger {
        width: 35px;
        height:5px;
        background: var(--color-lightGrey);
        border-radius:5px;
        transition: all .3s ease-in-out;
      }
      .menu-btn-burger::before,
      .menu-btn-burger::after {
        content: '';
        position:absolute;
        width:35px;
        height:5px;
        background:var(--color-darkGrey);
        border-radius: 5px;
        transition: all.3s ease-in-out;
      }

      .menu-btn-burger::before {
        transform: translateY(-11px);
      }
      .menu-btn-burger::after {
        transform: translateY(11px);
      }
      .menu-btn.open .menu-btn-burger {
        transform: translateX(-50px);
        background: transparent;
        box-shadow: none;
      }

      .menu-btn.open .menu-btn-burger::before {
        transform: rotate(45deg) translate(35px, -35px);
      }
      
      .menu-btn.open .menu-btn-burger::after {
        transform: rotate(-45deg) translate(35px, 35px);
      }
      .menu-mobile-content {
        display:none;
        font-size: 27pt;
        position:fixed;
        background-color:#fff;
      }

      .menu-mobile-content.open {
        display:flex;
        height:100vh;
        position:fixed;
        width:100%;
      }
      .menu-mobile-content li {
        list-style-type:none;
      }
      .menu-mobile-content a {
        color:inherit;
      }

      .menu-mobile-content ul .dropdown {
        overflow:hidden;
        transition:all .2s ease-in-out;
        line-height:0;
        padding: 0 1em;
        color:transparent;
      }

      .menu-mobile-content ul .dropdown.open {
        line-height: 1.5;
        color: inherit;
        font-size:23pt;
      }

      .dropdown-top {
        display:flex;
        cursor:pointer;
        align-items:center;
      }

      .dropdown-top::after {
        content: '';
        background-color:black;
        width:28px;
        height:16px;

        -webkit-mask: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iNyIgdmlld0JveD0iMCAwIDE1IDciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0tMS4zODA5MWUtMDUgLTQuODU0OThlLTA2TDUuMDk5OTkgNS43N0wtMS4zODA5MWUtMDUgMTEuNTQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEzLjMyIDEpIHJvdGF0ZSg5MCkiIHN0cm9rZT0iIzIzMTUzNiIgc3Ryb2tlLXdpZHRoPSIxLjciIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K") center center no-repeat;
        mask: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iNyIgdmlld0JveD0iMCAwIDE1IDciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0tMS4zODA5MWUtMDUgLTQuODU0OThlLTA2TDUuMDk5OTkgNS43N0wtMS4zODA5MWUtMDUgMTEuNTQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEzLjMyIDEpIHJvdGF0ZSg5MCkiIHN0cm9rZT0iIzIzMTUzNiIgc3Ryb2tlLXdpZHRoPSIxLjciIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K") center center no-repeat;
        transition: transform 0.2s ease 0s;
        display: inline-block;
      }

      .dropdown-top.open::after {
        transform:rotate(180deg);
      }
      .ul-container {
        padding-top:33px;
      }

  } 

@media only screen and (min-width: 599px) {
      .navbar-mobile{
        display: none;
      }
      .menu-mobile-content {
        display:none;
        }
  } 

</style>
