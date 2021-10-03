<script>
	import { onMount } from 'svelte';

  export let setDelta = "";
  export let placeholder = "";
  export let outputHTML = "";

	let editor;

	export let toolbarOptions = [
		[{ header: 2 },  "blockquote", "link", "image", "video"],
		["bold", "italic", "underline", "strike"],
		[{ list: "ordered" }, { list: "ordered" }],
		[{ align: [] }],
		["clean"]
	];
	
  onMount(async () => {
		const { default: Quill } = await import('quill');
    const { default: BlotFormatter } = await import('quill-blot-formatter');

    Quill.register('modules/blotFormatter', BlotFormatter);
    let quill = new Quill(editor, {
      modules: {
        toolbar: toolbarOptions,
        blotFormatter: {}
      },
      theme: "snow",
      placeholder: placeholder
    });

    quill.setContents(setDelta);

    const container = editor.getElementsByClassName("ql-editor")[0];

    quill.on("text-change", function(delta, oldDelta, source) {
      outputHTML = container.innerHTML;
      setDelta = quill.getContents();
    });
  });

</script>

<style>
  @import 'https://cdn.quilljs.com/1.3.7/quill.snow.css';
  .editor-wrapper {
    height:calc(100vh - 25rem);
  }
</style>

<p></p>
<div class="editor-wrapper">
  <div bind:this={editor} />
</div>
