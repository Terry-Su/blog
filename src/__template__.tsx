import React, { Component } from 'react'
import styled from 'styled-components'

import DefaultComponentProps from '@/__typings__/DefaultComponentProps'

class Props extends DefaultComponentProps {}

class State {}

export default class Template extends Component<Props, State> {
  render() {
    return <StyledRoot>Template</StyledRoot>
  }
}

const StyledRoot = styled.div``
