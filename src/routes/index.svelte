<script>
  import { Container, Button, Modal, Card, Input } from 'svelte-chota';
  import * as yup from 'yup';

  let modalOpen;
  let modalSuccesOpen;
  let modalText;

  let name, email, valid, errorName, errorEmail, refferer;
  let btnSubmitLoading = false;
  let btnSubmitDisabled = false;
  let showErrorSubmit = false;
  function setModalOpenSeed() {
    modalText = "Get notified about <a href=\"/learn/token\"> $RST </a>";
    refferer = "seed"
    setModal();
  }

  function setModalOpenProject() {
    modalText = "Subscribe to new projects";
    refferer = "project"
    setModal()
  }

  function setModal() {
    name="";
    email="";
    errorName = false;
    errorEmail = false;
    modalOpen = true;
    showErrorSubmit = false;
  }

  let schema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
  });

  function validateForm() {
    schema.isValid({
      name: name,
      email: email
    }).then(function (valid) {
      if(!valid) {
        isNameValid();
        isEmailValid();
      } else {
        handleSubmit();
      }
    });
  }

  async function handleSubmit() {
    btnSubmitLoading = true;
    btnSubmitDisabled = true;
    showErrorSubmit = false;

    let data = { data: { name: name, email: email, ref: refferer } };     
    const response = await fetch(
      `${window.location.origin}/.netlify/functions/create-email-sub`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    if (response.status == 200) {
      modalSuccesOpen = true;
      modalOpen = false;
    } else {
      console.log(response.status);
      btnSubmitLoading = false;
      btnSubmitDisabled = false;
      showErrorSubmit = true;
    }
  }

  function isNameValid() {
    try {
      schema.validateSyncAt("name", {name: name});
      errorName = false;
      } catch(e) {
      errorName = true;
    }
  }

  function isEmailValid() {
   try {
      schema.validateSyncAt("email", {email: email});
      errorEmail = false;
    } catch(e) {
      errorEmail = true;
    }
  }

</script>

<svelte:head>
  <title>Radstarter - The Radix Launchpad</title>
</svelte:head>
<Container>
  <div class="intro-main">
    <h3>
      We leverage swarm knowledge to bring
      you the best investment opportunities on Radix.
    </h3>
    <h4>Access rounds for high quality projects selected by the DAO</h4>
    <Button outline on:click={setModalOpenSeed}>Join seed sale</Button>
    <Button outline on:click={setModalOpenProject}>Subscribe to new Projects</Button>
  </div>
  <div class="featured-projects">
    <h3>Featured Projects</h3>
    <hr/>
    COMING SOON
  </div>
  <Modal bind:open={modalOpen}>
    <Card>
      <h3>{@html modalText}</h3>
      <p><Input bind:error={errorName}  type="text" bind:value={name}   on:keyup={isNameValid} placeholder="Name" /></p>
      <p><Input bind:error={errorEmail} type="text" bind:value={email} on:keyup={isEmailValid} placeholder="email" /></p>
      <Button loading={btnSubmitLoading} disabled={btnSubmitDisabled} on:click={validateForm}>Submit</Button>
      {#if showErrorSubmit}
        <div class="error-msg">
          Something went wrong,<br/> please try again later. 
          <img src="error.svg" height="33" width="33" alt="Error">
        </div>
      {/if}
    </Card>
  </Modal>
  <Modal  bind:open={modalSuccesOpen}>
    <div class="success">
      <img src="success.svg" height="120px" width="120px" alt="Succes" />
      <p>Succesfully joined the mailinglist.</p> 
    </div>
  </Modal>
</Container>

<style>
  .error-msg {
    position:absolute;
    left:18rem;
    bottom:0.7rem;
  }
  .error-msg img {
    position: absolute;
    left:-4rem;
    bottom:0.4rem;
  }
  .success {
    padding-top:1.2rem;
    text-align: center;
  }
</style>
