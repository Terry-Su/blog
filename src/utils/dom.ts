export function loadCssLink( src: string, callback = () => {} ) {
  const link = document.createElement( "link" )
  link.rel = "stylesheet"
  link.type = "text/css"
  link.href = src
  link.onload = callback
  document.head.appendChild( link )
}

export function loadScript( src, callback = () => {} ) {
  const script = document.createElement( "script" )
  script.src = src
  script.onload = callback
  document.head.appendChild( script )
}
