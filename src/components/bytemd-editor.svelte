<script>
	import { Editor } from 'bytemd'
	import 'bytemd/dist/index.min.css'
	import { deepdive } from '../stores/apply-store'	

	function handleMdChange(e) {
    $deepdive = e.detail.value;
  }
</script>

<p></p>
<Editor id="deepdive" value={$deepdive} on:change={handleMdChange} previewDebounce=10 />

<style>
	 :global(.bytemd) {
  height: calc(100vh - 200px);
	}
</style>

