declare var Quill: any;

export function initTextEditor(selector: string, placeholder: string = '') {
  const quill = new Quill(selector, {
    modules: {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, !1] }],
          ["bold", "italic", "underline", "strike"],
          ["blockquote", "code-block"],
          //[{ header: 1 }, { header: 2 }],
          [{ list: "ordered" }, { list: "bullet" }],
          //[{ script: "sub" }, { script: "super" }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          [{ indent: "-1" }, { indent: "+1" }],
          ["link", "image", "video"],
          ["html"]
        ],
        handlers: {
          'html': () => { }
        }
      }
    },
    placeholder: placeholder,
    theme: "snow"
  });

  /**
   * Stolen from: https://jsfiddle.net/nzolore/1jxy58vn/
   */
  const htmlButton = document.querySelector('.ql-html');

  htmlButton.addEventListener('click', function() {
    let htmlEditor: any = document.querySelector('.ql-html-editor');
    if (htmlEditor) {
      //console.log(htmlEditor.value.replace(/\n/g, ""));
      quill.root.innerHTML = htmlEditor.value.replace(/\n/g, "");
      quill.container.removeChild(htmlEditor);
    } else {
      htmlEditor = document.createElement("textarea");
      htmlEditor.className = 'ql-editor ql-html-editor'
      htmlEditor.innerHTML = quill.root.innerHTML;
      quill.container.appendChild(htmlEditor);
    }
  });

  return quill;
}
