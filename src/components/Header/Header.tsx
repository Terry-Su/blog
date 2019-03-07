import React, { Component } from 'react'

import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import { PATH_ABOUT, PATH_HOW_IT_WORKS_SERIES } from '@/constants/paths'
import { STYLE_LAYOUT_HOME_HEADER_HEIGHT } from '@/styles/STYLES'

import ResolvedLink from '../ResolvedLink'
import Logo from '../svg/Logo'

class Props extends DefaultComponentProps {}

class State {}

export default class Header extends Component<Props, State> {
  render() {
    return (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: `${STYLE_LAYOUT_HOME_HEADER_HEIGHT}px`,
          justifyContent: "space-around",
          alignItems: `center`
        }}
      >
        <ResolvedLink
          style={
            {
              // margin: `0 0 0 40px`
            }
          }
          to="/"
        >
          <div
            style={{
              display: `flex`,
              alignItems: `center`
            }}
          >
            <Logo height="30" />
            <span
              style={{
                margin: "0 0 0 15px",
                fontSize: "22px",
                fontWeight: "bolder",
                letterSpacing: "0px",
                color: `#555`
              }}
            >
              Terry Su
            </span>
          </div>
        </ResolvedLink>
        <div
          style={{
            display: "flex",
            justifyContent: "center"
          }}
        >
          {[
            ["ARTICLES", "/"],
            ["HOW IT WORKS SERIES", PATH_HOW_IT_WORKS_SERIES],
            ["ABOUT", PATH_ABOUT],
            ["Github", ""]
          ].map(([value, path], index) => (
            <ResolvedLink
              key={index}
              style={{
                fontSize: "18px",
                margin: "0 25px",
                letterSpacing: "1px"
              }}
              to={path}
            >
              {value}
            </ResolvedLink>
          ))}
        </div>
      </div>
    )
  }
}
