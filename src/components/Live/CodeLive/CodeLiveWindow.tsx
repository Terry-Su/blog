import React, { Component } from 'react'
import styled from 'styled-components'

import DefaultComponentProps from '@/__typings__/DefaultComponentProps'

export enum CodeLiveWindowType {
  HTML = 0,
  CSS = 1,
  JS = 2,
}

class Props {
  type?: CodeLiveWindowType
  value?: string
}

class State {}

export default class CodeLiveWindow extends Component<Props, State> {
  render() {
    const { type=CodeLiveWindowType.HTML, value = '' } = this.props
    return <StyledRoot contentEditable suppressContentEditableWarning >{value}</StyledRoot>
  }
}

const StyledRoot = styled.div``
