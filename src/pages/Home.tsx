import React, { Component } from 'react'
import styled from 'styled-components'

import DefaultComponentProps from '@/__typings__/DefaultComponentProps'

import Articles from './Articles/Articles'

class Props extends DefaultComponentProps {}

class State {}

export default class Home extends Component<Props, State> {
  render() {
    return <Articles />
  }
}
