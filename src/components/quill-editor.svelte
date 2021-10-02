<script>
	import { onMount, afterUpdate } from 'svelte';

  export let setText = "";
  export let placeholder = "";
  export let outputHTML = "";

	let editor;
  let quill;

	export let toolbarOptions = [
		[{ header: 1 }, { header: 2 }, "blockquote", "link", "image", "video"],
		["bold", "italic", "underline", "strike"],
		[{ list: "ordered" }, { list: "ordered" }],
		[{ align: [] }],
		["clean"]
	];
	
  onMount(async () => {
		const { default: Quill } = await import("quill");
	
    quill = new Quill(editor, {
      modules: {
        toolbar: toolbarOptions
      },
      theme: "snow",
      placeholder: placeholder
    });

    quill.setContents([{ insert: setText }]);

    const container = editor.getElementsByClassName("ql-editor")[0];

    quill.on("text-change", function(delta, oldDelta, source) {
       outputHTML = container.innerHTML;
    });
  });

  let count = 0;
  $: {
    if (count > 0) {
      quill.setContents([{ insert: setText }]);
    }
    count++;
  }

</script>

<style>
  @import 'https://cdn.quilljs.com/1.3.6/quill.snow.css';
  .editor-wrapper {
    height:calc(100vh - 25rem);
  }
</style>
<p></p>
<div class="editor-wrapper">
  <div bind:this={editor} />
</div>
