import React, { Component } from 'react'
import styled from 'styled-components'

import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import getDefaultData from '@/helpers/getDefaultData'
import { STYLE_BOTTOM_HEIGHT } from '@/styles/STYLES'

class Props extends DefaultComponentProps {}

class State {}

export default class Footer extends Component<Props, State> {
  render() {
    const { authorUrl, copyright = {} } = getDefaultData()
    const { left, center, right } = copyright
    return (
      <StyledRoot>
        <span className="contentWrapper">
          {left}
          {new Date().getFullYear()}
          <a className="authorLink" href={authorUrl}>
            {center}
          </a>
          {right}
        </span>
      </StyledRoot>
    )
  }
}

const StyledRoot = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${STYLE_BOTTOM_HEIGHT}px;
  background: #182633;

  > .contentWrapper {
    color: rgba(255, 255, 255, 0.5);
    font-size: 14px;

    > .authorLink {
      margin: 0 6px;
      color: #19affc;
    }
  }
`
