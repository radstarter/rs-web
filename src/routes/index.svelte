<script>
  import { Container, Button, Modal, Card, Input } from 'svelte-chota';
  import * as yup from 'yup';

  let modalOpen;
  let modalText;

  let name, email, valid, errorName, errorEmail, refferer;

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
  }


  let schema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
  });

  function validateForm() {
    schema.isValid({
      name: name,
      email: email
    }).then(function (v) {
      valid = v;
      if(!valid) {
        isNameValid();
        isEmailValid();
      }
    });
  }

  function isNameValid() {
    try {
      schema.validateSyncAt("name", {name: name});
      errorName = false;
      } catch(e) {
      errorName = true;
      console.log(e);
    }
  }

  function isEmailValid() {
   try {
      schema.validateSyncAt("email", {email: email});
      errorEmail = false;
    } catch(e) {
      errorEmail = true;
      console.log(e);
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
    <Button on:click={setModalOpenSeed}>Join seed sale</Button>
    <Button on:click={setModalOpenProject}>Subscribe to new Projects</Button>
  </div>
  <div class="featured-projects">
    <h3>Featured Projects</h3>
    <hr/>
    COMING SOON
  </div>
  <Modal bind:open={modalOpen}>
    <Card>
      <h3>{@html modalText}</h3>
      <p><Input bind:error={errorName}  type="text" bind:value={name} on:input={isNameValid} placeholder="Name" /></p>
      <p><Input bind:error={errorEmail} type="text" bind:value={email} on:input={isEmailValid} placeholder="email" /></p>
      <Button on:click={validateForm}>Submit</Button>
    </Card>
  </Modal>
</Container>
