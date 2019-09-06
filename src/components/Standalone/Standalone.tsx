import React, { Component } from 'react'
import styled from 'styled-components'

import StandaloneExample from './StandaloneExample/StandaloneExample'
import CodeLive from '../Live/CodeLive';

export default class Standalone extends Component {
  render() {
    return (
      <StyledRoot>
        {/* <StandaloneExample /> */}
        {/* <CodeLive /> */}
        <CodeLive
html={`
<div id="test"></div>
`}
css={`
#test { width: 100px; height: 100px; background: blue; }
`}
js={`
document.getElementById( 'test' ).onclick = () =>  alert( "test!" )
`}
/>
      </StyledRoot>
    )
  }
}


const StyledRoot = styled.div``
