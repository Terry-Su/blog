import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import AbstractCategory from '@/__typings__/AbstractCategory'
import { ClientListItemRemark } from '@/__typings__/ClientRemark'
import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import Category from '@/components/Category/Category'
import getDefaultData from '@/helpers/getDefaultData'
import LayoutHome from '@/layouts/LayoutHome'
import { STYLE_ARTICLES_SIDEBAR_WIDTH } from '@/styles/STYLES'

import List from './List'

class Props extends DefaultComponentProps {
  articles: any
}

class State {
  remarks: ClientListItemRemark[]
}

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`

const PADDING_TOP = 20

class Articles extends Component<Props, State> {
  componentDidMount() {
    const { listRemarks } = this.props.articles
    if (!listRemarks) {
      const { newestRemarks } = getDefaultData()
      this.props.dispatch({
        type: "articles/UPDATE_LIST_REMARKS",
        listRemarks: newestRemarks
      })
    }
  }

  onNewestClick = () => {
    const { newestRemarks } = getDefaultData()
    this.props.dispatch({
      type: "articles/UPDATE_LIST_REMARKS",
      listRemarks: newestRemarks
    })
  }

  render() {
    const { category }: { category: AbstractCategory } = getDefaultData()

    return (
      <LayoutHome overflowContent>
        <div
          style={{
            boxSizing: "border-box",
            display: "flex",
            // justifyContent: `space-between`,
            width: "100%",
            height: "100%",
            padding: `15px 0 0 0`
            // overflow: `auto`
          }}
        >
          <div
            style={{
              boxSizing: `border-box`,
              display: `flex`,
              justifyContent: `flex-end`,
              // width: `${STYLE_ARTICLES_SIDEBAR_WIDTH}px`,
              width: `30%`,
              height: `100%`,
              borderRight: `1px solid rgba(0,0,0,0.05)`,
              padding: `10px 0 0 0`,
              overflow: `auto`
            }}
          >
            <div
              style={{
                // boxSizing: `border-box`,
                height: `100%`,
                // padding: `0 0 50px 0`,
              }}
            >
              <div
                style={{
                  boxSizing: `border-box`,
                  display: `flex`,
                  alignItems: `center`,
                  height: `37px`,
                  padding: `0 50px 0 40px`,
                  cursor: `pointer`
                }}
                onClick={this.onNewestClick}
              >
                Newest
              </div>
              {category &&
                category.categories.map((category, index) => (
                  <Category key={index} category={category} />
                ))}
              {/* taking space  */}
              <div style={{
                padding: '20px 0'
              }}></div>
            </div>
          </div>
          <div
            style={{
              boxSizing: `border-box`,
              // width: `656px`,
              flex: `1 1 auto`,
              height: `calc( 100% - ${10}px )`,
              padding: `10px 0 0 40px`,
              overflow: `auto`
            }}
          >
            <List />
          </div>
        </div>
      </LayoutHome>
    )
  }
}
export default connect(({ articles = {} }: any) => ({ articles }))(Articles)
