export default function loadScript( src: string, callback?: any ) {
  const script = document.createElement( "script" )
  script.src = src
  script.onload = callback || function() {}
  document.head.appendChild( script )
} 