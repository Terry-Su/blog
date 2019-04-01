import React, { Component } from 'react'
import styled from 'styled-components'

import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import getDefaultData from '@/helpers/getDefaultData'

class Props extends DefaultComponentProps {}

class State {}

export default class NoteIsAutoTranslated extends Component<Props, State> {
  render() {
    const { noteIsAutoTranslated } = getDefaultData()
    return <StyledRoot>{noteIsAutoTranslated}</StyledRoot>
  }
}

const StyledRoot = styled.div`
  padding: 20px;
  border: 1px solid #1bc2fa;
  border-radius: 5px;
  background: white;
`
