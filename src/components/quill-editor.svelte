<script>

	export const prerender = true;
	import { onMount } from 'svelte';

  export let setDelta = "";
  export let placeholder = "";
  export let outputHTML = "";

	let editor;

	export let toolbarOptions = [
		[{ header: 2 },  "blockquote", "link", "image", "video"],
		["bold", "italic", "underline", "strike"],
		[{ list: "ordered" }, { list: "bullet" }],
		[{ align: [] }],
    ["clean"],
	];
	
  onMount(async () => {
    try {
    const { default: Quill } = await import('quill');
    const { default: ImageCompress }  = await  import('quill-image-compress');

    Quill.register('modules/imageCompress', ImageCompress);
    let quill = new Quill(editor, {
      modules: {
        toolbar: toolbarOptions,
        imageCompress: {
          quality: 0.9,
          maxWidth: 1024,
          maxHeight: 768,
          debug: false,
          imageType: 'image/jpeg'
        }
      },
      theme: "snow",
      placeholder: placeholder
    });

    quill.setContents(setDelta);

    const container = editor.getElementsByClassName("ql-editor")[0];

    quill.on("text-change", function(delta, oldDelta, source) {
      outputHTML = container.innerHTML;
      setDelta = quill.getContents();
    }); } catch (e) {
      console.log(e);
    }
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
