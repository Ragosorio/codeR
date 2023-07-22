import "./style.css";
import Split from "split-grid";
import r from "./r"
import { encode, decode } from 'js-base64'

function init() {
  const { pathname } = window.location
  const [rawHtml, rawCss, rawJs] = pathname.slice(1).split('%7C')

  const html = decode(rawHtml)
  const css = decode(rawCss)
  const js = decode(rawJs)

  $html.value = html
  $css.value = css
  $js.value = js

  const htmlForPreview = creatHtml(html, css, js);
  r("iframe").setAttribute("srcdoc", htmlForPreview)
}

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

const $js = r("#js");
const $html = r("#html");
const $css = r("#css");

$js.addEventListener("input", update);

$html.addEventListener("input", update);

$css.addEventListener("input", update);


const creatHtml = (html, css, js) => {
  

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
  const html = $html.value;
  const css = $css.value;
  const js = $js.value;
  
  const hashedCode = `${encode(html)}|${encode(css)}|${encode(js)}`
  window.history.replaceState(null, null, `/${hashedCode}`)

  const htmlForPreview = creatHtml(html, css, js)
  r("iframe").setAttribute("srcdoc", htmlForPreview)
};

init()