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

 class Articles extends Component<Props, State> {
  componentDidMount() {
    const { listRemarks } = this.props.articles 
    if ( ! listRemarks ) {
      const { newestRemarks } = getDefaultData()
      this.props.dispatch( { type: 'articles/UPDATE_LIST_REMARKS', listRemarks: newestRemarks } )
    }
  }

  render() {
     const { category }: { category: AbstractCategory } = getDefaultData()

    return (
      <LayoutHome>
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%"
          }}
        >
          <div
            style={{
              width: `${STYLE_ARTICLES_SIDEBAR_WIDTH}px`,
              height: "100%"
            }}
          >
            <div>Newest</div>
            <hr />
            {category && category.categories.map((category, index) => (
              <Category key={index} category={category} />
            ))}
          </div>
          <div>
            <List />
          </div>
        </div>
      </LayoutHome>
    )
  }
}
export default connect(({ articles = {} }: any) => ({ articles  })) ( Articles )