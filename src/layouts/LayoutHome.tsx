import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import Footer from '@/components/Footer/Footer'
import Header from '@/components/Header/Header'
import LangSwitch from '@/components/LangSwitch/LangSwitch'
import ResolvedLink from '@/components/ResolvedLink'
import Logo from '@/components/svg/Logo'
import { PATH_ABOUT, PATH_HOW_IT_WORKS_SERIES } from '@/constants/paths'
import {
    STYLE_LAYOUT_HOME_HEADER_HEIGHT, STYLE_LAYOUT_HOME_HEADER_TO_BOTTOM
} from '@/styles/STYLES'

// import { STYLE_LAYOUT_HOME_HEADER_HEIGHT } from '@/styles/STYLES.ts'
import LayoutBasic from './LayoutBasic'

class Props extends DefaultComponentProps {
  isMiniHeader?: boolean
  overflowContent?: boolean
}

class State {}

export default class LayoutHome extends Component<Props, State> {
  render() {
    const { isMiniHeader, overflowContent = false } = this.props
    return (
      <LayoutBasic
        style={{
          width: "100%",
          height: "100%"
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "40px",
            top: `20px`
          }}
        >
          <LangSwitch />
        </div>

        <Header isMini={isMiniHeader} />

        <div
          style={{
            margin: `${STYLE_LAYOUT_HOME_HEADER_TO_BOTTOM}px 0 0 0`,
            minHeight: `calc(100% - ${STYLE_LAYOUT_HOME_HEADER_HEIGHT}px - ${STYLE_LAYOUT_HOME_HEADER_TO_BOTTOM}px)`
          }}
        >
          {...this.props.children}
        </div>
        {/* <div style={{
          width: `100%`,
          height: `100%`,
          background: `skyblue`,
        }}>
         
        </div> */}
        {/* <div
          style={{
            width: "100%",
            height: overflowContent
              ? `calc( 100% - ${STYLE_LAYOUT_HOME_HEADER_HEIGHT}px )`
              : "auto",
            overflow: overflowContent ? `auto` : "none"
          }}
        >
          {...this.props.children}
        </div> */}
        {/* {!overflowContent && <Footer />} */}
        <Footer />
      </LayoutBasic>
    )
  }
}
