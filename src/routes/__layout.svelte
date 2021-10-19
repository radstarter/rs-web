<script>
  //import 'chota/dist/chota.min.css'
  import '../../chota/chota.css'
  import Nav from "../components/nav.svelte";
</script>
<Nav />
<slot></slot>
<style>
  :root {
    --font-family-sans: FT Base,-apple-system,system-ui,BlinkMacSystemFont,SF Pro Text,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
    --font-family-mono: font-family: FT Base,-apple-system,system-ui,BlinkMacSystemFont,SF Pro Text,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
  }
  :global(#toppie) {
    padding-top:55px;
  }
</style>
