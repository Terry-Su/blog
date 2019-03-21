import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import { PATH_ABOUT, PATH_HOW_IT_WORKS_SERIES } from '@/constants/paths'
import getDefaultData, { getCurrentPagePath } from '@/helpers/getDefaultData'
import { STYLE_LAYOUT_HOME_HEADER_HEIGHT } from '@/styles/STYLES'

import ResolvedLink from '../ResolvedLink'
import Logo from '../svg/Logo'

class Props extends DefaultComponentProps {
  isMini?: boolean
  history?: any
}

class State {}

class Header extends Component<Props, State> {
  onLogoClick = (event, defaultOnClick) => {
    defaultOnClick(event)
  }

  render() {
    const { isMini = false } = this.props
    const currentPath = getCurrentPagePath()
    const { pathnameRoot, logoTitle, texts = {} } = getDefaultData()
    return (
      <div
        style={{
          display: "flex",
          flexDirection: !isMini ? "column" : "row",
          justifyContent: !isMini ? "flex-start" : "space-around",
          alignItems: !isMini ? `center` : `center`,
          width: "100%",
          height: `${STYLE_LAYOUT_HOME_HEADER_HEIGHT}px`
        }}
      >
        <ResolvedLink to={pathnameRoot} onClick={this.onLogoClick}>
          <div
            style={{
              display: `flex`,
              alignItems: `center`,
              margin: !isMini ? "30px 0 0 0" : "0px"
            }}
          >
            <Logo height={!isMini ? "36" : "30"} />
            <span
              style={{
                margin: !isMini ? "0 0 0 15px" : "10px",
                fontSize: !isMini ? "24px" : "18px",
                fontWeight: "bold",
                letterSpacing: "0px",
                color: `#555`
              }}
            >
              {logoTitle}
            </span>
          </div>
        </ResolvedLink>
        {true && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: !isMini ? "30px 0 0 0" : "0"
            }}
          >
            {[
              [texts.navArticles, pathnameRoot],
              // ["HOW IT WORKS SERIES", PATH_HOW_IT_WORKS_SERIES],
              // ["WORKSPACE", PATH_HOW_IT_WORKS_SERIES],
              [texts.navAbout, `${pathnameRoot}${PATH_ABOUT}`]
              // ["Github", "https://github.com/Terry-Su"]
            ].map(([value, path], index) => (
              <ResolvedLink
                key={index}
                style={{
                  fontSize: !isMini ? "16px" : "16px",
                  margin: !isMini ? "0 25px" : "0 10px",
                  letterSpacing: "1px",
                  // fontWeight: !isMini ? "bold" : "normal",
                  color: !isMini
                    ? currentPath === path
                      ? "#555"
                      : "#aaa"
                    : "#aaa"
                }}
                to={path}
              >
                {value}
              </ResolvedLink>
            ))}
          </div>
        )}
      </div>
    )
  }
}

export default withRouter(Header)
