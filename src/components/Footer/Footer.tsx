import React, { Component } from 'react'

import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import getDefaultData from '@/helpers/getDefaultData'
import { STYLE_BOTTOM_HEIGHT } from '@/styles/STYLES'

class Props extends DefaultComponentProps {}

class State {}

export default class Footer extends Component<Props, State> {
  render() {
    const { authorUrl, copyright = {} } = getDefaultData()
    const { left, center, right } = copyright
    return (
      <div
        style={{
          boxSizing: `border-box`,
          display: "grid",
          placeItems: "center",
          height: `${STYLE_BOTTOM_HEIGHT}px`,
          background: `#182633`
        }}
      >
        <span
          style={{
            color: `rgba(255, 255, 255, 0.5)`,
            fontSize: "14px"
          }}
        >
          {left}
          {new Date().getFullYear()}{" "}
          <a
            style={{
              margin: `0 6px`,
              color: `#19affc`
            }}
            href={authorUrl}
          >
            {center}
          </a>{" "}
          {right}
        </span>
      </div>
    )
  }
}
