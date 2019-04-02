import React, { Component } from 'react'
import styled from 'styled-components'

import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import Markdown from '@/components/Markdown/Markdown'
import NoteIsAutoTranslated from '@/components/Note/NoteIsAutoTranslated'
import getDefaultData from '@/helpers/getDefaultData'
import LayoutHome from '@/layouts/LayoutHome'
import { BROWSER_HEIGHT, STYLE_LAYOUT_HOME_HEADER_HEIGHT } from '@/styles/STYLES'

class Props extends DefaultComponentProps {}

class State {}

export default class About extends Component<Props, State> {
  render() {
    const { isAutoTranslated } = getDefaultData()
    return (
      <LayoutHome overflowContent>
        {/* Note */}
        <StyledRoot>
          <div className="wrapper">
            {isAutoTranslated && (
              <div className="noteIsAutoTranslatedWrapper">
                <NoteIsAutoTranslated />
              </div>
            )}
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
  min-height: ${() => BROWSER_HEIGHT - STYLE_LAYOUT_HOME_HEADER_HEIGHT}px;
  padding: 40px 0 0 0;

  > .wrapper {
    width: 700px;

    > .noteIsAutoTranslatedWrapper {
      margin: 0 0 40px 0;
    }
  }
`
