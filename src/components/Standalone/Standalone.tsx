import React, { Component } from 'react'
import styled from 'styled-components'

import StandaloneExample from './StandaloneExample/StandaloneExample'

const Standalone = StandaloneExample
// const Standalone = getComponents().TestReactLive

export default class Template extends Component {
  render() {
    return (
      <StyledRoot>
        <Standalone />
      </StyledRoot>
    )
  }
}

function getComponents() {
  return {
    StandaloneExample
  }
}

const StyledRoot = styled.div``
