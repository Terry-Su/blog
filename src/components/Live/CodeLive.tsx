import React, { Component } from 'react'
import styled from 'styled-components'

import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import CodeLiveWindow, { CodeLiveWindowType } from './CodeLive/CodeLiveWindow';

class Props extends DefaultComponentProps {
    html?: string
    css?: string
    js?: string
}

class State {}

export default  class CodeLive extends Component<Props, State> {
    iframeRef: any = React.createRef()

    constructor( props ) {
        super( props )
    }

    get iframe() { return this.iframeRef.current }

    get ifrmaeHtml() {
        const { html, css, js } = this.props
        return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<title>Document</title>
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
</html>`
    }

    componentDidMount() {
        // this.iframe.contentWindow.document.open()
        // this.iframe.contentWindow.document.write( this.ifrmaeHtml )
        // this.iframe.contentWindow.document.close()
    }

    render() {
        const { html, css, js } = this.props
        // <iframe ref={this.iframeRef}/>
        return <StyledRoot>
            {/* <div className="windows-zone">
            <CodeLiveWindow type={CodeLiveWindowType.HTML} value={html}></CodeLiveWindow>
            <CodeLiveWindow type={CodeLiveWindowType.CSS} value={css}></CodeLiveWindow>
            <CodeLiveWindow type={CodeLiveWindowType.JS} value={js}></CodeLiveWindow>
            </div>
            <div className="display-zone">
                <iframe ref={this.iframeRef} src={`data:text/html;charset=utf-8,${encodeURIComponent(this.ifrmaeHtml)}`} />
            </div> */}
            <iframe src={`http://localhost:3601?html=${encodeURIComponent(html)}&css=${encodeURIComponent(css)}&js=${encodeURIComponent(js)}`} ></iframe>
            {/* <iframe src={`http://localhost:3601?html=${encodeURIComponent(html)}`} ></iframe> */}
            
        </StyledRoot>
    }
}

const StyledRoot = styled.div``
