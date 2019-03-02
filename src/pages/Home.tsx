import React, { Component } from 'react'
import styled from 'styled-components'

import DefaultComponentProps from '../__typings__/DefaultComponentProps'

class Props extends DefaultComponentProps {

}

class State {

}

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;


export default class Template extends Component<Props, State> {
  render() {
    return <div>
      <Title>Home</Title></div>
  }
}