import throttle from 'lodash/throttle'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import AbstractCategory from '@/__typings__/AbstractCategory'
import { ClientListItemRemark } from '@/__typings__/ClientRemark'
import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import Category, { CategoryItemColor } from '@/components/Category/Category'
import getDefaultData from '@/helpers/getDefaultData'
import LayoutHome from '@/layouts/LayoutHome'
import {
    STYLE_ARTICLES_LIST_WIDTH, STYLE_ARTICLES_MAX_CONTENT_WIDTH, STYLE_ARTICLES_SIDEBAR_WIDTH,
    STYLE_BOTTOM_HEIGHT, STYLE_LAYOUT_HOME_HEADER_HEIGHT, STYLE_LAYOUT_HOME_HEADER_TO_BOTTOM
} from '@/styles/STYLES'

import List from './List'

class Props extends DefaultComponentProps {
  articles: any
}

class State {
  scrollY: number = 0
  bodyHeight: number = 0
}

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`

const PADDING_TOP = 20

class Articles extends Component<Props, State> {
  state = new State()

  scrollListener = throttle(() => {
    const { scrollY } = window
    this.setState({ scrollY })
  }, 10)

  resizeListener = throttle(() => {
    const { height: bodyHeight } = document.body.getBoundingClientRect()
    this.setState({ bodyHeight })
  }, 10)

  componentDidMount() {
    const { listRemarks } = this.props.articles
    if (!listRemarks) {
      const { newestRemarks } = getDefaultData()
      this.props.dispatch({
        type: "articles/UPDATE_LIST_REMARKS",
        listRemarks: newestRemarks
      })
    }

    this.scrollListener()
    window.addEventListener("scroll", this.scrollListener)

    this.resizeListener()
    window.addEventListener("resize", this.resizeListener)
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.scrollListener)
    window.removeEventListener("resize", this.resizeListener)
  }

  get isFixingSidebar(): boolean {
    return (
      this.state.scrollY >=
        STYLE_LAYOUT_HOME_HEADER_HEIGHT + STYLE_LAYOUT_HOME_HEADER_TO_BOTTOM &&
      !this.hasScrolledInBootom
    )
  }

  get hasScrolledInBootom(): boolean {
    const { innerHeight, scrollY } = window
    return (
      innerHeight + scrollY >= document.body.scrollHeight - STYLE_BOTTOM_HEIGHT
    )
  }

  get notFixingSidebar(): boolean {
    return !this.isFixingSidebar
  }

  // sidebar to bottom while window scrolling in bottom
  get sidebarToBottom(): number {
    return (
      STYLE_BOTTOM_HEIGHT -
      (document.body.scrollHeight - (innerHeight + scrollY))
    )
  }

  get isNewestCategroy(): boolean {
    const { currentCategoryPath }: any = (this.props.articles as any) || {}
    return currentCategoryPath == null
  }

  onNewestClick = () => {
    const { newestRemarks } = getDefaultData()
    this.props.dispatch({
      type: "articles/UPDATE_LIST_REMARKS",
      listRemarks: newestRemarks
    })
    this.props.dispatch({
      type: "articles/UPDATE_CURRENT_CATEGORY_PATH",
      listRemarks: null
    })
  }

  render() {
    const { category }: { category: AbstractCategory } = getDefaultData()
    const { texts } = getDefaultData()
    const sidebarStyle: any = this.isFixingSidebar
      ? {
          marginTop: `${this.state.scrollY -
            STYLE_LAYOUT_HOME_HEADER_HEIGHT -
            STYLE_LAYOUT_HOME_HEADER_TO_BOTTOM}px`
        }
      : this.hasScrolledInBootom
      ? {
          marginTop: `${this.state.scrollY -
            STYLE_LAYOUT_HOME_HEADER_HEIGHT -
            STYLE_LAYOUT_HOME_HEADER_TO_BOTTOM -
            this.sidebarToBottom}px`
        }
      : {}

    return (
      <LayoutHome overflowContent>
        <div
          style={{
            boxSizing: "border-box",
            display: "flex",
            justifyContent: `center`,
            width: "100%",
            maxWidth: `${STYLE_ARTICLES_MAX_CONTENT_WIDTH}px`,
            margin: `0 auto`,
            minHeight: "100%"
          }}
        >
          {/* left sidebar */}
          <div
            style={{
              ...sidebarStyle,
              boxSizing: "border-box",
              display: `flex`,
              justifyContent: `flex-end`,
              width: `${STYLE_ARTICLES_SIDEBAR_WIDTH}px`,
              height: this.state.bodyHeight,
              margin: `0 50px 0 0`,
              borderRight: `1px solid rgba(0,0,0,0.02)`,
              overflow: `auto`
            }}
          >
            <div
              style={{
                // boxSizing: `border-box`,
                width: `100%`,
                height: `100%`
                // padding: `0 20px 0 0`
              }}
            >
              <CategoryItemColor
                style={{
                  boxSizing: `border-box`,
                  display: `inline-block`,
                  alignItems: `center`,
                  minWidth: `100%`,
                  height: `37px`,
                  lineHeight: `37px`,
                  padding: `0 50px 0 40px`,
                  cursor: `default`
                }}
                onClick={this.onNewestClick}
                persistent={this.isNewestCategroy}
              >
                {texts.categoryNewest}
              </CategoryItemColor>
              {category &&
                category.categories.map((category, index) => (
                  <Category
                    key={index}
                    category={category}
                    currentPath={category.name}
                  />
                ))}
              {/* taking space  */}
              {/* <div
                style={{
                  padding: "20px 0"
                }}
              /> */}
            </div>
          </div>

          {/* list */}
          <div
            style={{
              boxSizing: `border-box`,
              width: `${STYLE_ARTICLES_LIST_WIDTH}px`,
              height: `calc( 100% )`
              // padding: `10px ${STYLE_ARTICLES_SIDEBAR_WIDTH}px 0 ${STYLE_ARTICLES_SIDEBAR_WIDTH}px`
            }}
          >
            <List />
          </div>

          {/* right sidebar */}
          <div
            style={{
              // ...sidebarStyle,
              width: STYLE_ARTICLES_SIDEBAR_WIDTH,
              height: `auto`,
              margin: `0 0 0 50px`,
              // overflow: `auto`,
              borderLeft: `1px solid rgba(0,0,0,0.02)`
            }}
          >
            &nbsp;
          </div>
        </div>
      </LayoutHome>
    )
  }
}
export default connect(({ articles = {} }: any) => ({ articles }))(Articles)
