<script>
	import { onMount } from 'svelte';
  import { deepdive } from '../stores/apply-store.js';
	let editor;
  let test= "testosterone";
	
	export let toolbarOptions = [
		[{ header: 1 }, { header: 2 }, "blockquote", "link", "image", "video"],
		["bold", "italic", "underline", "strike"],
		[{ list: "ordered" }, { list: "ordered" }],
		[{ align: [] }],
		["clean"]
	];
	
  onMount(async () => {
		const { default: Quill } = await import("quill");
	
    let quill = new Quill(editor, {
      modules: {
        toolbar: toolbarOptions
      },
      theme: "snow",
      placeholder: "Write an in depth review of the project"
    });
    quill.setContents([{ insert: $deepdive }]);
  });
</script>

<style>
  @import 'https://cdn.quilljs.com/1.3.6/quill.snow.css';
</style>
<p></p>
<div class="editor-wrapper">
  <div bind:this={editor} />
</div>
