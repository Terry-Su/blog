import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import Footer from '@/components/Footer/Footer'
import Header from '@/components/Header/Header'
import ResolvedLink from '@/components/ResolvedLink'
import Logo from '@/components/svg/Logo'
import { PATH_ABOUT, PATH_HOW_IT_WORKS_SERIES } from '@/constants/paths'
import { STYLE_LAYOUT_HOME_HEADER_HEIGHT } from '@/styles/STYLES'

// import { STYLE_LAYOUT_HOME_HEADER_HEIGHT } from '@/styles/STYLES.ts'
import LayoutBasic from './LayoutBasic'

class Props extends DefaultComponentProps {}

class State {}

export default class LayoutHome extends Component<Props, State> {
  render() {
    return (
      <LayoutBasic
        style={{
          width: "100%",
          height: "100%"
        }}
      >
        <Header />
        <div
          style={{
            width: "100%",
            height: `calc( 100% - ${STYLE_LAYOUT_HOME_HEADER_HEIGHT}px )`,
            overflow: `auto`
          }}
        >
          {...this.props.children}
        </div>
        <Footer />
      </LayoutBasic>
    )
  }
}
