<script>
	import { Viewer } from 'bytemd'
	import 'bytemd/dist/index.min.css'
	import { deepdive } from '../stores/apply-store'	

	function handleMdChange(e) {
    $deepdive = e.detail.value;
  }
</script>

<p></p>
<Viewer  value={$deepdive} previewDebounce=10 />

<style>
	 :global(.bytemd) {
  height: calc(100vh - 200px);
	}
</style>

