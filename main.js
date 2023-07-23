import "./style.css";
import Split from "split-grid";
import r from "./r"
import { encode, decode } from 'js-base64'
import * as monaco from 'monaco-editor';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import JsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

const $js = r("#js");
const $html = r("#html");
const $css = r("#css");

const COMMOND_EDITOR_OPTIONS = {
  automaticLayout: true,
  fontSize: 14,
  theme: "vs-dark"
}

window.MonacoEnvironment = {
  getWorker (_, label){
    if (label === "html") return new HtmlWorker()
    if (label === "javascript") return new JsWorker()
    if (label === "css") return new CssWorker()
  }
}
  const { pathname } = window.location
  const [rawHtml, rawCss, rawJs] = pathname.slice(1).split('%7C')

  const html = decode(rawHtml)
  const css = decode(rawCss)
  const js = decode(rawJs)

  const htmlEditor = monaco.editor.create($html, {
    value: html,
    language: 'html',
    ...COMMOND_EDITOR_OPTIONS
  })

  const cssEditor = monaco.editor.create($css, {
    value: css,
    language: 'css',
    ...COMMOND_EDITOR_OPTIONS
  })

  const jsEditor = monaco.editor.create($js, {
    value: js,
    language: 'javascript',
    ...COMMOND_EDITOR_OPTIONS
  })

  htmlEditor.onDidChangeModelContent(update)
  cssEditor.onDidChangeModelContent(update)
  jsEditor.onDidChangeModelContent(update)
  
  const htmlForPreview = creatHtml(html, css, js);
  r("iframe").setAttribute("srcdoc", htmlForPreview)

Split({
  columnGutters: [{
      track: 1,
      element: r('.vertical-gutter'),
  }],
  rowGutters: [{
      track: 1,
      element: r('.horizontal-gutter'),
  }]
})


function creatHtml(html, css, js) {
  

  return `
  <!DOCTYPE html>
<html lang="en">
<head>
<style>
    ${css}
    </style>
</head>
<body>
${html}
<script> 
${js}
</script>
</body>
</html>
`;
};

function update () {
  const html = htmlEditor.getValue()
  const css = cssEditor.getValue()
  const js = jsEditor.getValue()
  
  const hashedCode = `${encode(html)}|${encode(css)}|${encode(js)}`
  window.history.replaceState(null, null, `/${hashedCode}`)

  const htmlForPreview = creatHtml(html, css, js)
  r("iframe").setAttribute("srcdoc", htmlForPreview)
};
