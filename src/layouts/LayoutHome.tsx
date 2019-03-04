import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import { PATH_HOW_IT_WORKS } from '@/constants/paths'
import { LAYOUT_HOME_HEADER_HEIGHT } from '@/styles/STYLES.ts'

class Props extends DefaultComponentProps {}

class State {}

export default class LayoutHome extends Component<Props, State> {
  render() {
    return (
      <div
        style={{
          width: "100%",
          height: "100%"
        }}
      >
        <div
          style={{
            width: "100%",
            height: `${LAYOUT_HOME_HEADER_HEIGHT}px`
          }}
        >
          <div
            style={{
              display: "grid",
              placeItems: "center"
            }}
          >
            <h1>
              <Link to="/">Logo</Link>
              
              </h1>
            <span>Step by Step</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "20px 0 0 0"
            }}
          >
            {[
              [ "Articles", '/' ],
              [ "How it works", PATH_HOW_IT_WORKS ],
              [ "About", '/about' ],
             ].map(([ value, path ], index) => (
              <Link
                key={index}
                style={{
                  margin: "0 50px"
                }}
                to={ path }
              >
                {value}
              </Link>
            ))}
          </div>
        </div>
        <div
          style={{
            width: "100%",
            height: `calc( 100% - ${LAYOUT_HOME_HEADER_HEIGHT}px )`,
          }}
        >
          {...this.props.children}
        </div>
      </div>
    )
  }
}
