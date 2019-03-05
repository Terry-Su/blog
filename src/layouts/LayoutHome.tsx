import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import Footer from '@/components/Footer/Footer'
import { PATH_ABOUT, PATH_HOW_IT_WORKS_SERIES } from '@/constants/paths'
import { STYLE_LAYOUT_HOME_HEADER_HEIGHT } from '@/styles/STYLES.ts'
import TSLink from '@cache/TSLink'

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
            height: "100%"
          }}
        >
          <div
            style={{
              width: "100%",
              height: `${STYLE_LAYOUT_HOME_HEADER_HEIGHT}px`
            }}
          >
            <div
              style={{
                display: "grid",
                placeItems: "center"
              }}
            >
              <h1>
                <TSLink to="/">Logo</TSLink>
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
                ["Articles", "/"],
                ["How It Works Series", PATH_HOW_IT_WORKS_SERIES],
                ["About", PATH_ABOUT]
              ].map(([value, path], index) => (
                <TSLink
                  key={index}
                  style={{
                    margin: "0 50px"
                  }}
                  to={path}
                >
                  {value}
                </TSLink>
              ))}
            </div>
          </div>
          <div
            style={{
              width: "100%",
              height: `calc( 100% - ${STYLE_LAYOUT_HOME_HEADER_HEIGHT}px )`
            }}
          >
            {...this.props.children}
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}
