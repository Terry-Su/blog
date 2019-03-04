import React, { Component } from 'react'
import styled from 'styled-components'

import AbstractCategory from '@/__typings__/AbstractCategory'
import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import Category from '@/components/Category/Category'
import getDefaultData from '@/helpers/getDefaultData'
import LayoutHome from '@/layouts/LayoutHome'
import { STYLE_ARTICLES_SIDEBAR_WIDTH } from '@/styles/STYLES'

class Props extends DefaultComponentProps {}

class State {}

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`

export default class Articles extends Component<Props, State> {
  render() {
    const category: AbstractCategory = getDefaultData().category
    return (
      <LayoutHome>
        <div style={{
          display: 'flex',
          width: '100%',
          height: '100%',
        }}>
          <div style={{
            width: `${STYLE_ARTICLES_SIDEBAR_WIDTH}px`,
            height: '100%',
          }}>
            <div>Newest</div>
            <hr />
            {
              category.categories.map( (category, index) => <Category key={index} category={ category } /> )
            }
          </div>
          <div>
            {
              [
                [ 'title1', 'description1' ],
                [ 'title2', 'description2' ],
                [ 'title3', 'description3' ],
              ].map( ([ title, description ], index) => <div key={index}>
                <h2>{ title }</h2>
                <p>{ description }</p>
              </div> )
            }
          </div>
        </div>
      </LayoutHome>
    )
  }
}
