import React, { Component } from 'react'

import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import getDefaultData from '@/helpers/getDefaultData'

class Props extends DefaultComponentProps {}

class State {}

export default class Footer extends Component<Props, State> {
  render() {
    const { authorUrl } = getDefaultData()
    return (
      <div
        style={{
          display: "grid",
          placeItems: "center",
          height: "60px",
          padding: `5px`,
          margin: `40px 0 0 0`,
          background: `#182633`
        }}
      >
        <span
          style={{
            color: `rgba(255, 255, 255, 0.5)`,
            fontSize: "14px"
          }}
        >
          Copyright © 2017-{new Date().getFullYear()}{" "}
          <a
            style={{
              color: `#19affc`
            }}
            href={authorUrl}
          >
            Terry Su
          </a>{" "}
          ALL RIGHTS RESERVED
        </span>
      </div>
    )
  }
}
