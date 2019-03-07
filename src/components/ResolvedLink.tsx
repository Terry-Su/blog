import React, { Component } from 'react'

import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import TSLink from '@cache/TSLink'

class Props extends DefaultComponentProps {
  to: string
  children?: any
  history?: any
  className?: any
  style?: any
}

class State {}

export default class ResolvedLink extends Component<Props, State> {
  render() {
    const { style, ...rest } = this.props
    return (
      <TSLink
        style={{
          color: "unset",
          textDecoration: "none",
          ...style
        }}
        {...rest}
      />
    )
  }
}
