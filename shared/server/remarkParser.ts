import showdown from 'showdown'

export default function remarkParser( sourceText ) {
  const converter = new showdown.Converter( { metadata: true } )
  const html = converter.makeHtml( sourceText )
  return html
}
