import React, { Component } from 'react'
import styled from 'styled-components'

import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import LayoutHome from '@/layouts/LayoutHome'
import { ARTICLES_SIDEBAR_WIDTH } from '@/styles/STYLES'

class Props extends DefaultComponentProps {}

class State {}

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`

export default class Articles extends Component<Props, State> {
  render() {
    return (
      <LayoutHome>
        <div style={{
          display: 'flex',
          width: '100%',
          height: '100%',
        }}>
          <div style={{
            width: `${ARTICLES_SIDEBAR_WIDTH}px`,
            height: '100%',
          }}>
            <ul>
              <li>Category1</li>
              <li>Category2</li>
              <li>Category3</li>
              <li>Category4</li>
              <li>Category45</li>
            </ul>
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
