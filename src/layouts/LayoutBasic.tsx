import React, { Component } from 'react'

import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import GlobalStyle from '@/styles/GlobalStyle'

class Props extends DefaultComponentProps {}

class State {}

export default class LayoutBasic extends Component<Props, State> {
  render() {
    return (
      <React.Fragment>
        <div {...this.props} />
        <GlobalStyle />
      </React.Fragment>
    )
  }
}
