import React, { Component } from 'react'

import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import LayoutHome from '@/layouts/LayoutHome'

class Props extends DefaultComponentProps {

}

class State {

}



export default class About extends Component<Props, State> {
  render() {
    return <LayoutHome>About</LayoutHome>
  }
}