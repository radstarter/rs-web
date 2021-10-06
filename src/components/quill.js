import Quill from "quill";

export function quill(node, options) {
    const quill = new Quill(node, {
        modules: {
            toolbar: [
                [{ header: [ 2] }],
                ["bold", "italic", "underline", "strike"],
                ["link", "blockquote", "image", "video"],
            		[{ list: "ordered" }, { list: "unordered" }],
	          	  [{ align: [] }]

            ]
        },
        placeholder: "Type something...",
        theme: "snow", // or 'bubble'
        ...options
    });
    const container = node.getElementsByClassName("ql-editor")[0];

    quill.on("text-change", function (delta, oldDelta, source) {
        node.dispatchEvent(
            new CustomEvent("text-change", {
                detail: {
                    html: container.innerHTML,
                    text: quill.getText()
                }
            })
        );
    });
}
