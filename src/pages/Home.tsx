import React, { Component } from 'react'
import styled from 'styled-components'

import DefaultComponentProps from '@/__typings__/DefaultComponentProps'

import Articles from './Articles/Articles'

class Props extends DefaultComponentProps {}

class State {}

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`

export default class Home extends Component<Props, State> {
  render() {
    return (
      <Articles />
    )
  }
}
