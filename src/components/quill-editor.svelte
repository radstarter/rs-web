<script>

	export const prerender = true;
	import { onMount } from 'svelte';
  import { Card, Modal } from 'svelte-chota';
  export let setDelta = "";
  export let placeholder = "";
  export let outputHTML = "";
  export let code = "";

	let editor;
  let modalOpen;
  let modalMessage;
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
    const { default: ImageUploader}  = await  import('quill-image-uploader');

    Quill.register('modules/imageUploader', ImageUploader);
    let quill = new Quill(editor, {
      modules: {
        toolbar: toolbarOptions,
        imageUploader: {
          upload: (file) => {
            const fileReader = new FileReader();
            return new Promise((resolve, reject) => {
              fileReader.addEventListener(
                "load",
                () => {
                  let base64ImageSrc = fileReader.result;

                  let transferImage = { code: code, image: base64ImageSrc};
                  
                  fetch(
                    `${window.location.origin}/.netlify/functions/upload-image`,
                    {
                      method: 'POST',
                      body: JSON.stringify(transferImage),
                    })
                    .then(response => response.json())
                    .then(result => {
                      resolve(result['secure_url'])
                    })
                    .catch(error => {
                      reject("Upload failed");
                      console.error(error);
                      modalOpen = true;
                      if (!code) {
                        modalMessage = "Set the Upload Key in Basic Information to upload images";
                      } else {
                        modalMessage = "Error while uploading the picture, try again later";
                      }
                  });
                });
              if (file) {
                fileReader.readAsDataURL(file);
              } else {
                reject("No file selected");
              }
            });
          }
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
<Modal bind:open={modalOpen}>
    <Card>
      {modalMessage}
    </Card>
  </Modal>

