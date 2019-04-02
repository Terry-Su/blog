// import mermaid from 'mermaid'
import { loadScript } from './dom'

export function initMermaid() {
  const codes = Array.from( document.getElementsByTagName( "code" ) )
  const mermaidCodes = codes.filter( dom => {
    const html = dom.innerHTML
    return html.startsWith( `graph` )
  } )

  // mermaidCodes.forEach( code => {
  //   code.setAttribute( "class", `mermaid` )
  // } )

  const render = () => {
    const mermaid = window[ "mermaid" ]
    mermaid.initialize( {
      startOnLoad: false
    } )

    mermaidCodes.forEach( ( codeDom, index ) => {
      const code = codeDom.innerText

      // # update style
      codeDom.style.display = "block"
      codeDom.style.width = "100%"
      codeDom.style.height = "100%"
      codeDom.style.textAlign = "center"

      // # render
      mermaid.mermaidAPI.render( `mermaid-element-${index}`, code, html => {
        codeDom.innerHTML = html
      } )
    } )
  }

  if ( window[ "mermaid" ] != null ) {
    render()
  } else {
    loadScript(
      "https://terry-su.github.io/CDN/libraries/mermaid/mermaid.min.js",
      () => {
        render()
      }
    )
  }
}
