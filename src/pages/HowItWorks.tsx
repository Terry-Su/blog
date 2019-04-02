import React, { Component } from 'react'
import styled from 'styled-components'

import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import Markdown from '@/components/Markdown/Markdown'
import getDefaultData from '@/helpers/getDefaultData'
import LayoutHome from '@/layouts/LayoutHome'

class Props extends DefaultComponentProps {}

class State {}

export default class HowItWorks extends Component<Props, State> {
  render() {
    return (
      <LayoutHome overflowContent>
        <StyledRoot style={{}}>
          <div className="wrapper">
            <Markdown />
          </div>
        </StyledRoot>
      </LayoutHome>
    )
  }
}

const StyledRoot = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 40px 0 0 0;

  > .wrapper {
    width: 700px;
  }
`
