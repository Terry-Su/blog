import React, { Component } from 'react'
import styled from 'styled-components'

import DefaultComponentProps from '@/__typings__/DefaultComponentProps'

class Props extends DefaultComponentProps {
    html: string
    css: string
    js: string
}

class State {}

export default  class Sandbox extends Component<Props, State> {
    iframeRef = React.createRef()

    get iframe() { return this.iframeRef.current }

    componentDidMount() {
        
    }

    render() {
        const { html, css, js } = this.props
        // <iframe ref={this.iframeRef}/>
        return <StyledRoot>
            <div>{html}</div>
            <hr/>
            <div>{css}</div>
            <hr/>
            <div>{js}</div>
        </StyledRoot>
    }
}

const StyledRoot = styled.div``
