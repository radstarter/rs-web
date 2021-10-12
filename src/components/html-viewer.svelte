<script>
	import DOMPurify from 'dompurify';

	export let dirtyHTML;

	$: clean = DOMPurify.sanitize(dirtyHTML);
</script>
<div class="html-viewer">
	{@html clean}
</div>
