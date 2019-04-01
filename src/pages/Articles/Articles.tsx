import throttle from 'lodash/throttle'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import AbstractCategory from '@/__typings__/AbstractCategory'
import { ClientListItemRemark } from '@/__typings__/ClientRemark'
import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import Category, { StyledCategoryItem } from '@/components/Category/Category'
import getDefaultData from '@/helpers/getDefaultData'
import LayoutHome from '@/layouts/LayoutHome'
import {
    BROWSER_HEIGHT, STYLE_ARTICLES_LIST_WIDTH, STYLE_ARTICLES_MAX_CONTENT_WIDTH,
    STYLE_ARTICLES_SIDEBAR_WIDTH, STYLE_BOTTOM_HEIGHT, STYLE_LAYOUT_HOME_HEADER_HEIGHT,
    STYLE_LAYOUT_HOME_HEADER_TO_BOTTOM
} from '@/styles/STYLES'

import List from './List'

class Props extends DefaultComponentProps {
  articles: any
}

class State {
  scrollY: number = 0
  bodyHeight: number = BROWSER_HEIGHT
}

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`

const PADDING_TOP = 20

class Articles extends Component<Props, State> {
  state = new State()

  componentDidMount() {
    const { listRemarks } = this.props.articles
    if (!listRemarks || listRemarks.length === 0) {
      const { newestRemarks } = getDefaultData()
      this.props.dispatch({
        type: "articles/UPDATE_LIST_REMARKS",
        listRemarks: newestRemarks
      })
    }
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

    return (
      <LayoutHome overflowContent>
        <StyledRoot
          style={{
            // boxSizing: "border-box",
            display: "flex",
            justifyContent: `center`,
            width: "100%",
            maxWidth: `${STYLE_ARTICLES_MAX_CONTENT_WIDTH}px`,
            margin: `0 auto`
            // minHeight: "100%"
          }}
        >
          {/* left sidebar */}
          <StyleLeftSidebar bodyHeight={this.state.bodyHeight}>
            <div
              style={{
                // boxSizing: `border-box`,
                width: `100%`,
                height: `100%`
                // padding: `0 20px 0 0`
              }}
            >
              <StyledCategoryItem
                style={{
                  padding: `0 50px 0 40px`,
                  margin: `0 0 0 19px`
                }}
                onClick={this.onNewestClick}
                persistent={this.isNewestCategroy}
              >
                {texts.categoryNewest}
              </StyledCategoryItem>
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
          </StyleLeftSidebar>

          {/* list */}
          <StyledListWrapper>
            <List />
          </StyledListWrapper>

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
        </StyledRoot>
      </LayoutHome>
    )
  }
}
export default connect(({ articles = {} }: any) => ({ articles }))(Articles)

const StyledRoot = styled.div``

const StyleLeftSidebar: any = styled.div`
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  box-sizing: border-box;
  align-self: flex-start;
  display: flex;
  justify-content: flex-end;
  width: ${STYLE_ARTICLES_SIDEBAR_WIDTH}px;
  height: ${(props: any) => props.bodyHeight};
  margin: 0 50px 0 0;
  border-right: 1px solid rgba(0, 0, 0, 0.02);
  /* overflow: auto; */
`

const StyledListWrapper: any = styled.div`
  box-sizing: border-box;
  width: ${(props: any) => STYLE_ARTICLES_LIST_WIDTH}px;
  height: 100%;
`
